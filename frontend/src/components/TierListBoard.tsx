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
  'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23f3f3f1" width="100" height="100"/><text x="50" y="58" text-anchor="middle" fill="%23000000" font-size="32">?</text></svg>';

function BoardItem({
  item,
  imageLoading = "lazy",
}: {
  item: TierItem;
  imageLoading?: "eager" | "lazy";
}) {
  return (
    <div className="group relative h-16 w-16 overflow-hidden border border-black bg-white sm:h-20 sm:w-20">
      {item.imageUrl ? (
        <>
          <img
            src={item.imageUrl}
            alt={item.title}
            className="h-full w-full object-cover"
            loading={imageLoading}
            crossOrigin="anonymous"
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImage;
            }}
          />
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-1">
            <p className="truncate text-center text-[10px] font-medium text-white sm:text-xs">
              {item.title}
            </p>
          </div>
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted p-1">
          <p className="line-clamp-3 w-full overflow-hidden px-1 text-center text-[10px] font-medium leading-tight text-black text-ellipsis sm:text-xs">
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
        className="flex flex-col overflow-hidden border-l border-t border-black bg-white"
      >
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className="flex border-b border-r border-black bg-white"
          >
            <div
              className="flex w-20 shrink-0 items-center justify-center border-r border-black p-2 text-center text-lg font-medium text-black sm:w-28 sm:text-xl"
              style={{ backgroundColor: tier.color }}
            >
              {tier.label}
            </div>

            <div className="flex min-h-20 flex-1 flex-wrap items-start gap-2 p-2">
              {tier.items.map((item) => (
                <BoardItem
                  key={item.id}
                  item={item}
                  imageLoading={imageLoading}
                />
              ))}
              {tier.items.length === 0 ? (
                <div className="flex min-h-16 w-full items-center justify-center text-sm text-muted-foreground">
                  Empty
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {showUnranked && unrankedItems && unrankedItems.length > 0 ? (
        <div className="mt-8 overflow-hidden border border-black bg-white">
          <div className="flex items-center justify-between border-b border-black bg-surface-1 p-4 text-white">
            <h3 className="font-medium text-white">
              Item Bank (Unranked)
            </h3>
            <span className="label-caps text-white/60">UNRANKED</span>
          </div>
          <div className="flex flex-wrap items-start gap-3 p-4">
            {unrankedItems.map((item) => (
              <BoardItem
                key={item.id}
                item={item}
                imageLoading={imageLoading}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
});

export default TierListBoard;
