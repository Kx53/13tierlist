import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Tier, TierItem } from '../lib/api';
import ItemForm from './ItemForm';


interface Props {
  tiers: Tier[];
  onChange: (tiers: Tier[]) => void;
  slug: string;
}

// Sortable Item component
function SortableItem({ item, onDelete }: { item: TierItem; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
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
      className="group relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing
                 border border-surface-700 bg-surface-800 hover:border-accent-500/50
                 hover:shadow-lg hover:shadow-accent-500/10 transition-all duration-200"
    >
      <img
        src={item.imageUrl}
        alt={item.title}
        className="w-full h-full object-cover pointer-events-none"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%231e293b" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%2364748b" font-size="30">?</text></svg>';
        }}
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1">
        <p className="text-[10px] sm:text-xs text-white truncate text-center font-medium">{item.title}</p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500/80 text-white
                   text-xs flex items-center justify-center
                   opacity-0 group-hover:opacity-100 transition-opacity duration-200
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
  onLabelChange,
  onColorChange,
  onDeleteTier,
  onAddItem,
}: {
  tier: Tier;
  onDeleteItem: (itemId: string) => void;
  onLabelChange: (label: string) => void;
  onColorChange: (color: string) => void;
  onDeleteTier: () => void;
  onAddItem: (tierId: string) => void;
}) {
  const itemIds = tier.items.map((item) => item.id);

  return (
    <div className="flex rounded-xl overflow-hidden border border-surface-800 bg-surface-900/50 group/tier transition-all duration-200 hover:border-surface-700">
      {/* Tier Label */}
      <div
        className="w-20 sm:w-28 flex-shrink-0 flex flex-col items-center justify-center gap-1 p-2 relative"
        style={{ backgroundColor: tier.color + '30' }}
      >
        <input
          type="text"
          value={tier.label}
          onChange={(e) => onLabelChange(e.target.value)}
          className="w-full text-center font-bold text-lg sm:text-xl bg-transparent border-none outline-none"
          style={{ color: tier.color }}
          maxLength={20}
        />
        <div className="flex gap-1 opacity-0 group-hover/tier:opacity-100 transition-opacity">
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
            🗑
          </button>
        </div>
      </div>

      {/* Items dropzone */}
      <SortableContext items={itemIds} strategy={rectSortingStrategy}>
        <div className="flex-1 flex flex-wrap gap-2 p-2 min-h-[80px] items-start" data-tier-id={tier.id}>
          {tier.items.map((item) => (
            <SortableItem
              key={item.id}
              item={item}
              onDelete={() => onDeleteItem(item.id)}
            />
          ))}
          <button
            onClick={() => onAddItem(tier.id)}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 border-dashed border-surface-700
                       flex items-center justify-center text-surface-600 hover:text-surface-400
                       hover:border-surface-500 hover:bg-surface-800/50 transition-all duration-200"
            title="Add item to this tier"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </SortableContext>
    </div>
  );
}

export default function TierListEditor({ tiers, onChange }: Props) {
  const [showItemForm, setShowItemForm] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const findTierByItemId = (itemId: string) => {
    return tiers.find((tier) => tier.items.some((item) => item.id === itemId));
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const activeTier = findTierByItemId(active.id as string);
    const overTier = findTierByItemId(over.id as string);

    if (!activeTier) return;

    const newTiers = [...tiers];

    if (activeTier === overTier && overTier) {
      // Same tier — reorder
      const tierIndex = newTiers.findIndex((t) => t.id === activeTier.id);
      const items = [...newTiers[tierIndex].items];
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);

      newTiers[tierIndex] = {
        ...newTiers[tierIndex],
        items: arrayMove(items, oldIndex, newIndex),
      };
    } else if (overTier) {
      // Different tier — move item
      const fromIndex = newTiers.findIndex((t) => t.id === activeTier.id);
      const toIndex = newTiers.findIndex((t) => t.id === overTier.id);
      const item = activeTier.items.find((i) => i.id === active.id)!;
      const insertIndex = overTier.items.findIndex((i) => i.id === over.id);

      newTiers[fromIndex] = {
        ...newTiers[fromIndex],
        items: newTiers[fromIndex].items.filter((i) => i.id !== active.id),
      };
      const newItems = [...newTiers[toIndex].items];
      newItems.splice(insertIndex, 0, item);
      newTiers[toIndex] = { ...newTiers[toIndex], items: newItems };
    }

    onChange(newTiers);
  };

  const handleDeleteItem = (itemId: string) => {
    const newTiers = tiers.map((tier) => ({
      ...tier,
      items: tier.items.filter((item) => item.id !== itemId),
    }));
    onChange(newTiers);
  };

  const handleAddItem = (tierId: string, title: string, imageUrl: string) => {
    const newTiers = tiers.map((tier) => {
      if (tier.id !== tierId) return tier;
      return {
        ...tier,
        items: [
          ...tier.items,
          { id: crypto.randomUUID().slice(0, 8), title, imageUrl },
        ],
      };
    });
    onChange(newTiers);
    setShowItemForm(null);
  };

  const handleLabelChange = (tierId: string, label: string) => {
    onChange(tiers.map((t) => (t.id === tierId ? { ...t, label } : t)));
  };

  const handleColorChange = (tierId: string, color: string) => {
    onChange(tiers.map((t) => (t.id === tierId ? { ...t, color } : t)));
  };

  const handleDeleteTier = (tierId: string) => {
    if (tiers.length <= 1) return;
    onChange(tiers.filter((t) => t.id !== tierId));
  };

  const handleAddTier = () => {
    const colors = ['#FF7F7F', '#FFBF7F', '#FFDF7F', '#FFFF7F', '#BFFF7F', '#7FFF7F', '#7FFFFF', '#7F7FFF', '#FF7FFF'];
    const newTier: Tier = {
      id: crypto.randomUUID().slice(0, 8),
      label: 'New',
      color: colors[tiers.length % colors.length],
      items: [],
    };
    onChange([...tiers, newTier]);
  };

  const activeItem = activeId
    ? tiers.flatMap((t) => t.items).find((i) => i.id === activeId)
    : null;

  return (
    <div className="space-y-2">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {tiers.map((tier) => (
          <DroppableTier
            key={tier.id}
            tier={tier}
            onDeleteItem={handleDeleteItem}
            onLabelChange={(label) => handleLabelChange(tier.id, label)}
            onColorChange={(color) => handleColorChange(tier.id, color)}
            onDeleteTier={() => handleDeleteTier(tier.id)}
            onAddItem={(tierId) => setShowItemForm(tierId)}
          />
        ))}

        <DragOverlay>
          {activeItem && (
            <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-accent-500 shadow-2xl shadow-accent-500/30 rotate-3">
              <img src={activeItem.imageUrl} alt={activeItem.title} className="w-full h-full object-cover" />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Add Tier button */}
      <button
        onClick={handleAddTier}
        className="w-full py-3 rounded-xl border-2 border-dashed border-surface-700
                   text-surface-500 hover:text-surface-300 hover:border-surface-500
                   hover:bg-surface-900/50 transition-all duration-200 text-sm font-medium"
      >
        + Add Tier
      </button>

      {/* Item Form Modal */}
      {showItemForm && (
        <ItemForm
          tierId={showItemForm}
          onAdd={handleAddItem}
          onClose={() => setShowItemForm(null)}
        />
      )}
    </div>
  );
}
