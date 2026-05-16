import { useState } from 'react';
import { Search, ChefHat, Save, Package, Layers, PlusCircle, Trash2, ChevronDown, ChevronRight, FolderOpen, Tag } from 'lucide-react';
import { useMenuStore } from '../../../store/useMenuStore';

const INGREDIENTS = [
  { id: 'ING-001', name: 'Premium Flour', unit: 'kg' },
  { id: 'ING-002', name: 'Mozzarella Cheese', unit: 'kg' },
  { id: 'ING-003', name: 'Tomato Paste', unit: 'liters' },
  { id: 'ING-004', name: 'Pizza Boxes (Large)', unit: 'pieces' },
  { id: 'ING-005', name: 'Chicken', unit: 'kg' },
  { id: 'ING-006', name: 'Butter', unit: 'kg' },
  { id: 'ING-007', name: 'Cream', unit: 'liters' },
];

const emptyRow = () => ({ ingredientId: '', qty: '' });

function BomEditor({ rows, onChange }) {
  const addRow = () => onChange([...rows, emptyRow()]);
  const removeRow = (idx) => onChange(rows.filter((_, i) => i !== idx));
  const updateRow = (idx, field, val) =>
    onChange(rows.map((r, i) => (i === idx ? { ...r, [field]: val } : r)));
  const ingredientUnit = (id) => INGREDIENTS.find((i) => i.id === id)?.unit || '';

  return (
    <div>
      {rows.length === 0 ? (
        <p className="text-xs text-muted-foreground py-3 text-center">No ingredients mapped yet.</p>
      ) : (
        <div className="space-y-2 mb-3">
          {rows.map((row, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <select
                value={row.ingredientId}
                onChange={(e) => updateRow(idx, 'ingredientId', e.target.value)}
                className="flex-1 p-2 rounded-lg border border-border bg-background outline-none focus:border-primary text-sm font-medium"
              >
                <option value="">Select ingredient…</option>
                {INGREDIENTS.map((ing) => (
                  <option key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</option>
                ))}
              </select>
              <input
                type="number" min="0" step="0.01" placeholder="Qty"
                value={row.qty}
                onChange={(e) => updateRow(idx, 'qty', e.target.value)}
                className="w-24 p-2 rounded-lg border border-border bg-background outline-none focus:border-primary text-sm font-medium text-right"
              />
              <span className="w-12 text-xs font-bold text-muted-foreground shrink-0">
                {ingredientUnit(row.ingredientId) || '—'}
              </span>
              <button onClick={() => removeRow(idx)} className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded transition-colors shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={addRow}
        className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors mt-1"
      >
        <PlusCircle className="w-3.5 h-3.5" /> Add Ingredient
      </button>
    </div>
  );
}

function LevelCard({ color, label, title, icon: Icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const colorMap = {
    purple:  { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700', icon: 'bg-purple-100 text-purple-600' },
    blue:    { bg: 'bg-blue-50 dark:bg-blue-900/20',    border: 'border-blue-200',   badge: 'bg-blue-100 text-blue-700',   icon: 'bg-blue-100 text-blue-600'   },
    indigo:  { bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-700', icon: 'bg-indigo-100 text-indigo-600' },
    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', icon: 'bg-emerald-100 text-emerald-600' },
  };
  const c = colorMap[color];
  return (
    <div className={`border ${c.border} rounded-xl overflow-hidden mb-5`}>
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-5 py-4 ${c.bg} transition-colors hover:brightness-95`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.icon}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${c.badge}`}>{label}</span>
            <p className="text-sm font-bold text-foreground mt-0.5">{title}</p>
          </div>
        </div>
        {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && <div className="p-4 bg-card">{children}</div>}
    </div>
  );
}

export default function RecipesTab() {
  const { items, categories, variants, addonGroups, addonItems } = useMenuStore();

  // Selection mode: 'category' or 'item'
  const [selectionMode, setSelectionMode] = useState('item'); // 'category' | 'item'
  const [selectedCategoryId, setSelectedCategoryId] = useState(categories[0]?.id || null);
  const [selectedItemId, setSelectedItemId] = useState(items[0]?.id || null);
  const [expandedCategories, setExpandedCategories] = useState({ [categories[0]?.id]: true });
  const [searchQuery, setSearchQuery] = useState('');

  const [boms, setBoms] = useState({});
  const getBom = (key) => boms[key] || [];
  const setBom = (key, rows) => setBoms((prev) => ({ ...prev, [key]: rows }));
  const hasBom = (key) => (boms[key] || []).length > 0;

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const selectedItem = items.find((i) => i.id === selectedItemId);
  const itemCategory = selectedItem ? categories.find((c) => c.id === selectedItem.categoryId) : null;
  const itemVariants = variants.filter((v) => v.itemId === selectedItemId);

  const toggleCategory = (catId) =>
    setExpandedCategories((prev) => ({ ...prev, [catId]: !prev[catId] }));

  const handleSelectCategory = (catId) => {
    setSelectionMode('category');
    setSelectedCategoryId(catId);
  };

  const handleSelectItem = (itemId, catId) => {
    setSelectionMode('item');
    setSelectedItemId(itemId);
    setSelectedCategoryId(catId);
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      items.some((i) => i.categoryId === c.id && i.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const catItemMapped = (catId) => hasBom(`cat-${catId}`);
  const itemMapped = (itemId) => {
    const ivs = variants.filter((v) => v.itemId === itemId);
    return hasBom(itemId) || ivs.some((v) => hasBom(`v-${v.id}`)) || addonItems.some((a) => hasBom(`a-${a.id}`));
  };

  return (
    <div className="h-full flex flex-col md:flex-row bg-background">

      {/* ── Left Panel ── */}
      <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-border bg-card flex flex-col shrink-0">
        <div className="p-3 border-b border-border bg-muted/10 shrink-0 space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background outline-none focus:border-primary text-sm font-medium"
            />
          </div>
        </div>

        <div className="flex-1 md:overflow-y-auto max-h-[30vh] md:max-h-full overflow-y-auto p-2">
          {filteredCategories.map((cat) => {
            const catItems = items.filter(
              (i) =>
                i.categoryId === cat.id &&
                i.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            const isExpanded = expandedCategories[cat.id];

            return (
              <div key={cat.id} className="mb-1">
                {/* Category row */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleCategory(cat.id)}
                    className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`flex-1 flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left ${
                      selectionMode === 'category' && selectedCategoryId === cat.id
                        ? 'bg-purple-100 border border-purple-200 shadow-sm'
                        : 'border border-transparent hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className={`text-sm font-bold truncate ${selectionMode === 'category' && selectedCategoryId === cat.id ? 'text-purple-700' : 'text-foreground'}`}>
                        {cat.name}
                      </span>
                    </div>
                    {catItemMapped(cat.id) && (
                      <span className="text-[9px] font-black bg-green-100 text-green-700 px-1.5 py-0.5 rounded shrink-0">✓</span>
                    )}
                  </button>
                </div>

                {/* Item rows */}
                {isExpanded && (
                  <div className="ml-6 mt-0.5 space-y-0.5">
                    {catItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelectItem(item.id, cat.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all text-left ${
                          selectionMode === 'item' && selectedItemId === item.id
                            ? 'bg-primary/10 border border-primary/20'
                            : 'border border-transparent hover:bg-muted'
                        }`}
                      >
                        <span className={`text-sm font-semibold truncate ${selectionMode === 'item' && selectedItemId === item.id ? 'text-primary' : 'text-foreground'}`}>
                          {item.name}
                        </span>
                        <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 ml-1 ${
                          itemMapped(item.id) ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {itemMapped(item.id) ? '✓' : '—'}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Right Panel: BOM Builder ── */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">

        {/* ── CATEGORY MODE ── */}
        {selectionMode === 'category' && selectedCategory && (
          <>
            <div className="px-4 sm:px-6 py-4 border-b border-border bg-card shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                  <FolderOpen className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-black text-foreground line-clamp-1">{selectedCategory.name}</h2>
                    <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded shrink-0">Category Level</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">
                    {items.filter((i) => i.categoryId === selectedCategory.id).length} items in this category
                  </p>
                </div>
              </div>
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-bold rounded-lg shadow-sm hover:bg-primary/90 transition-colors text-sm w-full sm:w-auto">
                <Save className="w-4 h-4" /> Save Recipe
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
                <p className="text-sm font-bold text-purple-800 mb-1">📦 Category-Level Ingredients</p>
                <p className="text-xs text-purple-700">
                  These ingredients are consumed by <strong>every item</strong> in the <strong>{selectedCategory.name}</strong> category.
                  Great for shared packaging, condiments, or base materials common to all items in this section.
                </p>
              </div>
              <LevelCard
                color="purple"
                label="Category"
                title={`Shared Recipe — ${selectedCategory.name}`}
                icon={FolderOpen}
                defaultOpen={true}
              >
                <BomEditor
                  rows={getBom(`cat-${selectedCategory.id}`)}
                  onChange={(rows) => setBom(`cat-${selectedCategory.id}`, rows)}
                />
              </LevelCard>
            </div>
          </>
        )}

        {/* ── ITEM MODE ── */}
        {selectionMode === 'item' && selectedItem && (
          <>
            <div className="px-4 sm:px-6 py-4 border-b border-border bg-card shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <ChefHat className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-black text-foreground line-clamp-1">{selectedItem.name}</h2>
                    <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded shrink-0">Item Level</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5 line-clamp-1">
                    {itemCategory?.name} • {selectedItem.type} • {selectedItem.itemCode}
                  </p>
                </div>
              </div>
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-bold rounded-lg shadow-sm hover:bg-primary/90 transition-colors text-sm w-full sm:w-auto">
                <Save className="w-4 h-4" /> Save All Recipes
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {/* Inheritance Notice */}
              {hasBom(`cat-${itemCategory?.id}`) && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 mb-5 flex items-start gap-3">
                  <FolderOpen className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-purple-800">
                    <strong>Category-level ingredients active:</strong> This item also inherits shared ingredients from the <strong>{itemCategory?.name}</strong> category recipe. Those are stacked on top of the item-level BOM below.
                  </p>
                </div>
              )}

              {/* Level 1: Base Item */}
              <LevelCard color="blue" label="Item Level" title={`Base Recipe — ${selectedItem.name}`} icon={Package} defaultOpen={true}>
                <p className="text-xs text-muted-foreground mb-4">Ingredients consumed for one serving of <strong>{selectedItem.name}</strong>, regardless of variant or addon.</p>
                <BomEditor rows={getBom(selectedItem.id)} onChange={(rows) => setBom(selectedItem.id, rows)} />
              </LevelCard>

              {/* Level 2: Variants */}
              <LevelCard color="indigo" label="Variant Level" title={`Variant Recipes (${itemVariants.length} variants)`} icon={Layers} defaultOpen={itemVariants.length > 0}>
                {itemVariants.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No variants for this item. Add variants in the Menu Builder first.</p>
                ) : (
                  <>
                    <p className="text-xs text-muted-foreground mb-4">Define ingredient differences per variant (e.g., Large uses more dough).</p>
                    {itemVariants.map((variant) => (
                      <div key={variant.id} className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Tag className="w-3.5 h-3.5 text-indigo-500" />
                          <span className="text-sm font-bold text-foreground">{variant.name}</span>
                          <span className="text-xs text-muted-foreground">(+₹{variant.price})</span>
                        </div>
                        <BomEditor rows={getBom(`v-${variant.id}`)} onChange={(rows) => setBom(`v-${variant.id}`, rows)} />
                        <div className="border-b border-border mt-4" />
                      </div>
                    ))}
                  </>
                )}
              </LevelCard>

              {/* Level 3: Addons */}
              <LevelCard color="emerald" label="Addon Level" title={`Addon Recipes (${addonGroups.length} groups)`} icon={PlusCircle} defaultOpen={false}>
                <p className="text-xs text-muted-foreground mb-4">Track ingredient usage for each add-on option.</p>
                {addonGroups.map((group) => {
                  const groupItems = addonItems.filter((ai) => ai.groupId === group.id);
                  return (
                    <div key={group.id} className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">{group.name}</span>
                        <div className="flex-1 h-px bg-border" />
                      </div>
                      {groupItems.map((addon) => (
                        <div key={addon.id} className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <PlusCircle className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-sm font-bold text-foreground">{addon.name}</span>
                            <span className="text-xs text-muted-foreground">(₹{addon.price})</span>
                          </div>
                          <BomEditor rows={getBom(`a-${addon.id}`)} onChange={(rows) => setBom(`a-${addon.id}`, rows)} />
                          <div className="border-b border-dashed border-border mt-3" />
                        </div>
                      ))}
                    </div>
                  );
                })}
              </LevelCard>
            </div>
          </>
        )}

        {/* Empty state */}
        {!selectedCategory && !selectedItem && (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <ChefHat className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-bold">Select a category or item to start mapping</p>
          </div>
        )}
      </div>
    </div>
  );
}
