import { UploadCloud, Edit2, Archive, Link as LinkIcon, BarChart2 } from 'lucide-react';
import { useMenuStore } from '../../../store/useMenuStore';

export default function ItemDrawer() {
  const { showItemDrawer, setShowItemDrawer, selectedItemForEdit } = useMenuStore();

  if (!showItemDrawer) return null;

  return (
    <div className="absolute inset-y-0 right-0 w-full sm:w-[400px] bg-card border-l border-border shadow-2xl z-20 flex flex-col">
      <div className="p-4 border-b border-border flex justify-between items-center bg-muted/10">
        <h3 className="font-black text-lg text-foreground">
          {selectedItemForEdit ? 'Edit Item' : 'Add New Item'}
        </h3>
        <button 
          onClick={() => setShowItemDrawer(false)}
          className="text-muted-foreground hover:text-foreground p-2 rounded-lg hover:bg-muted transition-colors"
        >
          Cancel
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        
        {/* Intelligence Panel (Only when editing) */}
        {selectedItemForEdit && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4">
            <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
              <BarChart2 className="w-4 h-4" /> Item Intelligence
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-black text-foreground">142</p>
                <p className="text-xs text-muted-foreground font-medium">Orders this week</p>
              </div>
              <div>
                <p className="text-lg font-bold text-green-600">Top 5%</p>
                <p className="text-xs text-muted-foreground font-medium">Performance tier</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-primary/10 flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <LinkIcon className="w-3 h-3" /> Linked to 3 Add-on groups
            </div>
          </div>
        )}

        {/* Image Upload */}
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Item Image</label>
          <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-muted/30 transition-colors cursor-pointer group">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-foreground">Click to upload</p>
            <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 2MB)</p>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Item Name *</label>
          <input 
            type="text" 
            className="w-full bg-background border border-border rounded-lg p-2.5 outline-none focus:border-primary font-medium" 
            placeholder="e.g. Garlic Bread" 
            defaultValue={selectedItemForEdit?.name || ''}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Base Price *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
              <input 
                type="text" 
                className="w-full pl-7 pr-3 bg-background border border-border rounded-lg p-2.5 outline-none focus:border-primary font-medium" 
                placeholder="0.00" 
                defaultValue={selectedItemForEdit?.price?.replace('$', '') || ''}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Food Type *</label>
            <select 
              className="w-full bg-background border border-border rounded-lg p-2.5 outline-none focus:border-primary font-medium"
              defaultValue={selectedItemForEdit?.type || 'Veg'}
            >
              <option>Veg</option>
              <option>Non-Veg</option>
              <option>Egg</option>
              <option>Vegan</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Prep Time (Mins)</label>
            <input type="number" className="w-full bg-background border border-border rounded-lg p-2.5 outline-none focus:border-primary font-medium" placeholder="e.g. 15" />
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Calories</label>
            <input type="number" className="w-full bg-background border border-border rounded-lg p-2.5 outline-none focus:border-primary font-medium" placeholder="e.g. 350" />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Description</label>
          <textarea rows="2" className="w-full bg-background border border-border rounded-lg p-2.5 outline-none focus:border-primary font-medium resize-none" placeholder="Short description..."></textarea>
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Tags</label>
          <input type="text" className="w-full bg-background border border-border rounded-lg p-2.5 outline-none focus:border-primary font-medium text-sm" placeholder="e.g. Spicy, Bestseller (comma separated)" />
        </div>

        {/* Toggles */}
        <div className="space-y-3 pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-foreground">In Stock</p>
              <p className="text-xs text-muted-foreground">Turn off to mark as out of stock</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked={selectedItemForEdit?.status !== 'Out of Stock'} />
              <div className="w-9 h-5 bg-muted-foreground/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-foreground">Featured Item</p>
              <p className="text-xs text-muted-foreground">Show in trending section</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-9 h-5 bg-muted-foreground/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        {/* Modifiers Section */}
        <div className="pt-4 border-t border-border">
          <div className="flex justify-between items-center mb-3">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Add-on Groups</label>
            <button className="text-xs font-bold text-primary hover:underline">Link Add-ons</button>
          </div>
          <div className="bg-muted/20 border border-border rounded-lg p-4 text-center border-dashed">
            <p className="text-sm text-muted-foreground font-medium">No add-ons linked to this item.</p>
          </div>
        </div>

      </div>
      <div className="p-4 border-t border-border bg-card flex gap-3">
        {selectedItemForEdit && (
          <button 
            className="px-4 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition-colors"
            title="Archive Item"
          >
            <Archive className="w-5 h-5" />
          </button>
        )}
        <button 
          onClick={() => setShowItemDrawer(false)}
          className="flex-1 bg-primary text-primary-foreground font-bold rounded-lg py-3 hover:bg-primary/90 transition-colors shadow-sm"
        >
          {selectedItemForEdit ? 'Update Item' : 'Save Item'}
        </button>
      </div>
    </div>
  );
}
