import { useState, useMemo } from 'react';
import { X, Search, ChevronRight, ChevronDown, Check, Minus, MapPin } from 'lucide-react';

const MOCK_OUTLETS = [
  { id: 1, name: 'Koramangala Branch' },
  { id: 2, name: 'Indiranagar Branch' },
  { id: 3, name: 'Whitefield Branch' },
  { id: 4, name: 'HSR Layout Branch' },
  { id: 5, name: 'JP Nagar Branch' },
];

// Full hierarchy: Category → Subcategory → Item (with variants & addons)
const OUTLET_MENU = {
  1: [
    { id: 'c1', name: 'Pizzas', type: 'category', subcategories: [
      { id: 'sc1', name: 'Veg Pizzas', type: 'subcategory', items: [
        { id: 'i1', name: 'Margherita', price: 199, variants: [
          { id: 'v1', name: 'Regular - 7"', price: 199 },
          { id: 'v2', name: 'Medium - 10"', price: 349 },
          { id: 'v3', name: 'Large - 12"', price: 499 },
        ], addons: [
          { id: 'a1', name: 'Extra Cheese', price: 49 },
          { id: 'a2', name: 'Jalapenos', price: 29 },
        ]},
        { id: 'i2', name: 'Farmhouse', price: 299, variants: [
          { id: 'v4', name: 'Regular', price: 299 },
          { id: 'v5', name: 'Medium', price: 449 },
        ], addons: [] },
        { id: 'i3', name: 'Paneer Tikka', price: 349, variants: [], addons: [
          { id: 'a3', name: 'Extra Paneer', price: 59 },
        ]},
        { id: 'i4', name: 'Veggie Paradise', price: 279, variants: [], addons: [] },
      ]},
      { id: 'sc2', name: 'Non Veg Pizzas', type: 'subcategory', items: [
        { id: 'i5', name: 'Chicken Tikka', price: 399, variants: [
          { id: 'v6', name: 'Regular', price: 399 },
          { id: 'v7', name: 'Medium', price: 549 },
          { id: 'v8', name: 'Large', price: 699 },
        ], addons: [
          { id: 'a4', name: 'Extra Chicken', price: 79 },
        ]},
        { id: 'i6', name: 'Pepperoni', price: 449, variants: [], addons: [] },
        { id: 'i7', name: 'BBQ Chicken', price: 429, variants: [], addons: [] },
      ]},
      { id: 'sc3', name: 'Cheese Burst', type: 'subcategory', items: [
        { id: 'i8', name: 'CB Margherita', price: 349, variants: [], addons: [] },
        { id: 'i9', name: 'CB Farmhouse', price: 449, variants: [], addons: [] },
      ]},
    ]},
    { id: 'c2', name: 'Sides', type: 'category', subcategories: [
      { id: 'sc4', name: 'Garlic Bread', type: 'subcategory', items: [
        { id: 'i10', name: 'Plain Garlic Bread', price: 99, variants: [], addons: [] },
        { id: 'i11', name: 'Cheese Garlic Bread', price: 149, variants: [], addons: [
          { id: 'a5', name: 'Extra Dip', price: 19 },
        ]},
        { id: 'i12', name: 'Stuffed Garlic Bread', price: 179, variants: [], addons: [] },
      ]},
      { id: 'sc5', name: 'Snacks', type: 'subcategory', items: [
        { id: 'i13', name: 'French Fries', price: 99, variants: [
          { id: 'v9', name: 'Regular', price: 99 },
          { id: 'v10', name: 'Large', price: 149 },
        ], addons: [
          { id: 'a6', name: 'Cheese Sauce', price: 29 },
          { id: 'a7', name: 'Peri Peri Seasoning', price: 19 },
        ]},
        { id: 'i14', name: 'Potato Wedges', price: 119, variants: [], addons: [] },
        { id: 'i15', name: 'Chicken Wings (6pc)', price: 249, variants: [], addons: [] },
      ]},
    ]},
    { id: 'c3', name: 'Drinks & Shakes', type: 'category', subcategories: [
      { id: 'sc6', name: 'Beverages', type: 'subcategory', items: [
        { id: 'i16', name: 'Cold Coffee', price: 149, variants: [], addons: [] },
        { id: 'i17', name: 'Pepsi 750ml', price: 60, variants: [], addons: [] },
        { id: 'i18', name: 'Mojito', price: 149, variants: [
          { id: 'v11', name: 'Virgin', price: 149 },
          { id: 'v12', name: 'Classic', price: 199 },
        ], addons: [] },
      ]},
      { id: 'sc7', name: 'Shakes', type: 'subcategory', items: [
        { id: 'i19', name: 'Oreo Shake', price: 179, variants: [], addons: [
          { id: 'a8', name: 'Extra Oreo', price: 29 },
        ]},
        { id: 'i20', name: 'Mango Lassi', price: 129, variants: [], addons: [] },
      ]},
    ]},
    { id: 'c4', name: 'Desserts', type: 'category', subcategories: [
      { id: 'sc8', name: 'Cakes & Sweets', type: 'subcategory', items: [
        { id: 'i21', name: 'Choco Lava Cake', price: 99, variants: [], addons: [] },
        { id: 'i22', name: 'Brownie', price: 129, variants: [], addons: [
          { id: 'a9', name: 'Ice Cream Scoop', price: 39 },
        ]},
        { id: 'i23', name: 'Gulab Jamun (2pc)', price: 79, variants: [], addons: [] },
      ]},
    ]},
  ],
  2: [
    { id: 'c1b', name: 'Pizzas', type: 'category', subcategories: [
      { id: 'sc1b', name: 'Veg Pizzas', type: 'subcategory', items: [
        { id: 'i1b', name: 'Margherita', price: 199, variants: [
          { id: 'v1b', name: 'Regular', price: 199 },
          { id: 'v2b', name: 'Medium', price: 349 },
        ], addons: [] },
        { id: 'i2b', name: 'Corn & Cheese', price: 249, variants: [], addons: [] },
      ]},
      { id: 'sc2b', name: 'Non Veg Pizzas', type: 'subcategory', items: [
        { id: 'i3b', name: 'Chicken Supreme', price: 399, variants: [], addons: [] },
      ]},
    ]},
    { id: 'c2b', name: 'Sides', type: 'category', subcategories: [
      { id: 'sc3b', name: 'Garlic Bread', type: 'subcategory', items: [
        { id: 'i4b', name: 'Classic Garlic Bread', price: 99, variants: [], addons: [] },
      ]},
    ]},
    { id: 'c3b', name: 'Desserts', type: 'category', subcategories: [
      { id: 'sc4b', name: 'Cakes', type: 'subcategory', items: [
        { id: 'i5b', name: 'Choco Lava Cake', price: 99, variants: [], addons: [] },
        { id: 'i6b', name: 'Ice Cream Sundae', price: 149, variants: [], addons: [] },
      ]},
    ]},
  ],
};

