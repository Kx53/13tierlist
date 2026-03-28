import { useEffect, useRef, useState } from "react";
import { Image as ImageIcon, Type, UploadCloud } from "lucide-react";
import { useStore } from "@nanostores/react";
import { uploadImage, type TierItem } from "@/lib/api";
import { i18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const itemFormDict = i18n("itemForm", {
  add: "Add Item",
  edit: "Edit Item",
  addUnranked: "Add New Item",
  addTier: "Add Item to Tier",
  image: "Image",
  text: "Text Only",
  title: "Title",
  titlePlaceholder: "Item name",
  imageUpload: "Image Upload",
  clickUpload: "Click to upload image",
  cancel: "Cancel",
  saveChanges: "Save Changes",
  uploading: "Uploading...",
  saving: "Saving...",
});

interface Props {
  tierId: string;
  initialItem?: TierItem;
  onSubmit: (tierId: string, title: string, imageUrl?: string) => void;
  onClose: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const API_BASE_URL = import.meta.env.PUBLIC_API_URL || "http://localhost:3001";

export default function ItemForm({
  tierId,
  initialItem,
  onSubmit,
  onClose,
}: Props) {
  const dict = useStore(itemFormDict);
  const [mode, setMode] = useState<"image" | "text">(
    initialItem && !initialItem.imageUrl ? "text" : "image",
  );
  const [title, setTitle] = useState(initialItem?.title || "");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    initialItem?.imageUrl || "",
  );
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (file && previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [file, previewUrl]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const clearSelectedImage = () => {
    if (file && previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFile(null);
    setPreviewUrl("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) {
      return;
    }

    if (selected.size > MAX_FILE_SIZE) {
      setError("File size must be less than 5MB");
      return;
    }

    if (file && previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (mode === "text") {
      onSubmit(tierId, title.trim());
      return;
    }

    if (!file && !previewUrl) {
      setError("Please upload an image or switch to Text mode.");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      let fullUrl = previewUrl || undefined;

      if (file) {
        const uploadedUrl = await uploadImage(file);
        fullUrl = `${API_BASE_URL}${uploadedUrl}`;
      }

      onSubmit(tierId, title.trim(), fullUrl);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to upload image. Is the backend running?",
      );
      setIsUploading(false);
    }
  };

  const isEditing = Boolean(initialItem);
  const heading = isEditing
    ? dict.edit
    : tierId === "unranked"
      ? dict.addUnranked
      : dict.addTier;
  const isFormValid =
    mode === "text"
      ? Boolean(title.trim())
      : Boolean(title.trim() && (file || previewUrl));

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isUploading) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{heading}</DialogTitle>
        </DialogHeader>

        <ToggleGroup
          type="single"
          value={mode}
          onValueChange={(value) => {
            if (value === "image" || value === "text") {
              setMode(value);
            }
          }}
          className="grid w-full grid-cols-2 rounded-2xl"
        >
          <ToggleGroupItem value="image" className="rounded-xl">
            <ImageIcon className="mr-1.5 h-4 w-4" />
            {dict.image}
          </ToggleGroupItem>
          <ToggleGroupItem value="text" className="rounded-xl">
            <Type className="mr-1.5 h-4 w-4" />
            {dict.text}
          </ToggleGroupItem>
        </ToggleGroup>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
              {dict.title}
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={dict.titlePlaceholder}
              className="text-sm"
              maxLength={100}
              autoFocus
              required
              disabled={isUploading}
            />
          </div>

          {mode === "image" ? (
            <div className="animate-in fade-in-0">
              <label className="mb-1.5 block text-sm font-medium text-muted-foreground">
                {dict.imageUpload}
              </label>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={isUploading}
              />

              {!previewUrl ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className={`flex h-36 w-full flex-col items-center justify-center rounded-3xl border border-dashed transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    error
                      ? "border-destructive/50 bg-destructive/6 text-destructive"
                      : "border-border bg-secondary/40 text-muted-foreground hover:border-primary/35 hover:bg-secondary/65 hover:text-foreground"
                  }`}
                >
                  <UploadCloud className="mb-2 h-8 w-8 opacity-70" />
                  <span className="text-sm font-medium">
                    {dict.clickUpload}
                  </span>
                </button>
              ) : (
                <div className="relative flex justify-center rounded-3xl border border-border bg-secondary/50 p-3">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-36 rounded-2xl object-contain"
                  />
                  {!isUploading ? (
                    <button
                      type="button"
                      onClick={clearSelectedImage}
                      className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface-3 text-sm text-foreground shadow-lg transition-colors hover:bg-destructive hover:text-destructive-foreground"
                      title="Remove image"
                    >
                      ×
                    </button>
                  ) : null}
                </div>
              )}
            </div>
          ) : null}

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isUploading}
            >
              {dict.cancel}
            </Button>
            <Button
              type="submit"
              className="font-semibold"
              disabled={!isFormValid || isUploading}
              pending={isUploading}
            >
              {isUploading
                ? dict.uploading
                : isEditing
                  ? dict.saveChanges
                  : dict.add}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
