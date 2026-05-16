import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Plus, Store, Building2, MoreVertical, X, ChevronRight, Search, 
  Settings, Save, PaintBucket, ToggleLeft, Gift, CreditCard, 
  Bell, Receipt, FileText, AppWindow, Key, Map, MessageSquare, Mail, ShieldCheck, LayoutDashboard, Server
} from 'lucide-react';

const INITIAL_TENANTS = [
  {
    id: 't1',
    name: 'Burger King Master',
    owner: 'John Doe',
    email: 'john@bk.com',
    status: 'Active',
    outlets: [
      { id: 'o1', name: 'Koramangala Branch', city: 'Bangalore', status: 'Active' },
      { id: 'o2', name: 'Indiranagar Branch', city: 'Bangalore', status: 'Active' },
    ]
  },
  {
    id: 't2',
    name: 'Pizza Hut Global',
    owner: 'Jane Smith',
    email: 'jane@ph.com',
    status: 'Active',
    outlets: [
      { id: 'o3', name: 'Whitefield Branch', city: 'Bangalore', status: 'Active' },
    ]
  }
];

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'restaurants', label: 'Restaurants', icon: Building2 },
  { id: 'outlets', label: 'Outlets', icon: Store },
  { id: 'branding', label: 'Brand & Theme', icon: PaintBucket },
  { id: 'toggles', label: 'Feature Toggles', icon: ToggleLeft },
  { id: 'credentials', label: 'API & Credentials', icon: Key },
];

