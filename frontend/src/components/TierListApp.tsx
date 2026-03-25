import { useState, useEffect, useCallback, useRef } from 'react';
import { getTierList, updateTierList } from '../lib/api';
import { getToken, hasToken, saveDraft, getDraft, removeDraft } from '../lib/token';
import TierListEditor from './TierListEditor';
import TierListViewer from './TierListViewer';
import type { TierListData, Tier, TierItem } from '../lib/api';

interface Props {
  slug: string;
}

export default function TierListApp({ slug }: Props) {
  const [data, setData] = useState<TierListData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [showDraftRestore, setShowDraftRestore] = useState(false);
  const draftRef = useRef<unknown>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tierList = await getTierList(slug);
        setData(tierList);
        setIsOwner(hasToken(slug));

        // Check for draft
        const draft = getDraft(slug);
        if (draft && hasToken(slug)) {
          draftRef.current = draft;
          setShowDraftRestore(true);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tier list');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const handleRestoreDraft = () => {
    if (draftRef.current && data) {
      const draft = draftRef.current as { title?: string; tiers?: Tier[]; unrankedItems?: TierItem[] };
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

  const handleChange = useCallback((title: string, tiers: Tier[], unrankedItems?: TierItem[]) => {
    setData(prev => prev ? { ...prev, title, tiers, unrankedItems } : prev);
    saveDraft(slug, { title, tiers, unrankedItems });
    setSaveStatus('idle');
  }, [slug]);

  const handleSave = async () => {
    if (!data) return;
    const token = getToken(slug);
    if (!token) return;

    setSaving(true);
    setSaveStatus('idle');
    try {
      await updateTierList(slug, token, {
        title: data.title,
        tiers: data.tiers,
        unrankedItems: data.unrankedItems,
      });
      removeDraft(slug);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      setSaveStatus('error');
      console.error('Save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/list/${slug}` : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-10 w-10 text-accent-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <p className="text-surface-400">Loading tier list...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="card text-center max-w-md">
          <p className="text-4xl mb-4">😕</p>
          <h2 className="text-xl font-semibold text-surface-200 mb-2">Not Found</h2>
          <p className="text-surface-400 mb-6">{error || 'This tier list could not be found.'}</p>
          <a href="/" className="btn-primary">Go Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Draft restore banner */}
      {showDraftRestore && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between animate-slide-up">
          <p className="text-amber-400 text-sm">You have unsaved changes from a previous session.</p>
          <div className="flex gap-2">
            <button onClick={handleRestoreDraft} className="btn-sm bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors">
              Restore
            </button>
            <button onClick={handleDismissDraft} className="btn-sm text-surface-500 hover:text-surface-300 text-xs transition-colors">
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex-1">
          {isOwner ? (
            <input
              type="text"
              value={data.title}
              onChange={(e) => handleChange(e.target.value, data.tiers, data.unrankedItems)}
              className="text-2xl sm:text-3xl font-bold bg-transparent border-none outline-none text-surface-100 w-full
                         focus:ring-0 placeholder-surface-600"
              placeholder="Tier List Title"
            />
          ) : (
            <h1 className="text-2xl sm:text-3xl font-bold text-surface-100">{data.title}</h1>
          )}
          {!isOwner && (
            <p className="text-sm text-surface-500 mt-1">👁️ View only</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleCopyLink} className="btn-secondary btn-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5z" />
              <path d="M7.414 15.414a2 2 0 01-2.828-2.828l3-3a2 2 0 012.828 0 1 1 0 001.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 005.656 5.656l1.5-1.5a1 1 0 00-1.414-1.414l-1.5 1.5z" />
            </svg>
            Copy Link
          </button>

          {isOwner && (
            <button
              onClick={handleSave}
              disabled={saving}
              className={`btn-sm rounded-lg px-4 py-2 font-medium text-xs transition-all ${
                saveStatus === 'saved'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : saveStatus === 'error'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'btn-primary'
              }`}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Saving
                </span>
              ) : saveStatus === 'saved' ? (
                '✓ Saved'
              ) : saveStatus === 'error' ? (
                '✕ Error'
              ) : (
                'Save'
              )}
            </button>
          )}
        </div>
      </div>

      {/* Tier List */}
      {isOwner ? (
        <TierListEditor
          tiers={data.tiers}
          unrankedItems={data.unrankedItems || []}
          onChange={(tiers, unrankedItems) => handleChange(data.title, tiers, unrankedItems)}
          slug={slug}
        />
      ) : (
        <TierListViewer 
          tiers={data.tiers} 
          unrankedItems={data.unrankedItems || []} 
        />
      )}
    </div>
  );
}
