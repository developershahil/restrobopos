import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Copy, ToggleLeft, ToggleRight, MoveRight, ChevronUp, ChevronDown, Filter, MoreVertical, GripVertical, Clock } from 'lucide-react';
import { useMenuStore } from '../../../store/useMenuStore';
import { ItemModal, ConfirmModal } from './modals/FormModals';

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';

const VegDot = ({ type }) => {
  const color = type === 'Veg' ? 'bg-green-500' : type === 'Non-Veg' ? 'bg-red-500' : 'bg-yellow-400';
  return <span className={`w-2.5 h-2.5 rounded-full shrink-0 mt-0.5 ${color}`} />;
};

const TAG_COLORS = {
  Bestseller: 'bg-amber-50 text-amber-700',
  Spicy: 'bg-red-50 text-red-600',
  New: 'bg-blue-50 text-blue-700',
  Popular: 'bg-purple-50 text-purple-700',
  "Chef's Special": 'bg-green-50 text-green-700',
};

function SortableItemRow({ item, isSelected, onSelect, onToggleStock, onSnooze, onDuplicate, onMoveCategory, onEdit, onDelete, onMove, openMenuId, setOpenMenuId }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: (isDragging || openMenuId === item.id) ? 50 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onSelect(item.id)}
      className={`group px-4 py-3 cursor-pointer transition-colors border-b border-border/50 relative bg-background ${
        isSelected ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-muted/50'
      } ${isDragging ? 'shadow-xl border-primary/50' : ''}`}
    >
      <div className="flex items-start gap-2.5">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 -ml-2 mt-[-2px] text-muted-foreground hover:text-foreground opacity-50 hover:opacity-100 transition-opacity">
          <GripVertical className="w-4 h-4" />
        </div>
        <VegDot type={item.type} />
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold truncate ${isSelected ? 'text-primary' : 'text-foreground'}`}>{item.name}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-sm font-bold text-foreground">₹{item.price}</span>
            {Number(item.discount) > 0 && (
              <span className="text-xs font-bold bg-green-50 text-green-700 px-1.5 py-0.5 rounded">{item.discount}% off</span>
            )}
            {!item.inStock && (
              <span className="text-xs font-bold bg-red-50 text-red-600 px-1.5 py-0.5 rounded flex items-center gap-1">
                {item.snoozeUntil ? <><Clock className="w-3 h-3" /> Snoozed</> : 'OOS'}
              </span>
            )}
          </div>
          {/* Tags */}
          {item.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {item.tags.map(tag => (
                <span key={tag} className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${TAG_COLORS[tag] || 'bg-muted text-muted-foreground'}`}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions (visible on hover) */}
      <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity relative">
        <button
          onClick={(e) => { 
            e.stopPropagation(); 
            if (item.inStock) {
              onSnooze(item.id);
            } else {
              onToggleStock(item.id); 
            }
          }}
          title={item.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
          className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-colors ${
            item.inStock ? 'bg-green-50 text-green-700 hover:bg-red-50 hover:text-red-600' : 'bg-red-50 text-red-600 hover:bg-green-50 hover:text-green-700'
          }`}
        >
          {item.inStock ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
          {item.inStock ? 'In Stock' : 'OOS'}
        </button>

        <button
          onClick={(e) => { 
            e.stopPropagation(); 
            setOpenMenuId(openMenuId === item.id ? null : item.id); 
          }}
          className={`p-1.5 rounded transition-colors ${openMenuId === item.id ? 'bg-muted text-foreground' : 'hover:bg-muted text-muted-foreground'}`}
        >
          <MoreVertical className="w-3.5 h-3.5" />
        </button>

        {openMenuId === item.id && (
          <>
            <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }} />
            <div className="absolute right-0 top-full mt-1 w-36 bg-card border border-border rounded-lg shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
              <button onClick={(e) => { e.stopPropagation(); onMove(item.id, 'up'); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-muted text-foreground">
                <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> Move Up
              </button>
              <button onClick={(e) => { e.stopPropagation(); onMove(item.id, 'down'); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-muted text-foreground">
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" /> Move Down
              </button>
              <div className="h-px bg-border my-1" />
              <button onClick={(e) => { e.stopPropagation(); onMoveCategory(item); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-muted text-foreground">
                <MoveRight className="w-3.5 h-3.5 text-muted-foreground" /> Move to Category
              </button>
              <button onClick={(e) => { e.stopPropagation(); onDuplicate(item.id); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-muted text-foreground">
                <Copy className="w-3.5 h-3.5 text-muted-foreground" /> Duplicate
              </button>
              <div className="h-px bg-border my-1" />
              <button onClick={(e) => { e.stopPropagation(); onEdit(item); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-muted text-foreground">
                <Edit2 className="w-3.5 h-3.5 text-muted-foreground" /> Edit Details
              </button>
              <button onClick={(e) => { e.stopPropagation(); onDelete(item); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-red-50 text-red-600">
                <Trash2 className="w-3.5 h-3.5" /> Delete Item
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function ItemList() {
  const {
    items, addItem, updateItem, deleteItem, duplicateItem, toggleItemStock, snoozeItem,
    selectedCategoryId, categories,
    selectedItemId, setSelectedItemId, reorderItem
  } = useMenuStore();

  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState('All');
  const [modal, setModal] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [snoozeItemId, setSnoozeItemId] = useState(null);

  const category = categories.find(c => c.id === selectedCategoryId);
  const filtered = items.filter(i => {
    if (i.categoryId !== selectedCategoryId) return false;
    if (search && !i.name.toLowerCase().includes(search.toLowerCase())) return false;
    
    if (filterMode === 'Swiggy' && !i.channels?.includes('Swiggy')) return false;
    if (filterMode === 'Zomato' && !i.channels?.includes('Zomato')) return false;
    if (filterMode === 'No Image' && !!i.imageUrl) return false;
    if (filterMode === 'OOS' && i.inStock) return false;
    
    return true;
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      reorderItem(active.id, over.id);
    }
  };

  return (
    <div className="w-72 shrink-0 border-r border-border bg-background flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-foreground">{category?.name || 'Items'}</span>
            <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-semibold">{filtered.length}</span>
          </div>
          <button
            onClick={() => setModal({ mode: 'add' })}
            className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-md text-xs font-semibold hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-muted/50 border border-border rounded-lg text-sm outline-none focus:border-primary transition-colors"
          />
        </div>
        
        {/* Quick Filters */}
        <div className="flex flex-wrap gap-1.5 mt-2 pb-1">
          {['All', 'Swiggy', 'Zomato', 'No Image', 'OOS'].map(f => (
            <button
              key={f}
              onClick={() => setFilterMode(f)}
              className={`px-2 py-1 text-[10px] font-bold rounded-full whitespace-nowrap transition-colors border ${
                filterMode === f 
                  ? 'bg-foreground text-background border-foreground' 
                  : 'bg-background text-muted-foreground border-border hover:bg-muted'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto py-1 custom-scrollbar">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 py-10 opacity-70">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
              <Search className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">No items found</p>
            <p className="text-xs text-muted-foreground mb-4">
              {search ? `No items match "${search}"` : 'There are no items in this category yet.'}
            </p>
            <button
              onClick={() => setModal({ mode: 'add' })}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 text-primary rounded-lg text-xs font-semibold hover:bg-primary/20 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add New Item
            </button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          >
            <SortableContext
              items={filtered.map(i => i.id)}
              strategy={verticalListSortingStrategy}
            >
              {filtered.map(item => (
                <SortableItemRow
                  key={item.id}
                  item={item}
                  isSelected={item.id === selectedItemId}
                  onSelect={setSelectedItemId}
                  onToggleStock={toggleItemStock}
                  onSnooze={setSnoozeItemId}
                  onDuplicate={duplicateItem}
                  onMoveCategory={(i) => setModal({ mode: 'move', item: i })}
                  onEdit={(i) => setModal({ mode: 'edit', item: i })}
                  onDelete={(i) => setModal({ mode: 'delete', item: i })}
                  onMove={(id, dir) => useMenuStore.getState().moveItem(id, dir)}
                  openMenuId={openMenuId}
                  setOpenMenuId={setOpenMenuId}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Modals */}
      {modal?.mode === 'add' && (
        <ItemModal initial={{ categoryId: selectedCategoryId }} onSave={(data) => addItem(data)} onClose={() => setModal(null)} />
      )}
      {modal?.mode === 'edit' && (
        <ItemModal initial={modal.item} onSave={(data) => updateItem(modal.item.id, data)} onClose={() => setModal(null)} />
      )}
      {modal?.mode === 'delete' && (
        <ConfirmModal 
          title="Delete Item" 
          message={`Are you sure you want to delete "${modal.item.name}"? This action cannot be undone.`} 
          onConfirm={() => deleteItem(modal.item.id)} 
          onClose={() => setModal(null)} 
        />
      )}
      {modal?.mode === 'move' && (
        <MoveModal item={modal.item} onSave={(catId) => updateItem(modal.item.id, { categoryId: catId })} onClose={() => setModal(null)} />
      )}
      {snoozeItemId && (
        <SnoozeModal 
          item={items.find(i => i.id === snoozeItemId)} 
          onSave={(until) => snoozeItem(snoozeItemId, until)} 
          onClose={() => setSnoozeItemId(null)} 
        />
      )}
    </div>
  );
}

function MoveModal({ item, onSave, onClose }) {
  const { categories } = useMenuStore();
  const [catId, setCatId] = useState(item.categoryId);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl shadow-xl w-80 mx-4">
        <div className="px-4 py-3 border-b border-border">
          <p className="text-sm font-bold">Move "{item.name}"</p>
        </div>
        <div className="p-4 space-y-3">
          <select value={catId} onChange={(e) => setCatId(e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary">
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted">Cancel</button>
            <button onClick={() => { onSave(catId); onClose(); }} className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">Move</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SnoozeModal({ item, onSave, onClose }) {
  if (!item) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl shadow-xl w-80 mx-4 overflow-hidden animate-in fade-in zoom-in-95">
        <div className="px-4 py-3 bg-red-50 border-b border-red-100 flex items-center gap-2">
          <Clock className="w-4 h-4 text-red-600" />
          <p className="text-sm font-bold text-red-700">Mark Out of Stock</p>
        </div>
        <div className="p-4 space-y-2">
          <p className="text-xs text-muted-foreground mb-4">How long should <span className="font-bold text-foreground">{item.name}</span> be out of stock?</p>
          
          <button onClick={() => { onSave(Date.now() + 2 * 60 * 60 * 1000); onClose(); }} className="w-full text-left px-4 py-2.5 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-sm font-semibold">
            Snooze for 2 Hours
          </button>
          <button onClick={() => { 
            const tomorrow = new Date(); tomorrow.setHours(24,0,0,0); 
            onSave(tomorrow.getTime()); onClose(); 
          }} className="w-full text-left px-4 py-2.5 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors text-sm font-semibold">
            Snooze until Tomorrow
          </button>
          <button onClick={() => { onSave('indefinite'); onClose(); }} className="w-full text-left px-4 py-2.5 rounded-lg border border-border hover:border-red-500 hover:bg-red-50 transition-colors text-sm font-semibold text-red-600">
            Indefinitely Out of Stock
          </button>
          
          <div className="pt-2">
            <button onClick={onClose} className="w-full py-2 rounded-lg text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
