import { forwardRef } from "react";
import type { Tier, TierItem } from "@/lib/api";

interface Props {
  tiers: Tier[];
  unrankedItems?: TierItem[];
  imageLoading?: "eager" | "lazy";
  className?: string;
  showUnranked?: boolean;
}

const fallbackImage =
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%231e293b" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%2364748b" font-size="30">?</text></svg>';

function BoardItem({
  item,
  imageLoading = "lazy",
}: {
  item: TierItem;
  imageLoading?: "eager" | "lazy";
}) {
  return (
    <div
      className="group relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden
                 border border-surface-700 bg-surface-800"
    >
      {item.imageUrl ? (
        <>
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover"
            loading={imageLoading}
            crossOrigin="anonymous"
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImage;
            }}
          />
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-1">
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
  );
}

const TierListBoard = forwardRef<HTMLDivElement, Props>(function TierListBoard(
  {
    tiers,
    unrankedItems,
    imageLoading = "lazy",
    className = "",
    showUnranked = true,
  },
  ref,
) {
  return (
    <div className={className || "space-y-2"}>
      <div
        ref={ref}
        className="flex flex-col gap-2 bg-surface-950 pb-2 rounded-xl overflow-hidden"
      >
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className="flex rounded-xl overflow-hidden border border-surface-800 bg-surface-900/50"
          >
            <div
              className="w-20 sm:w-28 shrink-0 flex items-center justify-center font-bold text-lg sm:text-xl p-2 text-center"
              style={{ backgroundColor: tier.color + "30", color: tier.color }}
            >
              {tier.label}
            </div>

            <div className="flex-1 flex flex-wrap gap-2 p-2 min-h-20 items-start">
              {tier.items.map((item) => (
                <BoardItem
                  key={item.id}
                  item={item}
                  imageLoading={imageLoading}
                />
              ))}
              {tier.items.length === 0 && (
                <div className="flex items-center justify-center w-full text-surface-600 text-sm min-h-16">
                  Empty
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showUnranked && unrankedItems && unrankedItems.length > 0 && (
        <div className="mt-8 rounded-xl border border-surface-700 bg-surface-800/50 overflow-hidden">
          <div className="bg-surface-800 border-b border-surface-700 p-3">
            <h3 className="font-bold text-surface-200">Item Bank (Unranked)</h3>
          </div>
          <div className="p-4 flex flex-wrap gap-3 items-start">
            {unrankedItems.map((item) => (
              <BoardItem
                key={item.id}
                item={item}
                imageLoading={imageLoading}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export default TierListBoard;
