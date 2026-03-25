import type { Tier, TierItem } from '@/lib/api';

interface Props {
  tiers: Tier[];
  unrankedItems?: TierItem[];
}

export default function TierListViewer({ tiers, unrankedItems }: Props) {
  return (
    <div className="space-y-2">
      {tiers.map((tier) => (
        <div
          key={tier.id}
          className="flex rounded-xl overflow-hidden border border-surface-800 bg-surface-900/50 animate-fade-in"
        >
          {/* Tier Label */}
          <div
            className="w-20 sm:w-28 shrink-0 flex items-center justify-center font-bold text-lg sm:text-xl"
            style={{ backgroundColor: tier.color + '30', color: tier.color }}
          >
            {tier.label}
          </div>

          {/* Items */}
          <div className="flex-1 flex flex-wrap gap-2 p-2 min-h-[80px] items-start">
            {tier.items.map((item) => (
              <div
                key={item.id}
                className="group relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden
                           border border-surface-700 bg-surface-800
                           hover:border-surface-500 hover:scale-105 transition-all duration-200"
              >
                {item.imageUrl ? (
                  <>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%231e293b" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%2364748b" font-size="30">?</text></svg>';
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent
                                    p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <p className="text-[10px] sm:text-xs text-white truncate text-center font-medium">
                        {item.title}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-1">
                    <p className="text-[10px] sm:text-xs text-center font-bold text-white overflow-hidden text-ellipsis line-clamp-3 w-full px-1 leading-tight">
                      {item.title}
                    </p>
                  </div>
                )}
              </div>
            ))}
            {tier.items.length === 0 && (
              <div className="flex items-center justify-center w-full text-surface-600 text-sm">
                Empty
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Unranked Bank */}
      {(unrankedItems && unrankedItems.length > 0) && (
        <div className="mt-8 rounded-xl border border-surface-700 bg-surface-800/50 overflow-hidden animate-fade-in">
          <div className="bg-surface-800 border-b border-surface-700 p-3">
            <h3 className="font-bold text-surface-200">Item Bank (Unranked)</h3>
          </div>
          <div className="p-4 flex flex-wrap gap-3 items-start">
            {unrankedItems.map((item) => (
              <div
                key={item.id}
                className="group relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden
                           border border-surface-700 bg-surface-800
                           hover:border-surface-500 hover:scale-105 transition-all duration-200"
              >
                {item.imageUrl ? (
                  <>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%231e293b" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%2364748b" font-size="30">?</text></svg>';
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent
                                    p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <p className="text-[10px] sm:text-xs text-white truncate text-center font-medium">
                        {item.title}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-1">
                    <p className="text-[10px] sm:text-xs text-center font-bold text-white overflow-hidden text-ellipsis line-clamp-3 w-full px-1 leading-tight">
                      {item.title}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
