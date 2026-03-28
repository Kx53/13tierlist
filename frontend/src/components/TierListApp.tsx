import { useEffect, useRef, useState } from "react";
import { getTierList, updateTierList } from "@/lib/api";
import { SearchX, Eye, Download, Check } from "lucide-react";
import {
  getToken,
  hasToken,
  saveDraft,
  getDraft,
  removeDraft,
} from "@/lib/token";
import TierListEditor from "@/components/TierListEditor";
import TierListViewer from "@/components/TierListViewer";
import TierListBoard from "@/components/TierListBoard";
import type { TierListData, Tier, TierItem } from "@/lib/api";
import { useStore } from "@nanostores/react";
import { i18n } from "@/lib/i18n";
import { Button, Card } from "@heroui/react";
import html2canvas from "html2canvas";

export const appEditorDict = i18n("editor", {
  viewOnly: "View only",
  copyLink: "Copy Link",
  download: "Download Image",
  exporting: "Exporting",
  save: "Save",
  saving: "Saving",
  saved: "✓ Saved",
  error: "✕ Error",
  exportError:
    "Couldn't generate the PNG. Please wait for images to finish loading and try again.",
  addTier: "+ Add Tier",
  itemBank: "Item Bank (Unranked)",
  uploadItem: "+ Upload Item",
  uploadPrompt: "Upload items to start dragging them into tiers",
});

export const draftDict = i18n("draft", {
  banner: "You have unsaved changes from a previous session.",
  restore: "Restore",
  dismiss: "Dismiss",
});

interface Props {
  slug: string;
}

interface DraftData {
  title?: string;
  tiers?: Tier[];
  unrankedItems?: TierItem[];
}

async function waitForExportAssets(element: HTMLElement) {
  if ("fonts" in document) {
    await (document as Document & { fonts: FontFaceSet }).fonts.ready;
  }

  const images = Array.from(element.querySelectorAll("img"));

  await Promise.all(
    images.map(async (image) => {
      if (!image.currentSrc && !image.src) return;

      if (image.complete && image.naturalWidth > 0) {
        if ("decode" in image) {
          try {
            await image.decode();
          } catch {
            // Allow html2canvas to render the current image state.
          }
        }
        return;
      }

      await new Promise<void>((resolve) => {
        const done = () => {
          image.removeEventListener("load", done);
          image.removeEventListener("error", done);
          resolve();
        };

        image.addEventListener("load", done, { once: true });
        image.addEventListener("error", done, { once: true });
      });
    }),
  );
}

function sanitizeFilename(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "tier-list";
  }

  return trimmed
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, " ")
    .slice(0, 100);
}

