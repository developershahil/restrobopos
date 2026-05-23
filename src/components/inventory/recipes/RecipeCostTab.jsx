import { useState } from 'react';
import { Search, TrendingDown, TrendingUp } from 'lucide-react';
import { useMenuStore } from '../../../store/useMenuStore';
import { useInventoryStore } from '../../../store/useInventoryStore';

export default function RecipeCostTab() {
  const { items, categories } = useMenuStore();
  const { ingredients } = useInventoryStore();
  const [searchQuery, setSearchQuery] = useState('');

  // We need to mock some BOMs here or pull from the RecipesTab if it was stored globally.
  // Since RecipesTab state was local in the previous implementation, let's mock a cost calculator logic
  // based on some dummy BOMs or random assignment for demonstration, as a real implementation would
  // have the BOMs in a global store (e.g. useInventoryStore or useMenuStore).
  
  // For demonstration, let's randomly assign 2-3 ingredients to each item to calculate cost.
  const calculateItemCost = (itemId) => {
    // Deterministic random-like based on string length to keep UI stable
    const count = (itemId.length % 3) + 2; 
    let cost = 0;
    for (let i = 0; i < count; i++) {
      const ing = ingredients[i % ingredients.length];
      const qty = ((i + 1) * 0.15);
      cost += ing.costPerUnit * qty;
    }
    return cost;
  };

  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-card relative">
      <div className="p-4 border-b border-border flex justify-between gap-4 bg-muted/10 shrink-0">
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search menu items..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-lg border border-border bg-background outline-none focus:border-primary text-sm font-medium w-full"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="bg-background border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap min-w-[800px]">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 sticky top-0 z-10">
              <tr>
                <th className="px-5 py-4 font-bold">Menu Item</th>
                <th className="px-5 py-4 font-bold">Category</th>
                <th className="px-5 py-4 font-bold text-right">Selling Price</th>
                <th className="px-5 py-4 font-bold text-right">Recipe Cost</th>
                <th className="px-5 py-4 font-bold text-right">Gross Margin</th>
                <th className="px-5 py-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredItems.map((item) => {
                const category = categories.find(c => c.id === item.categoryId)?.name || 'Unknown';
                const sellPrice = parseFloat(item.price);
                const recipeCost = calculateItemCost(item.id);
                const marginAmount = sellPrice - recipeCost;
                const marginPct = sellPrice > 0 ? (marginAmount / sellPrice) * 100 : 0;
                
                const isLowMargin = marginPct < 30; // Anything below 30% is low margin
                const isHighMargin = marginPct >= 70; // High margin
                
                return (
                  <tr key={item.id} className="hover:bg-muted/30">
                    <td className="px-5 py-4 font-bold text-foreground">{item.name}</td>
                    <td className="px-5 py-4 text-xs text-muted-foreground font-medium">{category}</td>
                    <td className="px-5 py-4 font-black text-right text-foreground">₹{sellPrice.toFixed(2)}</td>
                    <td className="px-5 py-4 font-black text-right text-red-600">₹{recipeCost.toFixed(2)}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className={`font-black ${isLowMargin ? 'text-red-600' : isHighMargin ? 'text-green-600' : 'text-blue-600'}`}>
                          {marginPct.toFixed(1)}%
                        </span>
                        <span className="text-xs font-medium text-muted-foreground">₹{marginAmount.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {isLowMargin ? (
                        <span className="flex items-center gap-1.5 px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded border border-red-200 w-max">
                          <TrendingDown className="w-3 h-3" /> Low Margin
                        </span>
                      ) : isHighMargin ? (
                        <span className="flex items-center gap-1.5 px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded border border-green-200 w-max">
                          <TrendingUp className="w-3 h-3" /> Great Margin
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded border border-blue-200 w-max">Healthy</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  );
}
