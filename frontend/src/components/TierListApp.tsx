import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Check, Download, Eye, SearchX } from "lucide-react";
import TierListBoard from "@/components/TierListBoard";
import TierListEditor from "@/components/TierListEditor";
import TierListViewer from "@/components/TierListViewer";
import { getTierList, updateTierList, type Tier, type TierItem, type TierListData } from "@/lib/api";
import { i18n } from "@/lib/i18n";
import {
  getDraft,
  getToken,
  hasToken,
  removeDraft,
  saveDraft,
} from "@/lib/token";
import { useStore } from "@nanostores/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const appEditorDict = i18n("editor", {
  viewOnly: "View only",
  copyLink: "Copy Link",
  download: "Download Image",
  exporting: "Exporting",
  save: "Save",
  saving: "Saving",
  saved: "✓ Saved",
  error: "✕ Error",
  exportError: "Couldn't generate the PNG. Please try again.",
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

const EXPORT_BOARD_WIDTH = 1200;

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
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const [copied, setCopied] = useState(false);
  const draftRef = useRef<DraftData | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    const targetElement = exportRef.current;
    if (!targetElement || !data) return;

    setIsExporting(true);
    setExportError("");

    try {
      const dataUrl = await toPng(targetElement, {
        cacheBust: true,
        backgroundColor: "#060816",
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = `${sanitizeFilename(data.title)}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
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
            className="h-10 w-10 animate-spin text-primary"
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
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <p className="text-muted-foreground">Loading tier list...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center py-32">
        <Card className="max-w-md w-full">
          <CardContent className="flex flex-col items-center p-8 text-center">
            <SearchX className="mb-4 h-12 w-12 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-semibold">Not Found</h2>
            <p className="mb-6 text-muted-foreground">
              {error || "This tier list could not be found."}
            </p>
            <a
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow-[0_16px_40px_-20px_rgba(76,92,255,0.95)] transition-colors hover:bg-primary/92"
            >
              Go Home
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in-0">
      {showDraftRestore ? (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-3xl border border-amber-300/15 bg-amber-300/8 px-4 py-4 animate-in slide-in-from-top-2">
          <p className="text-sm text-amber-100/85">{draftTexts.banner}</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="border-amber-200/10 bg-amber-200/14 text-amber-100 hover:bg-amber-200/20"
              onClick={handleRestoreDraft}
            >
              {draftTexts.restore}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-amber-100/65 hover:text-amber-50"
              onClick={handleDismissDraft}
            >
              {draftTexts.dismiss}
            </Button>
          </div>
        </div>
      ) : null}

      {exportError ? (
        <div className="mb-4 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground">
          {exportError}
        </div>
      ) : null}

      <div
        className="pointer-events-none fixed top-0 opacity-0"
        aria-hidden="true"
        style={{ left: -10000, zIndex: -1 }}
      >
        <div style={{ width: EXPORT_BOARD_WIDTH }}>
          <TierListBoard
            ref={exportRef}
            tiers={data.tiers}
            showUnranked={false}
            imageLoading="eager"
            className="space-y-2"
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:mb-7 sm:flex-row sm:items-center">
          <div className="w-full flex-1">
            {isOwner ? (
              <input
                type="text"
                value={data.title}
                onChange={(e) =>
                  handleChange(e.target.value, data.tiers, unrankedItems)
                }
                className="w-full border-none bg-transparent px-1 text-2xl font-semibold text-foreground outline-none placeholder:text-muted-foreground sm:text-3xl"
                placeholder="Tier List Title"
              />
            ) : (
              <h1 className="wrap-break-word px-1 text-2xl font-semibold text-foreground sm:text-3xl">
                {data.title}
              </h1>
            )}
            {!isOwner ? (
              <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" /> {editorTexts.viewOnly}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <Button
              size="sm"
              variant="secondary"
              className="hover:border-brand-200/40 hover:bg-secondary/95"
              onClick={handleExport}
              pending={isExporting}
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">
                {isExporting ? editorTexts.exporting : editorTexts.download}
              </span>
            </Button>

            <Button
              size="sm"
              variant="secondary"
              className={
                copied
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "hover:border-brand-200/40 hover:bg-secondary/95"
              }
              onClick={handleCopyLink}
            >
              {copied ? (
                <Check className="h-4 w-4" />
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

            {isOwner ? (
              <Button
                size="sm"
                variant={
                  saveStatus === "saved" || saveStatus === "error"
                    ? "outline"
                    : "default"
                }
                className={
                  saveStatus === "saved"
                    ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-400"
                    : saveStatus === "error"
                      ? "border-red-500/30 bg-red-500/20 text-red-400"
                      : "hover:shadow-[0_18px_40px_-24px_rgba(140,84,252,0.82)]"
                }
                onClick={handleSave}
                disabled={saving}
                pending={saving}
              >
                {saveButtonText}
              </Button>
            ) : null}
          </div>
        </div>

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
