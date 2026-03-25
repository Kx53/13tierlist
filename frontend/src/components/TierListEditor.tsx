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
  useDroppable,
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
  unrankedItems?: TierItem[];
  onChange: (tiers: Tier[], unrankedItems?: TierItem[]) => void;
  slug: string;
}

// Sortable Item component
function SortableItem({ item, onDelete }: { item: TierItem; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
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
      className={`group relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden cursor-grab active:cursor-grabbing
                 border-2 ${isDragging ? 'border-accent-500 shadow-xl' : 'border-surface-700 hover:border-accent-500/50'} 
                 bg-surface-800 transition-all duration-200`}
    >
      {item.imageUrl ? (
        <>
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover pointer-events-none"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%231e293b" width="100" height="100"/><text x="50" y="55" text-anchor="middle" fill="%2364748b" font-size="30">?</text></svg>';
            }}
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1 pointer-events-none">
            <p className="text-[10px] sm:text-xs text-white truncate text-center font-medium">{item.title}</p>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-1 bg-surface-700 pointer-events-none">
          <p className="text-[10px] sm:text-xs text-center font-bold text-white overflow-hidden text-ellipsis line-clamp-3 w-full px-1 leading-tight">{item.title}</p>
        </div>
      )}
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
  const { setNodeRef } = useDroppable({ id: tier.id, data: { type: 'Container' } });

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
        <div ref={setNodeRef} className="flex-1 flex flex-wrap gap-2 p-2 min-h-[80px] items-start" data-tier-id={tier.id}>
          {tier.items.map((item) => (
            <SortableItem
              key={item.id}
              item={item}
              onDelete={() => onDeleteItem(item.id)}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

// Droppable Unranked Pool
function DroppableUnranked({ items, onDeleteItem, onAddItem }: { items: TierItem[], onDeleteItem: (itemId: string) => void, onAddItem: () => void }) {
  const itemIds = items.map(i => i.id);
  const { setNodeRef } = useDroppable({ id: 'unranked', data: { type: 'Container' } });

  return (
    <div className="mt-8 rounded-xl border border-surface-700 bg-surface-800/50 overflow-hidden">
      <div className="bg-surface-800 border-b border-surface-700 p-3 flex justify-between items-center">
        <h3 className="font-bold text-surface-200 flex items-center gap-2">
          <svg className="w-5 h-5 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          Item Bank (Unranked)
        </h3>
        <button onClick={onAddItem} className="btn-primary py-1.5 text-sm">
          + Upload Item
        </button>
      </div>
      <SortableContext items={itemIds} strategy={rectSortingStrategy}>
        <div ref={setNodeRef} className="p-4 min-h-[120px] flex flex-wrap gap-3 items-start">
          {items.map((item) => (
            <SortableItem
              key={item.id}
              item={item}
              onDelete={() => onDeleteItem(item.id)}
            />
          ))}
          {items.length === 0 && (
            <div className="w-full flex flex-col items-center justify-center py-8 text-surface-500 opacity-70">
              <span className="text-3xl mb-2">📥</span>
              <p>Upload items to start dragging them into tiers</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export default function TierListEditor({ tiers, unrankedItems = [], onChange }: Props) {
  const [showItemForm, setShowItemForm] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const findContainerByItemId = (itemId: string): string | null => {
    if (unrankedItems.some(i => i.id === itemId)) return 'unranked';
    const tier = tiers.find(t => t.items.some(i => i.id === itemId));
    return tier ? tier.id : null;
  };

  const getContainerItems = (containerId: string): TierItem[] => {
    if (containerId === 'unranked') return unrankedItems;
    return tiers.find(t => t.id === containerId)?.items || [];
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    // Drop outside or on active item
    if (!over || active.id === over.id) return;

    const activeContainerId = findContainerByItemId(active.id as string);
    // Find if over a container or another item
    const overContainerId = over.data.current?.type === 'Container' 
      ? over.id as string 
      : findContainerByItemId(over.id as string);

    if (!activeContainerId || !overContainerId) return;

    const newTiers = [...tiers];
    let newUnranked = [...unrankedItems];

    if (activeContainerId === overContainerId) {
      // Reordering within the same container
      const items = [...getContainerItems(activeContainerId)];
      const oldIndex = items.findIndex(i => i.id === active.id);
      let newIndex = items.findIndex(i => i.id === over.id);
      if (newIndex === -1) newIndex = items.length; // Drop on empty container space

      const movedItems = arrayMove(items, oldIndex, newIndex);

      if (activeContainerId === 'unranked') {
        newUnranked = movedItems;
      } else {
        const tierIndex = newTiers.findIndex(t => t.id === activeContainerId);
        if (tierIndex !== -1) newTiers[tierIndex] = { ...newTiers[tierIndex], items: movedItems };
      }
    } else {
      // Moving between containers
      let activeItems = [...getContainerItems(activeContainerId)];
      let overItems = [...getContainerItems(overContainerId)];

      const itemTomove = activeItems.find(i => i.id === active.id)!;
      activeItems = activeItems.filter(i => i.id !== active.id);

      let insertIndex = overItems.findIndex(i => i.id === over.id);
      if (insertIndex === -1) insertIndex = overItems.length;

      overItems.splice(insertIndex, 0, itemTomove);

      // Apply updates to the source and destination containers
      [
        { id: activeContainerId, items: activeItems },
        { id: overContainerId, items: overItems }
      ].forEach(({ id, items }) => {
        if (id === 'unranked') {
          newUnranked = items;
        } else {
          const tierIndex = newTiers.findIndex(t => t.id === id);
          if (tierIndex !== -1) newTiers[tierIndex] = { ...newTiers[tierIndex], items };
        }
      });
    }

    onChange(newTiers, newUnranked);
  };

  const handleDeleteItem = (itemId: string) => {
    const isUnranked = unrankedItems.some(i => i.id === itemId);
    if (isUnranked) {
      onChange(tiers, unrankedItems.filter(i => i.id !== itemId));
    } else {
      const newTiers = tiers.map(tier => ({
        ...tier,
        items: tier.items.filter(item => item.id !== itemId)
      }));
      onChange(newTiers, unrankedItems);
    }
  };

  const handleAddItem = (tierId: string, title: string, imageUrl?: string) => {
    const newItem: TierItem = { id: crypto.randomUUID().slice(0, 8), title, ...(imageUrl ? { imageUrl } : {}) };
    if (tierId === 'unranked') {
      onChange(tiers, [...unrankedItems, newItem]);
    } else {
      const newTiers = tiers.map((tier) => {
        if (tier.id !== tierId) return tier;
        return { ...tier, items: [...tier.items, newItem] };
      });
      onChange(newTiers, unrankedItems);
    }
    setShowItemForm(null);
  };

  const activeItem = activeId
    ? [...unrankedItems, ...tiers.flatMap(t => t.items)].find((i) => i.id === activeId)
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
            onLabelChange={(label) => onChange(tiers.map(t => t.id === tier.id ? { ...t, label } : t), unrankedItems)}
            onColorChange={(color) => onChange(tiers.map(t => t.id === tier.id ? { ...t, color } : t), unrankedItems)}
            onDeleteTier={() => {
              if (tiers.length <= 1) return;
              onChange(tiers.filter((t) => t.id !== tier.id), unrankedItems);
            }}
            onAddItem={() => setShowItemForm(tier.id)}
          />
        ))}

        <button
          onClick={() => {
            const colors = ['#FF7F7F', '#FFBF7F', '#FFDF7F', '#FFFF7F', '#BFFF7F', '#7FFF7F', '#7FFFFF', '#7F7FFF', '#FF7FFF'];
            const newTier: Tier = {
              id: crypto.randomUUID().slice(0, 8),
              label: 'New',
              color: colors[tiers.length % colors.length],
              items: [],
            };
            onChange([...tiers, newTier], unrankedItems);
          }}
          className="w-full py-3 rounded-xl border-2 border-dashed border-surface-700
                     text-surface-500 hover:text-surface-300 hover:border-surface-500
                     hover:bg-surface-900/50 transition-all duration-200 text-sm font-medium"
        >
          + Add Tier
        </button>

        <DroppableUnranked 
          items={unrankedItems} 
          onDeleteItem={handleDeleteItem} 
          onAddItem={() => setShowItemForm('unranked')} 
        />

        <DragOverlay>
          {activeItem && (
            <div className="w-20 h-20 rounded-lg overflow-hidden border-4 border-accent-500 shadow-2xl shadow-accent-500/50 rotate-6 scale-110 flex items-center justify-center bg-surface-700">
              {activeItem.imageUrl ? (
                <img src={activeItem.imageUrl} alt={activeItem.title} className="w-full h-full object-cover" />
              ) : (
                <p className="text-xs text-center font-bold text-white overflow-hidden text-ellipsis line-clamp-3 w-full px-1">{activeItem.title}</p>
              )}
            </div>
          )}
        </DragOverlay>
      </DndContext>

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
