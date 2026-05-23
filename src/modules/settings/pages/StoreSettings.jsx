import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Settings, Save, X, Store, Clock, ShoppingBag, Truck, DollarSign, 
  CreditCard, Tag, ChevronDown, CheckCircle2, 
  Layout, Eye, MapPin, Timer, Receipt, Users, Bell, ShieldCheck,
  Smartphone, Database, Globe, Layers, ListOrdered, Plus, Trash2,
  AlertCircle, Info, Bike, Utensils, Star
} from 'lucide-react';

const OUTLETS = [
  { id: 's1', name: 'Koramangala Branch' },
  { id: 's2', name: 'Indiranagar Branch' },
  { id: 's3', name: 'Whitefield Branch' },
];

const CATEGORIES = [
  {
    id: 'profile',
    label: 'Outlet Profile',
    icon: MapPin,
    desc: 'Address, Contacts, and Timing',
    tabs: [
      { id: 'address', label: 'Address', icon: MapPin, desc: 'Outlet location and contact details.' },
      { id: 'contacts', label: 'Contacts', icon: Users, desc: 'Manage store contact numbers.' },
      { id: 'timing', label: 'Timing', icon: Clock, desc: 'Store operational hours.' },
      { id: 'currency', label: 'Currency', icon: DollarSign, desc: 'Set local currency and symbols.' },
      { id: 'foodLicense', label: 'Food license', icon: ShieldCheck, desc: 'FSSAI and other licenses.' },
    ]
  },
  {
    id: 'operations',
    label: 'Operations',
    icon: ShoppingBag,
    desc: 'Ordering, Delivery, and Prep Time',
    tabs: [
      { id: 'ordering', label: 'Ordering mode', icon: ShoppingBag, desc: 'Enable/Disable ordering modes & sequence.' },
      { id: 'preparation', label: 'Preparation time', icon: Timer, desc: 'Set kitchen prep & rush hour timings.' },
      { id: 'radius', label: 'Service radius', icon: Globe, desc: 'Define delivery area and geofencing.' },
      { id: 'delivery', label: 'Delivery charge', icon: Truck, desc: 'Distance based delivery fee engine.' },
      { id: 'rider', label: 'Rider setting', icon: Smartphone, desc: 'Third party rider fleet integrations.' },
      { id: 'other', label: 'Other settings', icon: Layers, desc: 'Auto-accept, WhatsApp & notifications.' },
    ]
  },
  {
    id: 'finance',
    label: 'Finance & Billing',
    icon: Receipt,
    desc: 'Taxes, Payments, and Charges',
    tabs: [
      { id: 'bill', label: 'Bill Settings', icon: Receipt, desc: 'Configure headers, footers and taxes.' },
      { id: 'taxes', label: 'Taxes', icon: ShieldCheck, desc: 'Manage GST and other service taxes.' },
      { id: 'payments', label: 'Bill Payments', icon: CreditCard, desc: 'Enable/Disable payment options.' },
      { id: 'charges', label: 'Other charges', icon: DollarSign, desc: 'Packaging & convenience fees.' },
    ]
  },
  {
    id: 'limits',
    label: 'Order Limits',
    icon: ListOrdered,
    desc: 'COD, MOV, and Enablement',
    tabs: [
      { id: 'cod', label: 'COD Limit', icon: DollarSign, desc: 'Maximum amount for COD orders.' },
      { id: 'mov', label: 'MOV Limit', icon: ListOrdered, desc: 'Minimum order value settings.' },
      { id: 'enablement', label: 'COD Enablement', icon: ShieldCheck, desc: 'Enable COD for specific modes.' },
    ]
  },
  {
    id: 'integrations',
    label: 'Integrations',
    icon: Database,
    desc: 'Third party POS & Tools',
    tabs: [
      { id: 'pos', label: 'Third party POS', icon: Database, desc: 'Petpooja, Billberry integrations.' },
    ]
  },
  {
    id: 'appearance',
    label: 'Appearance',
    icon: Layout,
    desc: 'App theme and visibility',
    tabs: [
      { id: 'appearance', label: 'Appearance', icon: Layout, desc: 'Layout & visibility settings for the app.' },
    ]
  }
];

