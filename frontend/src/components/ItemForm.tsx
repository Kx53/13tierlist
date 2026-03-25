import { useState, useRef, useEffect } from 'react';
import { uploadImage } from '../lib/api';

interface Props {
  tierId: string;
  onAdd: (tierId: string, title: string, imageUrl?: string) => void;
  onClose: () => void;
}

export default function ItemForm({ tierId, onAdd, onClose }: Props) {
  const [mode, setMode] = useState<'image' | 'text'>('image');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (mode === 'text') {
      onAdd(tierId, title.trim());
      return;
    }

    if (!file) {
      setError('Please upload an image or switch to Text mode.');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const uploadedUrl = await uploadImage(file);
      const fullUrl = import.meta.env.PUBLIC_API_URL 
        ? `${import.meta.env.PUBLIC_API_URL}${uploadedUrl}`
        : `http://localhost:3001${uploadedUrl}`;
        
      onAdd(tierId, title.trim(), fullUrl);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image. Is the backend running?');
      setIsUploading(false);
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const isFormValid = mode === 'text' ? !!title.trim() : !!(title.trim() && file);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={(!isUploading) ? onClose : undefined}
      ></div>

      {/* Modal */}
      <div className="relative bg-surface-800 border-2 border-surface-700 p-6 rounded-2xl w-full max-w-sm shadow-2xl animate-scale-in">
        <h3 className="text-xl font-bold text-white mb-5">
          {tierId === 'unranked' ? 'Add New Item' : 'Add Item to Tier'}
        </h3>

        {/* Mode Tabs */}
        <div className="flex bg-surface-900 rounded-lg p-1 mb-5">
          <button
            type="button"
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === 'image' ? 'bg-surface-700 text-white shadow-sm' : 'text-surface-400 hover:text-surface-200'}`}
            onClick={() => setMode('image')}
            disabled={isUploading}
          >
            🖼️ Image
          </button>
          <button
            type="button"
            className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === 'text' ? 'bg-surface-700 text-white shadow-sm' : 'text-surface-400 hover:text-surface-200'}`}
            onClick={() => setMode('text')}
            disabled={isUploading}
          >
            📝 Text Only
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5 focus-within:text-accent-400">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Item name"
              className="input-field w-full"
              maxLength={100}
              autoFocus
              required
              disabled={isUploading}
            />
          </div>

          {mode === 'image' && (
            <div className="animate-fade-in">
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Image Upload</label>
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
                  className={`w-full h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-200
                    ${error ? 'border-red-500/50 text-red-400 bg-red-500/5' : 'border-surface-600 text-surface-400 hover:text-surface-200 hover:border-accent-500 hover:bg-surface-700/50 focus:outline-none focus:ring-2 focus:ring-accent-500/50'}`}
                >
                  <svg className="w-8 h-8 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span className="font-medium text-sm">Click to upload image</span>
                </button>
              ) : (
                <div className="relative flex justify-center p-3 rounded-xl bg-surface-900 border-2 border-surface-700 group">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-[120px] rounded-lg object-contain"
                  />
                  {!isUploading && (
                    <button
                      type="button"
                      onClick={() => {
                        setFile(null);
                        setPreviewUrl('');
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-surface-700 border-2 border-surface-600 text-white flex items-center justify-center hover:bg-red-500 hover:border-red-500 transition-colors shadow-lg"
                      title="Remove image"
                    >
                      ×
                    </button>
                  )}
                </div>
              )}
              {error && <p className="text-red-400 text-xs font-medium mt-2 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                {error}
              </p>}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-secondary flex-1 border-surface-600 bg-surface-700 hover:bg-surface-600"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isUploading}
              className="btn-primary flex-1 py-2.5 relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                'Add Item'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
