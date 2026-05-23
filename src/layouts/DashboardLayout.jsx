import { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { 
  Maximize, Minimize, Settings as SettingsIcon, 
  ChevronRight, Save, X, Sun, Moon, Monitor, Palette, Menu as MenuIcon
} from 'lucide-react';
import Sidebar from '@shared/components/navigation/Sidebar';
import Topbar from '@shared/components/navigation/Topbar';
import { useOutletStore } from '@shared/store/useOutletStore';
import { useBrandStore } from '@shared/store/useBrandStore';



export default function DashboardLayout() {
  const location = useLocation();
  const activeBrand = useBrandStore(state => state.activeBrand);
  const activeOutlet = useOutletStore(state => state.activeOutlet);
  const setActiveOutlet = useOutletStore(state => state.setActiveOutlet);
  const outlets = useOutletStore(state => state.outlets);
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [discardKey, setDiscardKey] = useState(0);

  // Close mobile sidebar on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
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
    setDiscardKey(k => k + 1); // signal child pages to reset their state
  };

  const isDashboard = location.pathname === '/dashboard';
  const pageTitle = location.pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard';



  return (
    <div className={`flex h-screen overflow-hidden bg-background text-foreground`}>
      <Sidebar 
        activeBrand={activeBrand}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />
      <div className="flex flex-col flex-1 overflow-hidden relative">
        {isDashboard ? (
          <Topbar 
            activeBrand={activeBrand}
            activeOutlet={activeOutlet}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
            isDirty={isDirty}
            onSave={handleSave}
            onDiscard={handleDiscard}
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          />
        ) : (
          <header className="h-12 bg-card border-b border-border flex items-center justify-between px-4 md:px-5 shrink-0 z-40 shadow-sm">
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
               <span className="text-[13px] font-semibold text-foreground capitalize">{pageTitle}</span>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4">


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
          <Outlet context={{ isDirty, setIsDirty, discardKey, activeBrand, activeOutlet }} />
        </main>
      </div>
    </div>
  );
}
