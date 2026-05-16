import { useState } from 'react';
import { 
  Settings, Save, X, Store, Clock, ShoppingBag, Truck, DollarSign, 
  CreditCard, Monitor, Tag, Table2, ChevronDown, CheckCircle2, 
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

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialData);

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
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden font-sans">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 md:py-5 shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 z-30">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-9 h-9 md:w-10 md:h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold text-slate-900 tracking-tight">Store Settings</h1>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">Manage your outlet preferences and configurations</p>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-6 w-full sm:w-auto">
          <div className="flex items-center gap-2 md:gap-3 flex-1 sm:flex-initial">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hidden md:inline">Active Outlet</span>
            <div className="relative group flex-1 sm:flex-initial">
              <div className="flex items-center gap-2 md:gap-3 bg-slate-50 border border-slate-200 pl-3 md:pl-4 pr-8 md:pr-10 py-2 md:py-2.5 rounded-xl md:rounded-2xl cursor-pointer hover:border-indigo-300 transition-all shadow-sm group-hover:shadow-indigo-100/50">
                <Store className="w-4 h-4 text-indigo-500" />
                <select 
                  value={selectedOutlet}
                  onChange={(e) => setSelectedOutlet(e.target.value)}
                  className="bg-transparent text-sm font-black text-slate-700 outline-none appearance-none cursor-pointer pr-2 w-full"
                >
                  {OUTLETS.map(outlet => (
                    <option key={outlet.id} value={outlet.id}>{outlet.name}</option>
                  ))}
                </select>
                <div className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-indigo-500 transition-colors">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Navigation Sidebar — desktop: vertical sidebar, mobile: horizontal scroll */}
        <div className="md:w-72 bg-white md:border-r border-b md:border-b-0 border-slate-200 overflow-x-auto md:overflow-y-auto shrink-0 md:py-6 scrollbar-hide">
          <div className="px-4 md:px-6 mb-2 md:mb-4 hidden md:block">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Configuration</label>
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
              className={`flex items-center gap-2 md:gap-3 px-3 md:px-6 py-2.5 md:py-3.5 transition-all text-left relative group whitespace-nowrap md:whitespace-normal md:w-full shrink-0 md:shrink rounded-lg md:rounded-none ${
                activeCategory === category.id 
                  ? 'text-indigo-600 bg-indigo-50 md:bg-transparent' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 transition-all hidden md:block ${activeCategory === category.id ? 'opacity-100' : 'opacity-0'}`} />
              <div className={`p-1.5 md:p-2 rounded-lg transition-colors ${activeCategory === category.id ? 'bg-indigo-50' : 'bg-transparent group-hover:bg-slate-50'}`}>
                <category.icon className={`w-4 h-4 shrink-0 ${activeCategory === category.id ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
              </div>
              <div className="flex flex-col">
                <span className={`text-xs md:text-sm font-bold tracking-tight ${activeCategory === category.id ? 'text-indigo-600' : 'text-slate-600'}`}>{category.label}</span>
                <span className="text-[10px] text-slate-400 font-medium truncate w-40 hidden md:block">{category.desc}</span>
              </div>
            </button>
          ))
          }
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-[#F8FAFC] relative">
          <div className="max-w-4xl mx-auto p-4 md:p-6 pb-32">
            
            {/* Tab Header & Sub-navigation */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">{CATEGORIES.find(c => c.id === activeCategory)?.label}</h2>
                  <p className="text-sm text-slate-500 font-medium">{CATEGORIES.find(c => c.id === activeCategory)?.desc}</p>
                </div>
                {activeTab === 'ordering' && (
                  <div className="flex gap-3">
                    <button 
                      onClick={() => { setModalType('modes'); setIsModalOpen(true); }}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
                    >Enable/Disable Modes</button>
                    <button 
                      onClick={() => { setModalType('sequence'); setIsModalOpen(true); }}
                      className="px-4 py-2 bg-indigo-600 rounded-xl text-xs font-bold text-white hover:bg-indigo-700 transition-colors shadow-indigo-100 shadow-lg"
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
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${
                      activeTab === tab.id
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 shadow-sm'
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
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">
                        {modalType === 'modes' ? 'Enable/Disable Ordering Modes' : 'Modify Ordering Sequence'}
                      </h3>
                      <p className="text-sm text-slate-500 font-medium">
                        {modalType === 'modes' ? 'Select which modes should be available across your store.' : 'Drag and drop to reorder the sequence of modes.'}
                      </p>
                    </div>
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-6 max-h-[60vh] overflow-y-auto">
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
                          <div key={m.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 transition-all">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                <m.icon className="w-5 h-5 text-indigo-600" />
                              </div>
                              <span className="text-sm font-bold text-slate-700">{m.label}</span>
                            </div>
                            <button 
                              onClick={() => handleToggle(m.id)}
                              className={`w-14 h-7 rounded-full relative transition-all ${formData[m.id] ? 'bg-indigo-600' : 'bg-slate-300'}`}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow-sm transition-all ${formData[m.id] ? 'left-8' : 'left-1'}`} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {['Dine-in', 'Takeaway', 'Home Delivery', 'Drive-thru', 'QR Order'].map((m, i) => (
                          <div key={m} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-sm cursor-move hover:border-indigo-300 transition-all">
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-400 text-xs">{i + 1}</div>
                              <span className="text-sm font-bold text-slate-700">{m}</span>
                            </div>
                            <ListOrdered className="w-4 h-4 text-slate-300" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
                    >Cancel</button>
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="px-8 py-2.5 bg-indigo-600 rounded-xl text-sm font-bold text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
                    >Save Changes</button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              
              {/* Ordering Mode */}
              {activeTab === 'ordering' && (
                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-50">
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Visibility Control</h3>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">Choose which ordering modes are available for your customers at this outlet.</p>
                      </div>
                      <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                        Live on Store
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { label: 'Home Delivery', name: 'deliveryEnabled', icon: Truck, color: 'text-blue-500', bg: 'bg-blue-50' },
                        { label: 'Takeaway', name: 'takeawayEnabled', icon: ShoppingBag, color: 'text-orange-500', bg: 'bg-orange-50' },
                        { label: 'Dine-in', name: 'dineInEnabled', icon: Utensils, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                        { label: 'Drive-thru', name: 'driveThruEnabled', icon: Bike, color: 'text-purple-500', bg: 'bg-purple-50' },
                        { label: 'QR Ordering', name: 'qrOrderingEnabled', icon: Smartphone, color: 'text-indigo-500', bg: 'bg-indigo-50' },
                        { label: 'Scheduled', name: 'scheduledOrdersEnabled', icon: Clock, color: 'text-pink-500', bg: 'bg-pink-50' }
                      ].map(mode => (
                        <div key={mode.label} className={`relative p-6 rounded-2xl border transition-all duration-300 ${formData[mode.name] ? 'bg-white border-indigo-100 shadow-md shadow-indigo-50/50' : 'bg-slate-50 border-slate-100'}`}>
                          <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 ${mode.bg} rounded-xl flex items-center justify-center`}>
                              <mode.icon className={`w-5 h-5 ${mode.color}`} />
                            </div>
                            <button 
                              onClick={() => handleToggle(mode.name)}
                              className={`w-14 h-7 rounded-full relative transition-all duration-300 ${formData[mode.name] ? 'bg-indigo-600' : 'bg-slate-300'}`}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow-sm transition-all duration-300 ${formData[mode.name] ? 'left-8' : 'left-1'}`} />
                            </button>
                          </div>
                          <div>
                            <span className="text-sm font-bold text-slate-800 block">{mode.label}</span>
                            <span className="text-[10px] text-slate-400 font-medium leading-tight">Click to {formData[mode.name] ? 'disable' : 'enable'} this mode for customers.</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-indigo-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl shadow-indigo-900/20">
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-indigo-500/30 rounded-lg flex items-center justify-center">
                          <Info className="w-4 h-4 text-indigo-200" />
                        </div>
                        <h4 className="text-sm font-bold tracking-tight">Need custom ordering flows?</h4>
                      </div>
                      <p className="text-indigo-100/80 text-xs font-medium leading-relaxed max-w-lg mb-6">
                        You can configure specialized ordering sequences and priority rules for different delivery partners and aggregator platforms in the Advanced Sequence settings.
                      </p>
                      <button 
                        onClick={() => { setModalType('sequence'); setIsModalOpen(true); }}
                        className="bg-white text-indigo-900 px-5 py-2 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-colors shadow-lg"
                      >Open Advanced Settings</button>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
                      <Layers className="w-48 h-48" />
                    </div>
                  </div>

                  {/* Mode Specific Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formData.deliveryEnabled && (
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-in slide-in-from-left-4 duration-500">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                            <Truck className="w-5 h-5 text-blue-500" />
                          </div>
                          <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Delivery Settings</h4>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Min. Order Value</label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                              <input type="number" name="deliveryMinAmount" value={formData.deliveryMinAmount} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-8 pr-4 py-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-300 transition-all" />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivery Radius (KM)</label>
                            <input type="number" name="deliveryRadius" value={formData.deliveryRadius} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-300 transition-all" />
                          </div>
                        </div>
                      </div>
                    )}

                    {formData.takeawayEnabled && (
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-in slide-in-from-right-4 duration-500">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-orange-500" />
                          </div>
                          <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Takeaway Settings</h4>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Default Prep Time (Mins)</label>
                            <input type="number" name="takeawayPrepTime" value={formData.takeawayPrepTime} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-orange-300 transition-all" />
                          </div>
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-xs font-bold text-slate-600">Allow Scheduled Pickup</span>
                            <button className="w-14 h-7 bg-indigo-600 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute top-1 left-8" /></button>
                          </div>
                        </div>
                      </div>
                    )}

                    {formData.dineInEnabled && (
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm animate-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                            <Utensils className="w-5 h-5 text-emerald-500" />
                          </div>
                          <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Dine-in Settings</h4>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-xs font-bold text-slate-600">Table Number Required</span>
                            <button 
                              onClick={() => handleToggle('dineInTableRequired')}
                              className={`w-14 h-7 rounded-full relative transition-all ${formData.dineInTableRequired ? 'bg-indigo-600' : 'bg-slate-300'}`}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow-sm transition-all ${formData.dineInTableRequired ? 'left-8' : 'left-1'}`} />
                            </button>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Charge (%)</label>
                            <div className="relative">
                              <input type="number" name="dineInServiceCharge" value={formData.dineInServiceCharge} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-emerald-300 transition-all" />
                              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">%</span>
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
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-50">
                      <h3 className="text-lg font-bold text-slate-800 tracking-tight">App Interface Layout</h3>
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">Configure how categories and items are displayed on your customer's mobile app.</p>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50/30">
                      {[
                        { label: 'Category View', name: 'categoryView', options: ['Overlay View', 'Grid View', 'List View'], icon: Layout },
                        { label: 'Best Seller View', name: 'bestSellerView', options: ['Small Card', 'Large Card', 'Horizontal'], icon: Star },
                        { label: 'Featured Item View', name: 'featuredItemView', options: ['List', 'Grid', 'Carousel'], icon: Tag }
                      ].map(field => (
                        <div key={field.name} className="space-y-3">
                          <div className="flex items-center gap-2 mb-1">
                            <field.icon className="w-3.5 h-3.5 text-indigo-500" />
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{field.label}</label>
                          </div>
                          <div className="relative group">
                            <select 
                              name={field.name} 
                              value={formData[field.name]} 
                              onChange={handleChange} 
                              className="w-full pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none appearance-none hover:border-indigo-300 transition-colors shadow-sm cursor-pointer"
                            >
                              {field.options.map(opt => <option key={opt}>{opt}</option>)}
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-indigo-500 transition-colors" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-50">
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Home Screen Sections</h3>
                        <p className="text-sm text-slate-500 font-medium">Manage the order and item count for each section on the home screen.</p>
                      </div>
                      <button className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors">
                        <Plus className="w-4 h-4" />
                        Add New Row
                      </button>
                    </div>

                    <div className="space-y-4">
                      {formData.rows.map((row, index) => (
                        <div key={row.id} className="group flex items-center gap-6 p-6 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all duration-300">
                          <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-sm font-black text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-colors shadow-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1 space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Section Row {row.id}</label>
                            <div className="flex items-center gap-4">
                              <div className="text-sm font-bold text-slate-700">Display Count</div>
                              <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                                <button 
                                  onClick={() => {
                                    const newRows = [...formData.rows];
                                    newRows[index].count = Math.max(1, newRows[index].count - 1);
                                    setFormData(prev => ({ ...prev, rows: newRows }));
                                  }}
                                  className="px-3 py-1 hover:bg-slate-50 text-slate-400 hover:text-indigo-600 transition-colors border-r border-slate-100"
                                >-</button>
                                <input 
                                  type="number" 
                                  value={row.count} 
                                  onChange={(e) => {
                                    const newRows = [...formData.rows];
                                    newRows[index].count = parseInt(e.target.value) || 0;
                                    setFormData(prev => ({ ...prev, rows: newRows }));
                                  }}
                                  className="w-12 text-center text-sm font-bold text-indigo-600 outline-none bg-transparent" 
                                />
                                <button 
                                  onClick={() => {
                                    const newRows = [...formData.rows];
                                    newRows[index].count = newRows[index].count + 1;
                                    setFormData(prev => ({ ...prev, rows: newRows }));
                                  }}
                                  className="px-3 py-1 hover:bg-slate-50 text-slate-400 hover:text-indigo-600 transition-colors border-l border-slate-100"
                                >+</button>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2.5 bg-white text-slate-400 hover:text-indigo-600 rounded-xl border border-slate-200 hover:border-indigo-200 shadow-sm transition-all">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2.5 bg-white text-slate-400 hover:text-red-600 rounded-xl border border-slate-200 hover:border-red-200 shadow-sm transition-all">
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
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Outlet Location</h3>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">This address will be visible to your customers. Ensure it is accurate for better serviceability.</p>
                      </div>
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-indigo-600" />
                      </div>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Address Line 1</label>
                          <input 
                            type="text" 
                            name="addressLine1" 
                            value={formData.addressLine1} 
                            onChange={handleChange} 
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none" 
                            placeholder="Building, Street name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Address Line 2</label>
                          <input 
                            type="text" 
                            name="addressLine2" 
                            value={formData.addressLine2} 
                            onChange={handleChange} 
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none" 
                            placeholder="Locality, Landmark"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">City</label>
                          <input 
                            type="text" 
                            name="city" 
                            value={formData.city} 
                            onChange={handleChange} 
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">State</label>
                          <input 
                            type="text" 
                            name="state" 
                            value={formData.state} 
                            onChange={handleChange} 
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Country</label>
                          <input 
                            type="text" 
                            name="country" 
                            value={formData.country} 
                            onChange={handleChange} 
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:bg-white focus:border-indigo-300 transition-all outline-none" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 flex items-start gap-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
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
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Invoice Configuration</h3>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">Customize your bill headers and footers that customers see on their invoices.</p>
                      </div>
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                        <Receipt className="w-6 h-6 text-indigo-600" />
                      </div>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Legal Entity Name</label>
                        <input type="text" name="legalName" value={formData.legalName} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bill Header</label>
                          <textarea name="billHeader" value={formData.billHeader} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:bg-white focus:border-indigo-300 transition-all outline-none min-h-[120px] resize-none" placeholder="Enter header text..." />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bill Footer</label>
                          <textarea name="billFooter" value={formData.billFooter} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:bg-white focus:border-indigo-300 transition-all outline-none min-h-[120px] resize-none" placeholder="Enter footer text..." />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center border-t border-slate-50 pt-8">
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-slate-800 tracking-tight">Invoice Logo</h4>
                          <p className="text-[10px] text-slate-500 font-medium">This logo will be printed on the top of physical and digital invoices.</p>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="w-20 h-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center relative group hover:border-indigo-300 transition-colors">
                            <Plus className="w-6 h-6 text-slate-300 group-hover:text-indigo-400" />
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium italic">Max size 2MB. Format: PNG, JPG</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bill Payments */}
              {activeTab === 'payments' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: 'Bill Payment', desc: 'Enable customers to pay their bills directly through the app.', name: 'billPaymentEnabled', icon: CreditCard },
                      { label: 'Discount Coupons', desc: 'Allow customers to apply promo codes during checkout.', name: 'discountEnabled', icon: Tag },
                      { label: 'Convenience Fees', desc: 'Enable platform convenience charges for digital orders.', name: 'convenienceEnabled', icon: ShieldCheck },
                      { label: 'Digital Tips', desc: 'Allow customers to add tips for the staff or riders.', name: 'tipsEnabled', icon: DollarSign }
                    ].map(opt => (
                      <div key={opt.name} className={`p-6 rounded-2xl border transition-all ${formData[opt.name] ? 'bg-white border-indigo-100 shadow-md shadow-indigo-50/50' : 'bg-slate-50 border-slate-100 opacity-80'}`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData[opt.name] ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-400'}`}>
                            <opt.icon className="w-5 h-5" />
                          </div>
                          <button 
                            onClick={()=>handleToggle(opt.name)}
                            className={`w-14 h-7 rounded-full relative transition-all ${formData[opt.name] ? 'bg-indigo-600' : 'bg-slate-300'}`}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow-sm transition-all ${formData[opt.name] ? 'left-8' : 'left-1'}`} />
                          </button>
                        </div>
                        <h4 className="text-sm font-bold text-slate-800 mb-1">{opt.label}</h4>
                        <p className="text-[11px] text-slate-500 font-medium leading-tight">{opt.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contacts */}
              {activeTab === 'contacts' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm p-6">
                    <div className="flex items-start gap-6 mb-6">
                      <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0">
                        <Users className="w-7 h-7 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 tracking-tight">Contact Information</h3>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">This number will be displayed on the customer app for order-related assistance and queries.</p>
                      </div>
                    </div>
                    <div className="space-y-6 max-w-xl">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Contact Number</label>
                        <div className="relative">
                          <Smartphone className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                          <input type="text" name="contactNumbers" value={formData.contactNumbers} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-11 pr-4 py-3.5 text-sm font-bold text-slate-700 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                        </div>
                      </div>
                      <button className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-50">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                          <Globe className="w-5 h-5 text-indigo-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Geo Location</h3>
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Latitude</label>
                          <input type="text" name="latitude" value={formData.latitude} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Longitude</label>
                          <input type="text" name="longitude" value={formData.longitude} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-50">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                          <Layers className="w-5 h-5 text-indigo-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Delivery Bounds</h3>
                      </div>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Radius (KM)</label>
                          <div className="flex items-center gap-3">
                            <input type="number" name="radius" value={formData.radius} onChange={handleChange} className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-[10px] font-black text-slate-400">KM</div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Serviceability Logic</label>
                          <div className="space-y-2">
                            {[
                              'Accept orders from customers in circle',
                              'Reject & Transfer to 3rd Party Delivery',
                              'Radius based on 3rd Party Delivery'
                            ].map(opt => (
                              <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${formData.serviceability === opt ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
                                <input 
                                  type="radio" 
                                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300" 
                                  checked={formData.serviceability === opt} 
                                  onChange={() => setFormData(p => ({...p, serviceability: opt}))} 
                                />
                                <span className={`text-xs font-bold ${formData.serviceability === opt ? 'text-indigo-700' : 'text-slate-600'}`}>{opt}</span>
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
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Kitchen Workflow</h3>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">Set standard preparation times and configure rush hour overrides.</p>
                      </div>
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                        <Timer className="w-6 h-6 text-indigo-600" />
                      </div>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="max-w-md space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Prep Time (Minutes)</label>
                        <div className="flex items-center gap-4">
                          <input type="number" name="kitchenPrepTime" value={formData.kitchenPrepTime} onChange={handleChange} className="w-24 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none" />
                          <span className="text-xs font-bold text-slate-400 uppercase">Minutes / Order</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium italic leading-tight">This value is used to calculate estimated delivery time for customers.</p>
                      </div>

                      <div className="space-y-6 pt-6 border-t border-slate-50">
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-slate-800 tracking-tight">Rush Hour Configuration</h4>
                          <p className="text-xs text-slate-500 font-medium">Automatically increase prep time during peak hours.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="relative group">
                            <select name="rushHourOption" value={formData.rushHourOption} onChange={handleChange} className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none appearance-none hover:border-indigo-300 transition-colors cursor-pointer">
                              <option>There is no rush hour</option>
                              <option>Add some rush hour on all days</option>
                              <option>Different rush hour on different days</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                          {formData.rushHourOption !== 'There is no rush hour' && (
                            <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="space-y-0.5">
                                  <span className="text-xs font-bold text-slate-800">Lunch Peak</span>
                                  <p className="text-[10px] text-slate-400 font-medium">12:30 PM - 03:00 PM</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-black text-indigo-600">+10 min</span>
                                  <button className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                </div>
                              </div>
                              <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors shadow-sm">
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
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Delivery Fee Engine</h3>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">Set distance-based delivery charges and order value thresholds.</p>
                      </div>
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                        <Truck className="w-6 h-6 text-indigo-600" />
                      </div>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Free Delivery Threshold</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                            <input type="number" name="deliveryThreshold" value={formData.deliveryThreshold} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-8 pr-4 py-3 text-sm font-bold text-slate-700 outline-none" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fee Above Threshold</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                            <input type="number" name="chargeAboveThreshold" value={formData.chargeAboveThreshold} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-8 pr-4 py-3 text-sm font-bold text-slate-700 outline-none" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fee Below Threshold</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                            <input type="number" name="chargeBelowThreshold" value={formData.chargeBelowThreshold} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-8 pr-4 py-3 text-sm font-bold text-slate-700 outline-none" />
                          </div>
                        </div>
                      </div>

                      <div className="pt-10 border-t border-slate-50 space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-slate-800 tracking-tight">Distance-Based Delivery Fees</h4>
                            <p className="text-[11px] text-slate-500 font-medium">Charge extra based on the distance from the outlet.</p>
                          </div>
                          <div className="flex bg-slate-100 p-1 rounded-xl">
                            <button onClick={() => setFormData(p=>({...p, distanceFeeEnabled: true}))} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${formData.distanceFeeEnabled ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Enable</button>
                            <button onClick={() => setFormData(p=>({...p, distanceFeeEnabled: false}))} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${!formData.distanceFeeEnabled ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Disable</button>
                          </div>
                        </div>

                        {formData.distanceFeeEnabled && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Distance (KM)</label>
                              <div className="flex items-center gap-3">
                                <input type="number" value={formData.normalRadius} onChange={(e) => setFormData(p=>({...p, normalRadius: e.target.value}))} className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none" />
                                <div className="px-3 py-3 bg-slate-100 rounded-xl text-[10px] font-black text-slate-400">KM</div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Extra Charge per KM</label>
                              <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                                <input type="number" value={formData.extraCharge} onChange={(e) => setFormData(p=>({...p, extraCharge: e.target.value}))} className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-8 pr-4 py-3 text-sm font-bold text-slate-700 outline-none" />
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
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-2xl">
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
                        <DollarSign className="w-7 h-7 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 tracking-tight">Store Currency</h3>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">Select the local currency used for processing payments and displaying prices.</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Store Currency</label>
                      <div className="relative">
                        <div 
                          onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                          className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:border-indigo-300 transition-all shadow-sm group"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-black text-indigo-600 shadow-sm">{formData.currencySymbol}</div>
                            <div className="text-sm font-bold text-slate-700">{formData.currencyName} ({formData.currencyCode})</div>
                          </div>
                          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isCurrencyDropdownOpen ? 'rotate-180' : ''}`} />
                        </div>

                        {isCurrencyDropdownOpen && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                              <div className="relative">
                                <Plus className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 rotate-45" />
                                <input 
                                  type="text" 
                                  placeholder="Search currency..." 
                                  value={currencySearch}
                                  onChange={(e) => setCurrencySearch(e.target.value)}
                                  autoFocus
                                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm font-bold text-slate-700 outline-none focus:border-indigo-300 transition-all"
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
                                  className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer hover:bg-indigo-50 group ${formData.currencyCode === curr.code ? 'bg-indigo-50/50' : ''}`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${formData.currencyCode === curr.code ? 'bg-white text-indigo-600 shadow-sm' : 'bg-slate-100 text-slate-400 group-hover:bg-white'}`}>
                                      {curr.symbol}
                                    </div>
                                    <div className="flex flex-col">
                                      <span className={`text-xs font-bold ${formData.currencyCode === curr.code ? 'text-indigo-900' : 'text-slate-700'}`}>{curr.name}</span>
                                      <span className="text-[10px] text-slate-400 font-medium">{curr.code}</span>
                                    </div>
                                  </div>
                                  {formData.currencyCode === curr.code && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
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
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Store Operating Hours</h3>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">Configure the time slots when your store is open for business.</p>
                      </div>
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-indigo-600" />
                      </div>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="max-w-xl space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Timing Mode</label>
                        <div className="relative">
                          <select name="orderTimingOption" value={formData.orderTimingOption} onChange={handleChange} className="w-full pl-4 pr-10 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none appearance-none hover:border-indigo-300 transition-colors cursor-pointer">
                            <option>Same time for all days</option>
                            <option>Specific timing for each day</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Active Slots</h4>
                          <button className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                            <Plus className="w-4 h-4" />
                            Add Slot
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-4 p-5 bg-indigo-50/30 border border-indigo-100 rounded-2xl group transition-all">
                            <div className="flex-1 space-y-1">
                              <span className="text-[10px] font-black text-indigo-400 uppercase">Opening Time</span>
                              <input 
                                type="time" 
                                name="openingTime" 
                                value={formData.openingTime} 
                                onChange={handleChange}
                                className="w-full bg-transparent text-sm font-black text-slate-700 outline-none cursor-pointer"
                              />
                            </div>
                            <div className="w-px h-8 bg-indigo-100" />
                            <div className="flex-1 space-y-1 text-right">
                              <span className="text-[10px] font-black text-indigo-400 uppercase">Closing Time</span>
                              <input 
                                type="time" 
                                name="closingTime" 
                                value={formData.closingTime} 
                                onChange={handleChange}
                                className="w-full bg-transparent text-sm font-black text-slate-700 outline-none text-right cursor-pointer"
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
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                      <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                        <button 
                          onClick={() => setRiderTab('fleet')}
                          className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${riderTab === 'fleet' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                        >Fleet Service</button>
                        <button 
                          onClick={() => setRiderTab('auto')}
                          className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${riderTab === 'auto' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                        >Auto Assignment</button>
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-6">
                      {riderTab === 'fleet' ? (
                        <>
                          <div className="flex items-center justify-between p-6 rounded-2xl bg-indigo-900 text-white relative overflow-hidden shadow-xl shadow-indigo-900/10">
                            <div className="relative z-10 flex items-center gap-6">
                              <div className="w-14 h-14 bg-indigo-500/30 rounded-2xl flex items-center justify-center">
                                <Bike className="w-8 h-8 text-white" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold tracking-tight mb-1">In-house Rider Fleet</h3>
                                <p className="text-indigo-100/70 text-xs font-medium">Manage your own delivery team for localized fulfillment.</p>
                              </div>
                            </div>
                            <div className="relative z-10">
                              <button 
                                onClick={() => handleToggle('inHouseRiderEnabled')}
                                className={`w-14 h-7 rounded-full relative transition-all ${formData.inHouseRiderEnabled ? 'bg-indigo-500' : 'bg-slate-500/50'}`}
                              >
                                <div className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow-sm transition-all ${formData.inHouseRiderEnabled ? 'left-8' : 'left-1'}`} />
                              </button>
                            </div>
                          </div>

                          {formData.inHouseRiderEnabled && (
                            <div className="space-y-6 pt-4 animate-in slide-in-from-top-2 duration-300 border-t border-slate-50">
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Partner Integrations</h4>
                              <div className="grid grid-cols-1 gap-4">
                                {[
                                  { name: 'ELT riders', logo: 'ELT' },
                                  { name: 'Dunzo riders', logo: 'DZ' },
                                  { name: 'Wefast riders', logo: 'WF' }
                                ].map(rider => (
                                  <div key={rider.name} className="flex items-center justify-between p-5 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/20 transition-all duration-300">
                                    <div className="flex items-center gap-5">
                                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400 text-xs">{rider.logo}</div>
                                      <div>
                                        <h4 className="text-sm font-bold text-slate-800">{rider.name}</h4>
                                        <p className="text-[11px] text-slate-400 font-medium">External rider fleet API integration</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <button className="px-4 py-2 text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 rounded-lg transition-colors">Configure</button>
                                      <div className="w-px h-4 bg-slate-200" />
                                      <button className="px-4 py-2 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-indigo-600 transition-colors">Connect</button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                          <div className="flex items-center justify-between p-6 rounded-2xl bg-emerald-50 border border-emerald-100">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                <Timer className="w-6 h-6 text-emerald-600" />
                              </div>
                              <div>
                                <h3 className="text-sm font-bold text-slate-800">Auto Assignment Engine</h3>
                                <p className="text-[11px] text-slate-500 font-medium">Automatically dispatch orders to available riders.</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => handleToggle('autoAssignmentEnabled')}
                              className={`w-14 h-7 rounded-full relative transition-all ${formData.autoAssignmentEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow-sm transition-all ${formData.autoAssignmentEnabled ? 'left-8' : 'left-1'}`} />
                            </button>
                          </div>

                          {formData.autoAssignmentEnabled && (
                            <div className="space-y-6 pt-4 border-t border-slate-50">
                              <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assignment Strategy</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {['Nearest Rider First', 'Round Robin', 'Lowest Active Orders', 'Batching Mode'].map(strategy => (
                                    <label key={strategy} className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${formData.autoAssignStrategy === strategy ? 'bg-emerald-50/50 border-emerald-200 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
                                      <input 
                                        type="radio" 
                                        name="autoAssignStrategy"
                                        checked={formData.autoAssignStrategy === strategy} 
                                        onChange={() => setFormData(p => ({...p, autoAssignStrategy: strategy}))} 
                                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300" 
                                      />
                                      <span className={`text-sm font-bold ${formData.autoAssignStrategy === strategy ? 'text-emerald-700' : 'text-slate-600'}`}>{strategy}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assign After (Minutes)</label>
                                  <input 
                                    type="number" 
                                    name="autoAssignDelay" 
                                    value={formData.autoAssignDelay} 
                                    onChange={handleChange} 
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-emerald-300 transition-all" 
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Max Orders Per Rider</label>
                                  <input 
                                    type="number" 
                                    name="maxOrdersPerRider" 
                                    value={formData.maxOrdersPerRider} 
                                    onChange={handleChange} 
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-emerald-300 transition-all" 
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
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-2xl">
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
                        <ShieldCheck className="w-7 h-7 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 tracking-tight">Tax Configuration</h3>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">Manage GST and other service tax settings for your outlet.</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-800">Do you charge Goods and Service Tax (GST)?</h4>
                        <div className="flex gap-4">
                          <button onClick={()=>setFormData(p=>({...p, taxEnabled: true}))} className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all ${formData.taxEnabled ? 'bg-indigo-50 border-indigo-200 ring-4 ring-indigo-500/5' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.taxEnabled ? 'border-indigo-600' : 'border-slate-300'}`}>
                              {formData.taxEnabled && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                            </div>
                            <span className={`text-sm font-bold ${formData.taxEnabled ? 'text-indigo-700' : 'text-slate-600'}`}>Yes, I charge GST</span>
                          </button>
                          <button onClick={()=>setFormData(p=>({...p, taxEnabled: false}))} className={`flex-1 flex items-center justify-center gap-3 p-4 rounded-2xl border transition-all ${!formData.taxEnabled ? 'bg-indigo-50 border-indigo-200 ring-4 ring-indigo-500/5' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${!formData.taxEnabled ? 'border-indigo-600' : 'border-slate-300'}`}>
                              {!formData.taxEnabled && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                            </div>
                            <span className={`text-sm font-bold ${!formData.taxEnabled ? 'text-indigo-700' : 'text-slate-600'}`}>No, I don't</span>
                          </button>
                        </div>
                      </div>

                      {formData.taxEnabled && (
                        <div className="space-y-6 animate-in zoom-in-95 duration-300 pt-4 border-t border-slate-50">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GST Registration Number</label>
                            <input type="text" name="taxNumber" value={formData.taxNumber} onChange={handleChange} placeholder="e.g. 22AAAAA0000A1Z5" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-700 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CGST Rate (%)</label>
                              <div className="relative">
                                <input type="number" name="cgstRate" value={formData.cgstRate} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none" />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">%</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SGST Rate (%)</label>
                              <div className="relative">
                                <input type="number" name="sgstRate" value={formData.sgstRate} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none" />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">%</span>
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
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
                          <ShieldCheck className="w-7 h-7 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-800 tracking-tight">Compliance & Licenses</h3>
                          <p className="text-sm text-slate-500 font-medium leading-relaxed">Enter your FSSAI or other local food safety license numbers.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleToggle('licenseEnabled')}
                        className={`w-14 h-7 rounded-full relative transition-all ${formData.licenseEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow-sm transition-all ${formData.licenseEnabled ? 'left-8' : 'left-1'}`} />
                      </button>
                    </div>
                    {formData.licenseEnabled && (
                      <div className="space-y-2 animate-in slide-in-from-top-2 duration-300 pt-4 border-t border-slate-50">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">FSSAI License Number</label>
                        <input type="text" name="license" value={formData.license} onChange={handleChange} placeholder="Enter your 14-digit license number" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-700 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Other Settings */}
              {activeTab === 'other' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        <div className={`p-6 rounded-2xl border transition-all ${formData[opt.name] ? 'bg-white border-indigo-100 shadow-md shadow-indigo-50/50' : 'bg-slate-50 border-slate-100 opacity-80'}`}>
                          <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData[opt.name] ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-400'}`}>
                              <opt.icon className="w-5 h-5" />
                            </div>
                            <button 
                              onClick={()=>handleToggle(opt.name)}
                              className={`w-14 h-7 rounded-full relative transition-all ${formData[opt.name] ? 'bg-indigo-600' : 'bg-slate-300'}`}
                            >
                              <div className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow-sm transition-all ${formData[opt.name] ? 'left-8' : 'left-1'}`} />
                            </button>
                          </div>
                          <h4 className="text-sm font-bold text-slate-800 mb-1">{opt.label}</h4>
                          <p className="text-[11px] text-slate-500 font-medium leading-tight">{opt.desc}</p>
                        </div>
                        
                        {opt.name === 'autoCancelOrders' && formData.autoCancelOrders && (
                          <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-in slide-in-from-top-2 duration-300 space-y-4 shadow-sm">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auto Cancel Buffer (Minutes)</label>
                              <input 
                                type="number" 
                                name="bufferTime" 
                                value={formData.bufferTime} 
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-300 transition-all"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-600">Auto Refund on Cancel</span>
                              <button 
                                onClick={()=>handleToggle('autoRefund')}
                                className={`w-14 h-7 rounded-full relative transition-all ${formData.autoRefund ? 'bg-indigo-600' : 'bg-slate-300'}`}
                              >
                                <div className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow-sm transition-all ${formData.autoRefund ? 'left-8' : 'left-1'}`} />
                              </button>
                            </div>
                          </div>
                        )}

                        {opt.name === 'loyaltyEnabled' && formData.loyaltyEnabled && (
                          <div className="bg-white rounded-2xl border border-slate-200 p-6 animate-in slide-in-from-top-2 duration-300 space-y-4 shadow-sm">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Points per Rupee (₹1 = ? Points)</label>
                              <input 
                                type="number" 
                                name="loyaltyPointsPerRupee" 
                                value={formData.loyaltyPointsPerRupee} 
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-300 transition-all"
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
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Additional Fees</h3>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">Configure packaging, convenience, and service charges for different modes.</p>
                      </div>
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-indigo-600" />
                      </div>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { label: 'Packaging Charges', name: 'packagingEnabled', desc: 'Enable to charge for container and bag costs.' },
                        { label: 'Convenience Fees', name: 'convenienceEnabled', desc: 'Apply a flat fee for digital ordering convenience.' }
                      ].map(charge => (
                        <label key={charge.name} className={`flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${formData[charge.name] ? 'bg-indigo-50/50 border-indigo-200 shadow-sm' : 'bg-slate-50/50 border-slate-100 hover:border-slate-200'}`}>
                          <div className="pt-1">
                            <input 
                              type="checkbox" 
                              checked={formData[charge.name]} 
                              onChange={() => handleToggle(charge.name)}
                              className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
                            />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-slate-800 block mb-0.5">{charge.label}</span>
                            <span className="text-[11px] text-slate-500 font-medium leading-tight">{charge.desc}</span>
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
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-[#253966]/5">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-12 bg-[#253966] p-2 rounded-xl flex items-center justify-center shadow-lg">
                          <img src="https://www.petpooja.com/assets/images/pp-logo.png" className="w-full h-full object-contain filter brightness-0 invert" alt="Petpooja" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-800 tracking-tight">Petpooja Integration</h3>
                          <p className="text-sm text-slate-500 font-medium">Sync your menu and orders directly with Petpooja POS.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleToggle('petpoojaEnabled')}
                        className={`w-14 h-7 rounded-full relative transition-all ${formData.petpoojaEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow-sm transition-all ${formData.petpoojaEnabled ? 'left-8' : 'left-1'}`} />
                      </button>
                    </div>
                    {formData.petpoojaEnabled && (
                      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-2 duration-300">
                        {[
                          { label: 'App Key', name: 'petpoojaAppKey' },
                          { label: 'App Secret', name: 'petpoojaAppSecret' },
                          { label: 'Access Token', name: 'petpoojaAccessToken' },
                          { label: 'Restaurant ID', name: 'petpoojaRestaurantId' }
                        ].map(field => (
                          <div key={field.name} className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{field.label}</label>
                            <input type="text" name={field.name} value={formData[field.name]} onChange={handleChange} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:bg-white focus:border-indigo-300 transition-all outline-none" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center justify-between opacity-60 grayscale">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-12 bg-slate-800 rounded-xl flex items-center justify-center font-black text-white text-[10px] tracking-tighter">BILLBERRY</div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Bill Berry Integration</h3>
                        <p className="text-sm text-slate-500 font-medium">Connect with Bill Berry POS system.</p>
                      </div>
                    </div>
                    <button className="px-6 py-2.5 bg-slate-100 text-slate-400 rounded-xl text-xs font-black uppercase tracking-widest cursor-not-allowed">Connect</button>
                  </div>
                </div>
              )}

              {/* COD Limit */}
              {activeTab === 'cod' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
                          <DollarSign className="w-7 h-7 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-800 tracking-tight">Cash on Delivery Limits</h3>
                          <p className="text-sm text-slate-500 font-medium leading-relaxed">Set the maximum order value allowed for cash payments.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleToggle('codLimitEnabled')}
                        className={`w-14 h-7 rounded-full relative transition-all ${formData.codLimitEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow-sm transition-all ${formData.codLimitEnabled ? 'left-8' : 'left-1'}`} />
                      </button>
                    </div>
                    {formData.codLimitEnabled && (
                      <div className="space-y-6 animate-in slide-in-from-top-2 duration-300 pt-4 border-t border-slate-50">
                        {[
                          { label: 'Delivery COD Limit', desc: 'Max amount for home delivery', name: 'deliveryCodLimit' },
                          { label: 'Takeaway COD Limit', desc: 'Max amount for pickup orders', name: 'takeawayCodLimit' }
                        ].map(limit => (
                          <div key={limit.label} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="space-y-0.5">
                              <span className="text-sm font-bold text-slate-800">{limit.label}</span>
                              <p className="text-[10px] text-slate-400 font-medium">{limit.desc}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-black text-slate-400">₹</span>
                              <input 
                                type="number" 
                                name={limit.name} 
                                value={formData[limit.name] || 0} 
                                onChange={handleChange}
                                className="w-24 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-black text-indigo-600 outline-none focus:border-indigo-400 transition-all" 
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
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-2xl">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
                          <ListOrdered className="w-7 h-7 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-800 tracking-tight">Minimum Order Value (MOV)</h3>
                          <p className="text-sm text-slate-500 font-medium leading-relaxed">Set the minimum cart value required to place an order.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleToggle('movLimitEnabled')}
                        className={`w-14 h-7 rounded-full relative transition-all ${formData.movLimitEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow-sm transition-all ${formData.movLimitEnabled ? 'left-8' : 'left-1'}`} />
                      </button>
                    </div>
                    {formData.movLimitEnabled && (
                      <div className="space-y-6 animate-in slide-in-from-top-2 duration-300 pt-4 border-t border-slate-50">
                        {[
                          { label: 'Delivery MOV', desc: 'Minimum value for delivery', name: 'deliveryMov' },
                          { label: 'Takeaway MOV', desc: 'Minimum value for takeaway', name: 'takeawayMov' }
                        ].map(limit => (
                          <div key={limit.label} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="space-y-0.5">
                              <span className="text-sm font-bold text-slate-800">{limit.label}</span>
                              <p className="text-[10px] text-slate-400 font-medium">{limit.desc}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-black text-slate-400">₹</span>
                              <input 
                                type="number" 
                                name={limit.name} 
                                value={formData[limit.name] || 0} 
                                onChange={handleChange}
                                className="w-24 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-black text-indigo-600 outline-none focus:border-indigo-400 transition-all" 
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
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-2xl">
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
                        <CheckCircle2 className="w-7 h-7 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800 tracking-tight">Cash Payment Enablement</h3>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">Select which ordering modes allow cash payments.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { label: 'Cash for Takeaway', name: 'cashTakeaway' },
                        { label: 'Cash for Delivery', name: 'cashDelivery' },
                        { label: 'Cash for Dine-in', name: 'cashGo' },
                        { label: 'Cash for Self Serve', name: 'cashSelfServe' }
                      ].map(opt => (
                        <div key={opt.label} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors group">
                          <span className="text-xs font-bold text-slate-600 group-hover:text-slate-800">{opt.label}</span>
                          <button 
                            onClick={() => handleToggle(opt.name)}
                            className={`w-14 h-7 rounded-full relative transition-all ${formData[opt.name] ? 'bg-indigo-600' : 'bg-slate-300'}`}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full absolute top-1 shadow-sm transition-all ${formData[opt.name] ? 'left-8' : 'left-1'}`} />
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
          <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-400px)] max-w-4xl z-50 transition-all duration-500 transform ${hasChanges ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
            <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between border border-slate-800/50 backdrop-blur-md bg-opacity-90">
              <div className="flex items-center gap-4 px-2">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center animate-pulse">
                  <AlertCircle className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold tracking-tight">Unsaved changes</h4>
                  <p className="text-[11px] text-slate-400 font-medium leading-tight">You have modified some settings in this section.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleDiscard}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-all active:scale-95"
                >
                  Discard
                </button>
                <button 
                  onClick={handleSave}
                  className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
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
