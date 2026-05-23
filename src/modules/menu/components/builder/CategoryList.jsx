import { useState } from 'react';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, ChevronUp, ChevronDown, MoreVertical, GripVertical, Search } from 'lucide-react';
import { useMenuStore } from '@modules/menu/store/useMenuStore';
import { CategoryModal, ConfirmModal } from './modals/FormModals';
import { getCategoryTax, totalRate } from '@modules/menu/utils/taxUtils';

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';

function SortableCategoryItem({ cat, isSelected, itemCount, allActive, onSelect, onEdit, onDelete, onMove, onToggle, openMenuId, setOpenMenuId }) {
  const { taxes } = useMenuStore();
  const count = itemCount(cat.id);
  const isAllActive = allActive(cat.id);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cat.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: (isDragging || openMenuId === cat.id) ? 50 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onSelect(cat.id)}
      className={`group px-3 py-2 cursor-pointer transition-colors border-b border-border/50 relative bg-card ${
        isSelected ? 'bg-primary/5' : 'hover:bg-muted/50'
      } ${isDragging ? 'shadow-xl border-primary/50' : ''}`}
    >
      <div className="flex items-center gap-2.5">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 -ml-2 text-muted-foreground hover:text-foreground opacity-50 hover:opacity-100 transition-opacity">
          <GripVertical className="w-4 h-4" />
        </div>
        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color || '#6366f1' }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className={`text-sm font-semibold truncate ${isSelected ? 'text-primary' : 'text-foreground'}`}>{cat.name}</p>
            {(() => { const t = getCategoryTax(cat.id, taxes); return t ? <span className="text-[10px] font-bold bg-green-50 text-green-700 px-1.5 py-0.5 rounded shrink-0">{totalRate(t)}%</span> : null; })()}
          </div>
          <p className="text-xs text-muted-foreground">{count} items {!cat.active && '· Hidden'}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 mt-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity relative">
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(cat.id, !isAllActive); }}
          title={isAllActive ? 'Mark all Out of Stock' : 'Mark all In Stock'}
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-colors flex-1 justify-center ${
            isAllActive ? 'bg-green-50 text-green-700 hover:bg-red-50 hover:text-red-600' : 'bg-red-50 text-red-600 hover:bg-green-50 hover:text-green-700'
          }`}
        >
          {isAllActive ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
          All
        </button>
        <button
          onClick={(e) => { 
            e.stopPropagation(); 
            setOpenMenuId(openMenuId === cat.id ? null : cat.id); 
          }}
          className={`p-1.5 rounded transition-colors ${openMenuId === cat.id ? 'bg-muted text-foreground' : 'hover:bg-muted text-muted-foreground'}`}
        >
          <MoreVertical className="w-3.5 h-3.5" />
        </button>

        {openMenuId === cat.id && (
          <>
            <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }} />
            <div className="absolute right-0 top-full mt-1 w-32 bg-card border border-border rounded-lg shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
              <button onClick={(e) => { e.stopPropagation(); onMove(cat.id, 'up'); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-muted text-foreground">
                <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> Move Up
              </button>
              <button onClick={(e) => { e.stopPropagation(); onMove(cat.id, 'down'); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-muted text-foreground">
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> Move Down
              </button>
              <div className="h-px bg-border my-1" />
              <button onClick={(e) => { e.stopPropagation(); onEdit(cat); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-muted text-foreground">
                <Edit2 className="w-3.5 h-3.5 text-muted-foreground" /> Edit
              </button>
              <button onClick={(e) => { e.stopPropagation(); onDelete(cat); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-red-50 text-red-600">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function CategoryList({ onMobileSelect }) {
  const {
    categories, addCategory, updateCategory, deleteCategory, bulkToggleCategory,
    selectedCategoryId, setSelectedCategoryId, items, moveCategory, reorderCategory
  } = useMenuStore();

  const [modal, setModal] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [search, setSearch] = useState('');

  const itemCount = (catId) => items.filter(i => i.categoryId === catId).length;
  const allActive = (catId) => items.filter(i => i.categoryId === catId).every(i => i.inStock);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      reorderCategory(active.id, over.id);
    }
  };

  return (
    <div className="w-full md:w-56 md:shrink-0 md:border-r border-border bg-card flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col border-b border-border">
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Categories</span>
          <button
            onClick={() => setModal({ mode: 'add' })}
            className="p-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="px-4 pb-3 relative">
          <Search className="w-3.5 h-3.5 absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground pb-3" style={{ top: 'calc(50% - 6px)' }} />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-7 pr-3 py-1.5 bg-muted/50 border border-border rounded-md text-xs outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto py-1 custom-scrollbar">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        >
          <SortableContext
            items={categories.map(c => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {categories.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase())).map(cat => (
              <SortableCategoryItem
                key={cat.id}
                cat={cat}
                isSelected={cat.id === selectedCategoryId}
                itemCount={itemCount}
                allActive={allActive}
                onSelect={(id) => { setSelectedCategoryId(id); onMobileSelect?.(); }}
                onEdit={(c) => setModal({ mode: 'edit', cat: c })}
                onDelete={(c) => setModal({ mode: 'delete', cat: c })}
                onMove={moveCategory}
                onToggle={bulkToggleCategory}
                openMenuId={openMenuId}
                setOpenMenuId={setOpenMenuId}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* Modals */}
      {modal?.mode === 'add' && (
        <CategoryModal onSave={(data, timing) => addCategory(data, timing)} onClose={() => setModal(null)} />
      )}
      {modal?.mode === 'edit' && (
        <CategoryModal initial={modal.cat} onSave={(data, timing) => updateCategory(modal.cat.id, data, timing)} onClose={() => setModal(null)} />
      )}
      {modal?.mode === 'delete' && (
        <ConfirmModal 
          title="Delete Category" 
          message={`Are you sure you want to delete "${modal.cat.name}"? All items inside will lose their category association.`} 
          onConfirm={() => deleteCategory(modal.cat.id)} 
          onClose={() => setModal(null)} 
        />
      )}
    </div>
  );
}
