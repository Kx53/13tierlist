import { useState } from "react";
import { useStore } from "@nanostores/react";
import { createTierList } from "@/lib/api";
import { i18n } from "@/lib/i18n";
import { saveToken } from "@/lib/token";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const createDict = i18n("create", {
  title: "Create New Tier List",
  nameLabel: "Tier List Title",
  namePlaceholder: "e.g., Best Anime Characters, Top Foods, Game Rankings...",
  btn: "Create Tier List →",
  btnCreating: "Creating...",
  error: "Something went wrong",
});

export default function CreateForm() {
  const dict = useStore(createDict);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const trimmedTitle = title.trim();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!trimmedTitle) return;

    setLoading(true);
    setError("");

    try {
      const { slug, editToken } = await createTierList(trimmedTitle);
      saveToken(slug, editToken);
      window.location.href = `/list/${slug}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : dict.error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-8">
      <div>
        <label
          htmlFor="title"
          className="mb-3 block text-sm font-medium text-muted-foreground"
        >
          {dict.nameLabel}
        </label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={dict.namePlaceholder}
          className="h-14 rounded-3xl border-border/80 bg-[#1b1520]/70 text-base md:text-lg"
          maxLength={200}
          autoFocus
          required
        />
        <p className="mt-2 text-xs text-muted-foreground">
          {title.length}/200 characters
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive animate-in fade-in-0 zoom-in-95">
          {error}
        </div>
      ) : null}

      <Button
        type="submit"
        size="lg"
        className="h-13 w-full rounded-full font-semibold"
        disabled={!trimmedTitle}
        pending={loading}
      >
        {loading ? dict.btnCreating : dict.btn}
      </Button>
    </form>
  );
}
