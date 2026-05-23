import { useState, useMemo } from 'react';
import { useMenuStore } from '@modules/menu/store/useMenuStore';
import { Search, Save, Edit3 } from 'lucide-react';

export default function BulkEditGrid({ onClose }) {
  const { items, categories, updateItem, setHasUnsyncedChanges } = useMenuStore();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');

  // We will maintain a local state for edits to avoid brutal re-renders on every keystroke
  const [edits, setEdits] = useState({});

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (filterCat !== 'All' && item.categoryId !== filterCat) return false;
      if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [items, search, filterCat]);

  const handleEdit = (id, field, value) => {
    setEdits(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    Object.entries(edits).forEach(([id, changes]) => {
      updateItem(id, changes);
    });
    setHasUnsyncedChanges(true);
    setEdits({});
  };

  const hasChanges = Object.keys(edits).length > 0;

  return (
    <div className="flex flex-col h-full bg-background absolute inset-0 z-40">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 md:px-3 py-2 md:py-2 bg-card border-b border-border shrink-0 gap-3">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
            <Edit3 className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <div>
            <h2 className="text-sm md:text-base font-bold text-foreground">Bulk Edit Items</h2>
            <p className="text-[10px] md:text-xs text-muted-foreground hidden sm:block">Rapidly update pricing, markups, and stock status across your menu.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button onClick={onClose} className="flex-1 sm:flex-initial px-3 md:px-4 py-2 border border-border rounded-lg text-xs md:text-sm font-semibold hover:bg-muted transition-colors whitespace-nowrap">
            Exit
          </button>
          <button 
            onClick={handleSave}
            disabled={!hasChanges}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 md:px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all shadow-md whitespace-nowrap ${
              hasChanges ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5' : 'bg-muted text-muted-foreground opacity-60 cursor-not-allowed shadow-none'
            }`}
          >
            <Save className="w-3.5 h-3.5" /> Save {Object.keys(edits).length > 0 ? Object.keys(edits).length : ''}
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3 px-4 md:px-4 py-2 md:py-3 border-b border-border bg-muted/20 shrink-0">
        <div className="relative flex-1 min-w-[150px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search items..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-xs md:text-sm outline-none focus:border-primary transition-colors"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="px-2 md:px-3 py-2 bg-background border border-border rounded-lg text-xs md:text-sm outline-none focus:border-primary transition-colors cursor-pointer w-[120px] md:w-auto"
        >
          <option value="All">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        
        {hasChanges && (
          <span className="ml-auto text-xs font-semibold text-orange-500 bg-orange-50 px-2.5 py-1 rounded-full animate-pulse">
            Unsaved changes present
          </span>
        )}
      </div>

      {/* Data Grid */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground bg-muted/50 uppercase sticky top-0 z-10 backdrop-blur-sm">
            <tr>
              <th className="px-3 py-2 font-semibold border-b border-border/50">Item Name</th>
              <th className="px-3 py-2 font-semibold border-b border-border/50">Category</th>
              <th className="px-3 py-2 font-semibold border-b border-border/50">Base Price (₹)</th>
              <th className="px-3 py-2 font-semibold border-b border-border/50 text-orange-600">Swiggy Markup (%)</th>
              <th className="px-3 py-2 font-semibold border-b border-border/50 text-red-600">Zomato Markup (%)</th>
              <th className="px-3 py-2 font-semibold border-b border-border/50 text-center">In Stock</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => {
              const currentVals = edits[item.id] || {};
              const price = currentVals.price !== undefined ? currentVals.price : item.price;
              const swiggy = currentVals.swiggyMarkup !== undefined ? currentVals.swiggyMarkup : (item.swiggyMarkup || '0');
              const zomato = currentVals.zomatoMarkup !== undefined ? currentVals.zomatoMarkup : (item.zomatoMarkup || '0');
              const inStock = currentVals.inStock !== undefined ? currentVals.inStock : item.inStock;
              const catName = categories.find(c => c.id === item.categoryId)?.name || 'Unknown';

              const isEdited = (field) => currentVals[field] !== undefined && currentVals[field] !== item[field];

              return (
                <tr key={item.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-2.5 font-semibold text-foreground">{item.name}</td>
                  <td className="px-4 py-2.5 text-muted-foreground text-xs">{catName}</td>
                  
                  <td className="px-4 py-2.5">
                    <input 
                      type="number" 
                      value={price} 
                      onChange={(e) => handleEdit(item.id, 'price', e.target.value)}
                      className={`w-24 px-2 py-1.5 rounded outline-none font-bold text-foreground border transition-colors ${isEdited('price') ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-transparent border-transparent hover:border-border focus:border-primary focus:bg-background'}`}
                    />
                  </td>
                  
                  <td className="px-4 py-2.5">
                    <div className="relative">
                      <input 
                        type="number" 
                        value={swiggy} 
                        onChange={(e) => handleEdit(item.id, 'swiggyMarkup', e.target.value)}
                        className={`w-24 px-2 py-1.5 rounded outline-none font-bold text-foreground border transition-colors ${isEdited('swiggyMarkup') ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-transparent border-transparent hover:border-border focus:border-orange-400 focus:bg-background'}`}
                      />
                    </div>
                  </td>
                  
                  <td className="px-4 py-2.5">
                    <input 
                      type="number" 
                      value={zomato} 
                      onChange={(e) => handleEdit(item.id, 'zomatoMarkup', e.target.value)}
                      className={`w-24 px-2 py-1.5 rounded outline-none font-bold text-foreground border transition-colors ${isEdited('zomatoMarkup') ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-transparent border-transparent hover:border-border focus:border-red-400 focus:bg-background'}`}
                    />
                  </td>
                  
                  <td className="px-4 py-2.5 text-center">
                    <button
                      onClick={() => handleEdit(item.id, 'inStock', !inStock)}
                      className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                        inStock ? 'bg-green-50 text-green-700 hover:bg-red-50 hover:text-red-600' : 'bg-red-50 text-red-600 hover:bg-green-50 hover:text-green-700'
                      } ${isEdited('inStock') ? 'ring-2 ring-orange-400' : ''}`}
                    >
                      {inStock ? 'In Stock' : 'OOS'}
                    </button>
                  </td>
                </tr>
              );
            })}
            
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  No items match your search or filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
