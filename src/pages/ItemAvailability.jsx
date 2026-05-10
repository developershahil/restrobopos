import { useState } from 'react';
import { ToggleLeft, Search, CheckCircle2, XCircle, ChevronDown, Store, PackageX } from 'lucide-react';
import { useMenuStore } from '../store/useMenuStore';

const mockOutlets = [
  { id: 's1', name: 'Koramangala Branch' },
  { id: 's2', name: 'Indiranagar Branch' },
  { id: 's3', name: 'Whitefield Branch' },
];

export default function ItemAvailability() {
  const [selectedOutlet, setSelectedOutlet] = useState(mockOutlets[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('c1'); // categoryId or 'addons'

  const { 
    categories, 
    items, 
    addonGroups,
    addonItems,
    toggleItemStock,
    toggleAddonStock,
    bulkToggleCategory,
    bulkToggleAddonGroup
  } = useMenuStore();

  // Filter items based on selected category and search term
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeTab === 'all' ? true : item.categoryId === activeTab;
    return matchesSearch && matchesCategory;
  });

  // Filter add-ons based on search term
  const filteredAddons = addonItems.filter(addon => 
    addon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBulkItemToggle = (active) => {
    if (activeTab !== 'addons' && activeTab !== 'all') {
      bulkToggleCategory(activeTab, active);
    }
  };

  const handleBulkAddonToggle = (groupId, active) => {
    bulkToggleAddonGroup(groupId, active);
  };

  const currentCategory = categories.find(c => c.id === activeTab);

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border bg-card shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10 shadow-sm relative">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <ToggleLeft className="w-6 h-6 text-primary" /> Item Availability
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Manage stock status for items and add-ons across your outlets.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Outlet Selector */}
          <div className="relative group cursor-pointer">
            <div className="flex items-center gap-2 bg-muted/30 border border-border px-4 py-2 rounded-lg hover:bg-muted/50 transition-colors">
              <Store className="w-4 h-4 text-muted-foreground" />
              <select 
                value={selectedOutlet}
                onChange={(e) => setSelectedOutlet(e.target.value)}
                className="bg-transparent text-sm font-bold outline-none appearance-none cursor-pointer pr-4"
              >
                {mockOutlets.map(outlet => (
                  <option key={outlet.id} value={outlet.id}>{outlet.name}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 pointer-events-none" />
            </div>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search items..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-primary shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Sidebar - Categories */}
        <div className="w-64 border-r border-border bg-card/50 flex flex-col overflow-y-auto shrink-0">
          <div className="p-4">
            <p className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-3">Menu Categories</p>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-between ${activeTab === 'all' ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-muted text-foreground'}`}
              >
                All Items
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-between ${activeTab === category.id ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-muted text-foreground'}`}
                >
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }}></div>
                    {category.name}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-6">
              <p className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-3">Global Modifiers</p>
              <button
                onClick={() => setActiveTab('addons')}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-between ${activeTab === 'addons' ? 'bg-primary text-primary-foreground shadow-md' : 'hover:bg-muted text-foreground'}`}
              >
                <span className="flex items-center gap-2">
                  <PackageX className="w-4 h-4" /> Add-ons
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Content - Items/Addons List */}
        <div className="flex-1 overflow-y-auto bg-muted/10 p-6">
          
          <div className="max-w-4xl mx-auto">
            {/* Header / Bulk Actions */}
            <div className="flex items-center justify-between mb-6 bg-card border border-border rounded-xl p-4 shadow-sm">
              <div>
                <h2 className="text-lg font-black text-foreground">
                  {activeTab === 'addons' ? 'Manage Add-ons' : activeTab === 'all' ? 'All Items' : currentCategory?.name}
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">Toggle availability to immediately update all ordering channels.</p>
              </div>

              {activeTab !== 'addons' && activeTab !== 'all' && (
                <div className="flex items-center gap-2">
                  <button onClick={() => handleBulkItemToggle(true)} className="px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 rounded-lg text-xs font-bold transition-colors">
                    Mark All Active
                  </button>
                  <button onClick={() => handleBulkItemToggle(false)} className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-lg text-xs font-bold transition-colors">
                    Mark All Out of Stock
                  </button>
                </div>
              )}
            </div>

            {/* List */}
            {activeTab === 'addons' ? (
              // Add-ons List grouped by Addon Group
              <div className="space-y-6">
                {addonGroups.map(group => {
                  const groupAddons = filteredAddons.filter(a => a.groupId === group.id);
                  if (groupAddons.length === 0) return null;

                  return (
                    <div key={group.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                      <div className="bg-muted/30 px-5 py-3 border-b border-border flex justify-between items-center">
                        <h3 className="font-bold text-foreground">{group.name}</h3>
                        <div className="flex gap-2">
                          <button onClick={() => handleBulkAddonToggle(group.id, true)} className="text-[10px] uppercase tracking-wider font-bold text-green-600 hover:underline">All Active</button>
                          <span className="text-muted-foreground">|</span>
                          <button onClick={() => handleBulkAddonToggle(group.id, false)} className="text-[10px] uppercase tracking-wider font-bold text-red-600 hover:underline">All Out</button>
                        </div>
                      </div>
                      <div className="divide-y divide-border">
                        {groupAddons.map(addon => (
                          <div key={addon.id} className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors">
                            <div>
                              <p className="font-bold text-sm text-foreground">{addon.name}</p>
                              <p className="text-xs text-muted-foreground font-medium mt-0.5">${addon.price}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              {addon.inStock ? 
                                <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-100"><CheckCircle2 className="w-3.5 h-3.5" /> Active</span> : 
                                <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-100"><XCircle className="w-3.5 h-3.5" /> Out of Stock</span>
                              }
                              <button 
                                onClick={() => toggleAddonStock(addon.id)}
                                className={`w-12 h-6 rounded-full transition-colors relative flex items-center shadow-inner ${addon.inStock ? 'bg-green-500' : 'bg-muted-foreground/30'}`}
                              >
                                <div className={`w-4 h-4 bg-white rounded-full absolute transition-all shadow-md ${addon.inStock ? 'left-7' : 'left-1'}`} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {filteredAddons.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-xl">
                    No add-ons found matching "{searchTerm}"
                  </div>
                )}
              </div>
            ) : (
              // Items List
              <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden divide-y divide-border">
                {filteredItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-sm border-2 flex items-center justify-center shrink-0 ${item.type === 'Veg' ? 'border-green-600' : 'border-red-600'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${item.type === 'Veg' ? 'bg-green-600' : 'bg-red-600'}`} />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5">
                          {categories.find(c => c.id === item.categoryId)?.name} • ${item.price}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {item.inStock ? 
                        <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-100"><CheckCircle2 className="w-3.5 h-3.5" /> Active</span> : 
                        <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md border border-red-100"><XCircle className="w-3.5 h-3.5" /> Out of Stock</span>
                      }
                      
                      <button 
                        onClick={() => toggleItemStock(item.id)}
                        className={`w-12 h-6 rounded-full transition-colors relative flex items-center shadow-inner ${item.inStock ? 'bg-green-500' : 'bg-muted-foreground/30'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full absolute transition-all shadow-md ${item.inStock ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                ))}
                {filteredItems.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground">
                    No items found matching your criteria.
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