export default function TierListApp({ slug }: Props) {
  const editorTexts = useStore(appEditorDict);
  const draftTexts = useStore(draftDict);
  const [data, setData] = useState<TierListData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">(
    "idle",
  );
  const [showDraftRestore, setShowDraftRestore] = useState(false);
  const draftRef = useRef<DraftData | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleExport = async () => {
    const targetElement = exportRef.current;
    if (!targetElement || !data) return;

    setIsExporting(true);
    setExportError("");

    try {
      await waitForExportAssets(targetElement);

      const canvas = await html2canvas(targetElement, {
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#020617",
        scale: 2,
        imageTimeout: 15000,
        logging: false,
        removeContainer: true,
        width: targetElement.scrollWidth,
        height: targetElement.scrollHeight,
        windowWidth: targetElement.scrollWidth,
        windowHeight: targetElement.scrollHeight,
      });

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((value) => {
          if (value) {
            resolve(value);
            return;
          }

          reject(new Error("Failed to generate PNG blob from canvas."));
        }, "image/png");
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `${sanitizeFilename(data.title)}.png`;
      link.href = url;
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      console.error("Failed to export image:", err);
      setExportError(editorTexts.exportError);
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function loadTierList() {
      try {
        const tierList = await getTierList(slug);
        const ownsTierList = hasToken(slug);
        const draft = ownsTierList
          ? (getDraft(slug) as DraftData | null)
          : null;

        if (!isMounted) {
          return;
        }

        setData(tierList);
        setIsOwner(ownsTierList);
        draftRef.current = draft;
        setShowDraftRestore(Boolean(draft));
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setError(
          err instanceof Error ? err.message : "Failed to load tier list",
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadTierList();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleRestoreDraft = () => {
    if (draftRef.current && data) {
      const draft = draftRef.current;

      setData({
        ...data,
        title: draft.title || data.title,
        tiers: draft.tiers || data.tiers,
        unrankedItems: draft.unrankedItems || data.unrankedItems || [],
      });
    }
    setShowDraftRestore(false);
  };

  const handleDismissDraft = () => {
    removeDraft(slug);
    setShowDraftRestore(false);
  };

  const handleChange = (
    title: string,
    tiers: Tier[],
    unrankedItems?: TierItem[],
  ) => {
    setData((prev) => (prev ? { ...prev, title, tiers, unrankedItems } : prev));
    saveDraft(slug, { title, tiers, unrankedItems });
    setSaveStatus("idle");
  };

  const handleSave = async () => {
    if (!data) return;
    const token = getToken(slug);
    if (!token) return;

    setSaving(true);
    setSaveStatus("idle");
    try {
      await updateTierList(slug, token, {
        title: data.title,
        tiers: data.tiers,
        unrankedItems: data.unrankedItems,
      });
      removeDraft(slug);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      setSaveStatus("error");
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const shareUrl =
    typeof window === "undefined"
      ? ""
      : `${window.location.origin}/list/${slug}`;
  const saveButtonText =
    saveStatus === "saved"
      ? editorTexts.saved
      : saveStatus === "error"
        ? editorTexts.error
        : editorTexts.save;
  const unrankedItems = data?.unrankedItems || [];

  const handleCopyLink = () => {
    void navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="animate-spin h-10 w-10 text-accent-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
          <p className="text-surface-400">Loading tier list...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center py-32">
        <Card className="p-8 max-w-md w-full bg-surface-900 border-surface-800">
          <div className="flex flex-col items-center text-center">
            <SearchX className="w-12 h-12 mb-4 text-surface-500" />
            <h2 className="text-xl font-semibold text-surface-200 mb-2">
              Not Found
            </h2>
            <p className="text-surface-400 mb-6">
              {error || "This tier list could not be found."}
            </p>
            <a href="/" className="btn-primary w-fit inline-flex px-6 py-2">
              Go Home
            </a>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Draft restore banner */}
      {showDraftRestore && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between animate-slide-up">
          <p className="text-amber-400 text-sm">{draftTexts.banner}</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border-transparent"
              onPress={handleRestoreDraft}
            >
              {draftTexts.restore}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-surface-500"
              onPress={handleDismissDraft}
            >
              {draftTexts.dismiss}
            </Button>
          </div>
        </div>
      )}

      {exportError && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {exportError}
        </div>
      )}

      <div
        className="fixed top-0 pointer-events-none opacity-0"
        aria-hidden="true"
        style={{ left: -10000, zIndex: -1 }}
      >
        <div className="w-full max-w-300">
          <TierListBoard
            ref={exportRef}
            tiers={data.tiers}
            unrankedItems={unrankedItems}
            imageLoading="eager"
            className="space-y-2"
          />
        </div>
      </div>

      {/* Exportable Area removed from wrapper into child components */}
      <div className="mt-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-8">
          <div className="flex-1 w-full">
            {isOwner ? (
              <input
                type="text"
                value={data.title}
                onChange={(e) =>
                  handleChange(e.target.value, data.tiers, unrankedItems)
                }
                className="text-2xl sm:text-3xl font-bold bg-transparent border-none outline-none text-surface-100 w-full
                           focus:ring-0 placeholder-surface-600"
                placeholder="Tier List Title"
              />
            ) : (
              <h1 className="text-2xl sm:text-3xl font-bold text-surface-100 wrap-break-word">
                {data.title}
              </h1>
            )}
            {!isOwner && (
              <p className="text-sm text-surface-500 mt-1 flex items-center justify-start gap-1">
                <Eye className="w-4 h-4" /> {editorTexts.viewOnly}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Button
              size="sm"
              variant="secondary"
              onPress={handleExport}
              isPending={isExporting}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isExporting ? editorTexts.exporting : editorTexts.download}
              </span>
            </Button>

            <Button
              size="sm"
              variant="secondary"
              className={copied ? "text-emerald-400 bg-emerald-500/10" : ""}
              onPress={handleCopyLink}
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5z" />
                  <path d="M7.414 15.414a2 2 0 01-2.828-2.828l3-3a2 2 0 012.828 0 1 1 0 001.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 005.656 5.656l1.5-1.5a1 1 0 00-1.414-1.414l-1.5 1.5z" />
                </svg>
              )}
              <span className="hidden sm:inline">
                {copied ? "Copied" : editorTexts.copyLink}
              </span>
            </Button>

            {isOwner && (
              <Button
                size="sm"
                variant={
                  saveStatus === "saved" || saveStatus === "error"
                    ? "outline"
                    : "primary"
                }
                className={
                  saveStatus === "saved"
                    ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/20"
                    : saveStatus === "error"
                      ? "border-red-500/30 text-red-400 bg-red-500/20"
                      : ""
                }
                onPress={handleSave}
                isDisabled={saving}
                isPending={saving}
              >
                {saveButtonText}
              </Button>
            )}
          </div>
        </div>

        {/* Tier List */}
        {isOwner ? (
          <TierListEditor
            tiers={data.tiers}
            unrankedItems={unrankedItems}
            onChange={(tiers, nextUnrankedItems) =>
              handleChange(data.title, tiers, nextUnrankedItems)
            }
          />
        ) : (
          <TierListViewer tiers={data.tiers} unrankedItems={unrankedItems} />
        )}
      </div>
    </div>
  );
}
