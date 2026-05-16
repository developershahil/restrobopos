import { useState } from 'react';
import { useMenuStore } from '../../../store/useMenuStore';
import { Send, Clock, Calendar, CheckCircle2, XCircle, FileText, ChevronRight, Check } from 'lucide-react';

const PLATFORMS = [
  { id: 'Swiggy', name: 'Swiggy', color: 'bg-orange-500' },
  { id: 'Zomato', name: 'Zomato', color: 'bg-red-500' },
  { id: 'POS', name: 'Restro POS', color: 'bg-indigo-500' },
  { id: 'App', name: 'Mobile App', color: 'bg-blue-500' },
];

export default function MenuPushTab() {
  const { menus, selectedMenuId, scheduledPushes, pushHistory, schedulePush, recordPush, cancelPush } = useMenuStore();
  const [selectedPushMenuId, setSelectedPushMenuId] = useState(selectedMenuId || (menus.length > 0 ? menus[0].id : null));
  const selectedPushMenu = menus.find(m => m.id === selectedPushMenuId);

  const [selectedPlatforms, setSelectedPlatforms] = useState(['Swiggy', 'Zomato', 'POS', 'App']);
  const [scheduleType, setScheduleType] = useState('now'); // 'now' | 'later'
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [notes, setNotes] = useState('');
  
  const [isPushing, setIsPushing] = useState(false);
  const [pushSuccess, setPushSuccess] = useState(false);

  const togglePlatform = (id) => {
    setSelectedPlatforms(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleDeploy = () => {
    if (selectedPlatforms.length === 0) return;

    if (scheduleType === 'now') {
      setIsPushing(true);
      setTimeout(() => {
        setIsPushing(false);
        setPushSuccess(true);
        const prefix = `[${selectedPushMenu?.name || 'Menu'}] `;
        recordPush({ platforms: selectedPlatforms, notes: prefix + (notes || 'Immediate Deployment') });
        setTimeout(() => setPushSuccess(false), 3000);
        setNotes('');
      }, 1500);
    } else {
      if (!scheduleDate || !scheduleTime) return;
      
      const dateTimeString = `${scheduleDate}T${scheduleTime}`;
      const prefix = `[${selectedPushMenu?.name || 'Menu'}] `;
      schedulePush({
        platforms: selectedPlatforms,
        dateTime: new Date(dateTimeString).toISOString(),
        notes: prefix + (notes || 'Scheduled Deployment')
      });
      setScheduleDate('');
      setScheduleTime('');
      setNotes('');
      setScheduleType('now');
    }
  };

  return (
    <div className="flex h-full bg-background overflow-hidden flex-col md:flex-row">
      
      {/* LEFT PANEL: CONFIGURATION */}
      <div className="w-full md:w-1/2 p-4 md:p-6 md:border-r border-b md:border-b-0 border-border overflow-y-auto custom-scrollbar flex flex-col">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-foreground">Deploy Menu Updates</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Push your local menu changes to active platforms safely and securely.
          </p>
        </div>

        {/* 1. Target Menu */}
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] text-foreground">1</span> 
            Target Menu
          </h3>
          <select
            value={selectedPushMenuId}
            onChange={(e) => setSelectedPushMenuId(e.target.value)}
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary cursor-pointer transition-colors shadow-sm"
          >
            {menus.map(m => (
              <option key={m.id} value={m.id}>
                {m.name} {m.type === 'Festive' ? '🎉' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Platforms */}
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] text-foreground">2</span> 
            Select Platforms
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {PLATFORMS.map(p => {
              const isSelected = selectedPlatforms.includes(p.id);
              return (
                <div 
                  key={p.id}
                  onClick={() => togglePlatform(p.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-border/80 hover:bg-muted/30'
                  }`}
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                    isSelected ? p.color : 'bg-muted border border-border'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-sm font-semibold text-foreground">{p.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Timing */}
        <div className="mb-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] text-foreground">3</span> 
            Deployment Timing
          </h3>
          
          <div className="flex gap-4 mb-4">
            <label className={`flex-1 flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${scheduleType === 'now' ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}>
              <div className="flex items-center gap-2 mb-1">
                <input type="radio" name="timing" checked={scheduleType === 'now'} onChange={() => setScheduleType('now')} className="accent-primary" />
                <span className="text-sm font-bold">Push Immediately</span>
              </div>
              <span className="text-xs text-muted-foreground pl-5">Sync changes to selected platforms right now.</span>
            </label>
            
            <label className={`flex-1 flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${scheduleType === 'later' ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}>
              <div className="flex items-center gap-2 mb-1">
                <input type="radio" name="timing" checked={scheduleType === 'later'} onChange={() => setScheduleType('later')} className="accent-primary" />
                <span className="text-sm font-bold">Schedule for Later</span>
              </div>
              <span className="text-xs text-muted-foreground pl-5">Automatically deploy at a specific date and time.</span>
            </label>
          </div>

          {scheduleType === 'later' && (
            <div className="flex gap-4 p-4 bg-muted/30 border border-border rounded-xl animate-in slide-in-from-top-2 duration-200">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Date</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-primary" />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Time</label>
                <div className="relative">
                  <Clock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-primary" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. Notes */}
        <div className="mb-8 flex-1">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] text-foreground">4</span> 
            Release Notes (Optional)
          </h3>
          <div className="relative">
            <FileText className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <textarea 
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g., Updated prices for Diwali weekend..."
              className="w-full pl-9 pr-3 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-primary resize-none"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-border mt-auto">
          <button 
            onClick={handleDeploy}
            disabled={selectedPlatforms.length === 0 || isPushing || (scheduleType === 'later' && (!scheduleDate || !scheduleTime))}
            className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
              pushSuccess 
                ? 'bg-green-500 text-white shadow-none' 
                : selectedPlatforms.length > 0 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5' 
                  : 'bg-muted text-muted-foreground cursor-not-allowed shadow-none'
            }`}
          >
            {pushSuccess ? (
              <><CheckCircle2 className="w-5 h-5" /> Successfully Deployed</>
            ) : isPushing ? (
              <><Clock className="w-5 h-5 animate-spin" /> Deploying...</>
            ) : scheduleType === 'now' ? (
              <><Send className="w-5 h-5" /> Deploy Menu Now</>
            ) : (
              <><Calendar className="w-5 h-5" /> Schedule Deployment</>
            )}
          </button>
        </div>
      </div>

      {/* RIGHT PANEL: QUEUE & HISTORY */}
      <div className="w-full md:w-1/2 flex flex-col bg-muted/10 md:border-l border-border">
        
        {/* Pending Queue */}
        <div className="flex-1 p-4 md:p-6 border-b border-border overflow-y-auto custom-scrollbar">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">Scheduled Pushes</h3>
          
          {scheduledPushes.length === 0 ? (
            <div className="border border-dashed border-border rounded-xl py-8 text-center text-muted-foreground bg-card">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold">No scheduled pushes</p>
            </div>
          ) : (
            <div className="space-y-3">
              {scheduledPushes.map(push => (
                <div key={push.id} className="bg-card border border-border rounded-xl p-4 shadow-sm flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold uppercase">{new Date(push.dateTime).toLocaleString('en-US', { month: 'short' })}</span>
                    <span className="text-lg font-black leading-none">{new Date(push.dateTime).getDate()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-bold text-foreground">
                        {new Date(push.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <button onClick={() => cancelPush(push.id)} className="text-[10px] font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-0.5 rounded transition-colors">
                        Cancel
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-1.5">
                      {push.platforms.map(p => (
                        <span key={p} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{p}</span>
                      ))}
                    </div>
                    {push.notes && <p className="text-xs text-muted-foreground truncate">{push.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* History */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto custom-scrollbar">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">Deployment History</h3>
          
          <div className="space-y-3">
            {pushHistory.map((hist, idx) => (
              <div key={hist.id} className="flex gap-4 relative">
                {/* Timeline line */}
                {idx !== pushHistory.length - 1 && (
                  <div className="absolute left-3 top-8 bottom-[-16px] w-px bg-border z-0" />
                )}
                
                <div className="w-6 h-6 rounded-full bg-green-100 border-2 border-white flex items-center justify-center shrink-0 z-10">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">Menu Deployed</p>
                    <span className="text-[10px] text-muted-foreground font-semibold">
                      {new Date(hist.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </div>
                  <div className="flex gap-1 mt-1 mb-1">
                    {hist.platforms.map(p => (
                      <span key={p} className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-card border border-border text-foreground">{p}</span>
                    ))}
                  </div>
                  {hist.notes && <p className="text-xs text-muted-foreground mt-1">{hist.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
