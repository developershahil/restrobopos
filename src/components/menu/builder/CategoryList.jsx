import { useState } from 'react';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useMenuStore } from '../../../store/useMenuStore';
import { CategoryModal } from './modals/FormModals';
import { getCategoryTax, totalRate } from '../../../utils/taxUtils';

export default function CategoryList() {
  const {
    categories, addCategory, updateCategory, deleteCategory, bulkToggleCategory,
    selectedCategoryId, setSelectedCategoryId, items, taxes,
  } = useMenuStore();

  const [modal, setModal] = useState(null);

  const itemCount = (catId) => items.filter(i => i.categoryId === catId).length;
  const allActive = (catId) => items.filter(i => i.categoryId === catId).every(i => i.inStock);

  return (
    <div className="w-56 shrink-0 border-r border-border bg-card flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Categories</span>
        <button
          onClick={() => setModal({ mode: 'add' })}
          className="p-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto py-1">
        {categories.map(cat => {
          const isSelected = cat.id === selectedCategoryId;
          const count = itemCount(cat.id);
          const isAllActive = allActive(cat.id);

          return (
            <div
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`group px-4 py-3 cursor-pointer transition-colors border-b border-border/50 ${
                isSelected ? 'bg-primary/5' : 'hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
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
              <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); bulkToggleCategory(cat.id, !isAllActive); }}
                  title={isAllActive ? 'Mark all Out of Stock' : 'Mark all In Stock'}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition-colors flex-1 justify-center ${
                    isAllActive ? 'bg-green-50 text-green-700 hover:bg-red-50 hover:text-red-600' : 'bg-red-50 text-red-600 hover:bg-green-50 hover:text-green-700'
                  }`}
                >
                  {isAllActive ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                  All
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setModal({ mode: 'edit', cat }); }}
                  className="p-1.5 rounded hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteCategory(cat.id); }}
                  className="p-1.5 rounded hover:bg-red-50 hover:text-red-500 text-muted-foreground transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      {modal?.mode === 'add' && (
        <CategoryModal onSave={(data) => addCategory(data)} onClose={() => setModal(null)} />
      )}
      {modal?.mode === 'edit' && (
        <CategoryModal initial={modal.cat} onSave={(data) => updateCategory(modal.cat.id, data)} onClose={() => setModal(null)} />
      )}
    </div>
  );
}
