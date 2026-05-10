import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Layers, CheckSquare, Settings2, Link2, DollarSign, Activity } from 'lucide-react';
import { useMenuStore } from '../../../store/useMenuStore';
import { AddonGroupModal, VariantGroupModal, GlobalVariantModal, AddonItemModal, BulkLinkModal } from '../builder/modals/FormModals';

export default function ModifiersTab() {
  const { 
    activeModifierTab, setActiveModifierTab, 
    addonGroups, addonItems, itemAddonLinks, itemVariantLinks,
    addAddonGroup, updateAddonGroup, deleteAddonGroup, addAddonItem, updateAddonItem, deleteAddonItem,
    variantGroups, addVariantGroup, updateVariantGroup, deleteVariantGroup,
    globalVariants, addGlobalVariant, updateGlobalVariant, deleteGlobalVariant,
    bulkLinkModifier
  } = useMenuStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [modal, setModal] = useState(null); // null | { mode: 'add' | 'edit', group } | { mode: 'add-item', groupId } | { mode: 'edit-item', item, groupId }

  const filteredAddons = addonGroups.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVariantGroups = variantGroups.filter(g =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to calculate usage count
  const getUsageCount = (groupId, type) => {
    const links = type === 'addon' ? itemAddonLinks : itemVariantLinks;
    return Object.values(links).filter(link => link.linked && link.linked.includes(groupId)).length;
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative">
      {/* Sub Tab Navigation */}
      <div className="p-4 border-b border-border bg-card flex justify-between items-center shrink-0">
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveModifierTab('addons')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${activeModifierTab === 'addons' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
          >
            <CheckSquare className="w-4 h-4" /> Add-on Groups
          </button>
          <button 
            onClick={() => setActiveModifierTab('variants')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${activeModifierTab === 'variants' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted'}`}
          >
            <Layers className="w-4 h-4" /> Global Variants
          </button>
        </div>
        
        <button 
          onClick={() => setModal({ mode: 'add' })}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> {activeModifierTab === 'addons' ? 'Create Add-on Group' : 'Create Variant Group'}
        </button>
      </div>

      <div className="p-4 border-b border-border bg-muted/10 shrink-0">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder={`Search ${activeModifierTab}...`} 
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background outline-none focus:border-primary text-sm font-medium"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 bg-background">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {activeModifierTab === 'addons' && filteredAddons.map(group => {
            const optionsCount = addonItems.filter(ai => ai.groupId === group.id).length;
            const usageCount = getUsageCount(group.id, 'addon');
            const isSingle = group.max === 1;
            const isRequired = group.min > 0;
            
            return (
              <div key={group.id} className="bg-card border border-border rounded-xl shadow-sm hover:border-primary/30 transition-all flex flex-col">
                <div className="p-4 border-b border-border flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{group.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded uppercase tracking-wider">
                        {isSingle ? 'Single Selection' : 'Multiple Selection'}
                      </span>
                      {isRequired && (
                        <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded uppercase tracking-wider border border-red-100">
                          Required
                        </span>
                      )}
                    </div>
                  </div>
                  <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                    <Settings2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="p-4 flex-1 space-y-3">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-muted-foreground flex items-center gap-1.5"><Layers className="w-4 h-4"/> Options</span>
                    <span className="text-foreground">{optionsCount} Options</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-muted-foreground flex items-center gap-1.5"><DollarSign className="w-4 h-4"/> Selection</span>
                    <span className="text-primary bg-primary/10 px-2 py-0.5 rounded font-bold">Min {group.min} / Max {group.max}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-muted-foreground flex items-center gap-1.5"><Activity className="w-4 h-4"/> Reusability Score</span>
                    <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <Link2 className="w-3 h-3" /> Used in {usageCount} items
                    </span>
                  </div>

                  {/* List of Addon Items */}
                  <div className="mt-4 border border-border rounded-lg overflow-hidden">
                    {addonItems.filter(ai => ai.groupId === group.id).map(addon => (
                      <div key={addon.id} className="flex justify-between items-center px-3 py-2 border-b border-border bg-background last:border-0">
                        <span className="text-sm font-medium text-foreground">{addon.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-muted-foreground">
                            {Number(addon.price) > 0 ? `+₹${addon.price}` : 'Free'}
                          </span>
                          <div className="flex gap-1 ml-2">
                            <button onClick={() => setModal({ mode: 'edit-addon-item', item: addon, groupId: group.id })} className="p-1 hover:text-primary text-muted-foreground">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => deleteAddonItem(addon.id)} className="p-1 hover:text-red-500 text-muted-foreground">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button 
                      onClick={() => setModal({ mode: 'add-addon-item', groupId: group.id })}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-primary hover:bg-primary/10 transition-colors bg-muted/20"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Add-on Option
                    </button>
                  </div>
                </div>

                <div className="p-4 border-t border-border bg-muted/10 flex justify-between gap-2">
                  <button 
                    onClick={() => setModal({ mode: 'link', group, type: 'addon' })}
                    className="flex-1 py-2 text-xs font-bold bg-background border border-border text-foreground hover:bg-muted rounded-md transition-colors shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Link2 className="w-3.5 h-3.5" /> Link to Menu
                  </button>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setModal({ mode: 'edit', group })}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors border border-border bg-background shadow-sm"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteAddonGroup(group.id)}
                      className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-md transition-colors border border-border bg-background shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {activeModifierTab === 'variants' && filteredVariantGroups.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
              <Settings2 className="w-12 h-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-black text-foreground mb-1">Global Variants Engine</h3>
              <p className="text-muted-foreground max-w-sm font-medium">Create conditional variants (e.g. Size: Small, Medium, Large) with smart overrides based on the selected item type.</p>
              <button 
                onClick={() => setModal({ mode: 'add' })}
                className="mt-4 px-6 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
              >
                Initialize Variant Group
              </button>
            </div>
          )}

          {activeModifierTab === 'variants' && filteredVariantGroups.map(group => (
            <div key={group.id} className="bg-card border border-border rounded-xl shadow-sm hover:border-primary/30 transition-all flex flex-col">
              <div className="p-4 border-b border-border flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-foreground">{group.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded uppercase tracking-wider">
                      Variant Group
                    </span>
                  </div>
                </div>
                <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
                  <Settings2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-4 flex-1 space-y-3">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-muted-foreground flex items-center gap-1.5"><Layers className="w-4 h-4"/> Options</span>
                  <span className="text-foreground">{globalVariants.filter(v => v.groupId === group.id).length} Options</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-muted-foreground flex items-center gap-1.5"><Activity className="w-4 h-4"/> Reusability Score</span>
                  <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded flex items-center gap-1">
                    <Link2 className="w-3 h-3" /> Used in {getUsageCount(group.id, 'variant')} items
                  </span>
                </div>
                
                {/* List of Variant Items */}
                <div className="mt-4 border border-border rounded-lg overflow-hidden">
                  {globalVariants.filter(v => v.groupId === group.id).map(variant => (
                    <div key={variant.id} className="flex justify-between items-center px-3 py-2 border-b border-border bg-background last:border-0">
                      <span className="text-sm font-medium text-foreground">{variant.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground">
                          {Number(variant.priceDiff) >= 0 ? '+' : ''}₹{variant.priceDiff}
                        </span>
                        <div className="flex gap-1 ml-2">
                          <button onClick={() => setModal({ mode: 'edit-item', item: variant, groupId: group.id })} className="p-1 hover:text-primary text-muted-foreground">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => deleteGlobalVariant(variant.id)} className="p-1 hover:text-red-500 text-muted-foreground">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => setModal({ mode: 'add-item', groupId: group.id })}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-primary hover:bg-primary/10 transition-colors bg-muted/20"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Variant Option
                  </button>
                </div>

              </div>

              <div className="p-4 border-t border-border bg-muted/10 flex justify-between gap-2">
                <button 
                  onClick={() => setModal({ mode: 'link', group, type: 'variant' })}
                  className="flex-1 py-2 text-xs font-bold bg-background border border-border text-foreground hover:bg-muted rounded-md transition-colors shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Link2 className="w-3.5 h-3.5" /> Link to Menu
                </button>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setModal({ mode: 'edit', group })}
                    className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors border border-border bg-background shadow-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => deleteVariantGroup(group.id)}
                    className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-md transition-colors border border-border bg-background shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>

      {modal?.mode === 'add' && activeModifierTab === 'addons' && (
        <AddonGroupModal 
          onSave={(data) => addAddonGroup(data)} 
          onClose={() => setModal(null)} 
        />
      )}
      {modal?.mode === 'edit' && activeModifierTab === 'addons' && (
        <AddonGroupModal 
          initial={modal.group} 
          onSave={(data) => updateAddonGroup(modal.group.id, data)} 
          onClose={() => setModal(null)} 
        />
      )}

      {modal?.mode === 'add-addon-item' && activeModifierTab === 'addons' && (
        <AddonItemModal 
          groupId={modal.groupId} 
          onSave={(data) => addAddonItem(data)} 
          onClose={() => setModal(null)} 
        />
      )}
      {modal?.mode === 'edit-addon-item' && activeModifierTab === 'addons' && (
        <AddonItemModal 
          initial={modal.item} 
          groupId={modal.groupId} 
          onSave={(data) => updateAddonItem(modal.item.id, data)} 
          onClose={() => setModal(null)} 
        />
      )}

      {modal?.mode === 'add' && activeModifierTab === 'variants' && (
        <VariantGroupModal 
          onSave={(data) => addVariantGroup(data)} 
          onClose={() => setModal(null)} 
        />
      )}
      {modal?.mode === 'edit' && activeModifierTab === 'variants' && (
        <VariantGroupModal 
          initial={modal.group} 
          onSave={(data) => updateVariantGroup(modal.group.id, data)} 
          onClose={() => setModal(null)} 
        />
      )}

      {modal?.mode === 'link' && (
        <BulkLinkModal 
          group={modal.group}
          type={modal.type}
          onSave={(mode, selectionIds) => bulkLinkModifier(modal.group.id, modal.type, mode, selectionIds)}
          onClose={() => setModal(null)}
        />
      )}

      {modal?.mode === 'add-item' && activeModifierTab === 'variants' && (
        <GlobalVariantModal 
          groupId={modal.groupId} 
          onSave={(data) => addGlobalVariant(data)} 
          onClose={() => setModal(null)} 
        />
      )}
      {modal?.mode === 'edit-item' && activeModifierTab === 'variants' && (
        <GlobalVariantModal 
          initial={modal.item} 
          groupId={modal.groupId} 
          onSave={(data) => updateGlobalVariant(modal.item.id, data)} 
          onClose={() => setModal(null)} 
        />
      )}
    </div>
  );
}
