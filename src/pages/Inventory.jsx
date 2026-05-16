import { useInventoryStore } from '../store/useInventoryStore';
import InventoryHeader from '../components/inventory/common/InventoryHeader';
import IngredientsTab from '../components/inventory/ingredients/IngredientsTab';
import RecipesTab from '../components/inventory/recipes/RecipesTab';
import RecipeCostTab from '../components/inventory/recipes/RecipeCostTab';
import StockLevelsTab from '../components/inventory/stock/StockLevelsTab';
import StockLedgerTab from '../components/inventory/stock/StockLedgerTab';
import VendorsTab from '../components/inventory/purchase/VendorsTab';

const TABS = [
  { id: 'ingredients',   label: 'Ingredients Master' },
  { id: 'vendors',       label: 'Vendors & Suppliers' },
  { id: 'recipes',       label: 'Recipe Engineering' },
  { id: 'cost',          label: 'Recipe Costing' },
  { id: 'stock',         label: 'Stock Levels' },
  { id: 'ledger',        label: 'Stock Ledger' },
];

export default function Inventory() {
  const { activeTab, setActiveTab } = useInventoryStore();

  return (
    <div className="flex-1 flex flex-col h-full bg-muted/30 overflow-hidden">

      {/* Compact global header */}
      <InventoryHeader />

      {/* Tab navigation */}
      <div className="bg-card border-b border-border px-4 flex gap-5 overflow-x-auto shrink-0 scrollbar-hide">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 px-1 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'ingredients' && <IngredientsTab />}
        {activeTab === 'vendors'     && <VendorsTab />}
        {activeTab === 'recipes'     && <RecipesTab />}
        {activeTab === 'cost'        && <RecipeCostTab />}
        {activeTab === 'stock'       && <StockLevelsTab />}
        {activeTab === 'ledger'      && <StockLedgerTab />}
      </div>

    </div>
  );
}
