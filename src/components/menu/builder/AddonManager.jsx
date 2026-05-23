import { useState } from 'react';
import { Plus, Edit2, Trash2, ChevronDown, ChevronRight, Check } from 'lucide-react';
import { useMenuStore } from '../../../store/useMenuStore';
import { AddonGroupModal, AddonItemModal } from './modals/FormModals';

export default function AddonManager({ itemId }) {
  const {
    addonGroups, addAddonGroup, updateAddonGroup, deleteAddonGroup,
    addonItems, addAddonItem, updateAddonItem, deleteAddonItem,
    itemAddonLinks, setItemAddonLinks,
  } = useMenuStore();

  const link = itemAddonLinks[itemId] || { linked: [], applyToCategory: false };
  const [groupModal, setGroupModal] = useState(null);
  const [itemModal, setItemModal] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [showPicker, setShowPicker] = useState(false);

  const toggleLink = (groupId) => {
    const already = link.linked.includes(groupId);
    setItemAddonLinks(itemId, {
      ...link,
      linked: already ? link.linked.filter(g => g !== groupId) : [...link.linked, groupId],
    });
  };

  const linkedGroups = addonGroups.filter(g => link.linked.includes(g.id));

  return (
    <div className="space-y-3">
      {/* Link Groups */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Linked Addon Groups</span>
          <div className="flex gap-1">
            <button
              onClick={() => setShowPicker(!showPicker)}
              className="flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-muted text-foreground rounded-md hover:bg-muted/80 transition-colors"
            >
              Link Groups
            </button>
            <button
              onClick={() => setGroupModal({ mode: 'add' })}
              className="flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
            >
              <Plus className="w-3 h-3" /> New
            </button>
          </div>
        </div>

        {/* Group picker dropdown */}
        {showPicker && (
          <div className="border border-border rounded-lg overflow-hidden mb-2">
            {addonGroups.map(g => (
              <label key={g.id} className="flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-muted/50 border-b border-border/50 last:border-0">
                <div
                  onClick={() => toggleLink(g.id)}
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                    link.linked.includes(g.id) ? 'bg-primary border-primary' : 'border-border'
                  }`}
                >
                  {link.linked.includes(g.id) && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
                <span className="text-xs font-medium text-foreground">{g.name}</span>
                <span className="ml-auto text-[10px] text-muted-foreground">min {g.min} / max {g.max}</span>
              </label>
            ))}
          </div>
        )}

        {/* Apply to category checkbox */}
        <label className="flex items-center gap-2 cursor-pointer mb-2">
          <div
            onClick={() => setItemAddonLinks(itemId, { ...link, applyToCategory: !link.applyToCategory })}
            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${
              link.applyToCategory ? 'bg-primary border-primary' : 'border-border'
            }`}
          >
            {link.applyToCategory && <Check className="w-2.5 h-2.5 text-white" />}
          </div>
          <span className="text-xs text-muted-foreground">Apply to full category</span>
        </label>
      </div>

      {/* Linked groups list */}
      {linkedGroups.length === 0 ? (
        <div className="border border-dashed border-border rounded-xl py-8 flex flex-col items-center justify-center text-center px-4 bg-muted/10">
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-3">
            <Plus className="w-5 h-5" />
          </div>
          <p className="text-sm font-bold text-foreground mb-1">No addons linked</p>
          <p className="text-xs text-muted-foreground max-w-[200px]">Link existing addon groups like "Extra Toppings" or create a new one.</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {linkedGroups.map(group => {
            const groupItems = addonItems.filter(ai => ai.groupId === group.id);
            const isOpen = expanded[group.id];
            return (
              <div key={group.id} className="border border-border rounded-lg overflow-hidden">
                {/* Group header */}
                <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 cursor-pointer" onClick={() => setExpanded(p => ({ ...p, [group.id]: !p[group.id] }))}>
                  {isOpen ? <ChevronDown className="w-3 h-3 text-muted-foreground" /> : <ChevronRight className="w-3 h-3 text-muted-foreground" />}
                  <span className="text-xs font-semibold text-foreground flex-1">{group.name}</span>
                  <span className="text-[10px] text-muted-foreground">min {group.min} / max {group.max}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setGroupModal({ mode: 'edit', group }); }}
                    className="p-0.5 rounded hover:text-primary text-muted-foreground transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteAddonGroup(group.id); }}
                    className="p-0.5 rounded hover:text-red-500 text-muted-foreground transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {/* Addon items */}
                {isOpen && (
                  <div>
                    {groupItems.map(ai => (
                      <div key={ai.id} className="flex items-center gap-2 px-4 py-1.5 border-t border-border/50">
                        <span className="text-xs text-foreground flex-1">{ai.name}</span>
                        <span className="text-xs font-semibold text-foreground">₹{ai.price}</span>
                        <button onClick={() => setItemModal({ mode: 'edit', item: ai, groupId: group.id })} className="p-0.5 text-muted-foreground hover:text-primary transition-colors">
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button onClick={() => deleteAddonItem(ai.id)} className="p-0.5 text-muted-foreground hover:text-red-500 transition-colors">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => setItemModal({ mode: 'add', groupId: group.id })}
                      className="flex items-center gap-1 w-full px-4 py-1.5 text-xs text-primary hover:bg-primary/5 transition-colors border-t border-border/50"
                    >
                      <Plus className="w-3 h-3" /> Add item
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {groupModal?.mode === 'add' && (
        <AddonGroupModal onSave={(d) => addAddonGroup(d)} onClose={() => setGroupModal(null)} />
      )}
      {groupModal?.mode === 'edit' && (
        <AddonGroupModal initial={groupModal.group} onSave={(d) => updateAddonGroup(groupModal.group.id, d)} onClose={() => setGroupModal(null)} />
      )}
      {itemModal?.mode === 'add' && (
        <AddonItemModal groupId={itemModal.groupId} onSave={(d) => addAddonItem(d)} onClose={() => setItemModal(null)} />
      )}
      {itemModal?.mode === 'edit' && (
        <AddonItemModal initial={itemModal.item} groupId={itemModal.groupId} onSave={(d) => updateAddonItem(itemModal.item.id, d)} onClose={() => setItemModal(null)} />
      )}
    </div>
  );
}
