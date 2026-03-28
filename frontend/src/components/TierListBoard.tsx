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
    <div className="group relative h-16 w-16 overflow-hidden rounded-2xl border border-border bg-secondary sm:h-20 sm:w-20">
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
        <div className="flex h-full w-full items-center justify-center p-1">
          <p className="line-clamp-3 w-full overflow-hidden px-1 text-center text-[10px] font-bold leading-tight text-white text-ellipsis sm:text-xs">
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
        className="flex flex-col gap-2 overflow-hidden rounded-xl bg-background/30 pb-2"
      >
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className="flex overflow-hidden rounded-[24px] border border-border bg-card/75"
          >
            <div
              className="flex w-20 shrink-0 items-center justify-center p-2 text-center text-lg font-bold sm:w-28 sm:text-xl"
              style={{ backgroundColor: `${tier.color}30`, color: tier.color }}
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
        <div className="mt-8 overflow-hidden rounded-[28px] border border-border bg-card/80 shadow-[0_24px_80px_-36px_rgba(9,14,34,0.98)] backdrop-blur-xl">
          <div className="border-b border-border bg-secondary/70 p-4">
            <h3 className="font-semibold text-foreground">Item Bank (Unranked)</h3>
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
