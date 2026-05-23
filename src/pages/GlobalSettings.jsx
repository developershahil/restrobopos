import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Settings, Palette, MessageSquare, MapPin, Languages, Info, Phone, 
  FileText, Wallet, UtensilsCrossed, Crown, ShieldCheck, 
  Plus, X, Save, Trash2, Check, Image as ImageIcon,
  AlertCircle
} from 'lucide-react';

const SECTIONS = [
  { id: 'app', label: 'App Settings', icon: Settings },
  { id: 'brand', label: 'Brand', icon: Palette },
  { id: 'sms', label: 'SMS Gateway', icon: MessageSquare },
  { id: 'maps', label: 'Maps', icon: MapPin },
  { id: 'languages', label: 'Languages', icon: Languages },
  { id: 'about', label: 'About Us', icon: Info },
  { id: 'contact', label: 'Contact Us', icon: Phone },
  { id: 'legal', label: 'Legal', icon: FileText },
  { id: 'cashback', label: 'Cashback Settings', icon: Wallet },
  { id: 'ordering', label: 'Ordering Mode', icon: UtensilsCrossed },
  { id: 'membership', label: 'Club Membership', icon: Crown },
  { id: 'login', label: 'Login Restrictions', icon: ShieldCheck },
];

// Helper for Toggle
const Toggle = ({ enabled, onClick, label }) => (
  <div className="flex items-center justify-between p-4 bg-card border border-border rounded-xl">
    <div>
      <p className="text-sm font-bold text-foreground">{label}</p>
    </div>
    <button 
      onClick={onClick}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${enabled ? 'bg-primary' : 'bg-muted'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  </div>
);

// Helper for Input Group
const InputGroup = ({ label, value, onChange, placeholder, type = "text", subtext }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">{label}</label>
    <input 
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 bg-muted/10 border border-border rounded-xl text-sm font-medium outline-none focus:border-primary transition-all"
    />
    {subtext && <p className="text-[10px] text-muted-foreground font-medium">{subtext}</p>}
  </div>
);

export default function GlobalSettings() {
  const outletContext = useOutletContext();
  const discardKey = outletContext?.discardKey;
  const setIsDirty = outletContext?.setIsDirty;
  
  const [isPageDirty, setIsPageDirty] = useState(false);
  const [activeSection, setActiveSection] = useState('app');
  
  // Master State
  const [settings, setSettings] = useState({
    app: {
      restaurantName: 'La milano',
      displayName: 'La Milano POS',
      emailCompulsory: true,
      categoryMask: false,
      logoHeight: 40,
      splashScreen: {
        type: 'Static Logo',
        value: null
      },
      offerUsageTime: 30,
      ratingPopup: true,
      showSaveBadge: true
    },
    brand: {
      logo: null,
      footerLogo: null,
      primaryColor: '#eb5e28',
      secondaryColor: '#f5ebe0',
      greeting: 'Welcome to our store!',
      specialInstruction: 'Please add any special requests here.',
      social: {
        enabled: true,
        instagram: '',
        facebook: '',
        x: '',
        linkedin: '',
        youtube: ''
      },
      showNewOutletBanner: false,
      membershipActive: true,
      showEnquiryBanner: false,
      enquiryBannerImage: null
    },
    sms: {
      twoFactorApiKey: ''
    },
    maps: {
      googleApiKey: ''
    },
    languages: ['English', 'Hindi'],
    legal: {
      aboutUs: '',
      contactUs: '',
      privacyPolicy: '',
      terms: ''
    },
    cashback: {
      enabled: true,
      earningPercentage: 5,
      expirationDays: 30,
      signupBonus: 50,
      advance: {
        sameForAllModes: true,
        redeemPercentage: 10,
        consolidateOffers: false
      },
      delay: {
        sameForAllModes: true,
        delivery: { hours: 1, mins: 0 },
        takeaway: { hours: 0, mins: 30 }
      }
    },
    orderingMode: [
      { id: 1, name: 'Dine In', type: 'Fine Dine', orderTab: 'DSR', status: true },
      { id: 2, name: 'Takeaway', type: 'DSR', orderTab: 'TKY', status: true },
    ],
    clubMembership: {
      enabled: true,
      outlets: [],
      logo: null,
      badge: null,
      savingsIcon: null,
      pricePeriod: 'Monthly',
      price: 99,
      comparePrice: 199,
      name: 'Gold Member',
      exclusivePrice: {
        enabled: true,
        discount: 10,
        applicability: 'All'
      },
      fees: {
        delivery: true,
        packaging: false,
        convenience: false
      },
      advancedSelection: []
    },
    loginRestrictions: {
      singleDevice: true
    }
  });

  const [originalSettings] = useState(JSON.parse(JSON.stringify(settings)));
  const [showOrderingModal, setShowOrderingModal] = useState(false);
  const [newOrderMode, setNewOrderMode] = useState({ name: '', type: 'DSR', orderTab: '' });
  const [saveSuccess, setSaveSuccess] = useState(false);

  function handleDiscard() {
    setSettings(JSON.parse(JSON.stringify(originalSettings)));
    setIsPageDirty(false);
  }

  useEffect(() => {
    if (discardKey) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleDiscard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discardKey]);

  useEffect(() => {
    if (setIsDirty) {
      setIsDirty(isPageDirty);
    }
  }, [isPageDirty, setIsDirty]);

  // Handle changes and update local dirty state only
  const updateSetting = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: field === null ? value : {
        ...prev[section],
        [field]: value
      }
    }));
    setIsPageDirty(true);
  };

  const updateSubSetting = (section, subSection, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subSection]: {
          ...prev[section][subSection],
          [field]: value
        }
      }
    }));
    setIsPageDirty(true);
  };

  // Deep update for 3-level nesting (e.g. cashback.delay.delivery.hours)
  const updateDeepSetting = (section, sub1, sub2, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [sub1]: {
          ...prev[section][sub1],
          [sub2]: {
            ...prev[section][sub1][sub2],
            [field]: value
          }
        }
      }
    }));
    setIsPageDirty(true);
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    setIsPageDirty(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };


  return (
    <div className="flex flex-col h-full bg-muted/10 overflow-hidden relative">
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Navigation */}
        <div className="md:w-72 bg-card border-r border-border flex flex-col shrink-0">
          <div className="p-6 border-b border-border">
            <h1 className="text-xl font-black text-foreground">Global Settings</h1>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Platform Configuration</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-hide">
            {SECTIONS.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeSection === section.id 
                    ? 'bg-primary/10 text-primary shadow-sm' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <section.icon className={`w-5 h-5 ${activeSection === section.id ? 'text-primary' : 'text-muted-foreground'}`} />
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-muted/5 relative">
          <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-8 pb-32">
            
            {/* App Settings */}
            {activeSection === 'app' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-foreground">Application Settings</h2>
                  <p className="text-sm text-muted-foreground">Manage core application behavior and display.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup 
                    label="Name of restaurant" 
                    value={settings.app.restaurantName} 
                    onChange={val => updateSetting('app', 'restaurantName', val)}
                    placeholder="e.g. La milano"
                  />
                  <InputGroup 
                    label="Application display name" 
                    value={settings.app.displayName} 
                    onChange={val => updateSetting('app', 'displayName', val)}
                    placeholder="e.g. La Milano POS"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Toggle 
                    label="Customer Email Compulsory" 
                    enabled={settings.app.emailCompulsory} 
                    onClick={() => updateSetting('app', 'emailCompulsory', !settings.app.emailCompulsory)} 
                  />
                  <Toggle 
                    label="Apply Mask on Category Images" 
                    enabled={settings.app.categoryMask} 
                    onClick={() => updateSetting('app', 'categoryMask', !settings.app.categoryMask)} 
                  />
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Logo Height (px)</label>
                    <input 
                      type="number" 
                      value={settings.app.logoHeight} 
                      onChange={e => updateSetting('app', 'logoHeight', parseInt(e.target.value))}
                      className="w-full px-4 py-2.5 bg-muted/10 border border-border rounded-xl text-sm font-bold outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="p-6 border-b border-border bg-muted/20">
                    <h3 className="font-black text-foreground">Splash Screen Configuration</h3>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Splash Screen Type</label>
                      <select 
                        value={settings.app.splashScreen.type}
                        onChange={e => updateSubSetting('app', 'splashScreen', 'type', e.target.value)}
                        className="w-full px-4 py-2.5 bg-muted/10 border border-border rounded-xl text-sm font-bold outline-none focus:border-primary appearance-none cursor-pointer"
                      >
                        <option>Static Logo</option>
                        <option>Image</option>
                        <option>Animated Logo</option>
                        <option>Video</option>
                      </select>
                    </div>
                    
                    <div className="border-2 border-dashed border-border rounded-2xl p-12 text-center hover:border-primary transition-colors cursor-pointer group">
                      <div className="w-16 h-16 bg-muted/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <ImageIcon className="text-muted-foreground group-hover:text-primary" />
                      </div>
                      <p className="text-sm font-bold text-foreground">Click to upload {settings.app.splashScreen.type}</p>
                      <p className="text-xs text-muted-foreground mt-1">Max size 1MB • 3s limit for video</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-1.5">
                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Offer Usage Time (Minutes)</label>
                    <input 
                      type="number" 
                      value={settings.app.offerUsageTime} 
                      onChange={e => updateSetting('app', 'offerUsageTime', parseInt(e.target.value))}
                      className="w-full px-4 py-2.5 bg-muted/10 border border-border rounded-xl text-sm font-bold outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Toggle 
                        label="Rating Popup" 
                        enabled={settings.app.ratingPopup} 
                        onClick={() => updateSetting('app', 'ratingPopup', !settings.app.ratingPopup)} 
                      />
                    </div>
                    <div className="flex-1">
                      <Toggle 
                        label="Show Save Badge" 
                        enabled={settings.app.showSaveBadge} 
                        onClick={() => updateSetting('app', 'showSaveBadge', !settings.app.showSaveBadge)} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Brand Settings */}
            {activeSection === 'brand' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-foreground">Brand Identity</h2>
                  <p className="text-sm text-muted-foreground">Customize logos, colors, and messaging.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                    <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest">Brand Logo</h3>
                    <div className="h-40 bg-muted/10 border border-border border-dashed rounded-xl flex items-center justify-center relative group">
                      <div className="text-center">
                        <ImageIcon className="mx-auto mb-2 text-muted-foreground" />
                        <p className="text-[10px] font-bold text-muted-foreground">Upload Primary Logo</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                    <h3 className="text-xs font-black text-muted-foreground uppercase tracking-widest">Footer Logo</h3>
                    <div className="h-40 bg-muted/10 border border-border border-dashed rounded-xl flex items-center justify-center relative group">
                      <div className="text-center">
                        <ImageIcon className="mx-auto mb-2 text-muted-foreground" />
                        <p className="text-[10px] font-bold text-muted-foreground">Upload Footer Logo</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Primary Color</label>
                    <div className="flex gap-3">
                      <div className="flex-1 relative">
                        <input 
                          type="text" 
                          value={settings.brand.primaryColor}
                          onChange={e => updateSetting('brand', 'primaryColor', e.target.value)}
                          className="w-full pl-4 pr-12 py-2.5 bg-muted/10 border border-border rounded-xl text-sm font-bold outline-none focus:border-primary"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md border border-border" style={{ backgroundColor: settings.brand.primaryColor }} />
                      </div>
                      <input type="color" className="w-12 h-12 p-0 border-none bg-transparent cursor-pointer" value={settings.brand.primaryColor} onChange={e => updateSetting('brand', 'primaryColor', e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Secondary Color</label>
                    <div className="flex gap-3">
                      <div className="flex-1 relative">
                        <input 
                          type="text" 
                          value={settings.brand.secondaryColor}
                          onChange={e => updateSetting('brand', 'secondaryColor', e.target.value)}
                          className="w-full pl-4 pr-12 py-2.5 bg-muted/10 border border-border rounded-xl text-sm font-bold outline-none focus:border-primary"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md border border-border" style={{ backgroundColor: settings.brand.secondaryColor }} />
                      </div>
                      <input type="color" className="w-12 h-12 p-0 border-none bg-transparent cursor-pointer" value={settings.brand.secondaryColor} onChange={e => updateSetting('brand', 'secondaryColor', e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <InputGroup 
                    label="Greeting Message" 
                    value={settings.brand.greeting} 
                    onChange={val => updateSetting('brand', 'greeting', val)} 
                    placeholder="e.g. Welcome to our store!"
                  />
                  <InputGroup 
                    label="Special Instruction Message" 
                    value={settings.brand.specialInstruction} 
                    onChange={val => updateSetting('brand', 'specialInstruction', val)} 
                    placeholder="e.g. Please add any special requests here."
                  />
                </div>

                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="p-6 border-b border-border bg-muted/20 flex items-center justify-between">
                    <h3 className="font-black text-foreground">Social Links</h3>
                    <button 
                      onClick={() => updateSubSetting('brand', 'social', 'enabled', !settings.brand.social.enabled)}
                      className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${settings.brand.social.enabled ? 'bg-primary' : 'bg-muted'}`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${settings.brand.social.enabled ? 'translate-x-5' : 'translate-x-1.5'}`} />
                    </button>
                  </div>
                  {settings.brand.social.enabled && (
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-2 duration-300">
                      <InputGroup label="Instagram" value={settings.brand.social.instagram} onChange={val => updateSubSetting('brand', 'social', 'instagram', val)} placeholder="https://instagram.com/..." />
                      <InputGroup label="Facebook" value={settings.brand.social.facebook} onChange={val => updateSubSetting('brand', 'social', 'facebook', val)} placeholder="https://facebook.com/..." />
                      <InputGroup label="X (Twitter)" value={settings.brand.social.x} onChange={val => updateSubSetting('brand', 'social', 'x', val)} placeholder="https://x.com/..." />
                      <InputGroup label="LinkedIn" value={settings.brand.social.linkedin} onChange={val => updateSubSetting('brand', 'social', 'linkedin', val)} placeholder="https://linkedin.com/..." />
                      <InputGroup label="YouTube" value={settings.brand.social.youtube} onChange={val => updateSubSetting('brand', 'social', 'youtube', val)} placeholder="https://youtube.com/..." />
                    </div>
                  )}
                </div>

                {/* Brand Banners — wired to state */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="p-6 border-b border-border bg-muted/20">
                    <h3 className="font-black text-foreground">Banners</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <Toggle
                      label="Show New Outlet Banner"
                      enabled={settings.brand.showNewOutletBanner}
                      onClick={() => updateSetting('brand', 'showNewOutletBanner', !settings.brand.showNewOutletBanner)}
                    />
                    <Toggle
                      label="Show Enquiry Banner"
                      enabled={settings.brand.showEnquiryBanner}
                      onClick={() => updateSetting('brand', 'showEnquiryBanner', !settings.brand.showEnquiryBanner)}
                    />
                    {settings.brand.showEnquiryBanner && (
                      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer group animate-in slide-in-from-top-2 duration-300">
                        <div className="w-12 h-12 bg-muted/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                          <ImageIcon className="text-muted-foreground group-hover:text-primary" />
                        </div>
                        <p className="text-sm font-bold text-foreground">Upload Enquiry Banner Image</p>
                        <p className="text-xs text-muted-foreground mt-1">Recommended 1200×400px • PNG or JPG</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SMS Gateway */}
            {activeSection === 'sms' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-foreground">SMS Gateway</h2>
                  <p className="text-sm text-muted-foreground">Configure your communication channels.</p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <MessageSquare />
                    </div>
                    <div>
                      <p className="text-sm font-black text-foreground">2Factor SMS Gateway</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Active Provider</p>
                    </div>
                  </div>
                  <InputGroup 
                    label="2Factor SMS API Key" 
                    value={settings.sms.twoFactorApiKey} 
                    onChange={val => updateSetting('sms', 'twoFactorApiKey', val)} 
                    placeholder="Enter your API Key"
                    type="password"
                  />
                </div>
              </div>
            )}

            {/* Maps */}
            {activeSection === 'maps' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-foreground">Maps & Geolocation</h2>
                  <p className="text-sm text-muted-foreground">Integrate map services for deliveries and store tracking.</p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-[#4285F4]/5 rounded-xl border border-[#4285F4]/20">
                    <div className="w-12 h-12 bg-[#4285F4]/10 rounded-xl flex items-center justify-center text-[#4285F4]">
                      <MapPin />
                    </div>
                    <div>
                      <p className="text-sm font-black text-foreground">Google Maps Platform</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">API Integration</p>
                    </div>
                  </div>
                  <InputGroup 
                    label="Google API Key" 
                    value={settings.maps.googleApiKey} 
                    onChange={val => updateSetting('maps', 'googleApiKey', val)} 
                    placeholder="AIzaSy..."
                    type="password"
                    subtext="Required for address search and distance calculation."
                  />
                </div>
              </div>
            )}

            {/* Languages */}
            {activeSection === 'languages' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-foreground">Languages</h2>
                  <p className="text-sm text-muted-foreground">Select supported languages for your platform.</p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6">
                  <label className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4 block">Select Languages</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['English', 'Marathi', 'Gujarati', 'Hindi', 'Tamil', 'Kannada', 'Bengali', 'Punjabi'].map(lang => (
                      <button
                        key={lang}
                        onClick={() => {
                          const newLangs = settings.languages.includes(lang)
                            ? settings.languages.filter(l => l !== lang)
                            : [...settings.languages, lang];
                          updateSetting('languages', null, newLangs);
                        }}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
                          settings.languages.includes(lang)
                            ? 'bg-primary/10 border-primary text-primary'
                            : 'bg-muted/10 border-border text-muted-foreground hover:border-muted-foreground'
                        }`}
                      >
                        {lang}
                        {settings.languages.includes(lang) && <Check size={14} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Legal / About / Contact */}
            {['about', 'contact', 'legal'].includes(activeSection) && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-foreground">
                    {activeSection === 'about' && 'About Us Content'}
                    {activeSection === 'contact' && 'Contact Information'}
                    {activeSection === 'legal' && 'Legal & Policies'}
                  </h2>
                  <p className="text-sm text-muted-foreground">Enter the content that will be displayed to your customers.</p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                      {activeSection === 'about' ? 'About Content' : activeSection === 'contact' ? 'Contact Details' : 'Privacy Policy'}
                    </label>
                    <textarea
                      className="w-full h-72 px-4 py-3 bg-muted/10 border border-border rounded-xl text-sm font-medium outline-none focus:border-primary resize-none transition-all"
                      placeholder="Start typing..."
                      value={settings.legal[activeSection === 'about' ? 'aboutUs' : activeSection === 'contact' ? 'contactUs' : 'privacyPolicy']}
                      onChange={e => updateSetting('legal', activeSection === 'about' ? 'aboutUs' : activeSection === 'contact' ? 'contactUs' : 'privacyPolicy', e.target.value)}
                    />
                  </div>
                  {activeSection === 'legal' && (
                    <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                      <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Terms &amp; Conditions</label>
                      <textarea
                        className="w-full h-72 px-4 py-3 bg-muted/10 border border-border rounded-xl text-sm font-medium outline-none focus:border-primary resize-none transition-all"
                        placeholder="Enter your Terms & Conditions..."
                        value={settings.legal.terms}
                        onChange={e => updateSetting('legal', 'terms', e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Cashback Settings */}
            {activeSection === 'cashback' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-foreground">Cashback Configuration</h2>
                  <p className="text-sm text-muted-foreground">Setup and manage customer loyalty rewards.</p>
                </div>
                
                <Toggle 
                  label="Enable Cashback Module" 
                  enabled={settings.cashback.enabled} 
                  onClick={() => updateSetting('cashback', 'enabled', !settings.cashback.enabled)}
                />

                {settings.cashback.enabled && (
                  <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <InputGroup 
                        label="Earning Percentage (%)" 
                        value={settings.cashback.earningPercentage} 
                        onChange={val => updateSetting('cashback', 'earningPercentage', parseInt(val))}
                        type="number"
                      />
                      <InputGroup 
                        label="Expiration (Days)" 
                        value={settings.cashback.expirationDays} 
                        onChange={val => updateSetting('cashback', 'expirationDays', parseInt(val))}
                        type="number"
                      />
                      <InputGroup 
                        label="Signup Bonus (₹)" 
                        value={settings.cashback.signupBonus} 
                        onChange={val => updateSetting('cashback', 'signupBonus', parseInt(val))}
                        type="number"
                      />
                    </div>

                    <div className="bg-card border border-border rounded-2xl overflow-hidden">
                      <div className="p-6 border-b border-border bg-muted/20">
                        <h3 className="font-black text-foreground">Advance Settings</h3>
                      </div>
                      <div className="p-6 space-y-6">
                         <Toggle 
                          label="Same Configurations for all modes" 
                          enabled={settings.cashback.advance.sameForAllModes} 
                          onClick={() => updateSubSetting('cashback', 'advance', 'sameForAllModes', !settings.cashback.advance.sameForAllModes)}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <InputGroup 
                            label="Redeem Percentage (%)" 
                            value={settings.cashback.advance.redeemPercentage} 
                            onChange={val => updateSubSetting('cashback', 'advance', 'redeemPercentage', parseInt(val))}
                            type="number"
                          />
                          <Toggle 
                            label="Consolidate other offers" 
                            enabled={settings.cashback.advance.consolidateOffers} 
                            onClick={() => updateSubSetting('cashback', 'advance', 'consolidateOffers', !settings.cashback.advance.consolidateOffers)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-card border border-border rounded-2xl overflow-hidden">
                      <div className="p-6 border-b border-border bg-muted/20">
                        <h3 className="font-black text-foreground">Earnings Delay</h3>
                      </div>
                      <div className="p-6 space-y-6">
                         <Toggle 
                          label="Same Configurations for all modes" 
                          enabled={settings.cashback.delay.sameForAllModes} 
                          onClick={() => updateSubSetting('cashback', 'delay', 'sameForAllModes', !settings.cashback.delay.sameForAllModes)}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-1.5">
                             <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Delay for Delivery</label>
                             <div className="flex gap-2">
                               <input type="number" className="w-full px-4 py-2 bg-muted/10 border border-border rounded-xl text-sm font-bold outline-none" placeholder="Hrs"
                                 value={settings.cashback.delay.delivery.hours}
                                 onChange={e => updateDeepSetting('cashback', 'delay', 'delivery', 'hours', parseInt(e.target.value) || 0)} />
                               <input type="number" className="w-full px-4 py-2 bg-muted/10 border border-border rounded-xl text-sm font-bold outline-none" placeholder="Mins"
                                 value={settings.cashback.delay.delivery.mins}
                                 onChange={e => updateDeepSetting('cashback', 'delay', 'delivery', 'mins', parseInt(e.target.value) || 0)} />
                             </div>
                           </div>
                           <div className="space-y-1.5">
                             <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Delay for Takeaway</label>
                             <div className="flex gap-2">
                               <input type="number" className="w-full px-4 py-2 bg-muted/10 border border-border rounded-xl text-sm font-bold outline-none" placeholder="Hrs"
                                 value={settings.cashback.delay.takeaway.hours}
                                 onChange={e => updateDeepSetting('cashback', 'delay', 'takeaway', 'hours', parseInt(e.target.value) || 0)} />
                               <input type="number" className="w-full px-4 py-2 bg-muted/10 border border-border rounded-xl text-sm font-bold outline-none" placeholder="Mins"
                                 value={settings.cashback.delay.takeaway.mins}
                                 onChange={e => updateDeepSetting('cashback', 'delay', 'takeaway', 'mins', parseInt(e.target.value) || 0)} />
                             </div>
                           </div>
                         </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Ordering Mode */}
            {activeSection === 'ordering' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-foreground">Ordering Modes</h2>
                    <p className="text-sm text-muted-foreground">Manage how customers place orders.</p>
                  </div>
                  <button 
                    onClick={() => setShowOrderingModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-black rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Create Mode
                  </button>
                </div>

                <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-muted/20 border-b border-border">
                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Name</th>
                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Type</th>
                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Order Tab</th>
                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Status</th>
                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {settings.orderingMode.map(mode => (
                        <tr key={mode.id} className="hover:bg-muted/5 transition-colors group">
                          <td className="px-6 py-4 font-bold text-foreground">{mode.name}</td>
                          <td className="px-6 py-4">
                             <span className="px-2 py-1 bg-muted/20 rounded-lg text-[10px] font-black uppercase text-muted-foreground">{mode.type}</span>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-muted-foreground">{mode.orderTab}</td>
                          <td className="px-6 py-4 text-center">
                            <button 
                              onClick={() => {
                                const newModes = settings.orderingMode.map(m => m.id === mode.id ? { ...m, status: !m.status } : m);
                                updateSetting('orderingMode', null, newModes);
                              }}
                              className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${mode.status ? 'bg-green-500' : 'bg-muted'}`}
                            >
                              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${mode.status ? 'translate-x-5' : 'translate-x-1.5'}`} />
                            </button>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <button 
                               onClick={() => updateSetting('orderingMode', null, settings.orderingMode.filter(m => m.id !== mode.id))}
                               className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg text-muted-foreground transition-colors">
                               <Trash2 size={16} />
                             </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Club Membership */}
            {activeSection === 'membership' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-foreground">Club Membership</h2>
                  <p className="text-sm text-muted-foreground">Create premium subscription plans for loyal customers.</p>
                </div>

                <Toggle 
                  label="Enable Membership Program" 
                  enabled={settings.clubMembership.enabled} 
                  onClick={() => updateSetting('clubMembership', 'enabled', !settings.clubMembership.enabled)}
                />

                {settings.clubMembership.enabled && (
                  <div className="space-y-8 animate-in slide-in-from-top-4 duration-500">
                    <div className="bg-card border border-border rounded-2xl p-6">
                      <label className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4 block">Applicable Outlets</label>
                      <div className="flex flex-wrap gap-2">
                        {['All Outlets', 'Main Branch', 'Downtown', 'Airport', 'Mall Kiosk'].map(outlet => {
                          const isSelected = settings.clubMembership.outlets.includes(outlet);
                          return (
                            <button
                              key={outlet}
                              onClick={() => {
                                const newOutlets = isSelected
                                  ? settings.clubMembership.outlets.filter(o => o !== outlet)
                                  : [...settings.clubMembership.outlets, outlet];
                                updateSetting('clubMembership', 'outlets', newOutlets);
                              }}
                              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                                isSelected ? 'bg-primary/10 border-primary text-primary' : 'border-border hover:border-primary text-muted-foreground'
                              }`}
                            >
                              {outlet}
                              {isSelected && <Check size={12} />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                        <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Program Logo</h3>
                        <div className="h-32 bg-muted/10 border border-border border-dashed rounded-xl flex items-center justify-center">
                          <ImageIcon className="text-muted-foreground" />
                        </div>
                      </div>
                      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                        <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Badge Icon</h3>
                        <div className="h-32 bg-muted/10 border border-border border-dashed rounded-xl flex items-center justify-center">
                          <Crown className="text-muted-foreground" />
                        </div>
                      </div>
                      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                        <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Savings Icon</h3>
                        <div className="h-32 bg-muted/10 border border-border border-dashed rounded-xl flex items-center justify-center">
                          <Wallet className="text-muted-foreground" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Pricing Period</label>
                          <select
                            value={settings.clubMembership.pricePeriod}
                            onChange={e => updateSetting('clubMembership', 'pricePeriod', e.target.value)}
                            className="w-full px-4 py-2.5 bg-muted/10 border border-border rounded-xl text-sm font-bold outline-none focus:border-primary appearance-none cursor-pointer"
                          >
                            <option>Monthly</option>
                            <option>Quarterly</option>
                            <option>Yearly</option>
                          </select>
                        </div>
                        <InputGroup label="Membership Name" value={settings.clubMembership.name} onChange={val => updateSetting('clubMembership', 'name', val)} placeholder="e.g. Gold Pass" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputGroup label="Price (₹)" value={settings.clubMembership.price} onChange={val => updateSetting('clubMembership', 'price', parseInt(val))} type="number" />
                        <InputGroup label="Compare Price (₹)" value={settings.clubMembership.comparePrice} onChange={val => updateSetting('clubMembership', 'comparePrice', parseInt(val))} type="number" />
                      </div>
                    </div>

                    <div className="bg-card border border-border rounded-2xl overflow-hidden">
                      <div className="p-6 border-b border-border bg-muted/20">
                        <h3 className="font-black text-foreground">Exclusive Benefits</h3>
                      </div>
                      <div className="p-6 space-y-6">
                        <Toggle 
                          label="Enable Exclusive Pricing" 
                          enabled={settings.clubMembership.exclusivePrice.enabled} 
                          onClick={() => updateSubSetting('clubMembership', 'exclusivePrice', 'enabled', !settings.clubMembership.exclusivePrice.enabled)}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <InputGroup label="Discount (%)" value={settings.clubMembership.exclusivePrice.discount} onChange={val => updateSubSetting('clubMembership', 'exclusivePrice', 'discount', parseInt(val))} type="number" />
                           <div className="space-y-1.5">
                            <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Applicability</label>
                            <div className="flex gap-4">
                              {['All', 'Specific Category', 'Specific Items'].map(opt => (
                                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                  <input type="radio" name="applicability" checked={settings.clubMembership.exclusivePrice.applicability === opt} onChange={() => updateSubSetting('clubMembership', 'exclusivePrice', 'applicability', opt)} className="accent-primary" />
                                  <span className="text-xs font-bold">{opt}</span>
                                </label>
                              ))}
                            </div>
                           </div>
                        </div>
                      </div>
                    </div>

                    {/* Fee Waivers — wired to state */}
                    <div className="bg-card border border-border rounded-2xl overflow-hidden">
                      <div className="p-6 border-b border-border bg-muted/20">
                        <h3 className="font-black text-foreground">Fee Waivers for Members</h3>
                        <p className="text-xs text-muted-foreground mt-1">Waive specific fees for membership holders.</p>
                      </div>
                      <div className="p-6 space-y-4">
                        <Toggle
                          label="Waive Delivery Fee"
                          enabled={settings.clubMembership.fees.delivery}
                          onClick={() => updateSubSetting('clubMembership', 'fees', 'delivery', !settings.clubMembership.fees.delivery)}
                        />
                        <Toggle
                          label="Waive Packaging Fee"
                          enabled={settings.clubMembership.fees.packaging}
                          onClick={() => updateSubSetting('clubMembership', 'fees', 'packaging', !settings.clubMembership.fees.packaging)}
                        />
                        <Toggle
                          label="Waive Convenience Fee"
                          enabled={settings.clubMembership.fees.convenience}
                          onClick={() => updateSubSetting('clubMembership', 'fees', 'convenience', !settings.clubMembership.fees.convenience)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Login Restrictions */}
            {activeSection === 'login' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-foreground">Login Restrictions</h2>
                  <p className="text-sm text-muted-foreground">Manage platform security and access control.</p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6">
                   <Toggle 
                    label="Allow only single device login" 
                    enabled={settings.loginRestrictions.singleDevice} 
                    onClick={() => updateSetting('loginRestrictions', 'singleDevice', !settings.loginRestrictions.singleDevice)}
                  />
                  <p className="mt-4 text-xs text-muted-foreground flex items-center gap-2">
                    <AlertCircle size={14} className="text-primary" />
                    Enabling this will automatically log out the previous session when a new login occurs.
                  </p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Save Success Toast */}
      {saveSuccess && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-8 duration-500">
          <div className="bg-green-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
            <Check className="w-5 h-5" />
            <p className="text-sm font-black">Settings saved successfully!</p>
          </div>
        </div>
      )}

      {/* Global Action Bar */}
      {isPageDirty && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-6 z-50 animate-in slide-in-from-bottom-8 duration-500">
          <div className="bg-foreground text-background p-4 rounded-3xl shadow-2xl flex items-center justify-between gap-4 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3 pl-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center animate-pulse">
                <AlertCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest opacity-70">Unsaved Changes</p>
                <p className="text-[10px] font-bold opacity-50">Review and apply settings</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDiscard}
                className="px-4 py-2 text-xs font-black hover:bg-white/10 rounded-xl transition-colors"
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-primary text-primary-foreground text-xs font-black rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <Save size={14} /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ordering Mode Modal */}
      {showOrderingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-card w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-border">
            <div className="p-8 border-b border-border flex justify-between items-center bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <UtensilsCrossed size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-foreground">Create Ordering Mode</h2>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">New Configuration</p>
                </div>
              </div>
              <button onClick={() => setShowOrderingModal(false)} className="text-muted-foreground hover:text-foreground p-2 hover:bg-muted rounded-xl transition-colors"><X size={20} /></button>
            </div>
            <div className="p-8 space-y-6">
              <InputGroup label="Display Name" value={newOrderMode.name} onChange={val => setNewOrderMode({...newOrderMode, name: val})} placeholder="e.g. Fine Dine" />
              <div className="space-y-1.5">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Type</label>
                <div className="flex gap-4">
                  {['DSR', 'Fine Dine'].map(type => (
                    <label key={type} className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-border cursor-pointer hover:border-primary transition-all has-[:checked]:bg-primary/5 has-[:checked]:border-primary">
                      <input type="radio" name="orderType" checked={newOrderMode.type === type} onChange={() => setNewOrderMode({...newOrderMode, type})} className="hidden" />
                      <span className="text-xs font-bold">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              <InputGroup label="Order Tab Code" value={newOrderMode.orderTab} onChange={val => setNewOrderMode({...newOrderMode, orderTab: val})} placeholder="e.g. FDN" />
            </div>
            <div className="p-8 border-t border-border flex justify-end gap-3 bg-muted/5">
              <button className="px-6 py-2.5 text-xs font-black text-muted-foreground hover:bg-muted rounded-xl transition-colors" onClick={() => setShowOrderingModal(false)}>Cancel</button>
              <button 
                className="px-8 py-2.5 text-xs font-black bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                onClick={() => {
                  const mode = { ...newOrderMode, id: Date.now(), status: true };
                  updateSetting('orderingMode', null, [...settings.orderingMode, mode]);
                  setShowOrderingModal(false);
                  setNewOrderMode({ name: '', type: 'DSR', orderTab: '' });
                }}
              >
                Add Mode
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
