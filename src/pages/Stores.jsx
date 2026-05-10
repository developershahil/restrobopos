import { useState } from 'react';
import { Store, MapPin, Phone, Bike, Package, Utensils, Search, MoreVertical, Clock } from 'lucide-react';

const mockStores = [
  {
    id: 's1',
    name: 'Koramangala Branch',
    address: '1st Block, Koramangala, Bangalore',
    manager: 'Rahul Sharma',
    phone: '+91 98765 43210',
    masterStatus: true,
    channels: { delivery: true, takeaway: true, dineIn: true },
    metrics: { revenue: '$1,240', orders: 145 },
    timing: '10:00 AM - 11:00 PM',
  },
  {
    id: 's2',
    name: 'Indiranagar Branch',
    address: '100ft Road, Indiranagar, Bangalore',
    manager: 'Priya Patel',
    phone: '+91 99887 76655',
    masterStatus: true,
    channels: { delivery: true, takeaway: false, dineIn: true },
    metrics: { revenue: '$850', orders: 92 },
    timing: '11:00 AM - 10:00 PM',
  },
  {
    id: 's3',
    name: 'Whitefield Branch',
    address: 'ITPL Main Road, Whitefield',
    manager: 'Amit Kumar',
    phone: '+91 88776 65544',
    masterStatus: false,
    channels: { delivery: false, takeaway: false, dineIn: false },
    metrics: { revenue: '$0', orders: 0 },
    timing: '10:00 AM - 10:00 PM',
  },
  {
    id: 's4',
    name: 'HSR Layout Branch',
    address: 'Sector 2, HSR Layout, Bangalore',
    manager: 'Neha Singh',
    phone: '+91 77665 54433',
    masterStatus: true,
    channels: { delivery: true, takeaway: true, dineIn: false },
    metrics: { revenue: '$420', orders: 48 },
    timing: '12:00 PM - 12:00 AM',
  }
];

