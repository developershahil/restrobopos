import { useState } from 'react';
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Tag } from 'lucide-react';
import { useMenuStore } from '@modules/menu/store/useMenuStore';
import { OfferModal } from '../builder/modals/FormModals';

export default function OffersTab() {
  const { offers, items, addOffer, updateOffer, deleteOffer, toggleOffer } = useMenuStore();
  const [modal, setModal] = useState(null);

  const getItemNames = (ids) => {
    if (!ids || ids.length === 0) return 'All Items';
    const names = ids.map(id => items.find(i => i.id === id)?.name).filter(Boolean);
    if (names.length <= 2) return names.join(', ');
    return `${names.slice(0, 2).join(', ')} +${names.length - 2} more`;
  };

  return (
    <div className="p-4 max-w-2xl">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-bold text-foreground">Offers & Discounts</p>
          <p className="text-xs text-muted-foreground">Item-level pricing rules and promotional discounts</p>
        </div>
        <button
          onClick={() => setModal({ mode: 'add' })}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-semibold hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add Offer
        </button>
      </div>

      {offers.length === 0 ? (
        <div className="border border-dashed border-border rounded-md py-10 text-center text-sm text-muted-foreground">
          No offers yet. Click "Add Offer" to create one.
        </div>
      ) : (
        <div className="space-y-2">
          {offers.map(offer => (
            <div key={offer.id} className={`border border-border rounded-md p-3 flex items-center gap-3 transition-colors ${offer.active ? 'bg-card' : 'bg-muted/30 opacity-60'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${offer.active ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                <Tag className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-foreground truncate">{offer.name}</p>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${offer.type === 'Percentage' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                    {offer.type === 'Percentage' ? `${offer.value}% off` : `₹${offer.value} off`}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{getItemNames(offer.itemIds)}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => toggleOffer(offer.id)}
                  title={offer.active ? 'Disable' : 'Enable'}
                  className={`p-1 rounded transition-colors ${offer.active ? 'text-green-600 hover:bg-red-50 hover:text-red-500' : 'text-muted-foreground hover:bg-green-50 hover:text-green-600'}`}
                >
                  {offer.active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                </button>
                <button onClick={() => setModal({ mode: 'edit', offer })} className="p-1 rounded hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => deleteOffer(offer.id)} className="p-1 rounded hover:bg-red-50 hover:text-red-500 text-muted-foreground transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal?.mode === 'add' && (
        <OfferModal items={items} onSave={(d) => addOffer(d)} onClose={() => setModal(null)} />
      )}
      {modal?.mode === 'edit' && (
        <OfferModal initial={modal.offer} items={items} onSave={(d) => updateOffer(modal.offer.id, d)} onClose={() => setModal(null)} />
      )}
    </div>
  );
}
