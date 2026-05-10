import { useState } from 'react';
import { Bike, Package, Utensils, Maximize, Minimize, Save, X, Settings as SettingsIcon } from 'lucide-react';

export default function Topbar({ 
  activeBrand, 
  onOpenSwitchModal, 
  isFullscreen, 
  onToggleFullscreen,
  isDirty,
  onSave,
  onDiscard,
  isSettingsOpen,
  onToggleSettings,
  settingsRef,
  SettingsDropdown
}) {
  const [masterSwitch, setMasterSwitch] = useState(true);
  const [deliverySwitch, setDeliverySwitch] = useState(true);
  const [takeawaySwitch, setTakeawaySwitch] = useState(true);
  const [dineInSwitch, setDineInSwitch] = useState(true);

  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-4 shrink-0 shadow-sm z-40 transition-all duration-300">
      
      {/* Left: Brand, Outlet & Master Switch */}
      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* Current Brand Context */}
        <div className="flex items-center gap-2 px-2.5 py-1.5 bg-primary/10 border border-primary/20 rounded-md shrink-0 transition-all duration-300 cursor-pointer hover:bg-primary/20" onClick={onOpenSwitchModal}>
          <div className={`w-5 h-5 rounded ${activeBrand.color} flex items-center justify-center text-white font-black text-[10px] shadow-sm transition-colors duration-300`}>
            {activeBrand.initials}
          </div>
          <span className="font-black text-sm text-primary hidden lg:block tracking-tight transition-all">{activeBrand.name}</span>
        </div>

        <span className="text-muted-foreground/40 font-light hidden sm:block">/</span>

        <select className="bg-background border border-border rounded-md px-3 py-1.5 text-sm font-bold outline-none focus:border-primary shrink-0 max-w-[140px] sm:max-w-[200px] truncate">
          <option>📍 All Outlets</option>
          <option>📍 Koramangala Branch</option>
          <option>📍 Indiranagar Branch</option>
        </select>

        <div className="w-px h-6 bg-border hidden sm:block"></div>

        <div className="items-center gap-2 hidden sm:flex">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Store Status</span>
          <button 
            onClick={() => setMasterSwitch(!masterSwitch)}
            className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${masterSwitch ? 'bg-green-500' : 'bg-red-500'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full absolute transition-all shadow-sm ${masterSwitch ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
      </div>

      {/* Right: Actions & Toggles */}
      <div className="flex items-center gap-4">
        {/* Dirty State Actions */}
        {isDirty && (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300 mr-2">
            <button 
              onClick={onDiscard}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-muted-foreground hover:bg-muted rounded-lg transition-colors"
            >
              <X size={14} /> Discard
            </button>
            <button 
              onClick={onSave}
              className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-sm transition-colors"
            >
              <Save size={14} /> Save Changes
            </button>
            <div className="w-px h-6 bg-border mx-2"></div>
          </div>
        )}

        <div className="flex items-center gap-4 bg-muted/30 px-3 py-1.5 rounded-lg border border-border hidden md:flex">
          
          {/* Delivery Toggle */}
          <div className="flex items-center gap-2" title="Toggle Delivery Orders">
            <Bike className="w-3.5 h-3.5 text-blue-600" />
            <button 
              onClick={() => setDeliverySwitch(!deliverySwitch)}
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
              onClick={() => setTakeawaySwitch(!takeawaySwitch)}
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
              onClick={() => setDineInSwitch(!dineInSwitch)}
              className={`w-8 h-4 rounded-full transition-colors relative flex items-center ${dineInSwitch ? 'bg-green-500' : 'bg-muted-foreground/30'}`}
            >
              <div className={`w-3 h-3 bg-white rounded-full absolute transition-all shadow-sm ${dineInSwitch ? 'left-4.5' : 'left-0.5'}`} />
            </button>
          </div>
        </div>

        <div className="w-px h-6 bg-border hidden sm:block"></div>

        {/* Global UI Settings */}
        <div className="relative" ref={settingsRef}>
          <button 
            onClick={onToggleSettings}
            className={`p-1.5 rounded-lg transition-all ${isSettingsOpen ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
            title="UI Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
          {isSettingsOpen && <SettingsDropdown />}
        </div>

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