export default function Stores() {
  const [searchTerm, setSearchTerm] = useState('');
  const [stores, setStores] = useState(mockStores);

  const toggleMasterStatus = (storeId) => {
    setStores(stores.map(store => {
      if (store.id === storeId) {
        const newStatus = !store.masterStatus;
        return {
          ...store,
          masterStatus: newStatus,
          // If turning master off, turn off all channels. If turning on, restore them (mocking simple logic here)
          channels: newStatus ? { delivery: true, takeaway: true, dineIn: true } : { delivery: false, takeaway: false, dineIn: false }
        };
      }
      return store;
    }));
  };

  const toggleChannel = (storeId, channel) => {
    setStores(stores.map(store => {
      if (store.id === storeId) {
        return {
          ...store,
          channels: { ...store.channels, [channel]: !store.channels[channel] }
        };
      }
      return store;
    }));
  };

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border bg-card shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2"><Store className="w-6 h-6 text-primary" /> Store Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Control operational status and view details for all your outlets.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search stores..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-primary shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Main Content: Store Grid */}
      <div className="flex-1 overflow-y-auto p-6 bg-muted/10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          
          {filteredStores.map(store => (
            <div key={store.id} className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md">
              
              {/* Card Header (Store Name & Master Toggle) */}
              <div className="p-5 border-b border-border bg-muted/30 flex justify-between items-start">
                <div>
                  <h3 className="font-black text-lg text-foreground flex items-center gap-2">
                    {store.name}
                    {!store.masterStatus && <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-bold">Offline</span>}
                  </h3>
                  <p className="text-xs font-medium text-muted-foreground mt-1 flex items-start gap-1">
                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    {store.address}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Master Power</span>
                    <button 
                      onClick={() => toggleMasterStatus(store.id)}
                      className={`w-12 h-6 rounded-full transition-colors relative flex items-center shadow-inner ${store.masterStatus ? 'bg-green-500' : 'bg-red-500'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full absolute transition-all shadow-md ${store.masterStatus ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                  <button className="p-1 hover:bg-muted rounded-md text-muted-foreground"><MoreVertical className="w-5 h-5" /></button>
                </div>
              </div>

              {/* Card Body (Details & Channels) */}
              <div className="p-5 flex-1 flex flex-col gap-6 opacity-100 transition-opacity" style={{ opacity: store.masterStatus ? 1 : 0.6 }}>
                
                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background border border-border rounded-lg p-3">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Today's Revenue</p>
                    <p className="text-xl font-black mt-0.5">{store.metrics.revenue}</p>
                  </div>
                  <div className="bg-background border border-border rounded-lg p-3">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Orders</p>
                    <p className="text-xl font-black mt-0.5">{store.metrics.orders}</p>
                  </div>
                </div>

                {/* Manager & Contact */}
                <div className="space-y-2 text-sm font-medium">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground flex items-center gap-2"><Clock className="w-4 h-4" /> Timings</span>
                    <span className="font-bold">{store.timing}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground flex items-center gap-2"><Phone className="w-4 h-4" /> Manager</span>
                    <span className="font-bold">{store.manager} • <a href={`tel:${store.phone}`} className="text-primary hover:underline">{store.phone}</a></span>
                  </div>
                </div>

                {/* Channel Controls */}
                <div className="mt-auto">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Order Channels</p>
                  <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-lg border border-border justify-between">
                    
                    {/* Delivery */}
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <Bike className={`w-3.5 h-3.5 ${store.channels.delivery ? 'text-blue-600' : 'text-muted-foreground'}`} /> Delivery
                      </div>
                      <button 
                        disabled={!store.masterStatus}
                        onClick={() => toggleChannel(store.id, 'delivery')}
                        className={`w-9 h-4.5 rounded-full transition-colors relative flex items-center ${store.channels.delivery && store.masterStatus ? 'bg-blue-500' : 'bg-muted-foreground/30'} ${!store.masterStatus && 'cursor-not-allowed'}`}
                      >
                        <div className={`w-3.5 h-3.5 bg-white rounded-full absolute transition-all shadow-sm ${store.channels.delivery && store.masterStatus ? 'left-5' : 'left-0.5'}`} />
                      </button>
                    </div>

                    <div className="w-px h-8 bg-border"></div>

                    {/* Takeaway */}
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <Package className={`w-3.5 h-3.5 ${store.channels.takeaway ? 'text-orange-500' : 'text-muted-foreground'}`} /> Takeaway
                      </div>
                      <button 
                        disabled={!store.masterStatus}
                        onClick={() => toggleChannel(store.id, 'takeaway')}
                        className={`w-9 h-4.5 rounded-full transition-colors relative flex items-center ${store.channels.takeaway && store.masterStatus ? 'bg-orange-500' : 'bg-muted-foreground/30'} ${!store.masterStatus && 'cursor-not-allowed'}`}
                      >
                        <div className={`w-3.5 h-3.5 bg-white rounded-full absolute transition-all shadow-sm ${store.channels.takeaway && store.masterStatus ? 'left-5' : 'left-0.5'}`} />
                      </button>
                    </div>

                    <div className="w-px h-8 bg-border"></div>

                    {/* Dine-in */}
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <Utensils className={`w-3.5 h-3.5 ${store.channels.dineIn ? 'text-green-600' : 'text-muted-foreground'}`} /> Dine-in
                      </div>
                      <button 
                        disabled={!store.masterStatus}
                        onClick={() => toggleChannel(store.id, 'dineIn')}
                        className={`w-9 h-4.5 rounded-full transition-colors relative flex items-center ${store.channels.dineIn && store.masterStatus ? 'bg-green-500' : 'bg-muted-foreground/30'} ${!store.masterStatus && 'cursor-not-allowed'}`}
                      >
                        <div className={`w-3.5 h-3.5 bg-white rounded-full absolute transition-all shadow-sm ${store.channels.dineIn && store.masterStatus ? 'left-5' : 'left-0.5'}`} />
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