export default function StoreSettings() {
  const [activeCategory, setActiveCategory] = useState('profile');
  const [activeTab, setActiveTab] = useState('address');
  const [selectedOutlet, setSelectedOutlet] = useState(OUTLETS[0].id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'modes' or 'sequence'
  const [currencySearch, setCurrencySearch] = useState('');
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [riderTab, setRiderTab] = useState('fleet'); // 'fleet' or 'auto'

  const initialValues = {
    deliveryEnabled: true,
    deliveryMinAmount: 200,
    deliveryRadius: 8,
    takeawayEnabled: true,
    takeawayPrepTime: 15,
    dineInEnabled: true,
    dineInTableRequired: true,
    dineInServiceCharge: 5,
    driveThruEnabled: false,
    qrOrderingEnabled: true,
    scheduledOrdersEnabled: false,
    
    // Appearance
    categoryView: 'Overlay View',
    bestSellerView: 'Small Card',
    featuredItemView: 'List',
    rows: [{ id: 1, count: 4 }, { id: 2, count: 2 }, { id: 3, count: 2 }],

    // Bill Payments
    billPaymentEnabled: true,
    discountEnabled: true,
    convenienceEnabled: false,
    tipsEnabled: false,

    // COD Limits
    codLimitEnabled: true,
    deliveryCodLimit: 2000,
    takeawayCodLimit: 1000,

    // COD Enablement
    cashTakeaway: true,
    cashDelivery: true,
    cashGo: true,
    cashSelfServe: true,

    // MOV Limits
    movLimitEnabled: true,
    deliveryMov: 299,
    takeawayMov: 149,

    // Address
    addressLine1: 'Gr. Floor, 23, Maple Trade Centre',
    addressLine2: 'Nr. Surdhara Circle, Thaltej',
    city: 'Ahmedabad',
    state: 'Gujarat',
    country: 'India',

    // Bill Settings
    legalName: 'Restrobopos Store',
    billHeader: '',
    billFooter: '',

    // Contacts
    contactNumbers: '+91 81540-53444',

    // Service Radius
    latitude: '23.058353',
    longitude: '72.528447',
    radius: 8.5,
    serviceability: 'Accept orders from customers in circle',

    // Preparation Time
    kitchenPrepTime: 30,
    rushHourOption: 'There is no rush hour',
    rushHours: [],

    // Delivery Charges
    deliveryThreshold: 299,
    chargeAboveThreshold: 0,
    chargeBelowThreshold: 40,
    distanceFeeEnabled: true,
    perKmCharge: 10,
    normalRadius: 3,
    extraCharge: 5,
    collectTaxOnDelivery: true,

    // Timing
    orderTimingOption: 'Same time for all days',
    openingTime: '11:00',
    closingTime: '23:30',
    deliveryTimingEnabled: true,
    deliveryTimingOption: 'Outlet delivery available at all days of the week',

    // Taxes
    taxEnabled: true,
    taxNumber: '',
    cgstRate: 2.5,
    sgstRate: 2.5,

    // Currency
    currencySymbol: '₹',
    currencyCode: 'INR',
    currencyName: 'Indian Rupee',

    // Food License
    licenseEnabled: true,
    license: '',

    // Other Settings
    autoAccept: true,
    bestSellerCategory: true,
    offerSuggestions: true,
    featureSection: true,
    whatsappNotifications: true,
    autoCancelOrders: true,
    bufferTime: 60,
    autoRefund: true,
    loyaltyEnabled: true,
    loyaltyPointsPerRupee: 1,

    // Bill
    billLogo: null,

    // Other Charges
    packagingEnabled: false,

    // POS
    petpoojaEnabled: true,
    petpoojaAppKey: '2lvf6mvt6y6l0z9lbpep9w3m4jxane8d',
    petpoojaAppSecret: '333e62f7d7ff80dbaf6e2d3b248b8472af3d',
    petpoojaAccessToken: 'd5718a78a2be37f8fbf519b521996df8f8c3e',
    petpoojaRestaurantId: '12ndyrAt',

    // Rider
    inHouseRiderEnabled: true,
    autoAssignmentEnabled: true,
    autoAssignStrategy: 'Nearest Rider First',
    autoAssignDelay: 2,
    maxOrdersPerRider: 3,
  };

  const [formData, setFormData] = useState(initialValues);
  const [initialData, setInitialData] = useState(initialValues);
  const outletContext = useOutletContext();
  const discardKey = outletContext?.discardKey;
  const setIsDirty = outletContext?.setIsDirty;

  useEffect(() => {
    if (discardKey) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(initialData);
    }
  }, [discardKey, initialData]);

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialData);

  useEffect(() => {
    if (setIsDirty) {
      setIsDirty(hasChanges);
    }
  }, [hasChanges, setIsDirty]);

  const handleSave = () => {
    setInitialData(formData);
    // Here you would typically make an API call
    console.log('Saving settings:', formData);
  };

  const handleDiscard = () => {
    setFormData(initialData);
  };

  const handleToggle = (name) => {
    setFormData(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 md:px-8 py-2 md:py-5 shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 z-30">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-9 h-9 md:w-10 md:h-10 bg-primary/10 rounded-md flex items-center justify-center">
            <Settings className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold text-foreground tracking-tight">Store Settings</h1>
            <p className="text-xs text-muted-foreground font-medium hidden sm:block">Manage your outlet preferences and configurations</p>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2 md:gap-3 flex-1 sm:flex-initial">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] hidden md:inline">Active Outlet</span>
            <div className="relative group flex-1 sm:flex-initial">
              <div className="flex items-center gap-2 md:gap-3 bg-background border border-border pl-3 md:pl-4 pr-8 md:pr-10 py-2 md:py-2.5 rounded-md md:rounded-lg cursor-pointer hover:border-primary transition-all shadow-sm group-hover:shadow-primary/20/50">
                <Store className="w-4 h-4 text-primary" />
                <select 
                  value={selectedOutlet}
                  onChange={(e) => setSelectedOutlet(e.target.value)}
                  className="bg-transparent text-sm font-black text-foreground outline-none appearance-none cursor-pointer pr-2 w-full"
                >
                  {OUTLETS.map(outlet => (
                    <option key={outlet.id} value={outlet.id}>{outlet.name}</option>
                  ))}
                </select>
                <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-hover:text-primary transition-colors">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Navigation Sidebar — desktop: vertical sidebar, mobile: horizontal scroll */}
        <div className="md:w-72 bg-card md:border-r border-b md:border-b-0 border-border overflow-x-auto md:overflow-y-auto shrink-0 md:py-6 scrollbar-hide">
          <div className="px-4 md:px-4 mb-2 md:mb-4 hidden md:block">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Configuration</label>
          </div>
          {/* Mobile: horizontal scroll, Desktop: vertical stack */}
          <div className="flex md:flex-col gap-1 px-3 md:px-0 py-2 md:py-0">
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.id);
                setActiveTab(category.tabs[0].id);
              }}
              className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3.5 transition-all text-left relative group whitespace-nowrap md:whitespace-normal md:w-full shrink-0 md:shrink rounded-lg md:rounded-none ${
                activeCategory === category.id 
                  ? 'text-primary bg-primary/10 md:bg-transparent' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 bg-primary transition-all hidden md:block ${activeCategory === category.id ? 'opacity-100' : 'opacity-0'}`} />
              <div className={`p-1.5 md:p-2 rounded-lg transition-colors ${activeCategory === category.id ? 'bg-primary/10' : 'bg-transparent group-hover:bg-background'}`}>
                <category.icon className={`w-4 h-4 shrink-0 ${activeCategory === category.id ? 'text-primary' : 'text-muted-foreground group-hover:text-muted-foreground'}`} />
              </div>
              <div className="flex flex-col">
                <span className={`text-xs md:text-sm font-bold tracking-tight ${activeCategory === category.id ? 'text-primary' : 'text-muted-foreground'}`}>{category.label}</span>
                <span className="text-[10px] text-muted-foreground font-medium truncate w-40 hidden md:block">{category.desc}</span>
              </div>
            </button>
          ))
          }
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-background relative">
          <div className="max-w-4xl mx-auto p-4 md:p-4 pb-32">
            
            {/* Tab Header & Sub-navigation */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-foreground tracking-tight mb-1">{CATEGORIES.find(c => c.id === activeCategory)?.label}</h2>
                  <p className="text-sm text-muted-foreground font-medium">{CATEGORIES.find(c => c.id === activeCategory)?.desc}</p>
                </div>
                {activeTab === 'ordering' && (
                  <div className="flex gap-3">
                    <button 
                      onClick={() => { setModalType('modes'); setIsModalOpen(true); }}
                      className="px-4 py-2 bg-card border border-border rounded-md text-xs font-bold text-muted-foreground hover:bg-background transition-colors shadow-sm"
                    >Enable/Disable Modes</button>
                    <button 
                      onClick={() => { setModalType('sequence'); setIsModalOpen(true); }}
                      className="px-4 py-2 bg-primary rounded-md text-xs font-bold text-white hover:bg-primary/90 transition-colors shadow-primary/20 shadow-lg"
                    >Modify Sequence</button>
                  </div>
                )}
              </div>
              
              {/* Sub-tabs */}
              <div className="flex flex-wrap items-center gap-2 pb-2">
                {CATEGORIES.find(c => c.id === activeCategory)?.tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-bold transition-all whitespace-nowrap border ${
                      activeTab === tab.id
                        ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                        : 'bg-card text-muted-foreground border-border hover:border-primary hover:text-primary shadow-sm'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="bg-card w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
                  <div className="p-4 border-b border-border/50 flex items-center justify-between bg-background/50">
                    <div>
                      <h3 className="text-lg font-bold text-foreground tracking-tight">
                        {modalType === 'modes' ? 'Enable/Disable Ordering Modes' : 'Modify Ordering Sequence'}
                      </h3>
                      <p className="text-sm text-muted-foreground font-medium">
                        {modalType === 'modes' ? 'Select which modes should be available across your store.' : 'Drag and drop to reorder the sequence of modes.'}
                      </p>
                    </div>
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="w-10 h-10 bg-card border border-border rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4 max-h-[60vh] overflow-y-auto">
                    {modalType === 'modes' ? (
                      <div className="space-y-4">
                        {[
                          { id: 'deliveryEnabled', label: 'Home Delivery', icon: Truck },
                          { id: 'takeawayEnabled', label: 'Takeaway', icon: ShoppingBag },
                          { id: 'dineInEnabled', label: 'Dine-in', icon: Utensils },
                          { id: 'driveThruEnabled', label: 'Drive-thru', icon: Bike },
                          { id: 'qrOrderingEnabled', label: 'QR Ordering', icon: Smartphone },
                          { id: 'scheduledOrdersEnabled', label: 'Scheduled Orders', icon: Clock },
                        ].map(m => (
                          <div key={m.id} className="flex items-center justify-between p-4 bg-background rounded-lg border border-border/50 group hover:border-primary/40 transition-all">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-card rounded-md flex items-center justify-center shadow-sm">
                                <m.icon className="w-4 h-4 text-primary" />
                              </div>
                              <span className="text-sm font-bold text-foreground">{m.label}</span>
                            </div>
                            <button 
                              onClick={() => handleToggle(m.id)}
                              className={`w-14 h-7 rounded-full relative transition-all ${formData[m.id] ? 'bg-primary' : 'bg-muted'}`}
                            >
                              <div className={`w-4 h-4 bg-card rounded-full absolute top-1 shadow-sm transition-all ${formData[m.id] ? 'left-8' : 'left-1'}`} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {['Dine-in', 'Takeaway', 'Home Delivery', 'Drive-thru', 'QR Order'].map((m, i) => (
                          <div key={m} className="flex items-center justify-between p-4 bg-card border border-border rounded-lg shadow-sm cursor-move hover:border-primary transition-all">
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center font-bold text-muted-foreground text-xs">{i + 1}</div>
                              <span className="text-sm font-bold text-foreground">{m}</span>
                            </div>
                            <ListOrdered className="w-4 h-4 text-muted-foreground/50" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-background border-t border-border/50 flex justify-end gap-3">
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2.5 bg-card border border-border rounded-md text-sm font-bold text-muted-foreground hover:bg-background transition-all"
                    >Cancel</button>
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="px-8 py-2.5 bg-primary rounded-md text-sm font-bold text-white hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
                    >Save Changes</button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              
              {/* Ordering Mode */}
              {activeTab === 'ordering' && (
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-border/30">
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold text-foreground tracking-tight">Visibility Control</h3>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">Choose which ordering modes are available for your customers at this outlet.</p>
                      </div>
                      <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                        Live on Store
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { label: 'Home Delivery', name: 'deliveryEnabled', icon: Truck, color: 'text-blue-500', bg: 'bg-blue-50' },
                        { label: 'Takeaway', name: 'takeawayEnabled', icon: ShoppingBag, color: 'text-orange-500', bg: 'bg-orange-50' },
                        { label: 'Dine-in', name: 'dineInEnabled', icon: Utensils, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                        { label: 'Drive-thru', name: 'driveThruEnabled', icon: Bike, color: 'text-purple-500', bg: 'bg-purple-50' },
                        { label: 'QR Ordering', name: 'qrOrderingEnabled', icon: Smartphone, color: 'text-primary', bg: 'bg-primary/10' },
                        { label: 'Scheduled', name: 'scheduledOrdersEnabled', icon: Clock, color: 'text-pink-500', bg: 'bg-pink-50' }
                      ].map(mode => (
                        <div key={mode.label} className={`relative p-4 rounded-lg border transition-all duration-300 ${formData[mode.name] ? 'bg-card border-primary/20 shadow-md shadow-primary/10' : 'bg-background border-border/50'}`}>
                          <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 ${mode.bg} rounded-md flex items-center justify-center`}>
                              <mode.icon className={`w-4 h-4 ${mode.color}`} />
                            </div>
                            <button 
                              onClick={() => handleToggle(mode.name)}
                              className={`w-14 h-7 rounded-full relative transition-all duration-300 ${formData[mode.name] ? 'bg-primary' : 'bg-muted'}`}
                            >
                              <div className={`w-4 h-4 bg-card rounded-full absolute top-1 shadow-sm transition-all duration-300 ${formData[mode.name] ? 'left-8' : 'left-1'}`} />
                            </button>
                          </div>
                          <div>
                            <span className="text-sm font-bold text-foreground block">{mode.label}</span>
                            <span className="text-[10px] text-muted-foreground font-medium leading-tight">Click to {formData[mode.name] ? 'disable' : 'enable'} this mode for customers.</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-primary rounded-lg p-4 text-white relative overflow-hidden shadow-xl shadow-primary/20">
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                          <Info className="w-4 h-4 text-primary-foreground/70" />
                        </div>
                        <h4 className="text-sm font-bold tracking-tight">Need custom ordering flows?</h4>
                      </div>
                      <p className="text-primary-foreground/60 text-xs font-medium leading-relaxed max-w-lg mb-6">
                        You can configure specialized ordering sequences and priority rules for different delivery partners and aggregator platforms in the Advanced Sequence settings.
                      </p>
                      <button 
                        onClick={() => { setModalType('sequence'); setIsModalOpen(true); }}
                        className="bg-card text-primary-foreground px-5 py-2 rounded-md text-xs font-bold hover:bg-primary/10 transition-colors shadow-lg"
                      >Open Advanced Settings</button>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
                      <Layers className="w-48 h-48" />
                    </div>
                  </div>

                  {/* Mode Specific Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.deliveryEnabled && (
                      <div className="bg-card rounded-lg border border-border p-4 shadow-sm animate-in slide-in-from-left-4 duration-500">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-blue-50 rounded-md flex items-center justify-center">
                            <Truck className="w-4 h-4 text-blue-500" />
                          </div>
                          <h4 className="text-sm font-black text-foreground uppercase tracking-widest">Delivery Settings</h4>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Min. Order Value</label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">₹</span>
                              <input type="number" name="deliveryMinAmount" value={formData.deliveryMinAmount} onChange={handleChange} className="w-full bg-background border border-border/50 rounded-md pl-8 pr-4 py-3 text-sm font-bold text-foreground outline-none focus:bg-card focus:border-blue-300 transition-all" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Delivery Radius (KM)</label>
                            <input type="number" name="deliveryRadius" value={formData.deliveryRadius} onChange={handleChange} className="w-full bg-background border border-border/50 rounded-md px-3 py-2 text-sm font-bold text-foreground outline-none focus:bg-card focus:border-blue-300 transition-all" />
                          </div>
                        </div>
                      </div>
                    )}

                    {formData.takeawayEnabled && (
                      <div className="bg-card rounded-lg border border-border p-4 shadow-sm animate-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-orange-50 rounded-md flex items-center justify-center">
                            <ShoppingBag className="w-4 h-4 text-orange-500" />
                          </div>
                          <h4 className="text-sm font-black text-foreground uppercase tracking-widest">Takeaway Settings</h4>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Default Prep Time (Mins)</label>
                            <input type="number" name="takeawayPrepTime" value={formData.takeawayPrepTime} onChange={handleChange} className="w-full bg-background border border-border/50 rounded-md px-3 py-2 text-sm font-bold text-foreground outline-none focus:bg-card focus:border-orange-300 transition-all" />
                          </div>
                          <div className="flex items-center justify-between p-4 bg-background rounded-md border border-border/50">
                            <span className="text-xs font-bold text-muted-foreground">Allow Scheduled Pickup</span>
                            <button className="w-14 h-7 bg-primary rounded-full relative"><div className="w-4 h-4 bg-card rounded-full absolute top-1 left-8" /></button>
                          </div>
                        </div>
                      </div>
                    )}

                    {formData.dineInEnabled && (
                      <div className="bg-card rounded-lg border border-border p-4 shadow-sm animate-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-emerald-50 rounded-md flex items-center justify-center">
                            <Utensils className="w-4 h-4 text-emerald-500" />
                          </div>
                          <h4 className="text-sm font-black text-foreground uppercase tracking-widest">Dine-in Settings</h4>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-background rounded-md border border-border/50">
                            <span className="text-xs font-bold text-muted-foreground">Table Number Required</span>
                            <button 
                              onClick={() => handleToggle('dineInTableRequired')}
                              className={`w-14 h-7 rounded-full relative transition-all ${formData.dineInTableRequired ? 'bg-primary' : 'bg-muted'}`}
                            >
                              <div className={`w-4 h-4 bg-card rounded-full absolute top-1 shadow-sm transition-all ${formData.dineInTableRequired ? 'left-8' : 'left-1'}`} />
                            </button>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Service Charge (%)</label>
                            <div className="relative">
                              <input type="number" name="dineInServiceCharge" value={formData.dineInServiceCharge} onChange={handleChange} className="w-full bg-background border border-border/50 rounded-md px-3 py-2 text-sm font-bold text-foreground outline-none focus:bg-card focus:border-emerald-300 transition-all" />
                              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Appearance */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-border/30">
                      <h3 className="text-lg font-bold text-foreground tracking-tight">App Interface Layout</h3>
                      <p className="text-sm text-muted-foreground font-medium leading-relaxed">Configure how categories and items are displayed on your customer's mobile app.</p>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-background/30">
                      {[
                        { label: 'Category View', name: 'categoryView', options: ['Overlay View', 'Grid View', 'List View'], icon: Layout },
                        { label: 'Best Seller View', name: 'bestSellerView', options: ['Small Card', 'Large Card', 'Horizontal'], icon: Star },
                        { label: 'Featured Item View', name: 'featuredItemView', options: ['List', 'Grid', 'Carousel'], icon: Tag }
                      ].map(field => (
                        <div key={field.name} className="space-y-3">
                          <div className="flex items-center gap-2 mb-1">
                            <field.icon className="w-3.5 h-3.5 text-primary" />
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{field.label}</label>
                          </div>
                          <div className="relative group">
                            <select 
                              name={field.name} 
                              value={formData[field.name]} 
                              onChange={handleChange} 
                              className="w-full pl-4 pr-10 py-3 bg-card border border-border rounded-md text-sm font-bold text-foreground outline-none appearance-none hover:border-primary transition-colors shadow-sm cursor-pointer"
                            >
                              {field.options.map(opt => <option key={opt}>{opt}</option>)}
                            </select>
                            <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-border/30">
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold text-foreground tracking-tight">Home Screen Sections</h3>
                        <p className="text-sm text-muted-foreground font-medium">Manage the order and item count for each section on the home screen.</p>
                      </div>
                      <button className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-md text-xs font-bold hover:bg-primary/20 transition-colors">
                        <Plus className="w-4 h-4" />
                        Add New Row
                      </button>
                    </div>

                    <div className="space-y-4">
                      {formData.rows.map((row, index) => (
                        <div key={row.id} className="group flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:border-primary/20 hover:bg-primary/10/30 transition-all duration-300">
                          <div className="w-12 h-12 bg-card border border-border rounded-md flex items-center justify-center text-sm font-black text-muted-foreground group-hover:text-primary group-hover:border-primary/40 transition-colors shadow-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1 space-y-1">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Section Row {row.id}</label>
                            <div className="flex items-center gap-4">
                              <div className="text-sm font-bold text-foreground">Display Count</div>
                              <div className="flex items-center bg-card border border-border rounded-lg overflow-hidden shadow-sm">
                                <button 
                                  onClick={() => {
                                    const newRows = [...formData.rows];
                                    newRows[index].count = Math.max(1, newRows[index].count - 1);
                                    setFormData(prev => ({ ...prev, rows: newRows }));
                                  }}
                                  className="px-3 py-1 hover:bg-background text-muted-foreground hover:text-primary transition-colors border-r border-border/50"
                                >-</button>
                                <input 
                                  type="number" 
                                  value={row.count} 
                                  onChange={(e) => {
                                    const newRows = [...formData.rows];
                                    newRows[index].count = parseInt(e.target.value) || 0;
                                    setFormData(prev => ({ ...prev, rows: newRows }));
                                  }}
                                  className="w-12 text-center text-sm font-bold text-primary outline-none bg-transparent" 
                                />
                                <button 
                                  onClick={() => {
                                    const newRows = [...formData.rows];
                                    newRows[index].count = newRows[index].count + 1;
                                    setFormData(prev => ({ ...prev, rows: newRows }));
                                  }}
                                  className="px-3 py-1 hover:bg-background text-muted-foreground hover:text-primary transition-colors border-l border-border/50"
                                >+</button>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2.5 bg-card text-muted-foreground hover:text-primary rounded-md border border-border hover:border-primary/40 shadow-sm transition-all">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2.5 bg-card text-muted-foreground hover:text-red-600 rounded-md border border-border hover:border-red-200 shadow-sm transition-all">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Address */}
              {activeTab === 'address' && (
                <div className="space-y-6">
                  <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-border/30 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-foreground tracking-tight">Outlet Location</h3>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">This address will be visible to your customers. Ensure it is accurate for better serviceability.</p>
                      </div>
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div className="p-4 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Address Line 1</label>
                          <input 
                            type="text" 
                            name="addressLine1" 
                            value={formData.addressLine1} 
                            onChange={handleChange} 
                            className="w-full bg-background border border-border/50 rounded-md px-3 py-2 text-sm font-bold text-foreground focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none" 
                            placeholder="Building, Street name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Address Line 2</label>
                          <input 
                            type="text" 
                            name="addressLine2" 
                            value={formData.addressLine2} 
                            onChange={handleChange} 
                            className="w-full bg-background border border-border/50 rounded-md px-3 py-2 text-sm font-bold text-foreground focus:bg-card focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none" 
                            placeholder="Locality, Landmark"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">City</label>
                          <input 
                            type="text" 
                            name="city" 
                            value={formData.city} 
                            onChange={handleChange} 
                            className="w-full bg-background border border-border/50 rounded-md px-3 py-2 text-sm font-bold text-foreground focus:bg-card focus:border-primary transition-all outline-none" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">State</label>
                          <input 
                            type="text" 
                            name="state" 
                            value={formData.state} 
                            onChange={handleChange} 
                            className="w-full bg-background border border-border/50 rounded-md px-3 py-2 text-sm font-bold text-foreground focus:bg-card focus:border-primary transition-all outline-none" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Country</label>
                          <input 
                            type="text" 
                            name="country" 
                            value={formData.country} 
                            onChange={handleChange} 
                            className="w-full bg-background border border-border/50 rounded-md px-3 py-2 text-sm font-bold text-foreground focus:bg-card focus:border-primary transition-all outline-none" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-lg p-4 border border-amber-100 flex items-start gap-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-md flex items-center justify-center shrink-0">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-amber-900 mb-1">Update Google Maps Location?</h4>
                      <p className="text-xs text-amber-700/80 font-medium leading-relaxed">Changing the physical address might require you to re-calibrate your Service Radius in the "Service Radius" tab to ensure accurate delivery zones.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Bill Settings */}
              {activeTab === 'bill' && (
                <div className="space-y-6">
                  <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-border/30 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-foreground tracking-tight">Invoice Configuration</h3>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">Customize your bill headers and footers that customers see on their invoices.</p>
                      </div>
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Receipt className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div className="p-4 space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Legal Entity Name</label>
                        <input type="text" name="legalName" value={formData.legalName} onChange={handleChange} className="w-full bg-background border border-border/50 rounded-md px-3 py-2 text-sm font-bold text-foreground focus:bg-card focus:border-primary transition-all outline-none" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Bill Header</label>
                          <textarea name="billHeader" value={formData.billHeader} onChange={handleChange} className="w-full bg-background border border-border/50 rounded-md px-3 py-2 text-sm font-bold text-foreground focus:bg-card focus:border-primary transition-all outline-none min-h-[120px] resize-none" placeholder="Enter header text..." />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Bill Footer</label>
                          <textarea name="billFooter" value={formData.billFooter} onChange={handleChange} className="w-full bg-background border border-border/50 rounded-md px-3 py-2 text-sm font-bold text-foreground focus:bg-card focus:border-primary transition-all outline-none min-h-[120px] resize-none" placeholder="Enter footer text..." />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center border-t border-border/30 pt-8">
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-foreground tracking-tight">Invoice Logo</h4>
                          <p className="text-[10px] text-muted-foreground font-medium">This logo will be printed on the top of physical and digital invoices.</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 bg-background border-2 border-dashed border-border rounded-lg flex items-center justify-center relative group hover:border-primary transition-colors">
                            <Plus className="w-6 h-6 text-muted-foreground/50 group-hover:text-primary/70" />
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                          </div>
                          <div className="text-[10px] text-muted-foreground font-medium italic">Max size 2MB. Format: PNG, JPG</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bill Payments */}
              {activeTab === 'payments' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: 'Bill Payment', desc: 'Enable customers to pay their bills directly through the app.', name: 'billPaymentEnabled', icon: CreditCard },
                      { label: 'Discount Coupons', desc: 'Allow customers to apply promo codes during checkout.', name: 'discountEnabled', icon: Tag },
                      { label: 'Convenience Fees', desc: 'Enable platform convenience charges for digital orders.', name: 'convenienceEnabled', icon: ShieldCheck },
                      { label: 'Digital Tips', desc: 'Allow customers to add tips for the staff or riders.', name: 'tipsEnabled', icon: DollarSign }
                    ].map(opt => (
                      <div key={opt.name} className={`p-4 rounded-lg border transition-all ${formData[opt.name] ? 'bg-card border-primary/20 shadow-md shadow-primary/10' : 'bg-background border-border/50 opacity-80'}`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-8 h-8 rounded-md flex items-center justify-center ${formData[opt.name] ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                            <opt.icon className="w-4 h-4" />
                          </div>
                          <button 
                            onClick={()=>handleToggle(opt.name)}
                            className={`w-14 h-7 rounded-full relative transition-all ${formData[opt.name] ? 'bg-primary' : 'bg-muted'}`}
                          >
                            <div className={`w-4 h-4 bg-card rounded-full absolute top-1 shadow-sm transition-all ${formData[opt.name] ? 'left-8' : 'left-1'}`} />
                          </button>
                        </div>
                        <h4 className="text-sm font-bold text-foreground mb-1">{opt.label}</h4>
                        <p className="text-[11px] text-muted-foreground font-medium leading-tight">{opt.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contacts */}
              {activeTab === 'contacts' && (
                <div className="space-y-6">
                  <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm p-4">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <Users className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground tracking-tight">Contact Information</h3>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">This number will be displayed on the customer app for order-related assistance and queries.</p>
                      </div>
                    </div>
                    <div className="space-y-6 max-w-xl">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Primary Contact Number</label>
                        <div className="relative">
                          <Smartphone className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
                          <input type="text" name="contactNumbers" value={formData.contactNumbers} onChange={handleChange} className="w-full bg-background border border-border/50 rounded-md pl-11 pr-4 py-3.5 text-sm font-bold text-foreground focus:bg-card focus:border-primary transition-all outline-none" />
                        </div>
                      </div>
                      <button className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary transition-colors">
                        <Plus className="w-4 h-4" />
                        Add Secondary Number
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Service Radius */}
              {activeTab === 'radius' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
                      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border/30">
                        <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center">
                          <Globe className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground tracking-tight">Geo Location</h3>
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Latitude</label>
                          <input type="text" name="latitude" value={formData.latitude} onChange={handleChange} className="w-full bg-background border border-border/50 rounded-md px-3 py-2 text-sm font-bold text-foreground focus:bg-card focus:border-primary transition-all outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Longitude</label>
                          <input type="text" name="longitude" value={formData.longitude} onChange={handleChange} className="w-full bg-background border border-border/50 rounded-md px-3 py-2 text-sm font-bold text-foreground focus:bg-card focus:border-primary transition-all outline-none" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
                      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border/30">
                        <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center">
                          <Layers className="w-4 h-4 text-primary" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground tracking-tight">Delivery Bounds</h3>
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Service Radius (KM)</label>
                          <div className="flex items-center gap-3">
                            <input type="number" name="radius" value={formData.radius} onChange={handleChange} className="flex-1 bg-background border border-border/50 rounded-md px-3 py-2 text-sm font-bold text-foreground focus:bg-card focus:border-primary transition-all outline-none" />
                            <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center text-[10px] font-black text-muted-foreground">KM</div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Serviceability Logic</label>
                          <div className="space-y-2">
                            {[
                              'Accept orders from customers in circle',
                              'Reject & Transfer to 3rd Party Delivery',
                              'Radius based on 3rd Party Delivery'
                            ].map(opt => (
                              <label key={opt} className={`flex items-center gap-3 p-3 rounded-md border transition-all cursor-pointer ${formData.serviceability === opt ? 'bg-primary/10 border-primary/30' : 'bg-card border-border/50 hover:border-border'}`}>
                                <input 
                                  type="radio" 
                                  className="w-4 h-4 text-primary focus:ring-primary border-border" 
                                  checked={formData.serviceability === opt} 
                                  onChange={() => setFormData(p => ({...p, serviceability: opt}))} 
                                />
                                <span className={`text-xs font-bold ${formData.serviceability === opt ? 'text-primary' : 'text-muted-foreground'}`}>{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preparation Time */}
              {activeTab === 'preparation' && (
                <div className="space-y-6">
                  <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-border/30 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-foreground tracking-tight">Kitchen Workflow</h3>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">Set standard preparation times and configure rush hour overrides.</p>
                      </div>
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Timer className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div className="p-4 space-y-6">
                      <div className="max-w-md space-y-3">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Base Prep Time (Minutes)</label>
                        <div className="flex items-center gap-4">
                          <input type="number" name="kitchenPrepTime" value={formData.kitchenPrepTime} onChange={handleChange} className="w-24 bg-background border border-border/50 rounded-md px-3 py-2 text-sm font-bold text-foreground outline-none" />
                          <span className="text-xs font-bold text-muted-foreground uppercase">Minutes / Order</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground font-medium italic leading-tight">This value is used to calculate estimated delivery time for customers.</p>
                      </div>

                      <div className="space-y-6 pt-6 border-t border-border/30">
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-foreground tracking-tight">Rush Hour Configuration</h4>
                          <p className="text-xs text-muted-foreground font-medium">Automatically increase prep time during peak hours.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="relative group">
                            <select name="rushHourOption" value={formData.rushHourOption} onChange={handleChange} className="w-full pl-4 pr-10 py-3 bg-background border border-border/50 rounded-md text-sm font-bold text-foreground outline-none appearance-none hover:border-primary transition-colors cursor-pointer">
                              <option>There is no rush hour</option>
                              <option>Add some rush hour on all days</option>
                              <option>Different rush hour on different days</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                          {formData.rushHourOption !== 'There is no rush hour' && (
                            <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                              <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border/50">
                                <div className="space-y-0.5">
                                  <span className="text-xs font-bold text-foreground">Lunch Peak</span>
                                  <p className="text-[10px] text-muted-foreground font-medium">12:30 PM - 03:00 PM</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-black text-primary">+10 min</span>
                                  <button className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                </div>
                              </div>
                              <button className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-md text-xs font-bold hover:bg-primary/20 transition-colors shadow-sm">
                                <Plus className="w-4 h-4" />
                                Add Rush Hour Slot
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Delivery Charge */}
              {activeTab === 'delivery' && (
                <div className="space-y-6">
                  <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-border/30 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-foreground tracking-tight">Delivery Fee Engine</h3>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">Set distance-based delivery charges and order value thresholds.</p>
                      </div>
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Truck className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div className="p-4 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Free Delivery Threshold</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">₹</span>
                            <input type="number" name="deliveryThreshold" value={formData.deliveryThreshold} onChange={handleChange} className="w-full bg-background border border-border/50 rounded-md pl-8 pr-4 py-3 text-sm font-bold text-foreground outline-none" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Fee Above Threshold</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">₹</span>
                            <input type="number" name="chargeAboveThreshold" value={formData.chargeAboveThreshold} onChange={handleChange} className="w-full bg-background border border-border/50 rounded-md pl-8 pr-4 py-3 text-sm font-bold text-foreground outline-none" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Fee Below Threshold</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">₹</span>
                            <input type="number" name="chargeBelowThreshold" value={formData.chargeBelowThreshold} onChange={handleChange} className="w-full bg-background border border-border/50 rounded-md pl-8 pr-4 py-3 text-sm font-bold text-foreground outline-none" />
                          </div>
                        </div>
                      </div>

                      <div className="pt-10 border-t border-border/30 space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-foreground tracking-tight">Distance-Based Delivery Fees</h4>
                            <p className="text-[11px] text-muted-foreground font-medium">Charge extra based on the distance from the outlet.</p>
                          </div>
                          <div className="flex bg-muted p-1 rounded-md">
                            <button onClick={() => setFormData(p=>({...p, distanceFeeEnabled: true}))} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${formData.distanceFeeEnabled ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-muted-foreground'}`}>Enable</button>
                            <button onClick={() => setFormData(p=>({...p, distanceFeeEnabled: false}))} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${!formData.distanceFeeEnabled ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-muted-foreground'}`}>Disable</button>
                          </div>
                        </div>

                        {formData.distanceFeeEnabled && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Base Distance (KM)</label>
                              <div className="flex items-center gap-3">
                                <input type="number" value={formData.normalRadius} onChange={(e) => setFormData(p=>({...p, normalRadius: e.target.value}))} className="flex-1 bg-background border border-border/50 rounded-md px-3 py-2 text-sm font-bold text-foreground outline-none" />
                                <div className="px-3 py-3 bg-muted rounded-md text-[10px] font-black text-muted-foreground">KM</div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Extra Charge per KM</label>
                              <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">₹</span>
                                <input type="number" value={formData.extraCharge} onChange={(e) => setFormData(p=>({...p, extraCharge: e.target.value}))} className="w-full bg-background border border-border/50 rounded-md pl-8 pr-4 py-3 text-sm font-bold text-foreground outline-none" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Currency */}
              {activeTab === 'currency' && (
                <div className="space-y-6">
                  <div className="bg-card rounded-lg border border-border p-4 shadow-sm max-w-2xl">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground tracking-tight">Store Currency</h3>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">Select the local currency used for processing payments and displaying prices.</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Store Currency</label>
                      <div className="relative">
                        <div 
                          onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                          className="flex items-center justify-between p-4 bg-background border border-border/50 rounded-lg cursor-pointer hover:border-primary transition-all shadow-sm group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-card rounded-md flex items-center justify-center font-black text-primary shadow-sm">{formData.currencySymbol}</div>
                            <div className="text-sm font-bold text-foreground">{formData.currencyName} ({formData.currencyCode})</div>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isCurrencyDropdownOpen ? 'rotate-180' : ''}`} />
                        </div>

                        {isCurrencyDropdownOpen && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-2xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-4 border-b border-border/30 bg-background/50">
                              <div className="relative">
                                <Plus className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 rotate-45" />
                                <input 
                                  type="text" 
                                  placeholder="Search currency..." 
                                  value={currencySearch}
                                  onChange={(e) => setCurrencySearch(e.target.value)}
                                  autoFocus
                                  className="w-full bg-card border border-border rounded-md pl-9 pr-4 py-2 text-sm font-bold text-foreground outline-none focus:border-primary transition-all"
                                />
                              </div>
                            </div>
                            <div className="max-h-60 overflow-y-auto p-2 scrollbar-hide">
                              {[
                                { symbol: '₹', code: 'INR', name: 'Indian Rupee' },
                                { symbol: '$', code: 'USD', name: 'US Dollar' },
                                { symbol: '£', code: 'GBP', name: 'British Pound' },
                                { symbol: '€', code: 'EUR', name: 'Euro' },
                                { symbol: '¥', code: 'JPY', name: 'Japanese Yen' },
                                { symbol: 'A$', code: 'AUD', name: 'Australian Dollar' },
                                { symbol: 'C$', code: 'CAD', name: 'Canadian Dollar' },
                                { symbol: 'S$', code: 'SGD', name: 'Singapore Dollar' },
                                { symbol: 'AED', code: 'AED', name: 'UAE Dirham' },
                                { symbol: 'SAR', code: 'SAR', name: 'Saudi Riyal' }
                              ].filter(c => 
                                c.name.toLowerCase().includes(currencySearch.toLowerCase()) || 
                                c.code.toLowerCase().includes(currencySearch.toLowerCase())
                              ).map(curr => (
                                <div 
                                  key={curr.code} 
                                  onClick={() => {
                                    setFormData(p => ({ ...p, currencySymbol: curr.symbol, currencyCode: curr.code, currencyName: curr.name }));
                                    setIsCurrencyDropdownOpen(false);
                                    setCurrencySearch('');
                                  }}
                                  className={`flex items-center justify-between p-3 rounded-md transition-all cursor-pointer hover:bg-primary/10 group ${formData.currencyCode === curr.code ? 'bg-primary/10/50' : ''}`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${formData.currencyCode === curr.code ? 'bg-card text-primary shadow-sm' : 'bg-muted text-muted-foreground group-hover:bg-card'}`}>
                                      {curr.symbol}
                                    </div>
                                    <div className="flex flex-col">
                                      <span className={`text-xs font-bold ${formData.currencyCode === curr.code ? 'text-primary-foreground' : 'text-foreground'}`}>{curr.name}</span>
                                      <span className="text-[10px] text-muted-foreground font-medium">{curr.code}</span>
                                    </div>
                                  </div>
                                  {formData.currencyCode === curr.code && <CheckCircle2 className="w-4 h-4 text-primary" />}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Timing */}
              {activeTab === 'timing' && (
                <div className="space-y-6">
                  <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-border/30 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-foreground tracking-tight">Store Operating Hours</h3>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">Configure the time slots when your store is open for business.</p>
                      </div>
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div className="p-4 space-y-6">
                      <div className="max-w-xl space-y-4">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Timing Mode</label>
                        <div className="relative">
                          <select name="orderTimingOption" value={formData.orderTimingOption} onChange={handleChange} className="w-full pl-4 pr-10 py-3.5 bg-background border border-border/50 rounded-md text-sm font-bold text-foreground outline-none appearance-none hover:border-primary transition-colors cursor-pointer">
                            <option>Same time for all days</option>
                            <option>Specific timing for each day</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-black text-muted-foreground uppercase tracking-widest">Active Slots</h4>
                          <button className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary transition-colors">
                            <Plus className="w-4 h-4" />
                            Add Slot
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-4 p-5 bg-primary/10/30 border border-primary/20 rounded-lg group transition-all">
                            <div className="flex-1 space-y-1">
                              <span className="text-[10px] font-black text-primary uppercase">Opening Time</span>
                              <input 
                                type="time" 
                                name="openingTime" 
                                value={formData.openingTime} 
                                onChange={handleChange}
                                className="w-full bg-transparent text-sm font-black text-foreground outline-none cursor-pointer"
                              />
                            </div>
                            <div className="w-px h-8 bg-primary/20" />
                            <div className="flex-1 space-y-1 text-right">
                              <span className="text-[10px] font-black text-primary uppercase">Closing Time</span>
                              <input 
                                type="time" 
                                name="closingTime" 
                                value={formData.closingTime} 
                                onChange={handleChange}
                                className="w-full bg-transparent text-sm font-black text-foreground outline-none text-right cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Rider Settings */}
              {activeTab === 'rider' && (
                <div className="space-y-6">
                  <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-border/30 flex items-center justify-between bg-background/30">
                      <div className="flex bg-card p-1 rounded-md shadow-sm border border-border/50">
                        <button 
                          onClick={() => setRiderTab('fleet')}
                          className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${riderTab === 'fleet' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:text-muted-foreground'}`}
                        >Fleet Service</button>
                        <button 
                          onClick={() => setRiderTab('auto')}
                          className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${riderTab === 'auto' ? 'bg-primary text-white shadow-md' : 'text-muted-foreground hover:text-muted-foreground'}`}
                        >Auto Assignment</button>
                      </div>
                    </div>
                    
                    <div className="p-4 space-y-6">
                      {riderTab === 'fleet' ? (
                        <>
                          <div className="flex items-center justify-between p-4 rounded-lg bg-primary text-white relative overflow-hidden shadow-xl shadow-primary/10">
                            <div className="relative z-10 flex items-center gap-4">
                              <div className="w-14 h-14 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                                <Bike className="w-8 h-8 text-white" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold tracking-tight mb-1">In-house Rider Fleet</h3>
                                <p className="text-primary-foreground/70 text-xs font-medium">Manage your own delivery team for localized fulfillment.</p>
                              </div>
                            </div>
                            <div className="relative z-10">
                              <button 
                                onClick={() => handleToggle('inHouseRiderEnabled')}
                                className={`w-14 h-7 rounded-full relative transition-all ${formData.inHouseRiderEnabled ? 'bg-white/30' : 'bg-white/10'}`}
                              >
                                <div className={`w-4 h-4 bg-card rounded-full absolute top-1 shadow-sm transition-all ${formData.inHouseRiderEnabled ? 'left-8' : 'left-1'}`} />
                              </button>
                            </div>
                          </div>

                          {formData.inHouseRiderEnabled && (
                            <div className="space-y-6 pt-4 animate-in slide-in-from-top-2 duration-300 border-t border-border/30">
                              <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Partner Integrations</h4>
                              <div className="grid grid-cols-1 gap-4">
                                {[
                                  { name: 'ELT riders', logo: 'ELT' },
                                  { name: 'Dunzo riders', logo: 'DZ' },
                                  { name: 'Wefast riders', logo: 'WF' }
                                ].map(rider => (
                                  <div key={rider.name} className="flex items-center justify-between p-5 rounded-lg border border-border/50 hover:border-primary/20 hover:bg-primary/10/20 transition-all duration-300">
                                    <div className="flex items-center gap-5">
                                      <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center font-black text-muted-foreground text-xs">{rider.logo}</div>
                                      <div>
                                        <h4 className="text-sm font-bold text-foreground">{rider.name}</h4>
                                        <p className="text-[11px] text-muted-foreground font-medium">External rider fleet API integration</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <button className="px-4 py-2 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 rounded-lg transition-colors">Configure</button>
                                      <div className="w-px h-4 bg-muted" />
                                      <button className="px-4 py-2 text-muted-foreground text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors">Connect</button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                          <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-emerald-100 rounded-md flex items-center justify-center">
                                <Timer className="w-6 h-6 text-emerald-600" />
                              </div>
                              <div>
                                <h3 className="text-sm font-bold text-foreground">Auto Assignment Engine</h3>
                                <p className="text-[11px] text-muted-foreground font-medium">Automatically dispatch orders to available riders.</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleToggle('autoAssignmentEnabled')}
                              className={`w-14 h-7 rounded-full relative transition-all ${formData.autoAssignmentEnabled ? 'bg-emerald-500' : 'bg-muted'}`}
                            >
                              <div className={`w-4 h-4 bg-card rounded-full absolute top-1 shadow-sm transition-all ${formData.autoAssignmentEnabled ? 'left-8' : 'left-1'}`} />
                            </button>
                          </div>

                          {formData.autoAssignmentEnabled && (
                            <div className="space-y-6 pt-4 border-t border-border/30">
                              <div className="space-y-4">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Assignment Strategy</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {['Nearest Rider First', 'Round Robin', 'Lowest Active Orders', 'Batching Mode'].map(strategy => (
                                    <label key={strategy} className={`flex items-center gap-3 p-4 rounded-md border transition-all cursor-pointer ${formData.autoAssignStrategy === strategy ? 'bg-emerald-50/50 border-emerald-200 shadow-sm' : 'bg-card border-border/50 hover:border-border'}`}>
                                      <input 
                                        type="radio" 
                                        name="autoAssignStrategy"
                                        checked={formData.autoAssignStrategy === strategy} 
                                        onChange={() => setFormData(p => ({...p, autoAssignStrategy: strategy}))} 
                                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-border" 
                                      />
                                      <span className={`text-sm font-bold ${formData.autoAssignStrategy === strategy ? 'text-emerald-700' : 'text-muted-foreground'}`}>{strategy}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Assign After (Minutes)</label>
                                  <input 
                                    type="number" 
                                    name="autoAssignDelay" 
                                    value={formData.autoAssignDelay} 
                                    onChange={handleChange} 
                                    className="w-full bg-background border border-border/50 rounded-md px-3 py-2 text-sm font-bold text-foreground outline-none focus:bg-card focus:border-emerald-300 transition-all" 
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Max Orders Per Rider</label>
                                  <input 
                                    type="number" 
                                    name="maxOrdersPerRider" 
                                    value={formData.maxOrdersPerRider} 
                                    onChange={handleChange} 
                                    className="w-full bg-background border border-border/50 rounded-md px-3 py-2 text-sm font-bold text-foreground outline-none focus:bg-card focus:border-emerald-300 transition-all" 
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Taxes */}
              {activeTab === 'taxes' && (
                <div className="space-y-6">
                  <div className="bg-card rounded-lg border border-border p-4 shadow-sm max-w-2xl">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center">
                        <ShieldCheck className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground tracking-tight">Tax Configuration</h3>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">Manage GST and other service tax settings for your outlet.</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-foreground">Do you charge Goods and Service Tax (GST)?</h4>
                        <div className="flex gap-4">
                          <button onClick={()=>setFormData(p=>({...p, taxEnabled: true}))} className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-lg border transition-all ${formData.taxEnabled ? 'bg-primary/10 border-primary/30 ring-4 ring-indigo-500/5' : 'bg-card border-border/50 hover:border-border'}`}>
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.taxEnabled ? 'border-primary' : 'border-border'}`}>
                              {formData.taxEnabled && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                            </div>
                            <span className={`text-sm font-bold ${formData.taxEnabled ? 'text-primary' : 'text-muted-foreground'}`}>Yes, I charge GST</span>
                          </button>
                          <button onClick={()=>setFormData(p=>({...p, taxEnabled: false}))} className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-lg border transition-all ${!formData.taxEnabled ? 'bg-primary/10 border-primary/30 ring-4 ring-indigo-500/5' : 'bg-card border-border/50 hover:border-border'}`}>
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${!formData.taxEnabled ? 'border-primary' : 'border-border'}`}>
                              {!formData.taxEnabled && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                            </div>
                            <span className={`text-sm font-bold ${!formData.taxEnabled ? 'text-primary' : 'text-muted-foreground'}`}>No, I don't</span>
                          </button>
                        </div>
                      </div>

                      {formData.taxEnabled && (
                        <div className="space-y-6 animate-in zoom-in-95 duration-300 pt-4 border-t border-border/30">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">GST Registration Number</label>
                            <input type="text" name="taxNumber" value={formData.taxNumber} onChange={handleChange} placeholder="e.g. 22AAAAA0000A1Z5" className="w-full bg-background border border-border/50 rounded-md px-3 py-2.5 text-sm font-bold text-foreground focus:bg-card focus:border-primary transition-all outline-none" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">CGST Rate (%)</label>
                              <div className="relative">
                                <input type="number" name="cgstRate" value={formData.cgstRate} onChange={handleChange} className="w-full bg-background border border-border/50 rounded-md px-3 py-2 text-sm font-bold text-foreground outline-none" />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">%</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">SGST Rate (%)</label>
                              <div className="relative">
                                <input type="number" name="sgstRate" value={formData.sgstRate} onChange={handleChange} className="w-full bg-background border border-border/50 rounded-md px-3 py-2 text-sm font-bold text-foreground outline-none" />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Food License */}
              {activeTab === 'foodLicense' && (
                <div className="space-y-6">
                  <div className="bg-card rounded-lg border border-border p-4 shadow-sm max-w-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center">
                          <ShieldCheck className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground tracking-tight">Compliance & Licenses</h3>
                          <p className="text-sm text-muted-foreground font-medium leading-relaxed">Enter your FSSAI or other local food safety license numbers.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleToggle('licenseEnabled')}
                        className={`w-14 h-7 rounded-full relative transition-all ${formData.licenseEnabled ? 'bg-primary' : 'bg-muted'}`}
                      >
                        <div className={`w-4 h-4 bg-card rounded-full absolute top-1 shadow-sm transition-all ${formData.licenseEnabled ? 'left-8' : 'left-1'}`} />
                      </button>
                    </div>
                    {formData.licenseEnabled && (
                      <div className="space-y-2 animate-in slide-in-from-top-2 duration-300 pt-4 border-t border-border/30">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">FSSAI License Number</label>
                        <input type="text" name="license" value={formData.license} onChange={handleChange} placeholder="Enter your 14-digit license number" className="w-full bg-background border border-border/50 rounded-md px-3 py-2.5 text-sm font-bold text-foreground focus:bg-card focus:border-primary transition-all outline-none" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Other Settings */}
              {activeTab === 'other' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: 'Auto Accept Orders', desc: 'Instantly accept incoming orders without manual intervention.', name: 'autoAccept', icon: CheckCircle2 },
                      { label: 'Best Seller Visibility', desc: 'Display a dedicated "Best Seller" category on the home screen.', name: 'bestSellerCategory', icon: Star },
                      { label: 'Offer Suggestions', desc: 'Show relevant offers to customers during item selection.', name: 'offerSuggestions', icon: Tag },
                      { label: 'Featured Section', desc: 'Enable the featured items section in category views.', name: 'featureSection', icon: Layout },
                      { label: 'WhatsApp Alerts', desc: 'Send automated order updates via WhatsApp to customers.', name: 'whatsappNotifications', icon: Bell },
                      { label: 'Auto-Cancel Inactive', desc: 'Cancel orders that aren\'t processed within the buffer time.', name: 'autoCancelOrders', icon: X },
                      { label: 'Loyalty Program', desc: 'Enable customers to earn points on every successful order.', name: 'loyaltyEnabled', icon: Star }
                    ].map(opt => (
                      <div key={opt.name} className="space-y-4">
                        <div className={`p-4 rounded-lg border transition-all ${formData[opt.name] ? 'bg-card border-primary/20 shadow-md shadow-primary/10' : 'bg-background border-border/50 opacity-80'}`}>
                          <div className="flex items-center justify-between mb-4">
                            <div className={`w-8 h-8 rounded-md flex items-center justify-center ${formData[opt.name] ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                              <opt.icon className="w-4 h-4" />
                            </div>
                            <button 
                              onClick={()=>handleToggle(opt.name)}
                              className={`w-14 h-7 rounded-full relative transition-all ${formData[opt.name] ? 'bg-primary' : 'bg-muted'}`}
                            >
                              <div className={`w-4 h-4 bg-card rounded-full absolute top-1 shadow-sm transition-all ${formData[opt.name] ? 'left-8' : 'left-1'}`} />
                            </button>
                          </div>
                          <h4 className="text-sm font-bold text-foreground mb-1">{opt.label}</h4>
                          <p className="text-[11px] text-muted-foreground font-medium leading-tight">{opt.desc}</p>
                        </div>
                        
                        {opt.name === 'autoCancelOrders' && formData.autoCancelOrders && (
                          <div className="bg-card rounded-lg border border-border p-4 animate-in slide-in-from-top-2 duration-300 space-y-4 shadow-sm">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Auto Cancel Buffer (Minutes)</label>
                              <input 
                                type="number" 
                                name="bufferTime" 
                                value={formData.bufferTime} 
                                onChange={handleChange}
                                className="w-full bg-background border border-border/50 rounded-md px-3 py-2 text-sm font-bold text-foreground outline-none focus:bg-card focus:border-primary transition-all"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-muted-foreground">Auto Refund on Cancel</span>
                              <button 
                                onClick={()=>handleToggle('autoRefund')}
                                className={`w-14 h-7 rounded-full relative transition-all ${formData.autoRefund ? 'bg-primary' : 'bg-muted'}`}
                              >
                                <div className={`w-4 h-4 bg-card rounded-full absolute top-1 shadow-sm transition-all ${formData.autoRefund ? 'left-8' : 'left-1'}`} />
                              </button>
                            </div>
                          </div>
                        )}

                        {opt.name === 'loyaltyEnabled' && formData.loyaltyEnabled && (
                          <div className="bg-card rounded-lg border border-border p-4 animate-in slide-in-from-top-2 duration-300 space-y-4 shadow-sm">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Points per Rupee (₹1 = ? Points)</label>
                              <input 
                                type="number" 
                                name="loyaltyPointsPerRupee" 
                                value={formData.loyaltyPointsPerRupee} 
                                onChange={handleChange}
                                className="w-full bg-background border border-border/50 rounded-md px-3 py-2 text-sm font-bold text-foreground outline-none focus:bg-card focus:border-primary transition-all"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Other Charges */}
              {activeTab === 'charges' && (
                <div className="space-y-6">
                  <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-border/30 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-foreground tracking-tight">Additional Fees</h3>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">Configure packaging, convenience, and service charges for different modes.</p>
                      </div>
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { label: 'Packaging Charges', name: 'packagingEnabled', desc: 'Enable to charge for container and bag costs.' },
                        { label: 'Convenience Fees', name: 'convenienceEnabled', desc: 'Apply a flat fee for digital ordering convenience.' }
                      ].map(charge => (
                        <label key={charge.name} className={`flex items-start gap-4 p-5 rounded-lg border transition-all cursor-pointer ${formData[charge.name] ? 'bg-primary/10/50 border-primary/30 shadow-sm' : 'bg-background/50 border-border/50 hover:border-border'}`}>
                          <div className="pt-1">
                            <input 
                              type="checkbox" 
                              checked={formData[charge.name]} 
                              onChange={() => handleToggle(charge.name)}
                              className="w-4 h-4 rounded border-border text-primary focus:ring-primary" 
                            />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-foreground block mb-0.5">{charge.label}</span>
                            <span className="text-[11px] text-muted-foreground font-medium leading-tight">{charge.desc}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Third Party POS */}
              {activeTab === 'pos' && (
                <div className="space-y-6">
                  <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-border/30 flex items-center justify-between bg-[#253966]/5">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 bg-[#253966] p-2 rounded-md flex items-center justify-center shadow-lg">
                          <img src="https://www.petpooja.com/assets/images/pp-logo.png" className="w-full h-full object-contain filter brightness-0 invert" alt="Petpooja" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-foreground tracking-tight">Petpooja Integration</h3>
                          <p className="text-sm text-muted-foreground font-medium">Sync your menu and orders directly with Petpooja POS.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleToggle('petpoojaEnabled')}
                        className={`w-14 h-7 rounded-full relative transition-all ${formData.petpoojaEnabled ? 'bg-primary' : 'bg-muted'}`}
                      >
                        <div className={`w-4 h-4 bg-card rounded-full absolute top-1 shadow-sm transition-all ${formData.petpoojaEnabled ? 'left-8' : 'left-1'}`} />
                      </button>
                    </div>
                    {formData.petpoojaEnabled && (
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                        {[
                          { label: 'App Key', name: 'petpoojaAppKey' },
                          { label: 'App Secret', name: 'petpoojaAppSecret' },
                          { label: 'Access Token', name: 'petpoojaAccessToken' },
                          { label: 'Restaurant ID', name: 'petpoojaRestaurantId' }
                        ].map(field => (
                          <div key={field.name} className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{field.label}</label>
                            <input type="text" name={field.name} value={formData[field.name]} onChange={handleChange} className="w-full bg-background border border-border/50 rounded-md px-3 py-2 text-sm font-bold text-foreground focus:bg-card focus:border-primary transition-all outline-none" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-card rounded-lg border border-border p-4 shadow-sm flex items-center justify-between opacity-60 grayscale">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 bg-foreground rounded-md flex items-center justify-center font-black text-background text-[10px] tracking-tighter">BILLBERRY</div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground tracking-tight">Bill Berry Integration</h3>
                        <p className="text-sm text-muted-foreground font-medium">Connect with Bill Berry POS system.</p>
                      </div>
                    </div>
                    <button className="px-4 py-2.5 bg-muted text-muted-foreground rounded-md text-xs font-black uppercase tracking-widest cursor-not-allowed">Connect</button>
                  </div>
                </div>
              )}

              {/* COD Limit */}
              {activeTab === 'cod' && (
                <div className="space-y-6">
                  <div className="bg-card rounded-lg border border-border p-4 shadow-sm max-w-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground tracking-tight">Cash on Delivery Limits</h3>
                          <p className="text-sm text-muted-foreground font-medium leading-relaxed">Set the maximum order value allowed for cash payments.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleToggle('codLimitEnabled')}
                        className={`w-14 h-7 rounded-full relative transition-all ${formData.codLimitEnabled ? 'bg-primary' : 'bg-muted'}`}
                      >
                        <div className={`w-4 h-4 bg-card rounded-full absolute top-1 shadow-sm transition-all ${formData.codLimitEnabled ? 'left-8' : 'left-1'}`} />
                      </button>
                    </div>
                    {formData.codLimitEnabled && (
                      <div className="space-y-6 animate-in slide-in-from-top-2 duration-300 pt-4 border-t border-border/30">
                        {[
                          { label: 'Delivery COD Limit', desc: 'Max amount for home delivery', name: 'deliveryCodLimit' },
                          { label: 'Takeaway COD Limit', desc: 'Max amount for pickup orders', name: 'takeawayCodLimit' }
                        ].map(limit => (
                          <div key={limit.label} className="flex items-center justify-between p-4 bg-background rounded-lg border border-border/50">
                            <div className="space-y-0.5">
                              <span className="text-sm font-bold text-foreground">{limit.label}</span>
                              <p className="text-[10px] text-muted-foreground font-medium">{limit.desc}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-black text-muted-foreground">₹</span>
                              <input 
                                type="number" 
                                name={limit.name} 
                                value={formData[limit.name] || 0} 
                                onChange={handleChange}
                                className="w-24 bg-card border border-border rounded-md px-4 py-2 text-sm font-black text-primary outline-none focus:border-primary transition-all" 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* MOV Limit */}
              {activeTab === 'mov' && (
                <div className="space-y-6">
                  <div className="bg-card rounded-lg border border-border p-4 shadow-sm max-w-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center">
                          <ListOrdered className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground tracking-tight">Minimum Order Value (MOV)</h3>
                          <p className="text-sm text-muted-foreground font-medium leading-relaxed">Set the minimum cart value required to place an order.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleToggle('movLimitEnabled')}
                        className={`w-14 h-7 rounded-full relative transition-all ${formData.movLimitEnabled ? 'bg-primary' : 'bg-muted'}`}
                      >
                        <div className={`w-4 h-4 bg-card rounded-full absolute top-1 shadow-sm transition-all ${formData.movLimitEnabled ? 'left-8' : 'left-1'}`} />
                      </button>
                    </div>
                    {formData.movLimitEnabled && (
                      <div className="space-y-6 animate-in slide-in-from-top-2 duration-300 pt-4 border-t border-border/30">
                        {[
                          { label: 'Delivery MOV', desc: 'Minimum value for delivery', name: 'deliveryMov' },
                          { label: 'Takeaway MOV', desc: 'Minimum value for takeaway', name: 'takeawayMov' }
                        ].map(limit => (
                          <div key={limit.label} className="flex items-center justify-between p-4 bg-background rounded-lg border border-border/50">
                            <div className="space-y-0.5">
                              <span className="text-sm font-bold text-foreground">{limit.label}</span>
                              <p className="text-[10px] text-muted-foreground font-medium">{limit.desc}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-black text-muted-foreground">₹</span>
                              <input 
                                type="number" 
                                name={limit.name} 
                                value={formData[limit.name] || 0} 
                                onChange={handleChange}
                                className="w-24 bg-card border border-border rounded-md px-4 py-2 text-sm font-black text-primary outline-none focus:border-primary transition-all" 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* COD Enablement */}
              {activeTab === 'enablement' && (
                <div className="space-y-6">
                  <div className="bg-card rounded-lg border border-border p-4 shadow-sm max-w-2xl">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground tracking-tight">Cash Payment Enablement</h3>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">Select which ordering modes allow cash payments.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { label: 'Cash for Takeaway', name: 'cashTakeaway' },
                        { label: 'Cash for Delivery', name: 'cashDelivery' },
                        { label: 'Cash for Dine-in', name: 'cashGo' },
                        { label: 'Cash for Self Serve', name: 'cashSelfServe' }
                      ].map(opt => (
                        <div key={opt.label} className="flex items-center justify-between p-4 bg-background rounded-lg border border-border/50 hover:border-primary/40 transition-colors group">
                          <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground">{opt.label}</span>
                          <button 
                            onClick={() => handleToggle(opt.name)}
                            className={`w-14 h-7 rounded-full relative transition-all ${formData[opt.name] ? 'bg-primary' : 'bg-muted'}`}
                          >
                            <div className={`w-4 h-4 bg-card rounded-full absolute top-1 shadow-sm transition-all ${formData[opt.name] ? 'left-8' : 'left-1'}`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Floating Save/Discard Bar */}
          <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 z-50 transition-all duration-500 transform ${hasChanges ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
            <div className="bg-card text-foreground p-3 rounded-lg shadow-2xl flex items-center justify-between gap-4 border border-border backdrop-blur-md">
              <div className="flex items-center gap-3 pl-2">
                <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center animate-pulse">
                  <AlertCircle className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-[13px] font-semibold tracking-tight">Unsaved changes</h4>
                  <p className="text-[11px] text-muted-foreground font-medium leading-tight">Review and apply your settings.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDiscard}
                  className="px-3 py-1.5 text-[13px] font-medium text-muted-foreground hover:bg-muted rounded-md transition-colors"
                >
                  Discard
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 h-8 bg-primary text-primary-foreground text-[13px] font-medium rounded-md hover:bg-primary/90 transition-all flex items-center gap-2"
                >
                  <Save size={14} /> Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