export default function GlobalSettings() {
  const { theme, setTheme, isDirty, setIsDirty } = useOutletContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [tenants, setTenants] = useState(INITIAL_TENANTS);
  const [showResModal, setShowResModal] = useState(false);
  const [showOutletModal, setShowOutletModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);

  const [newRes, setNewRes] = useState({ name: '', owner: '', email: '', package: 'Standard' });
  const [newOutlet, setNewOutlet] = useState({ name: '', city: '', address: '', contact: '' });

  const [brandData, setBrandData] = useState({
    brandName: 'Restrobopos Master',
    primaryColor: '#eb5e28',
    secondaryColor: '#f5ebe0',
    loyalty: true,
    membership: false,
    wallet: true,
  });

  const [credentials, setCredentials] = useState({
    googleMapsKey: '',
    googleAuthClientId: '',
    firebaseConfig: '',
    twilioSid: '',
    twilioToken: '',
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPass: '',
  });

  const handleCreateRestaurant = () => {
    const res = {
      id: 't' + (tenants.length + 1),
      name: newRes.name,
      owner: newRes.owner,
      email: newRes.email,
      status: 'Active',
      outlets: []
    };
    setTenants([...tenants, res]);
    setShowResModal(false);
    setNewRes({ name: '', owner: '', email: '', package: 'Standard' });
    setIsDirty(true);
  };

  const handleCreateOutlet = () => {
    if (!selectedTenant) return;
    const updatedTenants = tenants.map(t => {
      if (t.id === selectedTenant.id) {
        return {
          ...t,
          outlets: [
            ...t.outlets,
            { id: 'o' + Date.now(), name: newOutlet.name, city: newOutlet.city, status: 'Active' }
          ]
        };
      }
      return t;
    });
    setTenants(updatedTenants);
    setShowOutletModal(false);
    setNewOutlet({ name: '', city: '', address: '', contact: '' });
    setIsDirty(true);
  };

  const handleDataChange = (setter, value) => {
    setter(value);
    setIsDirty(true);
  };

  return (
    <div className="flex flex-col h-full bg-muted/10 overflow-hidden">
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Tabs — horizontal scroll on mobile, vertical on desktop */}
        <div className="md:w-64 bg-card md:border-r border-b md:border-b-0 border-border overflow-x-auto md:overflow-y-auto shrink-0 md:py-6 md:px-4">
          <div className="flex md:flex-col gap-1 px-3 md:px-0 py-2 md:py-0">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap md:whitespace-normal shrink-0 md:shrink md:w-full ${
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
          <div className="max-w-5xl mx-auto space-y-6 pb-12">
            
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-primary text-primary-foreground p-6 rounded-2xl shadow-lg relative overflow-hidden group cursor-pointer" onClick={() => setShowResModal(true)}>
                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                      <Building2 size={120} />
                    </div>
                    <h3 className="text-xl font-black mb-2">Create New Restaurant</h3>
                    <p className="text-primary-foreground/80 text-sm mb-4">Add a new brand or tenant to the platform.</p>
                    <div className="bg-white/20 w-fit px-4 py-2 rounded-lg font-bold text-sm backdrop-blur-sm">
                      Get Started <ChevronRight className="inline-block w-4 h-4" />
                    </div>
                  </div>
                  <div className="bg-foreground text-background p-6 rounded-2xl shadow-lg relative overflow-hidden group cursor-pointer" onClick={() => {
                    setSelectedTenant(tenants[0]);
                    setShowOutletModal(true);
                  }}>
                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                      <Store size={120} />
                    </div>
                    <h3 className="text-xl font-black mb-2">Launch New Outlet</h3>
                    <p className="text-background/80 text-sm mb-4">Expand an existing brand with a new physical store.</p>
                    <div className="bg-background/10 w-fit px-4 py-2 rounded-lg font-bold text-sm backdrop-blur-sm border border-background/20">
                      Add Store <ChevronRight className="inline-block w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-card border border-border p-5 rounded-2xl shadow-sm">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Total Brands</p>
                    <p className="text-3xl font-black">{tenants.length}</p>
                  </div>
                  <div className="bg-card border border-border p-5 rounded-2xl shadow-sm">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">Total Outlets</p>
                    <p className="text-3xl font-black">{tenants.reduce((acc, t) => acc + t.outlets.length, 0)}</p>
                  </div>
                  <div className="bg-card border border-border p-5 rounded-2xl shadow-sm">
                    <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-1">System Health</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                      <p className="text-lg font-bold text-green-600">All Systems Operational</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'restaurants' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-foreground">Restaurant Management</h2>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-primary text-primary-foreground rounded-lg" onClick={() => setShowResModal(true)}>
                    <Plus className="w-4 h-4" /> Create Restaurant
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {tenants.map(tenant => (
                    <div key={tenant.id} className="bg-card border border-border p-4 rounded-2xl flex items-center justify-between group hover:border-primary transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-lg">
                          {tenant.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-black text-foreground">{tenant.name}</h3>
                          <p className="text-xs text-muted-foreground">{tenant.email} • {tenant.outlets.length} Outlets</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-1.5 text-xs font-bold hover:bg-muted rounded-lg" onClick={() => {
                          setSelectedTenant(tenant);
                          setShowOutletModal(true);
                        }}>Add Outlet</button>
                        <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground"><MoreVertical size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'credentials' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="px-6 py-5 border-b border-border bg-muted/20 flex items-center gap-3">
                    <Map className="w-5 h-5 text-primary" />
                    <div>
                      <h2 className="text-lg font-black text-foreground">Google Cloud Platform</h2>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">API Keys & Authentication</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Google Maps API Key</label>
                      <input 
                        type="password" 
                        value={credentials.googleMapsKey}
                        onChange={e => handleDataChange(setCredentials, {...credentials, googleMapsKey: e.target.value})}
                        className="w-full px-4 py-2 bg-muted/10 border border-border rounded-lg text-sm font-medium outline-none focus:border-primary" 
                        placeholder="AIzaSy..." 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Google Auth Client ID</label>
                      <input 
                        type="text" 
                        value={credentials.googleAuthClientId}
                        onChange={e => handleDataChange(setCredentials, {...credentials, googleAuthClientId: e.target.value})}
                        className="w-full px-4 py-2 bg-muted/10 border border-border rounded-lg text-sm font-medium outline-none focus:border-primary" 
                        placeholder="123456789-abc.apps.googleusercontent.com" 
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="px-6 py-5 border-b border-border bg-muted/20 flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <div>
                      <h2 className="text-lg font-black text-foreground">Communications Gateway</h2>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">SMS & WhatsApp Credentials</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Twilio Account SID</label>
                        <input 
                          type="text" 
                          value={credentials.twilioSid}
                          onChange={e => handleDataChange(setCredentials, {...credentials, twilioSid: e.target.value})}
                          className="w-full px-4 py-2 bg-muted/10 border border-border rounded-lg text-sm font-medium outline-none focus:border-primary" 
                          placeholder="AC..." 
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Auth Token</label>
                        <input 
                          type="password" 
                          value={credentials.twilioToken}
                          onChange={e => handleDataChange(setCredentials, {...credentials, twilioToken: e.target.value})}
                          className="w-full px-4 py-2 bg-muted/10 border border-border rounded-lg text-sm font-medium outline-none focus:border-primary" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="px-6 py-5 border-b border-border bg-muted/20 flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <h2 className="text-lg font-black text-foreground">SMTP Configuration</h2>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Outgoing Email Settings</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                      <div className="col-span-2 space-y-1.5">
                        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">SMTP Host</label>
                        <input type="text" className="w-full px-4 py-2 bg-muted/10 border border-border rounded-lg text-sm font-medium outline-none focus:border-primary" placeholder="smtp.gmail.com" onChange={() => setIsDirty(true)} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Port</label>
                        <input type="text" className="w-full px-4 py-2 bg-muted/10 border border-border rounded-lg text-sm font-medium outline-none focus:border-primary" placeholder="587" onChange={() => setIsDirty(true)} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'outlets' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-foreground">Global Outlet Oversight</h2>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input type="text" placeholder="Search outlets..." className="w-full pl-9 pr-4 py-1.5 bg-card border border-border rounded-lg text-sm outline-none focus:border-primary" />
                  </div>
                </div>
                <div className="bg-card border border-border rounded-2xl overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-muted/20 border-b border-border">
                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Outlet</th>
                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Brand</th>
                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Location</th>
                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Status</th>
                        <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {tenants.flatMap(t => t.outlets.map(o => (
                        <tr key={o.id} className="hover:bg-muted/5 transition-colors">
                          <td className="px-6 py-4 font-bold text-foreground">{o.name}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground font-medium">{t.name}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground font-medium">{o.city}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-black rounded uppercase tracking-wider">Active</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground"><ChevronRight size={16} /></button>
                          </td>
                        </tr>
                      )))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'branding' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="px-6 py-5 border-b border-border bg-muted/20 flex items-center gap-3">
                    <PaintBucket className="w-5 h-5 text-primary" />
                    <div>
                      <h2 className="text-lg font-black text-foreground">Global Appearance</h2>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Theme & UI Preferences</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    {/* Theme section removed - now in global topbar settings */}

                    <div className="h-px bg-border"></div>

                    {/* Color Scheme */}
                    <div className="space-y-4">
                      <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Primary Color</label>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 space-y-1.5">
                          <input 
                            type="text" 
                            value={brandData.primaryColor}
                            onChange={e => handleDataChange(setBrandData, {...brandData, primaryColor: e.target.value})}
                            className="w-full px-4 py-2 bg-muted/10 border border-border rounded-lg text-sm font-bold outline-none focus:border-primary" 
                          />
                        </div>
                        <input 
                          type="color" 
                          value={brandData.primaryColor}
                          onChange={e => handleDataChange(setBrandData, {...brandData, primaryColor: e.target.value})}
                          className="w-12 h-10 bg-transparent border-none cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'toggles' && (
              <div className="p-12 text-center text-muted-foreground border-2 border-dashed border-border rounded-2xl bg-card/50">
                <Settings className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="font-bold text-foreground">{TABS.find(t => t.id === activeTab)?.label}</h3>
                <p className="text-sm mt-1">This section contains unified branding and feature toggles for the entire system.</p>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Modals */}
      {showResModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/10">
              <h2 className="text-xl font-black text-foreground">Create New Restaurant</h2>
              <button onClick={() => setShowResModal(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Brand Name</label>
                <input type="text" className="w-full px-4 py-2 bg-muted/10 border border-border rounded-lg text-sm font-medium outline-none focus:border-primary" placeholder="e.g. Burger King" value={newRes.name} onChange={e => setNewRes({...newRes, name: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Owner Email</label>
                <input type="email" className="w-full px-4 py-2 bg-muted/10 border border-border rounded-lg text-sm font-medium outline-none focus:border-primary" placeholder="admin@brand.com" value={newRes.email} onChange={e => setNewRes({...newRes, email: e.target.value})} />
              </div>
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-3 bg-muted/5">
              <button className="px-4 py-2 text-sm font-bold text-muted-foreground hover:bg-muted rounded-lg" onClick={() => setShowResModal(false)}>Cancel</button>
              <button className="px-4 py-2 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-sm" onClick={handleCreateRestaurant}>Create Brand</button>
            </div>
          </div>
        </div>
      )}

      {showOutletModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/10">
              <h2 className="text-xl font-black text-foreground">Add Outlet to {selectedTenant?.name}</h2>
              <button onClick={() => setShowOutletModal(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Outlet Name</label>
                <input type="text" className="w-full px-4 py-2 bg-muted/10 border border-border rounded-lg text-sm font-medium outline-none focus:border-primary" placeholder="e.g. Downtown" value={newOutlet.name} onChange={e => setNewOutlet({...newOutlet, name: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">City</label>
                <input type="text" className="w-full px-4 py-2 bg-muted/10 border border-border rounded-lg text-sm font-medium outline-none focus:border-primary" placeholder="New York" value={newOutlet.city} onChange={e => setNewOutlet({...newOutlet, city: e.target.value})} />
              </div>
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-3 bg-muted/5">
              <button className="px-4 py-2 text-sm font-bold text-muted-foreground hover:bg-muted rounded-lg" onClick={() => setShowOutletModal(false)}>Cancel</button>
              <button className="px-4 py-2 text-sm font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-sm" onClick={handleCreateOutlet}>Launch Outlet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
