import type { Tier } from '../lib/api';

interface Props {
  tiers: Tier[];
  onAddTier: () => void;
  onRenameTier: (tierId: string, label: string) => void;
  onDeleteTier: (tierId: string) => void;
  onChangeColor: (tierId: string, color: string) => void;
}

export default function TierControls({ tiers, onAddTier, onRenameTier, onDeleteTier, onChangeColor }: Props) {
  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-surface-300 mb-3">Manage Tiers</h3>
      <div className="space-y-2">
        {tiers.map((tier) => (
          <div key={tier.id} className="flex items-center gap-2">
            <input
              type="color"
              value={tier.color}
              onChange={(e) => onChangeColor(tier.id, e.target.value)}
              className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent flex-shrink-0"
            />
            <input
              type="text"
              value={tier.label}
              onChange={(e) => onRenameTier(tier.id, e.target.value)}
              className="input py-1.5 text-sm flex-1"
              maxLength={20}
            />
            <button
              onClick={() => onDeleteTier(tier.id)}
              disabled={tiers.length <= 1}
              className="btn-danger btn-sm text-xs px-2"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <button onClick={onAddTier} className="btn-secondary btn-sm w-full mt-3 text-xs">
        + Add Tier
      </button>
    </div>
  );
}
