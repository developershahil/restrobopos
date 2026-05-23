import { useState } from 'react';
import { X, Smartphone, Monitor } from 'lucide-react';
import { useMenuStore } from '@modules/menu/store/useMenuStore';

export default function LivePreviewDrawer({ onClose }) {
  const { items, categories } = useMenuStore();
  const [channel, setChannel] = useState('Swiggy');

  const getPrice = (item) => {
    let p = parseFloat(item.price);
    if (channel === 'Swiggy' && item.swiggyMarkup) p += (p * parseFloat(item.swiggyMarkup)) / 100;
    if (channel === 'Zomato' && item.zomatoMarkup) p += (p * parseFloat(item.zomatoMarkup)) / 100;
    return p.toFixed(2);
  };

  const getFilteredItems = (catId) => {
    return items.filter(i => {
      if (i.categoryId !== catId) return false;
      if (!i.inStock) return false;
      if (!i.channels.includes(channel)) return false;
      return true;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="bg-background w-full max-w-md h-full shadow-2xl flex flex-col border-l border-border animate-in slide-in-from-right-full duration-300">
        
        {/* Header */}
        <div className="px-3 py-2 border-b border-border bg-card flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-black flex items-center gap-2">Live Menu Preview</h2>
            <p className="text-xs font-semibold text-muted-foreground mt-0.5">See exactly what your customers see.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Channel Switcher */}
        <div className="p-4 bg-muted/30 border-b border-border shrink-0">
          <div className="flex bg-muted p-1 rounded-lg border border-border/50">
            {['Swiggy', 'Zomato', 'POS', 'Mobile App'].map(c => (
              <button
                key={c}
                onClick={() => setChannel(c)}
                className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-md transition-all ${
                  channel === c ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {c === 'POS' ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                <span className="text-[10px] font-black uppercase tracking-wider">{c}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Preview Area (Simulated Mobile Screen) */}
        <div className="flex-1 overflow-y-auto bg-muted/10 p-4">
          <div className="bg-background border border-border shadow-xl rounded-[2rem] mx-auto w-full max-w-[340px] h-[650px] overflow-hidden flex flex-col relative">
            
            {/* Phone Notch */}
            <div className="absolute top-0 inset-x-0 h-6 bg-background flex justify-center z-20 rounded-t-[2rem]">
               <div className="w-24 h-5 bg-black rounded-b-xl"></div>
            </div>

            {/* App Header */}
            <div className={`pt-10 pb-4 px-4 shadow-sm z-10 ${
              channel === 'Swiggy' ? 'bg-orange-500 text-white' : 
              channel === 'Zomato' ? 'bg-red-600 text-white' : 
              channel === 'Mobile App' ? 'bg-indigo-600 text-white' : 'bg-card border-b border-border'
            }`}>
              <h3 className="font-black text-lg">Your Restaurant</h3>
              <p className="text-xs opacity-90">{channel} Delivery</p>
            </div>

            {/* Menu Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {categories.filter(c => c.active).map(cat => {
                const catItems = getFilteredItems(cat.id);
                if (catItems.length === 0) return null;

                return (
                  <div key={cat.id} className="space-y-3">
                    <h4 className="text-base font-black border-b border-border/50 pb-2">{cat.name} ({catItems.length})</h4>
                    <div className="space-y-4">
                      {catItems.map(item => (
                        <div key={item.id} className="flex gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className={`w-2.5 h-2.5 rounded-sm border-2 shrink-0 ${item.type === 'Veg' ? 'border-green-500 bg-green-100' : 'border-red-500 bg-red-100'}`} />
                              <p className="text-sm font-bold text-foreground truncate">{item.name}</p>
                            </div>
                            <p className="text-sm font-black text-foreground mb-1">₹{getPrice(item)}</p>
                            {item.description && <p className="text-[10px] text-muted-foreground line-clamp-2">{item.description}</p>}
                          </div>
                          {item.imageUrl ? (
                            <div className="w-20 h-20 rounded-md overflow-hidden shrink-0 border border-border shadow-sm">
                              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <div className="w-20 h-20 rounded-md bg-muted/50 border border-dashed border-border flex items-center justify-center shrink-0">
                              <span className="text-[10px] text-muted-foreground font-semibold">No Image</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
              {categories.filter(c => c.active && getFilteredItems(c.id).length > 0).length === 0 && (
                <div className="text-center py-20 text-muted-foreground text-sm font-semibold">
                  No items available for {channel}.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