// Clone outlet 1 data for outlets 3-5
for (let oid = 3; oid <= 5; oid++) {
  if (!OUTLET_MENU[oid]) OUTLET_MENU[oid] = JSON.parse(JSON.stringify(OUTLET_MENU[1]));
}

// Badge component
function Badge({ label, color = 'muted' }) {
  const colors = {
    muted: 'bg-muted text-muted-foreground',
    blue: 'bg-primary/10 text-primary',
    green: 'bg-emerald-500/10 text-emerald-600',
    orange: 'bg-amber-500/10 text-amber-600',
    purple: 'bg-purple-500/10 text-purple-600',
  };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${colors[color]}`}>
      {label}
    </span>
  );
}

// Checkbox component
function Checkbox({ checked, partial, onClick, size = 'md' }) {
  const sz = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const iconSz = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';
  return (
    <button
      onClick={onClick}
      className={`${sz} rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
        checked ? 'bg-primary border-primary' : partial ? 'bg-primary/50 border-primary' : 'border-border hover:border-primary/50'
      }`}
    >
      {checked && <Check className={`${iconSz} text-primary-foreground`} />}
      {partial && !checked && <Minus className={`${iconSz} text-primary-foreground`} />}
    </button>
  );
}

export default function SelectCategoriesModal({ open, onClose, onDone, selectedCategories = [], mode = 'categories' }) {
  const [selectedOutlets, setSelectedOutlets] = useState([1]);
  const [activeOutletId, setActiveOutletId] = useState(1);
  const [outletDropdownOpen, setOutletDropdownOpen] = useState(false);
  const [outletSearch, setOutletSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expanded, setExpanded] = useState({});
  const [checked, setChecked] = useState(new Set(selectedCategories));
  const isItemMode = mode === 'items';
  const title = isItemMode ? 'Select Items' : 'Select Categories';

  const toggle = (key) => setExpanded(p => ({ ...p, [key]: !p[key] }));

  const isChecked = (key) => checked.has(key);

  const toggleCheck = (key, parentKeys = []) => {
    setChecked(prev => {
      const n = new Set(prev);
      if (n.has(key)) {
        n.delete(key);
      } else {
        n.add(key);
        parentKeys.forEach(pk => n.add(pk));
      }
      return n;
    });
  };

  // Collect all descendant keys for a node
  const getAllKeys = (node, outletId) => {
    const keys = [];
    if (node.subcategories) {
      node.subcategories.forEach(sc => {
        if (!isItemMode) {
          keys.push(`sc-${outletId}-${sc.id}`);
        } else {
          sc.items?.forEach(it => {
            keys.push(`item-${outletId}-${it.id}`);
            it.variants?.forEach(v => keys.push(`var-${outletId}-${v.id}`));
            it.addons?.forEach(a => keys.push(`addon-${outletId}-${a.id}`));
          });
        }
      });
    }
    if (node.items && isItemMode) {
      node.items.forEach(it => {
        keys.push(`item-${outletId}-${it.id}`);
        it.variants?.forEach(v => keys.push(`var-${outletId}-${v.id}`));
        it.addons?.forEach(a => keys.push(`addon-${outletId}-${a.id}`));
      });
    }
    
    // If no children were found, return the node's own key so it can be selected
    if (keys.length === 0) {
      if (node.type === 'category') keys.push(`cat-${outletId}-${node.id}`);
      if (node.type === 'subcategory') keys.push(`sc-${outletId}-${node.id}`);
    }
    
    return keys;
  };

  const toggleBulk = (keys, parentKeys = []) => {
    setChecked(prev => {
      const n = new Set(prev);
      const allIn = keys.every(k => n.has(k));
      keys.forEach(k => allIn ? n.delete(k) : n.add(k));
      if (!allIn) parentKeys.forEach(pk => n.add(pk));
      return n;
    });
  };

  const bulkStatus = (keys) => {
    const c = keys.filter(k => checked.has(k)).length;
    if (c === 0) return 'none';
    if (c === keys.length) return 'all';
    return 'partial';
  };

  // Search helper
  const matchSearch = (text) => !searchQuery || text.toLowerCase().includes(searchQuery.toLowerCase());

  // Build filtered menu per active outlet
  const menuTree = [activeOutletId].filter(Boolean).flatMap(outletId => {
    const outlet = MOCK_OUTLETS.find(o => o.id === outletId);
    const cats = OUTLET_MENU[outletId] || [];
    return cats.map(cat => ({ ...cat, outletId, outletName: outlet?.name || '' }));
  }).filter(cat => {
    if (!searchQuery) return true;
    if (matchSearch(cat.name)) return true;
    return cat.subcategories?.some(sc =>
      matchSearch(sc.name) || sc.items?.some(it =>
        matchSearch(it.name) || it.variants?.some(v => matchSearch(v.name)) || it.addons?.some(a => matchSearch(a.name))
      )
    );
  });

  // Removed global availableVariantTypes to use localized ones instead.

  const totalSelected = checked.size;

  const toggleOutlet = (id) => {
    setSelectedOutlets(p => {
      if (p.includes(id)) {
        const next = p.filter(x => x !== id);
        if (activeOutletId === id) setActiveOutletId(next[0] || null);
        return next;
      } else {
        if (p.length === 0) setActiveOutletId(id);
        return [...p, id];
      }
    });
  };

  const removeOutlet = (id) => {
    setSelectedOutlets(p => {
      const next = p.filter(x => x !== id);
      if (activeOutletId === id) setActiveOutletId(next[0] || null);
      return next;
    });
  };

  const handleDone = () => { onDone(Array.from(checked)); onClose(); };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-[95vw] max-w-6xl h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-foreground">{title}</h3>
            <span className="bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full">{totalSelected} selected</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted text-muted-foreground"><X className="w-5 h-5" /></button>
        </div>

        {/* Outlet Selector */}
        <div className="px-6 py-3 border-b border-border space-y-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">Select Outlets</span>
            <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">{selectedOutlets.length}</span>
          </div>
          {/* Outlet Search and Selection */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              value={outletSearch} onChange={e => { setOutletSearch(e.target.value); setOutletDropdownOpen(true); }}
              onFocus={() => setOutletDropdownOpen(true)}
              placeholder="Search outlets to add..."
              className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
            {outletDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setOutletDropdownOpen(false)} />
                <div className="absolute left-0 right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-xl z-20 py-1 max-h-48 overflow-y-auto">
                  {MOCK_OUTLETS.filter(o => !outletSearch || o.name.toLowerCase().includes(outletSearch.toLowerCase())).map(o => {
                    const sel = selectedOutlets.includes(o.id);
                    return (<button key={o.id} onClick={() => { toggleOutlet(o.id); setOutletSearch(''); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${sel ? 'bg-primary/5 text-primary' : 'text-foreground hover:bg-muted/50'}`}>
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${sel ? 'bg-primary border-primary' : 'border-border'}`}>
                        {sel && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span className="font-medium">{o.name}</span>
                    </button>);
                  })}
                  {MOCK_OUTLETS.filter(o => !outletSearch || o.name.toLowerCase().includes(outletSearch.toLowerCase())).length === 0 && (
                    <div className="px-4 py-3 text-sm text-muted-foreground text-center">No outlets found</div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Selected Outlets Tabs */}
          {selectedOutlets.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1 border-t border-border mt-2">
              {selectedOutlets.map(id => {
                const o = MOCK_OUTLETS.find(x => x.id === id);
                const isActive = activeOutletId === id;
                return (
                  <button 
                    key={id} 
                    onClick={() => setActiveOutletId(id)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                      isActive ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-foreground border-border hover:bg-muted'
                    }`}
                  >
                    {o?.name}
                    <X className="w-3 h-3 opacity-70 hover:opacity-100" onClick={(e) => { e.stopPropagation(); removeOutlet(id); }} />
                  </button>
                );
              })}
            </div>
          )}

          {/* Category Search */}
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder={`Search in ${MOCK_OUTLETS.find(o => o.id === activeOutletId)?.name || 'categories'}...`}
              className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" />
          </div>

        </div>

        {/* Tree */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          {menuTree.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              {selectedOutlets.length === 0 ? 'Select an outlet to view categories' : 'No results found'}
            </div>
          ) : menuTree.map(cat => {
            const catKey = `cat-${cat.outletId}-${cat.id}`;
            const catExpanded = expanded[catKey];
            const catChildKeys = getAllKeys(cat, cat.outletId);
            const catSt = bulkStatus(catChildKeys);

            return (
              <div key={catKey} className="mb-0.5">
                {/* Category */}
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-muted/40 transition-colors group">
                  <button onClick={() => toggle(catKey)} className="p-0.5 text-muted-foreground hover:text-foreground">
                    {catExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                  <Checkbox checked={catSt === 'all'} partial={catSt === 'partial'} onClick={() => toggleBulk(catChildKeys)} />
                  <span className={`text-sm font-semibold flex-1 ${catSt === 'all' ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                    {cat.name} — {cat.outletName}
                  </span>
                  <Badge label="Category" color="blue" />
                </div>

                {/* Localized Quick Select for Category */}
                {catExpanded && isItemMode && (() => {
                  const localTypes = new Set();
                  cat.subcategories?.forEach(sc => {
                    sc.items?.forEach(it => {
                      it.variants?.forEach(v => localTypes.add(v.name.split(' - ')[0].trim()));
                    });
                  });
                  cat.items?.forEach(it => {
                    it.variants?.forEach(v => localTypes.add(v.name.split(' - ')[0].trim()));
                  });
                  const typesArr = Array.from(localTypes);
                  if (typesArr.length === 0) return null;
                  
                  return (
                    <div className="ml-8 pl-2 mb-2 flex items-center gap-2 overflow-x-auto">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Quick Select (Category):</span>
                      {typesArr.map(type => (
                        <button
                          key={type}
                          onClick={() => {
                            const keysToToggle = [];
                            const parentKeys = [];
                            cat.subcategories?.forEach(sc => {
                              sc.items?.forEach(it => {
                                it.variants?.forEach(v => {
                                  if (v.name.includes(type)) {
                                    keysToToggle.push(`var-${cat.outletId}-${v.id}`);
                                    parentKeys.push(`item-${cat.outletId}-${it.id}`);
                                  }
                                });
                              });
                            });
                            cat.items?.forEach(it => {
                              it.variants?.forEach(v => {
                                if (v.name.includes(type)) {
                                  keysToToggle.push(`var-${cat.outletId}-${v.id}`);
                                  parentKeys.push(`item-${cat.outletId}-${it.id}`);
                                }
                              });
                            });
                            toggleBulk(keysToToggle, parentKeys);
                          }}
                          className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 transition-colors whitespace-nowrap"
                        >
                          All {type}
                        </button>
                      ))}
                    </div>
                  );
                })()}

                {/* Subcategories */}
                {catExpanded && cat.subcategories?.map(sc => {
                  const scKey = `sc-${cat.outletId}-${sc.id}`;
                  const scExpanded = expanded[scKey];
                  const scChildKeys = [];
                  if (isItemMode) {
                    sc.items?.forEach(it => {
                      scChildKeys.push(`item-${cat.outletId}-${it.id}`);
                      it.variants?.forEach(v => scChildKeys.push(`var-${cat.outletId}-${v.id}`));
                      it.addons?.forEach(a => scChildKeys.push(`addon-${cat.outletId}-${a.id}`));
                    });
                  }
                  
                  const isScChecked = !isItemMode ? isChecked(scKey) : bulkStatus(scChildKeys) === 'all';
                  const isScPartial = !isItemMode ? false : bulkStatus(scChildKeys) === 'partial';
                  
                  const handleScClick = () => {
                    if (!isItemMode) toggleCheck(scKey);
                    else toggleBulk(scChildKeys);
                  };

                  if (searchQuery && !matchSearch(sc.name) && !sc.items?.some(it => matchSearch(it.name))) return null;

                  return (
                    <div key={scKey} className="ml-8 border-l-2 border-border/40 pl-2">
                      {/* Subcategory row */}
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/30 transition-colors group">
                        <button onClick={() => toggle(scKey)} className="p-0.5 text-muted-foreground hover:text-foreground">
                          {scExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                        <Checkbox checked={isScChecked} partial={isScPartial} onClick={handleScClick} size="sm" />
                        <span className={`text-sm font-medium flex-1 ${isScChecked ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                          {sc.name}
                        </span>
                        <Badge label="Subcategory" color="green" />
                      </div>

                      {/* Localized Quick Select for Subcategory */}
                      {scExpanded && isItemMode && (() => {
                        const localTypes = new Set();
                        sc.items?.forEach(it => {
                          it.variants?.forEach(v => localTypes.add(v.name.split(' - ')[0].trim()));
                        });
                        const typesArr = Array.from(localTypes);
                        if (typesArr.length === 0) return null;
                        
                        return (
                          <div className="ml-6 pl-2 mb-2 mt-1 flex items-center gap-2 overflow-x-auto">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Quick Select (Subcategory):</span>
                            {typesArr.map(type => (
                              <button
                                key={type}
                                onClick={() => {
                                  const keysToToggle = [];
                                  const parentKeys = [];
                                  sc.items?.forEach(it => {
                                    it.variants?.forEach(v => {
                                      if (v.name.includes(type)) {
                                        keysToToggle.push(`var-${cat.outletId}-${v.id}`);
                                        parentKeys.push(`item-${cat.outletId}-${it.id}`);
                                      }
                                    });
                                  });
                                  toggleBulk(keysToToggle, parentKeys);
                                }}
                                className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 transition-colors whitespace-nowrap"
                              >
                                All {type}
                              </button>
                            ))}
                          </div>
                        );
                      })()}

                      {/* Items */}
                      {scExpanded && isItemMode && sc.items?.map(item => {
                        if (searchQuery && !matchSearch(item.name) && !matchSearch(sc.name)) return null;
                        const itemKey = `item-${cat.outletId}-${item.id}`;
                        const itemExpanded = expanded[itemKey];
                        const hasChildren = (item.variants?.length > 0) || (item.addons?.length > 0);

                        return (
                          <div key={itemKey} className="ml-6 border-l-2 border-border/30 pl-2">
                            {/* Item row */}
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted/20 transition-colors">
                              {hasChildren ? (
                                <button onClick={() => toggle(itemKey)} className="p-0.5 text-muted-foreground hover:text-foreground">
                                  {itemExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                </button>
                              ) : <div className="w-5" />}
                              <Checkbox checked={isChecked(itemKey)} onClick={() => toggleCheck(itemKey)} size="sm" />
                              <span className={`text-sm flex-1 ${isChecked(itemKey) ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{item.name}</span>
                              <span className="text-xs text-muted-foreground font-medium">₹{item.price}</span>
                              <Badge label="Item" />
                            </div>

                            {/* Variants & Addons */}
                            {itemExpanded && hasChildren && (
                              <div className="ml-7 border-l-2 border-border/20 pl-2 mb-1">
                                {item.variants?.length > 0 && (
                                  <div className="mb-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-purple-500 px-3 pt-1.5 pb-0.5">Variants</p>
                                    {item.variants.map(v => {
                                      const vKey = `var-${cat.outletId}-${v.id}`;
                                      return (
                                        <div key={vKey} className="flex items-center gap-2 px-3 py-1 rounded hover:bg-muted/10">
                                          <Checkbox checked={isChecked(vKey)} onClick={() => toggleCheck(vKey, [itemKey])} size="sm" />
                                          <span className={`text-xs flex-1 ${isChecked(vKey) ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{v.name}</span>
                                          <span className="text-[11px] text-muted-foreground">₹{v.price}</span>
                                          <Badge label="Variant" color="purple" />
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                                {item.addons?.length > 0 && (
                                  <div className="mb-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500 px-3 pt-1.5 pb-0.5">Addons</p>
                                    {item.addons.map(a => {
                                      const aKey = `addon-${cat.outletId}-${a.id}`;
                                      return (
                                        <div key={aKey} className="flex items-center gap-2 px-3 py-1 rounded hover:bg-muted/10">
                                          <Checkbox checked={isChecked(aKey)} onClick={() => toggleCheck(aKey, [itemKey])} size="sm" />
                                          <span className={`text-xs flex-1 ${isChecked(aKey) ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{a.name}</span>
                                          <span className="text-[11px] text-muted-foreground">+₹{a.price}</span>
                                          <Badge label="Addon" color="orange" />
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border shrink-0">
          <button onClick={onClose} className="flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" /> Close
          </button>
          <button onClick={handleDone} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm">
            Done ({totalSelected})
          </button>
        </div>
      </div>
    </div>
  );
}
