import { useState } from 'react';

interface Props {
  tierId: string;
  onAdd: (tierId: string, title: string, imageUrl: string) => void;
  onClose: () => void;
}

export default function ItemForm({ tierId, onAdd, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [previewError, setPreviewError] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;
    onAdd(tierId, title.trim(), imageUrl.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative glass p-6 w-full max-w-md animate-scale-in">
        <h3 className="text-lg font-semibold text-surface-100 mb-4">Add Item</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Item name"
              className="input-field"
              maxLength={100}
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setPreviewError(false);
              }}
              placeholder="https://example.com/image.jpg"
              className="input-field"
              required
            />
          </div>

          {/* Preview */}
          {imageUrl && (
            <div className="flex items-center justify-center p-4 rounded-xl bg-surface-900 border border-surface-700">
              {previewError ? (
                <div className="text-center text-surface-500 text-sm">
                  <p>⚠️ Cannot preview image</p>
                  <p className="text-xs mt-1">The image will still be saved</p>
                </div>
              ) : (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="max-w-[120px] max-h-[120px] rounded-lg object-cover"
                  onError={() => setPreviewError(true)}
                />
              )}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !imageUrl.trim()}
              className="btn-primary flex-1"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
