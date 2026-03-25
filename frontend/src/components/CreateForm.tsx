import { useState } from 'react';
import { createTierList } from '@/lib/api';
import { saveToken } from '@/lib/token';
import { useStore } from '@nanostores/react';
import { i18n } from '@/lib/i18n';
import { Input, Button } from "@heroui/react";

export const createDict = i18n('create', {
  title: "Create New Tier List",
  nameLabel: "Tier List Title",
  namePlaceholder: "e.g., Best Anime Characters, Top Foods, Game Rankings...",
  btn: "Create Tier List →",
  btnCreating: "Creating...",
  error: "Something went wrong"
});

export default function CreateForm() {
  const dict = useStore(createDict);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError('');

    try {
      const { slug, editToken } = await createTierList(title.trim());
      saveToken(slug, editToken);
      window.location.href = `/list/${slug}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : dict.error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-surface-300 mb-2">
          {dict.nameLabel}
        </label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={dict.namePlaceholder}
          className="w-full text-lg bg-surface-900 border-surface-700 hover:border-surface-600 focus:border-accent-500"
          maxLength={200}
          autoFocus
          required
        />
        <p className="mt-2 text-xs text-surface-500">
          {title.length}/200 characters
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-scale-in">
          {error}
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full py-6 text-base rounded-xl font-bold bg-accent-500 hover:bg-accent-600 text-white shadow-lg shadow-accent-500/25 border-none"
        isDisabled={!title.trim()}
        isPending={loading}
      >
        {loading ? dict.btnCreating : dict.btn}
      </Button>
    </form>
  );
}
