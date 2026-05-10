import { useState } from 'react';
import { ChevronDown, Send, Upload, Download } from 'lucide-react';
import { useMenuStore } from '../../../store/useMenuStore';
import CategoryList from './CategoryList';
import ItemList from './ItemList';
import ItemConfigPanel from './ItemConfigPanel';
import CSVImportModal from './modals/CSVImportModal';

export default function MenuBuilderTab() {
  const { menus, selectedMenuId, setSelectedMenuId, items, categories } = useMenuStore();
  const [published, setPublished] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const selectedMenu = menus.find(m => m.id === selectedMenuId);

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

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top bar: menu selector + publish */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-card border-b border-border shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-muted-foreground uppercase">Menu</span>
          <div className="relative">
            <select
              value={selectedMenuId}
              onChange={(e) => { setSelectedMenuId(e.target.value); setPublished(false); }}
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
            <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded">
              {selectedMenu.startDate} → {selectedMenu.endDate}
            </span>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {published && (
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">✓ Published</span>
          )}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-md text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export Menu
          </button>
          <button
            onClick={() => setShowImport(true)}
            className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-md text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Upload className="w-3.5 h-3.5" /> Import CSV
          </button>
          <button
            onClick={() => setPublished(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-bold hover:bg-primary/90 transition-colors"
          >
            <Send className="w-3 h-3" /> Publish
          </button>
        </div>
      </div>

      {/* 3-column layout */}
      <div className="flex flex-1 overflow-hidden">
        <CategoryList />
        <ItemList />
        <ItemConfigPanel />
      </div>
      {showImport && <CSVImportModal onClose={() => setShowImport(false)} />}
    </div>
  );
}
