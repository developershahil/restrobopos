import { Search, Building2 } from 'lucide-react';
import { useInventoryStore } from '@modules/inventory/store/useInventoryStore';

const TAB_LABELS = {
  ingredients: 'Ingredients Master',
  recipes: 'Recipe Engineering',
  stock: 'Stock Levels',
  purchase: 'Purchase Orders',
};

export default function InventoryHeader() {
  const { activeTab, selectedOutlet, setSelectedOutlet } = useInventoryStore();

  return (
    <div className="bg-card border-b border-border px-4 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
      <div className="flex items-center gap-4">
        <p className="hidden sm:block text-sm font-bold text-foreground">{TAB_LABELS[activeTab] || 'Inventory'}</p>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="relative">
          <Building2 className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <select
            value={selectedOutlet}
            onChange={(e) => setSelectedOutlet(e.target.value)}
            className="pl-8 pr-8 py-2.5 rounded-lg border border-border bg-muted/50 outline-none focus:border-primary text-xs font-bold transition-colors appearance-none cursor-pointer"
          >
            <option value="all">All Outlets (Global)</option>
            <option value="outlet-1">Koramangala Branch</option>
            <option value="outlet-2">Indiranagar Branch</option>
            <option value="outlet-3">HSR Layout Branch</option>
          </select>
        </div>

        <div className="relative flex-1 sm:flex-none">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search inventory..."
            className="w-full sm:w-48 pl-8 pr-3 py-2.5 rounded-lg border border-border bg-background outline-none focus:border-primary text-xs font-medium transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
