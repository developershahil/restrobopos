import { Smartphone, X, Clock, MapPin } from 'lucide-react';
import { useMenuStore } from '../../../store/useMenuStore';

export default function PreviewDrawer() {
  const { showPreviewDrawer, setShowPreviewDrawer, categories, items } = useMenuStore();

  if (!showPreviewDrawer) return null;

  return (
    <div className="absolute inset-y-0 right-0 w-full sm:w-[450px] bg-background border-l border-border shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
      
      {/* Header */}
      <div className="p-4 border-b border-border bg-card flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-foreground text-background rounded-md">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-lg text-foreground leading-tight">Customer Preview</h3>
            <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Simulator</p>
          </div>
        </div>
        <button 
          onClick={() => setShowPreviewDrawer(false)}
          className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Simulator Controls */}
      <div className="p-4 border-b border-border bg-muted/20 space-y-3 shrink-0">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <select className="w-full pl-9 pr-3 py-2 text-sm font-bold bg-background border border-border rounded-lg outline-none focus:border-primary appearance-none">
              <option>Indiranagar Branch</option>
              <option>Koramangala Branch</option>
              <option>Whitefield Branch</option>
            </select>
          </div>
          <div className="w-32 relative">
            <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="time" defaultValue="19:30" className="w-full pl-9 pr-2 py-2 text-sm font-bold bg-background border border-border rounded-lg outline-none focus:border-primary" />
          </div>
        </div>
        <div className="text-xs text-center font-medium text-muted-foreground bg-background border border-border py-1.5 rounded-md">
          Simulating context: <strong className="text-foreground">Default Menu (P0)</strong>
        </div>
      </div>

      {/* Simulated Device Frame */}
      <div className="flex-1 overflow-hidden p-6 bg-muted/30 flex justify-center">
        <div className="w-[375px] h-full bg-background rounded-[2rem] border-[8px] border-card shadow-xl overflow-hidden flex flex-col relative">
          
          {/* Mock App Header */}
          <div className="p-4 border-b border-border text-center bg-card">
            <h4 className="font-black text-lg text-foreground">Menu</h4>
            <p className="text-xs text-muted-foreground font-medium">Delivering to Indiranagar</p>
          </div>

          {/* Mock App Content */}
          <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-6">
            {categories.filter(c => c.active).map(cat => (
              <div key={cat.id}>
                <h5 className="font-black text-lg text-foreground mb-3">{cat.name}</h5>
                <div className="space-y-4">
                  {items.filter(i => i.categoryId === cat.id && i.status !== 'Out of Stock').map(item => (
                    <div key={item.id} className="flex gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`w-2.5 h-2.5 rounded-sm border-2 ${item.type === 'Veg' ? 'border-green-500 bg-green-100' : 'border-red-500 bg-red-100'} shrink-0`}></span>
                          <p className="font-bold text-sm text-foreground truncate">{item.name}</p>
                        </div>
                        <p className="font-black text-sm text-foreground mb-1">${item.price}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-snug">
                          A delicious and freshly prepared {item.name.toLowerCase()} perfect for your cravings.
                        </p>
                      </div>
                      <div className="w-20 shrink-0 flex flex-col items-center">
                        <div className="w-20 h-20 bg-muted rounded-lg border border-border mb-[-12px]"></div>
                        <button className="bg-primary/10 text-primary font-black text-xs px-4 py-1.5 rounded-md shadow-sm border border-primary/20 bg-white relative z-10">
                          ADD
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
      
    </div>
  );
}
