import { Bike, Package, Utensils, Maximize, Minimize, Save, X, Settings as SettingsIcon, Menu as MenuIcon } from 'lucide-react';
import { useOutletSettingsStore } from '../../store/useOutletSettingsStore';
import { useOutletStore } from '../../store/useOutletStore';

export default function Topbar({ 
  activeBrand, 
  activeOutlet,
  isFullscreen, 
  onToggleFullscreen,
  isDirty,
  onSave,
  onDiscard,
  onOpenMobileSidebar
}) {
  const settings = useOutletSettingsStore(state => state.settings[activeOutlet.id]) || {
    master: true, delivery: true, takeaway: true, dineIn: true
  };
  const toggleSetting = useOutletSettingsStore(state => state.toggleSetting);
  
  const outlets = useOutletStore(state => state.outlets);
  const setActiveOutlet = useOutletStore(state => state.setActiveOutlet);

  const { master: masterSwitch, delivery: deliverySwitch, takeaway: takeawaySwitch, dineIn: dineInSwitch } = settings;

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4 shrink-0 shadow-sm z-40 transition-all duration-300">
      
      {/* Left: Brand, Outlet & Master Switch */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        
        {/* Mobile Hamburger */}
        <button onClick={onOpenMobileSidebar} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground md:hidden shrink-0">
          <MenuIcon className="w-4 h-4" />
        </button>

        <select 
          className="bg-background border border-border rounded-md px-3 py-1.5 text-sm font-bold outline-none focus:border-primary shrink-0 max-w-[140px] sm:max-w-[200px] truncate cursor-pointer hover:bg-muted transition-colors"
          value={activeOutlet.id}
          onChange={(e) => setActiveOutlet(e.target.value)}
        >
          {outlets.map(outlet => (
            <option key={outlet.id} value={outlet.id}>📍 {outlet.name}</option>
          ))}
        </select>

        <div className="w-px h-6 bg-border hidden sm:block"></div>

        <div className="items-center gap-2 hidden sm:flex">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Store Status</span>
          <button 
            onClick={() => toggleSetting(activeOutlet.id, 'master')}
            className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${masterSwitch ? 'bg-green-500' : 'bg-red-500'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full absolute transition-all shadow-sm ${masterSwitch ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
      </div>

      {/* Right: Actions & Toggles */}
      <div className="flex items-center gap-2.5">


        <div className="flex items-center gap-2.5 bg-muted/30 px-3 py-1.5 rounded-lg border border-border hidden md:flex">
          
          {/* Delivery Toggle */}
          <div className="flex items-center gap-2" title="Toggle Delivery Orders">
            <Bike className="w-3.5 h-3.5 text-blue-600" />
            <button 
              onClick={() => toggleSetting(activeOutlet.id, 'delivery')}
              className={`w-8 h-4 rounded-full transition-colors relative flex items-center ${deliverySwitch ? 'bg-blue-500' : 'bg-muted-foreground/30'}`}
            >
              <div className={`w-3 h-3 bg-white rounded-full absolute transition-all shadow-sm ${deliverySwitch ? 'left-4.5' : 'left-0.5'}`} />
            </button>
          </div>

          <div className="w-px h-4 bg-border"></div>
          
          {/* Takeaway Toggle */}
          <div className="flex items-center gap-2" title="Toggle Takeaway Orders">
            <Package className="w-3.5 h-3.5 text-orange-500" />
            <button 
              onClick={() => toggleSetting(activeOutlet.id, 'takeaway')}
              className={`w-8 h-4 rounded-full transition-colors relative flex items-center ${takeawaySwitch ? 'bg-orange-500' : 'bg-muted-foreground/30'}`}
            >
              <div className={`w-3 h-3 bg-white rounded-full absolute transition-all shadow-sm ${takeawaySwitch ? 'left-4.5' : 'left-0.5'}`} />
            </button>
          </div>

          <div className="w-px h-4 bg-border"></div>

          {/* Dine-in Toggle */}
          <div className="flex items-center gap-2" title="Toggle Dine-in Orders">
            <Utensils className="w-3.5 h-3.5 text-green-600" />
            <button 
              onClick={() => toggleSetting(activeOutlet.id, 'dineIn')}
              className={`w-8 h-4 rounded-full transition-colors relative flex items-center ${dineInSwitch ? 'bg-green-500' : 'bg-muted-foreground/30'}`}
            >
              <div className={`w-3 h-3 bg-white rounded-full absolute transition-all shadow-sm ${dineInSwitch ? 'left-4.5' : 'left-0.5'}`} />
            </button>
          </div>
        </div>

        <div className="w-px h-6 bg-border hidden sm:block"></div>



        <button 
          onClick={onToggleFullscreen}
          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
          title={isFullscreen ? "Exit Fullscreen (Esc)" : "Enter Fullscreen"}
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
