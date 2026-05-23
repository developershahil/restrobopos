import { useState } from 'react';
import { Search, Store, LayoutList, RefreshCw, Layers } from 'lucide-react';
import { useMenuStore } from '@modules/menu/store/useMenuStore';

const mockStores = [
  { id: 's1', name: 'Indiranagar Branch', city: 'Bangalore' },
  { id: 's2', name: 'Koramangala Branch', city: 'Bangalore' },
  { id: 's3', name: 'Whitefield Branch', city: 'Bangalore' },
  { id: 's4', name: 'HSR Layout Branch', city: 'Bangalore' },
  { id: 's5', name: 'Bandra West', city: 'Mumbai' },
  { id: 's6', name: 'Andheri East', city: 'Mumbai' },
];

export default function StoreLinkingTab() {
  const { categories, links, setLinks } = useMenuStore();
  const [viewBy, setViewBy] = useState('store'); // 'store' or 'category'
  const [selectedEntity, setSelectedEntity] = useState('s1');
  const [searchTerm, setSearchTerm] = useState('');

  const handleToggle = (storeId, catId) => {
    setLinks(prev => {
      const storeLinks = prev[storeId] || [];
      const newLinks = storeLinks.includes(catId) 
        ? storeLinks.filter(id => id !== catId)
        : [...storeLinks, catId];
      return { ...prev, [storeId]: newLinks };
    });
  };

  const handleSelectAll = () => {
    if (viewBy === 'store') {
      setLinks(prev => ({ ...prev, [selectedEntity]: categories.map(c => c.id) }));
    } else {
      setLinks(prev => {
        const newLinks = { ...prev };
        mockStores.forEach(s => {
          if (!newLinks[s.id]?.includes(selectedEntity)) {
            newLinks[s.id] = [...(newLinks[s.id] || []), selectedEntity];
          }
        });
        return newLinks;
      });
    }
  };

  const handleClearAll = () => {
    if (viewBy === 'store') {
      setLinks(prev => ({ ...prev, [selectedEntity]: [] }));
    } else {
      setLinks(prev => {
        const newLinks = { ...prev };
        mockStores.forEach(s => {
          if (newLinks[s.id]) {
            newLinks[s.id] = newLinks[s.id].filter(id => id !== selectedEntity);
          }
        });
        return newLinks;
      });
    }
  };

  const handleApplyPreset = (preset) => {
    if (viewBy === 'category') {
      setLinks(prev => {
        const newLinks = { ...prev };
        let targetStores = [];
        
        if (preset === 'all') targetStores = mockStores;
        else if (preset === 'blr') targetStores = mockStores.filter(s => s.city === 'Bangalore');
        else if (preset === 'mum') targetStores = mockStores.filter(s => s.city === 'Mumbai');

        targetStores.forEach(s => {
          if (!newLinks[s.id]?.includes(selectedEntity)) {
            newLinks[s.id] = [...(newLinks[s.id] || []), selectedEntity];
          }
        });
        return newLinks;
      });
    }
  };

  const getFilteredList = () => {
    const list = viewBy === 'store' ? mockStores : categories;
    return list.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  const isLinked = (storeId, catId) => {
    return links[storeId]?.includes(catId) || false;
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Action Bar */}
      <div className="p-4 border-b border-border bg-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
          <button 
            onClick={() => { setViewBy('store'); setSelectedEntity('s1'); setSearchTerm(''); }}
            className={`flex items-center gap-2 px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${viewBy === 'store' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Store className="w-4 h-4" /> View by Store
          </button>
          <button 
            onClick={() => { setViewBy('category'); setSelectedEntity('c1'); setSearchTerm(''); }}
            className={`flex items-center gap-2 px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${viewBy === 'category' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <LayoutList className="w-4 h-4" /> View by Category
          </button>
        </div>

        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm">
          <RefreshCw className="w-4 h-4" /> Save Changes
        </button>
      </div>

      {/* Two Pane Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Pane: Selection List */}
        <div className="w-1/3 max-w-sm border-r border-border bg-card flex flex-col shrink-0">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder={`Search ${viewBy === 'store' ? 'stores' : 'categories'}...`} 
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background outline-none focus:border-primary text-sm font-medium"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {getFilteredList().map(item => {
              let linkedCount;
              let totalCount;
              if (viewBy === 'store') {
                linkedCount = links[item.id]?.length || 0;
                totalCount = categories.length;
              } else {
                linkedCount = mockStores.filter(s => links[s.id]?.includes(item.id)).length;
                totalCount = mockStores.length;
              }

              // Visual indicator logic
              const isFullyLinked = linkedCount === totalCount;
              const isPartiallyLinked = linkedCount > 0 && linkedCount < totalCount;

              return (
                <button 
                  key={item.id}
                  onClick={() => setSelectedEntity(item.id)}
                  className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-colors
                    ${selectedEntity === item.id ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-muted text-foreground font-medium'}`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isFullyLinked ? 'bg-green-500' : isPartiallyLinked ? 'bg-orange-500' : 'bg-muted-foreground/30'}`} title={isFullyLinked ? 'Fully Linked' : isPartiallyLinked ? 'Partially Linked' : 'Not Linked'}></div>
                    <span>{item.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${selectedEntity === item.id ? 'bg-primary/20' : 'bg-muted-foreground/10 text-muted-foreground'}`}>
                    {linkedCount}/{totalCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Matrix Checkboxes */}
        <div className="flex-1 overflow-y-auto bg-background p-4">
          <div className="max-w-3xl mx-auto space-y-6">
            
            <div className="flex justify-between items-end border-b border-border pb-4">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  {viewBy === 'store' ? 'Link Categories to Outlet' : 'Link Stores to Category'}
                </h2>
                <p className="text-sm text-muted-foreground font-medium mt-1">
                  Select which items should be visible.
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {viewBy === 'category' && (
                  <div className="flex gap-2 mb-2">
                    <span className="text-xs font-bold text-muted-foreground flex items-center gap-1 mr-2 uppercase tracking-wider"><Layers className="w-3 h-3"/> Presets:</span>
                    <button onClick={() => handleApplyPreset('all')} className="text-xs font-bold bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary px-2 py-1 rounded transition-colors">All Outlets</button>
                    <button onClick={() => handleApplyPreset('blr')} className="text-xs font-bold bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary px-2 py-1 rounded transition-colors">Bangalore</button>
                    <button onClick={() => handleApplyPreset('mum')} className="text-xs font-bold bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary px-2 py-1 rounded transition-colors">Mumbai</button>
                  </div>
                )}
                <div className="flex gap-2">
                  <button 
                    onClick={handleSelectAll}
                    className="text-sm font-bold text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-md hover:bg-muted transition-colors"
                  >
                    Select All
                  </button>
                  <button 
                    onClick={handleClearAll}
                    className="text-sm font-bold text-muted-foreground hover:text-red-500 px-3 py-1.5 rounded-md hover:bg-red-50 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-md shadow-sm divide-y divide-border">
              {(viewBy === 'store' ? categories : mockStores).map((item) => {
                const checked = viewBy === 'store' ? isLinked(selectedEntity, item.id) : isLinked(item.id, selectedEntity);
                const onChange = () => {
                  if (viewBy === 'store') handleToggle(selectedEntity, item.id);
                  else handleToggle(item.id, selectedEntity);
                };

                return (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={onChange}
                      className="w-3.5 h-3.5 rounded border-border text-primary accent-primary cursor-pointer shrink-0"
                    />
                    <span className="flex-1 text-sm font-medium text-foreground truncate">{item.name}</span>
                    {viewBy === 'category' && (
                      <span className="text-xs text-muted-foreground shrink-0">{item.city}</span>
                    )}
                    {checked && (
                      <span className="text-[10px] uppercase tracking-wider font-bold text-green-600 bg-green-50 border border-green-100 px-1.5 py-0.5 rounded shrink-0">
                        Linked
                      </span>
                    )}
                  </label>
                );
              })}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
