import { useState, useEffect } from 'react';
import { 
  X, Bell, Smartphone, Send, Image as ImageIcon, 
  Plus, Search, Info, Wand2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DYNAMIC_VARIABLES = [
  { label: 'Customer Name', value: '{{customer_name}}', example: 'John Doe' },
  { label: 'City', value: '{{city}}', example: 'New York' },
  { label: 'Story Name', value: '{{story_name}}', example: 'Pizza Hut' },
  { label: 'Discount Code', value: '{{promo_code}}', example: 'WELCOME50' },
];

const APP_SCREENS = [
  'Home', 'Menu', 'Offers', 'Cart', 'Profile', 'Past Orders', 'Stores'
];

export default function NotificationDrawer({ isOpen, onClose, initialData, onSave }) {
  const [activeLang, setActiveLang] = useState('English');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetScreen, setTargetScreen] = useState('Home');
  const [targeting, setTargeting] = useState('all'); // 'all' or 'specific'
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('');
  const [showVariableMenu, setShowVariableMenu] = useState(false);
  const [activeField, setActiveField] = useState(null); // 'title' or 'description'

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setTargetScreen(initialData.targetScreen || 'Home');
      setTargeting(initialData.targeting || 'all');
      setIsScheduled(initialData.status === 'Scheduled');
    } else {
      setTitle('');
      setDescription('');
      setTargetScreen('Home');
      setTargeting('all');
      setIsScheduled(false);
    }
  }, [initialData, isOpen]);

  const handleSave = () => {
    if (!title) {
      alert('Please enter a title');
      return;
    }
    onSave({
      id: initialData?.id,
      title,
      description,
      targetScreen,
      targeting,
      isScheduled,
      scheduledTime
    });
  };

  const insertVariable = (variable) => {
    if (activeField === 'title') {
      setTitle(prev => prev + ' ' + variable);
    } else if (activeField === 'description') {
      setDescription(prev => prev + ' ' + variable);
    }
    setShowVariableMenu(false);
  };

  const generateAICopy = () => {
    // Simulated AI copywriting
    const suggestions = [
      { t: "Hungry? Your favorite is waiting! 🍕", d: "Order now and get 20% off on your first order of the day." },
      { t: "Flash Sale Alert! ⚡", d: "Limited time offer: Buy 1 Get 1 Free on all medium pizzas!" },
      { t: "We miss you, {{customer_name}}! ❤️", d: "Come back today and enjoy a complimentary dessert with your meal." }
    ];
    const random = suggestions[Math.floor(Math.random() * suggestions.length)];
    setTitle(random.t);
    setDescription(random.d);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-5xl bg-background border-l border-border z-[9999] shadow-2xl flex overflow-hidden"
          >
            {/* Left Side: Configuration Form */}
            <div className="flex-1 flex flex-col h-full bg-background border-r border-border">
              {/* Header */}
              <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-background z-20">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Notification</h2>
                  </div>
                </div>
                <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                {/* Language Selection */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Language</label>
                  <div className="flex p-1 bg-muted rounded-lg w-fit">
                    {['English', 'Hindi'].map(lang => (
                      <button
                        key={lang}
                        onClick={() => setActiveLang(lang)}
                        className={`px-5 py-1.5 rounded-md text-xs font-bold transition-all ${
                          activeLang === lang ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content Configuration */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Content</label>
                    <button 
                      onClick={generateAICopy}
                      className="flex items-center gap-1 text-[10px] font-bold text-primary hover:underline"
                    >
                      <Wand2 className="w-3 h-3" /> AI Suggest
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      onFocus={() => setActiveField('title')}
                      className="w-full bg-muted/20 border border-border rounded-lg px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-primary transition-all"
                    />
                    <div className="relative">
                      <textarea 
                        placeholder="Description"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onFocus={() => setActiveField('description')}
                        className="w-full bg-muted/20 border border-border rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-primary transition-all resize-none"
                      />
                      <button 
                        onClick={() => setShowVariableMenu(!showVariableMenu)}
                        className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground rounded text-[10px] font-bold"
                      >
                        <Plus className="w-3 h-3" /> Variable
                      </button>

                      {/* Variable Menu */}
                      <AnimatePresence>
                        {showVariableMenu && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute bottom-full right-0 mb-2 w-64 bg-card border border-border rounded-md shadow-2xl overflow-hidden z-10"
                          >
                            <div className="p-3 border-b border-border bg-muted/30">
                              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Available Tags</p>
                            </div>
                            <div className="p-2 space-y-1">
                              {DYNAMIC_VARIABLES.map(v => (
                                <button
                                  key={v.value}
                                  onClick={() => insertVariable(v.value)}
                                  className="w-full text-left p-3 rounded-lg hover:bg-muted group transition-colors"
                                >
                                  <p className="text-xs font-black text-foreground">{v.label}</p>
                                  <p className="text-[10px] font-medium text-muted-foreground group-hover:text-primary transition-colors">{v.value}</p>
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Routing & targeting */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Redirect Screen</label>
                    <select 
                      value={targetScreen}
                      onChange={(e) => setTargetScreen(e.target.value)}
                      className="w-full bg-muted/20 border border-border rounded-lg px-4 py-2 text-sm font-bold focus:outline-none focus:border-primary appearance-none"
                    >
                      {APP_SCREENS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Audience</label>
                    <div className="flex p-1 bg-muted rounded-lg">
                      <button 
                        onClick={() => setTargeting('all')}
                        className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${targeting === 'all' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'}`}
                      >
                        All
                      </button>
                      <button 
                        onClick={() => setTargeting('specific')}
                        className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${targeting === 'specific' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'}`}
                      >
                        Specific
                      </button>
                    </div>
                  </div>
                </div>

                {/* Specific Outlets Selection (Conditional) */}
                {targeting === 'specific' && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="p-5 border border-primary/20 bg-primary/5 rounded-lg space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary">Select Outlets / Cities</p>
                      <button className="text-[10px] font-black uppercase text-primary underline">Select All</button>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-primary/60" />
                      <input 
                        type="text" 
                        placeholder="Search outlets..."
                        className="w-full bg-background/50 border border-primary/10 rounded-lg py-2 pl-9 pr-4 text-xs font-bold focus:outline-none"
                      />
                    </div>
                    <div className="max-h-32 overflow-y-auto space-y-2 custom-scrollbar">
                      {['New York (All)', 'London (Central)', 'Downtown Bistro', 'Uptown Grill'].map(o => (
                        <label key={o} className="flex items-center gap-3 cursor-pointer group">
                          <input type="checkbox" className="w-4 h-4 rounded border-primary/20 text-primary focus:ring-primary/20" />
                          <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{o}</span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Image & Scheduling */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Notification Image</label>
                    <button className="w-full border-2 border-dashed border-border rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:border-primary/40 hover:bg-primary/5 transition-all group">
                      <div className="p-3 bg-muted rounded-md group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">Upload Banner</span>
                    </button>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Scheduling</label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <div 
                          onClick={() => setIsScheduled(!isScheduled)}
                          className={`w-9 h-5 rounded-full relative transition-colors ${isScheduled ? 'bg-primary' : 'bg-muted'}`}
                        >
                          <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${isScheduled ? 'translate-x-4' : ''}`} />
                        </div>
                        <span className="text-xs font-bold text-foreground">Schedule</span>
                      </label>
                      {isScheduled && (
                        <div className="space-y-2">
                          <input 
                            type="datetime-local"
                            value={scheduledTime}
                            onChange={(e) => setScheduledTime(e.target.value)}
                            className="w-full bg-muted/20 border border-border rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:border-primary transition-all"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border bg-background flex items-center justify-between sticky bottom-0 z-20">
                <button 
                  onClick={onClose}
                  className="px-4 py-2 border border-border rounded-lg text-xs font-bold hover:bg-muted transition-colors uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="flex items-center gap-2 px-8 py-2 bg-primary text-primary-foreground rounded-lg font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>{isScheduled ? 'Schedule' : 'Send Now'}</span>
                </button>
              </div>
            </div>

            {/* Right Side: Live Preview (Sticky) */}
            <div className="w-[360px] bg-muted/20 border-l border-border p-5 flex flex-col items-center justify-center">
              <div className="w-full space-y-6">
                <div className="flex items-center gap-2 px-4">
                  <Smartphone className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mobile Live Preview</span>
                </div>

                {/* iPhone Frame */}
                <div className="relative w-full aspect-[9/19] bg-[#1a1a1a] rounded-[45px] border-[8px] border-[#333] shadow-2xl p-4 flex flex-col overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#333] rounded-b-2xl z-20" />
                  
                  {/* Lock Screen UI */}
                  <div className="relative z-10 pt-12 flex flex-col items-center">
                    <p className="text-4xl font-light text-white/90">
                      {isScheduled && scheduledTime 
                        ? new Date(scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                        : '05:30'}
                    </p>
                    <p className="text-xs font-medium text-white/60">
                      {isScheduled && scheduledTime 
                        ? new Date(scheduledTime).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' }) 
                        : 'Sunday, May 10'}
                    </p>
                  </div>

                  {/* Notification Card */}
                  <div className="mt-12 space-y-2">
                    <motion.div 
                      layout
                      className="bg-white/90 backdrop-blur-md rounded-lg p-3.5 shadow-xl"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-primary rounded flex items-center justify-center">
                            <span className="text-[8px] font-black text-white">RB</span>
                          </div>
                          <span className="text-[10px] font-black text-black/80 uppercase">Restrobopos</span>
                        </div>
                        <span className="text-[9px] font-bold text-black/40 uppercase">Now</span>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-black text-black">
                          {title || 'Notification Title'}
                        </p>
                        <p className="text-[11px] font-medium text-black/60 leading-relaxed">
                          {description || 'Notification description will appear here...'}
                        </p>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <div className="flex-1 h-1.5 bg-black/5 rounded-full" />
                        <div className="w-4 h-1.5 bg-primary/20 rounded-full" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Wallpaper Effect */}
                  <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-80" />
                </div>
                
                <div className="bg-card border border-border rounded-md p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Reach Estimation</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-black">
                      <span className="text-muted-foreground">Target Users</span>
                      <span className="text-foreground">~{targeting === 'all' ? '12,450' : '420'}</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className={`h-full bg-primary transition-all duration-1000 ${targeting === 'all' ? 'w-full' : 'w-1/4'}`} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
