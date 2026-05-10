import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Copy, ToggleLeft, ToggleRight, MoveRight } from 'lucide-react';
import { useMenuStore } from '../../../store/useMenuStore';
import { ItemModal } from './modals/FormModals';

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

export default function ItemList() {
  const {
    items, addItem, updateItem, deleteItem, duplicateItem, toggleItemStock,
    selectedCategoryId, categories,
    selectedItemId, setSelectedItemId,
  } = useMenuStore();

  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);

  const category = categories.find(c => c.id === selectedCategoryId);
  const filtered = items.filter(i =>
    i.categoryId === selectedCategoryId &&
    i.name.toLowerCase().includes(search.toLowerCase())
  );

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
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-semibold hover:bg-primary/90 transition-colors"
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
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto py-1">
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-sm text-muted-foreground">No items found</div>
        ) : (
          filtered.map(item => {
            const isSelected = item.id === selectedItemId;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItemId(item.id)}
                className={`group px-4 py-3 cursor-pointer transition-colors border-b border-border/50 ${
                  isSelected ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-muted/50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <VegDot type={item.type} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${isSelected ? 'text-primary' : 'text-foreground'}`}>{item.name}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-sm font-bold text-foreground">₹{item.price}</span>
                      {Number(item.discount) > 0 && (
                        <span className="text-xs font-bold bg-green-50 text-green-700 px-1.5 py-0.5 rounded">{item.discount}% off</span>
                      )}
                      {!item.inStock && (
                        <span className="text-xs font-bold bg-red-50 text-red-600 px-1.5 py-0.5 rounded">OOS</span>
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
                <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleItemStock(item.id); }}
                    title={item.inStock ? 'Mark Out of Stock' : 'Mark In Stock'}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-colors ${
                      item.inStock ? 'bg-green-50 text-green-700 hover:bg-red-50 hover:text-red-600' : 'bg-red-50 text-red-600 hover:bg-green-50 hover:text-green-700'
                    }`}
                  >
                    {item.inStock ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                    {item.inStock ? 'In Stock' : 'OOS'}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); duplicateItem(item.id); }} title="Duplicate"
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setModal({ mode: 'move', item }); }} title="Move"
                    className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                    <MoveRight className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setModal({ mode: 'edit', item }); }}
                    className="p-1.5 rounded hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }}
                    className="p-1.5 rounded hover:bg-red-50 hover:text-red-500 text-muted-foreground transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modals */}
      {modal?.mode === 'add' && (
        <ItemModal categoryId={selectedCategoryId} onSave={(data) => addItem(data)} onClose={() => setModal(null)} />
      )}
      {modal?.mode === 'edit' && (
        <ItemModal initial={modal.item} categoryId={selectedCategoryId} onSave={(data) => updateItem(modal.item.id, data)} onClose={() => setModal(null)} />
      )}
      {modal?.mode === 'move' && (
        <MoveModal item={modal.item} onSave={(catId) => updateItem(modal.item.id, { categoryId: catId })} onClose={() => setModal(null)} />
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
