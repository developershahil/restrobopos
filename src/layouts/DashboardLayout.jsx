import { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { 
  Maximize, Minimize, Settings as SettingsIcon, LayoutDashboard, Server, 
  ChevronRight, Save, X, Sun, Moon, Monitor, Palette, Menu as MenuIcon
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import SwitchRestaurantModal from '../components/modals/SwitchRestaurantModal';

const MOCK_BRANDS = [
  { id: 'b1', name: 'Burger King', role: 'Super Admin', outlets: 12, status: 'Active', color: 'bg-orange-500', initials: 'BK' },
  { id: 'b2', name: 'Pizza Hut', role: 'Owner', outlets: 5, status: 'Active', color: 'bg-red-600', initials: 'PH' },
  { id: 'b3', name: 'Taco Bell', role: 'Manager', outlets: 2, status: 'Pending Billing', color: 'bg-purple-600', initials: 'TB' },
  { id: 'b4', name: 'KFC', role: 'Owner', outlets: 8, status: 'Active', color: 'bg-red-700', initials: 'KF' }
];

export default function DashboardLayout() {
  const location = useLocation();
  const [activeBrand, setActiveBrand] = useState(MOCK_BRANDS[0]);
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [theme, setTheme] = useState('light'); // 'light' | 'dark' | 'system'
  const [isDirty, setIsDirty] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const settingsRef = useRef(null);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Theme Application Logic
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Click outside to close settings
  useEffect(() => {
    function handleClickOutside(event) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleSave = () => {
    setIsDirty(false);
  };

  const handleDiscard = () => {
    setIsDirty(false);
    window.location.reload(); 
  };

  const isDashboard = location.pathname === '/dashboard';
  const pageTitle = location.pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard';

  const SettingsDropdown = () => (
    <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-primary" />
          <span className="font-black text-sm text-foreground">UI Settings</span>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Theme Mode</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'light', icon: Sun, label: 'Light' },
              { id: 'dark', icon: Moon, label: 'Dark' },
              { id: 'system', icon: Monitor, label: 'System' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => { setTheme(t.id); setIsDirty(true); }}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border-2 transition-all ${
                  theme === t.id 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-border bg-muted/5 text-muted-foreground hover:bg-muted'
                }`}
              >
                <t.icon size={16} />
                <span className="text-[10px] font-bold">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="p-2 border-t border-border bg-muted/10 text-center">
        <p className="text-[10px] font-medium text-muted-foreground">Restrobopos v2.4.0</p>
      </div>
    </div>
  );

  return (
    <div className={`flex h-screen overflow-hidden bg-background text-foreground`}>
      <Sidebar 
        onOpenSwitchModal={() => setIsSwitchModalOpen(true)} 
        activeBrand={activeBrand}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        {isDashboard ? (
          <Topbar 
            activeBrand={activeBrand} 
            onOpenSwitchModal={() => setIsSwitchModalOpen(true)} 
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
            isDirty={isDirty}
            onSave={handleSave}
            onDiscard={handleDiscard}
            isSettingsOpen={isSettingsOpen}
            onToggleSettings={() => setIsSettingsOpen(!isSettingsOpen)}
            settingsRef={settingsRef}
            SettingsDropdown={SettingsDropdown}
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          />
        ) : (
          <header className="h-12 bg-card border-b border-border flex items-center justify-between px-4 md:px-6 shrink-0 z-40 shadow-sm">
            <div className="flex items-center gap-2">
               {/* Mobile hamburger */}
               <button 
                 onClick={() => setIsMobileSidebarOpen(true)} 
                 className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground md:hidden"
               >
                 <MenuIcon className="w-5 h-5" />
               </button>
               <span className="text-xs font-black text-muted-foreground uppercase tracking-widest opacity-60 hidden sm:inline">System</span>
               <ChevronRight size={12} className="text-muted-foreground/40 hidden sm:inline" />
               <span className="text-sm font-black text-foreground capitalize">{pageTitle}</span>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">
              {isDirty && (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                  <button onClick={handleDiscard} className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 text-xs font-bold text-muted-foreground hover:bg-muted rounded-lg">
                    <X size={14} /> <span className="hidden sm:inline">Discard</span>
                  </button>
                  <button onClick={handleSave} className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-sm">
                    <Save size={14} /> <span className="hidden sm:inline">Save</span>
                  </button>
                  <div className="w-px h-4 bg-border mx-1 md:mx-2 hidden sm:block"></div>
                </div>
              )}

              <div className="relative" ref={settingsRef}>
                <button 
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className={`p-1.5 rounded-lg transition-all ${isSettingsOpen ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
                >
                  <SettingsIcon className="w-4 h-4" />
                </button>
                {isSettingsOpen && <SettingsDropdown />}
              </div>

              <button 
                onClick={toggleFullscreen}
                className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all hidden sm:block"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </header>
        )}
        <main className="flex-1 overflow-y-auto">
          <Outlet context={{ theme, setTheme, isDirty, setIsDirty }} />
        </main>
      </div>

      <SwitchRestaurantModal 
        isOpen={isSwitchModalOpen} 
        onClose={() => setIsSwitchModalOpen(false)} 
        brands={MOCK_BRANDS}
        activeBrand={activeBrand}
        onSelectBrand={setActiveBrand}
      />
    </div>
  );
}
