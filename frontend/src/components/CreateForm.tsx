import { useState } from 'react';
import { createTierList } from '../lib/api';
import { saveToken } from '../lib/token';

export default function CreateForm() {
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
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-surface-300 mb-2">
          Tier List Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Best Anime Characters, Top Foods, Game Rankings..."
          className="input text-lg"
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

      <button
        type="submit"
        disabled={loading || !title.trim()}
        className="btn-primary w-full py-3.5 text-base rounded-xl"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            Creating...
          </span>
        ) : (
          'Create Tier List →'
        )}
      </button>
    </form>
  );
}
