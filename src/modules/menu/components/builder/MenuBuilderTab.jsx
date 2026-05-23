import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Send, Upload, Download, Eye, AlertCircle, Edit3, ArrowLeft } from 'lucide-react';
import { useMenuStore } from '@modules/menu/store/useMenuStore';
import CategoryList from './CategoryList';
import ItemList from './ItemList';
import ItemConfigPanel from './ItemConfigPanel';
import CSVImportModal from './modals/CSVImportModal';
import BulkEditGrid from './BulkEditGrid';

export default function MenuBuilderTab() {
  const { 
    menus, selectedMenuId, setSelectedMenuId, items, categories, 
    hasUnsyncedChanges, setHasUnsyncedChanges,
    variants, variantGroups, globalVariants, addonGroups, addonItems, itemAddonLinks, itemVariantLinks
  } = useMenuStore();
  
  const [showImport, setShowImport] = useState(false);
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  const selectedMenu = menus.find(m => m.id === selectedMenuId);

  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setHasUnsyncedChanges(true);
  }, [categories, items, variants, variantGroups, globalVariants, addonGroups, addonItems, itemAddonLinks, itemVariantLinks, setHasUnsyncedChanges]);

  const handleExportCSV = () => {
    const headers = [
      'Category', 'Name', 'Price', 'Type', 'Description',
      'Prep Time (mins)', 'Calories', 'Packaging (₹)', 'Discount (%)',
      'Tags', 'Allergens', 'Channels', 'Item Code', 'Min Qty', 'Max Qty'
    ];

    const escape = (v) => {
      if (!v) return '';
      const str = String(v);
      return str.includes(',') || str.includes('"') ? `"${str.replace(/"/g, '""')}"` : str;
    };

    const rows = items.map(item => {
      const cat = categories.find(c => c.id === item.categoryId)?.name || 'Uncategorized';
      return [
        cat, item.name, item.price, item.type, item.description,
        item.prepTime, item.calories, item.packagingCharge, item.discount,
        (item.tags || []).join(', '), (item.allergens || []).join(', '), (item.channels || []).join(', '),
        item.itemCode, item.minOrderQty, item.maxOrderQty
      ].map(escape).join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `menu_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Mobile view state: 'categories' | 'items' | 'config'
  const [mobileView, setMobileView] = useState('categories');

  // When a category is selected on mobile, switch to items view
  const handleMobileCategorySelect = () => setMobileView('items');
  // When an item is selected on mobile, switch to config view
  const handleMobileItemSelect = () => setMobileView('config');

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top bar: menu selector + publish */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-2.5 bg-card border-b border-border shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-muted-foreground uppercase hidden sm:inline">Menu</span>
          <div className="relative">
            <select
              value={selectedMenuId}
              onChange={(e) => { setSelectedMenuId(e.target.value); }}
              className="appearance-none bg-background border border-border rounded-md pl-3 pr-8 py-1.5 text-sm font-semibold outline-none focus:border-primary cursor-pointer transition-colors"
            >
              {menus.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} {m.type === 'Festive' ? '🎉' : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
          {selectedMenu?.type === 'Festive' && (
            <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded hidden sm:inline">
              {selectedMenu.startDate} → {selectedMenu.endDate}
            </span>
          )}
        </div>

        <div className="ml-auto flex items-center gap-1.5 md:gap-2 flex-wrap justify-end">
          {!hasUnsyncedChanges && (
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded items-center gap-1 hidden sm:flex">
              ✓ Synced
            </span>
          )}
          <button
            onClick={() => setShowBulkEdit(true)}
            className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 md:py-2 border border-border rounded-md text-xs md:text-sm font-semibold text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Bulk Edit</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="items-center gap-1.5 px-2 md:px-3 py-1.5 md:py-2 border border-border rounded-md text-xs md:text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors hidden lg:flex"
          >
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          <button
            onClick={() => setShowImport(true)}
            className="items-center gap-1.5 px-2 md:px-3 py-1.5 md:py-2 border border-border rounded-md text-xs md:text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors hidden lg:flex"
          >
            <Upload className="w-3.5 h-3.5" /> Import
          </button>
          <button
            onClick={() => setHasUnsyncedChanges(false)}
            className={`flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-bold transition-all ${
              hasUnsyncedChanges 
                ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:-translate-y-0.5' 
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {hasUnsyncedChanges ? <AlertCircle className="w-4 h-4 animate-pulse" /> : <Send className="w-3 h-3" />}
            <span className="hidden sm:inline">{hasUnsyncedChanges ? 'Publish Changes' : 'Publish'}</span>
            <span className="sm:hidden">{hasUnsyncedChanges ? 'Publish' : 'Publish'}</span>
          </button>
        </div>
      </div>

      {/* Desktop: 3-column layout */}
      <div className="hidden md:flex flex-1 overflow-hidden relative">
        <CategoryList />
        <ItemList />
        <ItemConfigPanel />
        {showBulkEdit && <BulkEditGrid onClose={() => setShowBulkEdit(false)} />}
      </div>

      {/* Mobile: Single panel navigation */}
      <div className="flex md:hidden flex-1 overflow-hidden relative flex-col">
        {mobileView === 'categories' && (
          <div className="flex-1 overflow-hidden">
            <CategoryList onMobileSelect={handleMobileCategorySelect} />
          </div>
        )}
        {mobileView === 'items' && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <button 
              onClick={() => setMobileView('categories')}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-primary bg-primary/5 border-b border-border shrink-0"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Categories
            </button>
            <div className="flex-1 overflow-hidden">
              <ItemList onMobileSelect={handleMobileItemSelect} />
            </div>
          </div>
        )}
        {mobileView === 'config' && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <button 
              onClick={() => setMobileView('items')}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-primary bg-primary/5 border-b border-border shrink-0"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Items
            </button>
            <div className="flex-1 overflow-hidden">
              <ItemConfigPanel />
            </div>
          </div>
        )}
        {showBulkEdit && <BulkEditGrid onClose={() => setShowBulkEdit(false)} />}
      </div>

      {showImport && <CSVImportModal onClose={() => setShowImport(false)} />}
    </div>
  );
}
