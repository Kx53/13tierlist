import { useState } from "react";
import { Pencil, Trash2, Inbox } from "lucide-react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
  useDroppable,
  TouchSensor,
  pointerWithin,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Tier, TierItem } from "@/lib/api";
import ItemForm from "@/components/ItemForm";
import { useStore } from "@nanostores/react";
import { i18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export const editorDict = i18n("editor", {
  viewOnly: "View only",
  copyLink: "Copy Link",
  save: "Save",
  saving: "Saving",
  saved: "✓ Saved",
  error: "✕ Error",
  addTier: "+ Add Tier",
  itemBank: "Item Bank (Unranked)",
  uploadItem: "+ Upload Item",
  uploadPrompt: "Upload items to start dragging them into tiers",
});

interface Props {
  tiers: Tier[];
  unrankedItems?: TierItem[];
  onChange: (tiers: Tier[], unrankedItems?: TierItem[]) => void;
}

const TIER_COLORS = [
  "#FF7F7F",
  "#FFBF7F",
  "#FFDF7F",
  "#FFFF7F",
  "#BFFF7F",
  "#7FFF7F",
  "#7FFFFF",
  "#7F7FFF",
  "#FF7FFF",
];

function findContainerByItemId(
  itemId: string,
  tiers: Tier[],
  unrankedItems: TierItem[],
) {
  if (unrankedItems.some((item) => item.id === itemId)) {
    return "unranked";
  }

  const tier = tiers.find((currentTier) =>
    currentTier.items.some((item) => item.id === itemId),
  );

  return tier ? tier.id : null;
}

function getContainerItems(
  containerId: string,
  tiers: Tier[],
  unrankedItems: TierItem[],
) {
  if (containerId === "unranked") {
    return unrankedItems;
  }

  return tiers.find((tier) => tier.id === containerId)?.items || [];
}

function updateTierItems(tiers: Tier[], tierId: string, items: TierItem[]) {
  return tiers.map((tier) => (tier.id === tierId ? { ...tier, items } : tier));
}

function updateTierValue(
  tiers: Tier[],
  tierId: string,
  changes: Partial<Pick<Tier, "label" | "color">>,
) {
  return tiers.map((tier) =>
    tier.id === tierId ? { ...tier, ...changes } : tier,
  );
}

function removeItemFromTiers(tiers: Tier[], itemId: string) {
  return tiers.map((tier) => ({
    ...tier,
    items: tier.items.filter((item) => item.id !== itemId),
  }));
}

function updateItemInTiers(
  tiers: Tier[],
  tierId: string,
  updatedItem: TierItem,
) {
  return tiers.map((tier) =>
    tier.id === tierId
      ? {
          ...tier,
          items: tier.items.map((item) =>
            item.id === updatedItem.id ? updatedItem : item,
          ),
        }
      : tier,
  );
}

function createNewTier(tierCount: number): Tier {
  return {
    id: crypto.randomUUID().slice(0, 8),
    label: "New",
    color: TIER_COLORS[tierCount % TIER_COLORS.length],
    items: [],
  };
}

// Sortable Item component
function SortableItem({
  item,
  onDelete,
  onEdit,
}: {
  item: TierItem;
  onDelete: () => void;
  onEdit: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: { item },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group relative h-16 w-16 touch-none select-none overflow-hidden rounded-2xl border cursor-grab active:cursor-grabbing sm:h-20 sm:w-20
                 ${isDragging ? "border-primary shadow-[0_16px_40px_-24px_rgba(76,92,255,0.95)]" : "border-border hover:border-primary/50"}
                 bg-secondary transition-all duration-200`}
    >
      {item.imageUrl ? (
        <>
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover pointer-events-none"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%231e293b" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%2364748b" font-size="30">?</text></svg>';
            }}
          />
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent p-1 pointer-events-none">
            <p className="text-[10px] sm:text-xs text-white truncate text-center font-medium">
              {item.title}
            </p>
          </div>
        </>
      ) : (
        <div className="pointer-events-none flex h-full w-full flex-col items-center justify-center bg-surface-3 p-1">
          <p className="text-[10px] sm:text-xs text-center font-bold text-white overflow-hidden text-ellipsis line-clamp-3 w-full px-1 leading-tight">
            {item.title}
          </p>
        </div>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-blue-500/80 text-white
                   text-[10px] flex items-center justify-center
                   opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity duration-200
                   hover:bg-blue-500 z-10"
        onPointerDown={(e) => e.stopPropagation()}
        title="Edit item"
      >
        <Pencil className="w-3 h-3" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500/80 text-white
                   text-xs flex items-center justify-center
                   opacity-100 xl:opacity-0 xl:group-hover:opacity-100 transition-opacity duration-200
                   hover:bg-red-500 z-10"
        onPointerDown={(e) => e.stopPropagation()}
      >
        ×
      </button>
    </div>
  );
}

// Droppable tier row
function DroppableTier({
  tier,
  onDeleteItem,
  onEditItem,
  onLabelChange,
  onColorChange,
  onDeleteTier,
}: {
  tier: Tier;
  onDeleteItem: (itemId: string) => void;
  onEditItem: (itemId: string) => void;
  onLabelChange: (label: string) => void;
  onColorChange: (color: string) => void;
  onDeleteTier: () => void;
}) {
  const itemIds = tier.items.map((item) => item.id);
  const { setNodeRef } = useDroppable({
    id: tier.id,
    data: { type: "Container" },
  });

  return (
    <div className="group/tier flex overflow-hidden rounded-[24px] border border-border bg-card/75 transition-all duration-200 hover:border-primary/25">
      {/* Tier Label */}
      <div
        className="relative flex w-20 shrink-0 flex-col items-center justify-center gap-1 p-2 sm:w-28"
        style={{ backgroundColor: tier.color + "30" }}
      >
        <input
          type="text"
          value={tier.label}
          onChange={(e) => onLabelChange(e.target.value)}
          className="w-full text-center font-bold text-lg sm:text-xl bg-transparent border-none outline-none"
          style={{ color: tier.color }}
          maxLength={20}
        />
        <div className="flex gap-1 opacity-100 xl:opacity-0 xl:group-hover/tier:opacity-100 transition-opacity">
          <input
            type="color"
            value={tier.color}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-5 h-5 rounded cursor-pointer border-0 bg-transparent"
            title="Change color"
          />
          <button
            onClick={onDeleteTier}
            className="w-5 h-5 rounded flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/20 text-xs transition-colors"
            title="Delete tier"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Items dropzone */}
      <SortableContext items={itemIds} strategy={rectSortingStrategy}>
        <div
          ref={setNodeRef}
          className="flex min-h-20 flex-1 flex-wrap items-start gap-2 p-2"
          data-tier-id={tier.id}
        >
          {tier.items.map((item) => (
            <SortableItem
              key={item.id}
              item={item}
              onDelete={() => onDeleteItem(item.id)}
              onEdit={() => onEditItem(item.id)}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

// Droppable Unranked Pool
function DroppableUnranked({
  items,
  onDeleteItem,
  onEditItem,
  onAddItem,
}: {
  items: TierItem[];
  onDeleteItem: (itemId: string) => void;
  onEditItem: (itemId: string) => void;
  onAddItem: () => void;
}) {
  const dict = useStore(editorDict);
  const itemIds = items.map((i) => i.id);
  const { setNodeRef } = useDroppable({
    id: "unranked",
    data: { type: "Container" },
  });

  return (
    <div className="mt-8 overflow-hidden rounded-[28px] border border-border bg-card/80 shadow-[0_24px_80px_-36px_rgba(9,14,34,0.98)] backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-border bg-secondary/70 p-4">
        <h3 className="flex items-center gap-2 font-semibold text-foreground">
          <svg
            className="h-5 w-5 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            ></path>
          </svg>
          {dict.itemBank}
        </h3>
        <Button
          size="sm"
          className="font-semibold"
          onClick={onAddItem}
        >
          {dict.uploadItem}
        </Button>
      </div>
      <SortableContext items={itemIds} strategy={rectSortingStrategy}>
        <div
          ref={setNodeRef}
          className="flex min-h-30 flex-wrap items-start gap-3 p-4"
        >
          {items.map((item) => (
            <SortableItem
              key={item.id}
              item={item}
              onDelete={() => onDeleteItem(item.id)}
              onEdit={() => onEditItem(item.id)}
            />
          ))}
          {items.length === 0 && (
            <div className="flex w-full flex-col items-center justify-center py-8 text-muted-foreground opacity-70">
              <Inbox className="w-8 h-8 mb-2 mx-auto" />
              <p>{dict.uploadPrompt}</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export default function TierListEditor({
  tiers,
  unrankedItems = [],
  onChange,
}: Props) {
  const dict = useStore(editorDict);
  const [showItemForm, setShowItemForm] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<TierItem | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const dropAnimationConfig = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: "0.4" } },
    }),
    duration: 150,
  };

  const allItems = [...unrankedItems, ...tiers.flatMap((tier) => tier.items)];

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    // Drop outside or on active item
    if (!over || active.id === over.id) return;

    const activeContainerId = findContainerByItemId(
      active.id as string,
      tiers,
      unrankedItems,
    );
    // Find if over a container or another item
    const overContainerId =
      over.data.current?.type === "Container"
        ? (over.id as string)
        : findContainerByItemId(over.id as string, tiers, unrankedItems);

    if (!activeContainerId || !overContainerId) return;

    let newTiers = [...tiers];
    let newUnranked = [...unrankedItems];

    if (activeContainerId === overContainerId) {
      // Reordering within the same container
      const items = [
        ...getContainerItems(activeContainerId, tiers, unrankedItems),
      ];
      const oldIndex = items.findIndex((i) => i.id === active.id);
      let newIndex = items.findIndex((i) => i.id === over.id);
      if (newIndex === -1) newIndex = items.length; // Drop on empty container space

      const movedItems = arrayMove(items, oldIndex, newIndex);

      if (activeContainerId === "unranked") {
        newUnranked = movedItems;
      } else {
        newTiers = updateTierItems(newTiers, activeContainerId, movedItems);
      }
    } else {
      // Moving between containers
      let activeItems = [
        ...getContainerItems(activeContainerId, tiers, unrankedItems),
      ];
      let overItems = [
        ...getContainerItems(overContainerId, tiers, unrankedItems),
      ];

      const itemToMove = activeItems.find((i) => i.id === active.id);
      if (!itemToMove) return;

      activeItems = activeItems.filter((i) => i.id !== active.id);

      let insertIndex = overItems.findIndex((i) => i.id === over.id);
      if (insertIndex === -1) insertIndex = overItems.length;

      overItems.splice(insertIndex, 0, itemToMove);

      // Apply updates to the source and destination containers
      [
        { id: activeContainerId, items: activeItems },
        { id: overContainerId, items: overItems },
      ].forEach(({ id, items }) => {
        if (id === "unranked") {
          newUnranked = items;
        } else {
          newTiers = updateTierItems(newTiers, id, items);
        }
      });
    }

    onChange(newTiers, newUnranked);
  };

  const handleDeleteItem = (itemId: string) => {
    if (unrankedItems.some((item) => item.id === itemId)) {
      onChange(
        tiers,
        unrankedItems.filter((item) => item.id !== itemId),
      );
      return;
    }

    onChange(removeItemFromTiers(tiers, itemId), unrankedItems);
  };

  const handleEditItemClick = (itemId: string) => {
    const item = allItems.find((currentItem) => currentItem.id === itemId);
    if (item) setEditItem(item);
  };

  const handleSubmitItem = (
    tierId: string,
    title: string,
    imageUrl?: string,
  ) => {
    if (editItem) {
      const updatedItem = {
        ...editItem,
        title,
        ...(imageUrl ? { imageUrl } : { imageUrl: undefined }),
      };
      if (!imageUrl) delete updatedItem.imageUrl;

      if (tierId === "unranked") {
        onChange(
          tiers,
          unrankedItems.map((item) =>
            item.id === editItem.id ? updatedItem : item,
          ),
        );
      } else {
        onChange(updateItemInTiers(tiers, tierId, updatedItem), unrankedItems);
      }
      setEditItem(null);
    } else {
      const newItem: TierItem = {
        id: crypto.randomUUID().slice(0, 8),
        title,
        ...(imageUrl ? { imageUrl } : {}),
      };
      if (tierId === "unranked") {
        onChange(tiers, [...unrankedItems, newItem]);
      } else {
        const newTiers = tiers.map((tier) => {
          if (tier.id !== tierId) return tier;
          return { ...tier, items: [...tier.items, newItem] };
        });
        onChange(newTiers, unrankedItems);
      }
      setShowItemForm(null);
    }
  };

  const activeItem = activeId
    ? allItems.find((item) => item.id === activeId)
    : null;

  return (
    <div className="space-y-2">
      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col gap-2 rounded-xl bg-background/30 pb-2">
          {tiers.map((tier) => (
            <DroppableTier
              key={tier.id}
              tier={tier}
              onDeleteItem={handleDeleteItem}
              onEditItem={handleEditItemClick}
              onLabelChange={(label) =>
                onChange(
                  updateTierValue(tiers, tier.id, { label }),
                  unrankedItems,
                )
              }
              onColorChange={(color) =>
                onChange(
                  updateTierValue(tiers, tier.id, { color }),
                  unrankedItems,
                )
              }
              onDeleteTier={() => {
                if (tiers.length <= 1) return;
                onChange(
                  tiers.filter((t) => t.id !== tier.id),
                  unrankedItems,
                );
              }}
            />
          ))}
        </div>

        <Button
          variant="outline"
          onClick={() =>
            onChange([...tiers, createNewTier(tiers.length)], unrankedItems)
          }
          className="w-full rounded-[24px] border-2 border-dashed border-border py-8 text-sm font-medium text-muted-foreground hover:border-primary/40 hover:bg-secondary/45 hover:text-foreground"
        >
          {dict.addTier}
        </Button>

        <DroppableUnranked
          items={unrankedItems}
          onDeleteItem={handleDeleteItem}
          onEditItem={handleEditItemClick}
          onAddItem={() => setShowItemForm("unranked")}
        />

        <DragOverlay dropAnimation={dropAnimationConfig}>
          {activeItem && (
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-4 border-primary bg-surface-3 shadow-[0_16px_40px_-24px_rgba(76,92,255,0.95)]">
              {activeItem.imageUrl ? (
                <img
                  src={activeItem.imageUrl}
                  alt={activeItem.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <p className="text-xs text-center font-bold text-white overflow-hidden text-ellipsis line-clamp-3 w-full px-1">
                  {activeItem.title}
                </p>
              )}
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Item Form Modal */}
      {(showItemForm || editItem) && (
        <ItemForm
          tierId={
            (showItemForm ||
              (editItem
                ? findContainerByItemId(editItem.id, tiers, unrankedItems)
                : null)) as string
          }
          initialItem={editItem || undefined}
          onSubmit={handleSubmitItem}
          onClose={() => {
            setShowItemForm(null);
            setEditItem(null);
          }}
        />
      )}
    </div>
  );
}
