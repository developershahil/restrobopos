import { useState } from 'react';
import { Settings, Save, X, Store, Clock, ShoppingBag, Truck, DollarSign, CreditCard, Monitor, Tag, Table2, ChevronDown, CheckCircle2 } from 'lucide-react';

const OUTLETS = [
  { id: 's1', name: 'Koramangala Branch' },
  { id: 's2', name: 'Indiranagar Branch' },
  { id: 's3', name: 'Whitefield Branch' },
];

const TABS = [
  { id: 'outlet', label: 'Outlet Information', icon: Store },
  { id: 'timings', label: 'Store Timings', icon: Clock },
  { id: 'modes', label: 'Ordering Modes', icon: ShoppingBag },
  { id: 'delivery', label: 'Delivery Settings', icon: Truck },
  { id: 'charges', label: 'Store Charges', icon: DollarSign },
  { id: 'payments', label: 'Payment Options', icon: CreditCard },
  { id: 'pos', label: 'POS & Kitchen', icon: Monitor },
  { id: 'offers', label: 'Offers & Promotions', icon: Tag },
  { id: 'table', label: 'Table Management', icon: Table2 },
];

export default function StoreSettings() {
  const [activeTab, setActiveTab] = useState('outlet');
  const [selectedOutlet, setSelectedOutlet] = useState(OUTLETS[0].id);

  // Form State Mock
  const [formData, setFormData] = useState({
    outletName: 'Koramangala Branch',
    outletCode: 'KRM-01',
    address: '1st Block, Koramangala, Bangalore',
    contactNumber: '+91 98765 43210',
    lat: '12.9279',
    lng: '77.6271',
    openTime: '10:00',
    closeTime: '23:00',
    breakTime: false,
    tempClose: false,
    delivery: true,
    takeaway: true,
    dineIn: true,
    qrOrdering: true,
    minOrderAmount: '150',
    deliveryRadius: '5',
    deliveryCharges: '40',
    freeDeliveryAbove: '500',
    perKmCharge: '10',
    packagingCharge: '20',
    convenienceFee: '0',
    codEnable: true,
    onlinePayment: true,
    kotPrinter: 'Printer 1',
    autoPrint: true,
    counterNumber: '1',
    kds: true,
    happyHours: false,
    outletOffers: true,
    couponAvailability: true,
    tableCount: '25',
    qrTable: true,
    sessionTimeout: '120',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleToggle = (name) => {
    setFormData(prev => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="flex flex-col h-full bg-muted/10 overflow-hidden">
      {/* Header & Sticky Save Bar */}
      <div className="bg-card border-b border-border p-4 sm:px-6 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-20 shadow-sm relative">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Settings className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-black text-foreground">Store Settings</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage operational settings for specific outlets.</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer mr-2">
            <div className="flex items-center gap-2 bg-background border border-border px-4 py-2 rounded-lg shadow-sm">
              <Store className="w-4 h-4 text-muted-foreground" />
              <select 
                value={selectedOutlet}
                onChange={(e) => setSelectedOutlet(e.target.value)}
                className="bg-transparent text-sm font-bold outline-none appearance-none cursor-pointer pr-4"
              >
                {OUTLETS.map(outlet => (
                  <option key={outlet.id} value={outlet.id}>{outlet.name}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 pointer-events-none" />
            </div>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-muted-foreground hover:bg-muted rounded-lg transition-colors">
            <X className="w-4 h-4" /> Discard
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors shadow-sm">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Tabs */}
        <div className="w-64 bg-card border-r border-border overflow-y-auto shrink-0 py-6 px-4 hidden md:block">
          <div className="space-y-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <tab.icon className="w-5 h-5 shrink-0" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-3xl mx-auto space-y-8 pb-12">
            
            {activeTab === 'outlet' && (
              <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-border bg-muted/20">
                  <h2 className="text-lg font-black text-foreground">Outlet Information</h2>
                  <p className="text-sm text-muted-foreground">Basic contact and location details.</p>
                </div>
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Outlet Name</label>
                      <input type="text" name="outletName" value={formData.outletName} onChange={handleChange} className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Outlet Code</label>
                      <input type="text" name="outletCode" value={formData.outletCode} onChange={handleChange} className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium outline-none focus:border-primary" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Address</label>
                    <textarea name="address" value={formData.address} onChange={handleChange} rows="3" className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium outline-none focus:border-primary resize-none"></textarea>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Contact Number</label>
                      <input type="text" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Latitude</label>
                      <input type="text" name="lat" value={formData.lat} onChange={handleChange} className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Longitude</label>
                      <input type="text" name="lng" value={formData.lng} onChange={handleChange} className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium outline-none focus:border-primary" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'timings' && (
              <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-border bg-muted/20">
                  <h2 className="text-lg font-black text-foreground">Store Timings</h2>
                  <p className="text-sm text-muted-foreground">Manage operational hours and temporary closures.</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Opening Time</label>
                      <input type="time" name="openTime" value={formData.openTime} onChange={handleChange} className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Closing Time</label>
                      <input type="time" name="closeTime" value={formData.closeTime} onChange={handleChange} className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium outline-none focus:border-primary" />
                    </div>
                  </div>
                  
                  <div className="border-t border-border pt-6 space-y-4">
                    <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                      <div>
                        <p className="font-bold text-foreground">Break Time</p>
                        <p className="text-xs text-muted-foreground">Is the store currently on a short break?</p>
                      </div>
                      <button onClick={() => handleToggle('breakTime')} className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${formData.breakTime ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full absolute transition-all shadow-md ${formData.breakTime ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                      <div>
                        <p className="font-bold text-foreground">Temporary Close</p>
                        <p className="text-xs text-muted-foreground">Close the store temporarily across all channels.</p>
                      </div>
                      <button onClick={() => handleToggle('tempClose')} className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${formData.tempClose ? 'bg-red-500' : 'bg-muted-foreground/30'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full absolute transition-all shadow-md ${formData.tempClose ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'modes' && (
              <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-border bg-muted/20">
                  <h2 className="text-lg font-black text-foreground">Ordering Modes</h2>
                  <p className="text-sm text-muted-foreground">Enable or disable various ways customers can order.</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/10 transition-colors">
                    <div>
                      <p className="font-bold text-foreground">Delivery</p>
                      <p className="text-xs text-muted-foreground">Accept orders for home delivery.</p>
                    </div>
                    <button onClick={() => handleToggle('delivery')} className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${formData.delivery ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute transition-all shadow-md ${formData.delivery ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/10 transition-colors">
                    <div>
                      <p className="font-bold text-foreground">Takeaway</p>
                      <p className="text-xs text-muted-foreground">Accept orders for self-pickup.</p>
                    </div>
                    <button onClick={() => handleToggle('takeaway')} className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${formData.takeaway ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute transition-all shadow-md ${formData.takeaway ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/10 transition-colors">
                    <div>
                      <p className="font-bold text-foreground">Dine In</p>
                      <p className="text-xs text-muted-foreground">Accept orders placed at the table via staff.</p>
                    </div>
                    <button onClick={() => handleToggle('dineIn')} className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${formData.dineIn ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute transition-all shadow-md ${formData.dineIn ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border rounded-xl hover:bg-muted/10 transition-colors">
                    <div>
                      <p className="font-bold text-foreground">QR Ordering</p>
                      <p className="text-xs text-muted-foreground">Allow customers to scan and order themselves.</p>
                    </div>
                    <button onClick={() => handleToggle('qrOrdering')} className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${formData.qrOrdering ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute transition-all shadow-md ${formData.qrOrdering ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                  
                  <div className="pt-4 mt-4 border-t border-border">
                    <div className="space-y-1.5 max-w-sm">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Minimum Order Amount</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                        <input type="number" name="minOrderAmount" value={formData.minOrderAmount} onChange={handleChange} className="w-full pl-8 pr-4 py-2 bg-background border border-border rounded-lg text-sm font-medium outline-none focus:border-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'delivery' && (
              <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-border bg-muted/20">
                  <h2 className="text-lg font-black text-foreground">Delivery Settings</h2>
                  <p className="text-sm text-muted-foreground">Configure delivery radius and charges.</p>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Delivery Radius (KM)</label>
                    <input type="number" name="deliveryRadius" value={formData.deliveryRadius} onChange={handleChange} className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium outline-none focus:border-primary" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Base Delivery Charge</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                      <input type="number" name="deliveryCharges" value={formData.deliveryCharges} onChange={handleChange} className="w-full pl-8 pr-4 py-2 bg-background border border-border rounded-lg text-sm font-medium outline-none focus:border-primary" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Free Delivery Above</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                      <input type="number" name="freeDeliveryAbove" value={formData.freeDeliveryAbove} onChange={handleChange} className="w-full pl-8 pr-4 py-2 bg-background border border-border rounded-lg text-sm font-medium outline-none focus:border-primary" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Per KM Extra Charge</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                      <input type="number" name="perKmCharge" value={formData.perKmCharge} onChange={handleChange} className="w-full pl-8 pr-4 py-2 bg-background border border-border rounded-lg text-sm font-medium outline-none focus:border-primary" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'charges' && (
              <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-border bg-muted/20">
                  <h2 className="text-lg font-black text-foreground">Store Charges</h2>
                  <p className="text-sm text-muted-foreground">Set mandatory fees and charges.</p>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Packaging Charge</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                      <input type="number" name="packagingCharge" value={formData.packagingCharge} onChange={handleChange} className="w-full pl-8 pr-4 py-2 bg-background border border-border rounded-lg text-sm font-medium outline-none focus:border-primary" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Convenience Fee</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                      <input type="number" name="convenienceFee" value={formData.convenienceFee} onChange={handleChange} className="w-full pl-8 pr-4 py-2 bg-background border border-border rounded-lg text-sm font-medium outline-none focus:border-primary" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-border bg-muted/20">
                  <h2 className="text-lg font-black text-foreground">Payment Options</h2>
                  <p className="text-sm text-muted-foreground">Enable or disable payment methods at this outlet.</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                    <div>
                      <p className="font-bold text-foreground">Cash on Delivery (COD)</p>
                      <p className="text-xs text-muted-foreground">Allow customers to pay by cash upon delivery.</p>
                    </div>
                    <button onClick={() => handleToggle('codEnable')} className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${formData.codEnable ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute transition-all shadow-md ${formData.codEnable ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                    <div>
                      <p className="font-bold text-foreground">Online Payment</p>
                      <p className="text-xs text-muted-foreground">Allow customers to pay via Razorpay/Stripe.</p>
                    </div>
                    <button onClick={() => handleToggle('onlinePayment')} className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${formData.onlinePayment ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute transition-all shadow-md ${formData.onlinePayment ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pos' && (
              <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-border bg-muted/20">
                  <h2 className="text-lg font-black text-foreground">POS & Kitchen Settings</h2>
                  <p className="text-sm text-muted-foreground">Configuration for on-site billing and kitchen displays.</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">KOT Printer Name</label>
                      <input type="text" name="kotPrinter" value={formData.kotPrinter} onChange={handleChange} className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Counter Number</label>
                      <input type="text" name="counterNumber" value={formData.counterNumber} onChange={handleChange} className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium outline-none focus:border-primary" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                    <div>
                      <p className="font-bold text-foreground">Auto Print KOT</p>
                      <p className="text-xs text-muted-foreground">Automatically print kitchen tickets upon order arrival.</p>
                    </div>
                    <button onClick={() => handleToggle('autoPrint')} className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${formData.autoPrint ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute transition-all shadow-md ${formData.autoPrint ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                    <div>
                      <p className="font-bold text-foreground">Kitchen Display System (KDS)</p>
                      <p className="text-xs text-muted-foreground">Enable digital order management in the kitchen.</p>
                    </div>
                    <button onClick={() => handleToggle('kds')} className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${formData.kds ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute transition-all shadow-md ${formData.kds ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'offers' && (
              <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-border bg-muted/20">
                  <h2 className="text-lg font-black text-foreground">Offers & Promotions</h2>
                  <p className="text-sm text-muted-foreground">Enable outlet-specific marketing tools.</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                    <div>
                      <p className="font-bold text-foreground">Happy Hours</p>
                      <p className="text-xs text-muted-foreground">Enable time-based discounts for this outlet.</p>
                    </div>
                    <button onClick={() => handleToggle('happyHours')} className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${formData.happyHours ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute transition-all shadow-md ${formData.happyHours ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                    <div>
                      <p className="font-bold text-foreground">Outlet Specific Offers</p>
                      <p className="text-xs text-muted-foreground">Allow local discounts not available at other branches.</p>
                    </div>
                    <button onClick={() => handleToggle('outletOffers')} className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${formData.outletOffers ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute transition-all shadow-md ${formData.outletOffers ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                    <div>
                      <p className="font-bold text-foreground">Coupon Availability</p>
                      <p className="text-xs text-muted-foreground">Enable voucher and coupon codes for customers.</p>
                    </div>
                    <button onClick={() => handleToggle('couponAvailability')} className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${formData.couponAvailability ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute transition-all shadow-md ${formData.couponAvailability ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'table' && (
              <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-border bg-muted/20">
                  <h2 className="text-lg font-black text-foreground">Table Management</h2>
                  <p className="text-sm text-muted-foreground">Configure on-site dining and QR ordering.</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Table Count</label>
                      <input type="number" name="tableCount" value={formData.tableCount} onChange={handleChange} className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Session Timeout (Mins)</label>
                      <input type="number" name="sessionTimeout" value={formData.sessionTimeout} onChange={handleChange} className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium outline-none focus:border-primary" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border rounded-xl">
                    <div>
                      <p className="font-bold text-foreground">QR Table Ordering</p>
                      <p className="text-xs text-muted-foreground">Allow customers to place orders from the table via QR scan.</p>
                    </div>
                    <button onClick={() => handleToggle('qrTable')} className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${formData.qrTable ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full absolute transition-all shadow-md ${formData.qrTable ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
