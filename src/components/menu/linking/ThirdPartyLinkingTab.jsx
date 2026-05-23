import { useState } from 'react';
import { Share2, Clock, CheckCircle2, ExternalLink, Smartphone } from 'lucide-react';
import { useMenuStore } from '../../../store/useMenuStore';

const mockData = {
  petpooja: {
    live: {
      id: 'PP-LIVE-992',
      name: 'Summer Special Menu v4',
      pushedAt: '2024-05-02 14:30',
      target: 'Own Ordering App',
      status: 'Live'
    }
  },
  billberry: {
    live: {
      id: 'BB-LIVE-001',
      name: 'Core Menu 2024',
      pushedAt: '2024-04-28 09:00',
      target: 'Own Ordering App',
      status: 'Live'
    }
  }
};

export default function ThirdPartyLinkingTab() {
  const [selectedPOS, setSelectedPOS] = useState('petpooja');
  const [showFullMenu, setShowFullMenu] = useState(false);
  const { categories, items } = useMenuStore();

  const currentData = mockData[selectedPOS];

  return (
    <div className="flex flex-col h-full bg-muted/30 overflow-hidden relative">
      
      {/* Header / Switcher */}
      <div className="p-4 border-b border-border bg-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-xl font-black text-foreground">Third Party Menus</h1>
          <p className="text-xs text-muted-foreground font-medium">View the currently active menu pushed from your POS systems.</p>
        </div>

        <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
          <button 
            onClick={() => { setSelectedPOS('petpooja'); setShowFullMenu(false); }}
            className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${selectedPOS === 'petpooja' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Petpooja
          </button>
          <button 
            onClick={() => { setSelectedPOS('billberry'); setShowFullMenu(false); }}
            className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${selectedPOS === 'billberry' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Billberry
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        
        {/* Live Menu Section */}
        <section className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Currently Live
            </h2>
          </div>
          
          <div className="bg-gradient-to-br from-card to-muted/50 border border-primary/20 rounded-2xl p-8 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Smartphone className="w-32 h-32" />
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-foreground">{currentData.live.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full border border-primary/20 uppercase">
                        ID: {currentData.live.id}
                      </span>
                      <span className="text-xs text-muted-foreground font-bold">•</span>
                      <span className="text-xs text-green-600 font-black uppercase tracking-wider">Active</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pushed Timestamp</span>
                    <div className="flex items-center gap-2 text-foreground font-bold">
                      <Clock className="w-4 h-4 text-primary" />
                      {currentData.live.pushedAt}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sync Target</span>
                    <div className="flex items-center gap-2 text-foreground font-bold">
                      <Share2 className="w-4 h-4 text-primary" />
                      {currentData.live.target}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-auto">
                <button 
                  onClick={() => setShowFullMenu(!showFullMenu)}
                  className={`w-full md:w-auto px-8 py-4 rounded-2xl text-base font-black flex items-center justify-center gap-3 transition-all shadow-xl ${showFullMenu ? 'bg-foreground text-background' : 'bg-primary text-primary-foreground shadow-primary/20 hover:opacity-90'}`}
                >
                  <ExternalLink className="w-5 h-5" />
                  {showFullMenu ? 'Hide Menu Details' : 'View Menu Items'}
                </button>
              </div>
            </div>
          </div>

          {/* Full Menu Details Section */}
          {showFullMenu && (
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="p-6 border-b border-border bg-muted/30 flex justify-between items-center">
                <h3 className="font-black text-lg text-foreground">Pushed Menu Content</h3>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                  Snapshot from {currentData.live.pushedAt}
                </div>
              </div>
              <div className="p-6 space-y-8 max-h-[600px] overflow-y-auto">
                {categories.map(cat => (
                  <div key={cat.id} className="space-y-4">
                    <div className="flex items-center gap-3 border-l-4 border-primary pl-4">
                      <h4 className="text-xl font-black text-foreground">{cat.name}</h4>
                      <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {items.filter(i => i.categoryId === cat.id).length} Items
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-5">
                      {items.filter(i => i.categoryId === cat.id).map(item => (
                        <div key={item.id} className="p-3 bg-muted/20 border border-border rounded-xl flex justify-between items-center group hover:border-primary/30 transition-colors">
                          <div className="flex items-center gap-3">
                             <div className={`w-2.5 h-2.5 rounded-sm border-2 ${item.type === 'Veg' ? 'border-green-500 bg-green-100' : 'border-red-500 bg-red-100'} shrink-0`}></div>
                             <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{item.name}</span>
                          </div>
                          <span className="font-black text-sm text-foreground">${item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Integration</div>
                <div className="text-sm font-bold text-foreground capitalize">{selectedPOS} POS</div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Sync Status</div>
                <div className="text-sm font-bold text-foreground">Operational</div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Last Check</div>
                <div className="text-sm font-bold text-foreground">2 mins ago</div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
