import { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Users, ShoppingBag, Menu, Package, Store, 
  Settings, ChevronLeft, ChevronRight, BarChart3, 
  Tag, ToggleLeft, Globe, LogOut, User as UserIcon, Building, HelpCircle, ChevronUp, LayoutDashboard, Server, Bell, X, Moon, Sun, Search
} from 'lucide-react';
import GlobalSearchModal from './GlobalSearchModal';

const NAV_GROUPS = [
  {
    title: 'Analytics',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Reports & BI', href: '/reports', icon: BarChart3 },
    ]
  },
  {
    title: 'Operations',
    items: [
      { name: 'Orders', href: '/orders', icon: ShoppingBag },
      { name: 'Customers', href: '/customers', icon: Users },
      { name: 'Stores', href: '/stores', icon: Store },
      { name: 'Notifications', href: '/notifications', icon: Bell },
    ]
  },
  {
    title: 'Menu Engine',
    items: [
      { name: 'Menu', href: '/menu', icon: Menu },
      { name: 'Offers', href: '/offers', icon: Tag },
      { name: 'Availability', href: '/availability', icon: ToggleLeft },
      { name: 'Inventory', href: '/inventory', icon: Package },
    ]
  }
];

const SETTINGS_NAV = [
  { name: 'Store Settings', href: '/settings', icon: Settings },
  { name: 'Global Settings', href: '/global-settings', icon: Globe },
];

export default function Sidebar({ onOpenSwitchModal, activeBrand, isMobileOpen, onMobileClose }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark') || 
           localStorage.getItem('theme') === 'dark';
  });
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sidebarContent = (isMobile) => (
    <>
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-border shrink-0">
        <span className={`text-xl font-black text-foreground whitespace-nowrap overflow-hidden transition-all duration-300 ${!isMobile && isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto tracking-tight'}`}>
          Restrobopos
        </span>
        {!isMobile && (
          <span className={`text-2xl font-black text-primary transition-all duration-300 ${isCollapsed ? 'opacity-100 block mx-auto' : 'opacity-0 hidden'}`}>
            RB
          </span>
        )}
        {isMobile && (
          <button onClick={onMobileClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      
      {/* Collapse Toggle — desktop only */}
      {!isMobile && (
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 bg-primary text-primary-foreground rounded-full p-1 shadow-md hover:scale-110 transition-transform z-50"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      )}

      <div className="px-4 pt-4 pb-2">
        <button 
          onClick={() => { setIsSearchOpen(true); if (isMobile) onMobileClose(); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-all border border-border/50 hover:border-border ${!isMobile && isCollapsed ? 'justify-center' : ''}`}
        >
          <Search className="w-5 h-5 shrink-0" />
          <span className={`whitespace-nowrap transition-all duration-300 ${!isMobile && isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto block'}`}>
            Global Search...
          </span>
        </button>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto custom-scrollbar">
        {NAV_GROUPS.map((group, idx) => (
          <div key={idx} className="space-y-2">
            {(!isMobile && !isCollapsed || isMobile) && (
              <p className="px-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 opacity-60">
                {group.title}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => { if (!isMobile) setIsCollapsed(true); if (isMobile) onMobileClose(); }}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    } ${!isMobile && isCollapsed ? 'justify-center' : ''}`
                  }
                  title={!isMobile && isCollapsed ? item.name : undefined}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span className={`whitespace-nowrap transition-all duration-300 ${!isMobile && isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto block'}`}>
                    {item.name}
                  </span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}

        {/* Configuration Group */}
        <div className={`space-y-2`}>
           {(!isMobile && !isCollapsed || isMobile) && (
             <p className="px-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3 opacity-60">Settings</p>
           )}
           <div className="space-y-1">
            {SETTINGS_NAV.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => { if (!isMobile) setIsCollapsed(true); if (isMobile) onMobileClose(); }}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  } ${!isMobile && isCollapsed ? 'justify-center' : ''}`
                }
                title={!isMobile && isCollapsed ? item.name : undefined}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className={`whitespace-nowrap transition-all duration-300 ${!isMobile && isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto block'}`}>
                  {item.name}
                </span>
              </NavLink>
            ))}
           </div>
        </div>
      </nav>

      {/* Profile Section (Bottom Sticky) */}
      <div className="p-4 border-t border-border bg-muted/20 relative" ref={menuRef}>
        {/* Profile Menu Popover */}
        {isProfileMenuOpen && (
          <div className={`absolute ${!isMobile && isCollapsed ? 'left-full ml-4 bottom-0 w-64' : 'bottom-full left-4 right-4 mb-2'} bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in ${!isMobile && isCollapsed ? 'slide-in-from-left-2' : 'slide-in-from-bottom-2'} duration-200 z-[60]`}>
            <div className="p-4 border-b border-border bg-muted/30">
              <p className="font-black text-sm text-foreground truncate">John Doe</p>
              <p className="text-[10px] font-bold text-muted-foreground truncate">john@restro.com</p>
              <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                {activeBrand.role || 'Super Admin'}
              </div>
            </div>
            <div className="p-2 space-y-1">
              <button 
                onClick={() => { setIsProfileMenuOpen(false); navigate('/profile'); if (isMobileOpen) onMobileClose(); }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold rounded-lg hover:bg-muted text-foreground transition-colors text-left"
              >
                <UserIcon className="w-4 h-4 text-muted-foreground" /> My Profile
              </button>
              <button 
                onClick={() => { setIsProfileMenuOpen(false); onOpenSwitchModal(); }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold rounded-lg hover:bg-muted text-foreground transition-colors text-left"
              >
                <Building className="w-4 h-4 text-muted-foreground" /> Switch Restaurant
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold rounded-lg hover:bg-muted text-foreground transition-colors text-left">
                <HelpCircle className="w-4 h-4 text-muted-foreground" /> Help & Support
              </button>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-bold rounded-lg hover:bg-muted text-foreground transition-colors text-left"
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-muted-foreground" /> : <Moon className="w-4 h-4 text-muted-foreground" />}
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
            <div className="p-2 border-t border-border bg-muted/10">
              <button 
                onClick={() => {
                  localStorage.removeItem('isLoggedIn');
                  navigate('/login');
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-black rounded-lg hover:bg-red-50 text-red-600 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </div>
          </div>
        )}

        {/* Profile Trigger */}
        <button 
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className={`w-full flex items-center gap-3 transition-all ${!isMobile && isCollapsed ? 'justify-center' : 'px-2 py-2 rounded-xl bg-card border border-border shadow-sm hover:border-primary/50'}`}
        >
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-black text-xs shrink-0 shadow-inner">
            JD
          </div>
          {(!isMobile && !isCollapsed || isMobile) && (
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-black text-foreground truncate">John Doe</p>
              <p className="text-[10px] font-medium text-muted-foreground truncate">{activeBrand.name}</p>
            </div>
          )}
          {(!isMobile && !isCollapsed || isMobile) && (
            <ChevronUp size={14} className={`text-muted-foreground transition-transform duration-300 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
          )}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-card border-r border-border flex-col hidden md:flex transition-all duration-300 relative z-50 shrink-0 shadow-lg`}>
        {sidebarContent(false)}
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[90] md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200" 
            onClick={onMobileClose} 
          />
          {/* Drawer */}
          <div className="absolute inset-y-0 left-0 w-72 bg-card border-r border-border flex flex-col shadow-2xl animate-in slide-in-from-left duration-300 z-10">
            {sidebarContent(true)}
          </div>
        </div>
      )}
      
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
