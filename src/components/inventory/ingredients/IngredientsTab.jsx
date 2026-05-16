import { useState } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useInventoryStore } from '../../../store/useInventoryStore';

export default function IngredientsTab() {
  const { ingredients, addIngredient, vendors } = useInventoryStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: 'Dry Goods',
    unit: 'kg',
    costPerUnit: '',
    minStock: '',
    vendorId: '',
  });

  const handleAddIngredient = (e) => {
    e.preventDefault();
    const parsedCost = parseFloat(formData.costPerUnit);
    const parsedMin = parseInt(formData.minStock);
    if (!formData.name.trim() || isNaN(parsedCost) || isNaN(parsedMin)) return;

    addIngredient({
      id: `ING-00${ingredients.length + 1}`,
      ...formData,
      costPerUnit: parsedCost,
      minStock: parsedMin,
      vendorId: formData.vendorId || null,
    });

    setIsDrawerOpen(false);
    setFormData({ name: '', category: 'Dry Goods', unit: 'kg', costPerUnit: '', minStock: '', vendorId: '' });
  };

  const filteredIngredients = ingredients.filter(ing =>
    ing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ing.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-card relative">
      {/* Action Bar */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between gap-4 bg-muted/10 shrink-0">
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-lg border border-border bg-background outline-none focus:border-primary text-sm font-medium w-full"
          />
        </div>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg shadow-sm hover:bg-primary/90 transition-colors text-sm shrink-0 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" /> Add Ingredient
        </button>
      </div>

      {/* Table Area */}
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="bg-background border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap min-w-[800px]">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 font-bold">Ingredient</th>
                  <th className="px-6 py-4 font-bold">Category</th>
                  <th className="px-6 py-4 font-bold">Unit Cost</th>
                  <th className="px-6 py-4 font-bold">Alert Threshold</th>
                  <th className="px-6 py-4 font-bold">Primary Vendor</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredIngredients.map((ing) => (
                  <tr key={ing.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-foreground">{ing.name}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-muted rounded text-xs font-bold text-muted-foreground">
                        {ing.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-foreground">₹{ing.costPerUnit.toFixed(2)}</span>
                      <span className="text-xs text-muted-foreground ml-1">/ {ing.unit}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${ing.minStock > 0 ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-muted text-muted-foreground border-border'
                        }`}>
                        {ing.minStock > 0 ? `Min: ${ing.minStock} ${ing.unit}` : 'Not set'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-muted-foreground">
                      {ing.vendorId ? vendors.find(v => v.id === ing.vendorId)?.name || 'Unknown' : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Ingredient Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setIsDrawerOpen(false)} />

          <div className="relative w-full max-w-md bg-card h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-border bg-muted/30">
              <h3 className="text-xl font-black text-foreground">Add New Ingredient</h3>
              <p className="text-sm text-muted-foreground mt-1">Register a new raw material to your inventory master list.</p>
            </div>

            <form onSubmit={handleAddIngredient} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground">Ingredient Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Premium Mozzarella"
                  className="w-full p-3 rounded-lg border border-border bg-background outline-none focus:border-primary font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 rounded-lg border border-border bg-background outline-none focus:border-primary font-medium"
                  >
                    <option value="Dry Goods">Dry Goods</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Produce">Produce</option>
                    <option value="Meat">Meat</option>
                    <option value="Canned Goods">Canned Goods</option>
                    <option value="Packaging">Packaging</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Measurement Unit</label>
                  <select
                    value={formData.unit}
                    onChange={e => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full p-3 rounded-lg border border-border bg-background outline-none focus:border-primary font-medium"
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="g">Grams (g)</option>
                    <option value="liters">Liters (L)</option>
                    <option value="ml">Milliliters (ml)</option>
                    <option value="pieces">Pieces (pcs)</option>
                    <option value="packets">Packets</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Est. Cost per Unit (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.costPerUnit}
                    onChange={e => setFormData({ ...formData, costPerUnit: e.target.value })}
                    placeholder="0.00"
                    className="w-full p-3 rounded-lg border border-border bg-background outline-none focus:border-primary font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Min Stock Alert</label>
                  <input
                    type="number"
                    required
                    value={formData.minStock}
                    onChange={e => setFormData({ ...formData, minStock: e.target.value })}
                    placeholder="e.g., 50"
                    className="w-full p-3 rounded-lg border border-border bg-background outline-none focus:border-primary font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground">Primary Vendor</label>
                <select
                  value={formData.vendorId}
                  onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
                  className="w-full p-3 rounded-lg border border-border bg-background outline-none focus:border-primary text-sm font-medium"
                >
                  <option value="">No vendor (Manual PO only)</option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
                <p className="text-[10px] text-muted-foreground font-bold mt-1">Used for auto-generating purchase orders when stock is low.</p>
              </div>
            </form>

            <div className="p-6 border-t border-border bg-muted/10 grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="px-4 py-3 rounded-lg font-bold border border-border bg-background text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddIngredient}
                className="px-4 py-3 rounded-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                Save Ingredient
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
