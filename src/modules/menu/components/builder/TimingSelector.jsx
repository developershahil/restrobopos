import { useMenuStore } from '@modules/menu/store/useMenuStore';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function TimingSelector({ itemId, categoryId, value, onChange }) {
  const { itemTiming, setItemTiming, categoryTiming, setCategoryTiming } = useMenuStore();
  
  const id = itemId || categoryId;
  const isItem = !!itemId;
  
  const storeTiming = id ? (isItem ? itemTiming[id] : categoryTiming[id]) : null;
  const defaultTiming = { alwaysAvailable: true, days: [], startTime: '', endTime: '' };
  
  const currentTiming = value || storeTiming || defaultTiming;

  const update = (patch) => {
    const nextTiming = { ...currentTiming, ...patch };
    if (onChange) {
      onChange(nextTiming);
    } else if (id) {
      if (isItem) {
        setItemTiming(id, nextTiming);
      } else {
        setCategoryTiming(id, nextTiming);
      }
    }
  };

  const toggleDay = (day) => {
    const days = currentTiming.days.includes(day)
      ? currentTiming.days.filter(d => d !== day)
      : [...currentTiming.days, day];
    update({ days });
  };

  return (
    <div className="space-y-3">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Availability</span>

      {/* Toggle */}
      <div className="flex gap-2">
        <button
          onClick={(e) => { e.preventDefault(); update({ alwaysAvailable: true }); }}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
            currentTiming.alwaysAvailable
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background text-muted-foreground border-border hover:bg-muted'
          }`}
        >
          Always Available
        </button>
        <button
          onClick={(e) => { e.preventDefault(); update({ alwaysAvailable: false }); }}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
            !currentTiming.alwaysAvailable
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background text-muted-foreground border-border hover:bg-muted'
          }`}
        >
          Custom Timing
        </button>
      </div>

      {/* Custom timing config */}
      {!currentTiming.alwaysAvailable && (
        <div className="space-y-3 border border-border rounded-lg p-3 bg-card">
          {/* Days */}
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1.5">Select Days</p>
            <div className="flex flex-wrap gap-1">
              {DAYS.map(day => (
                <button
                  type="button"
                  key={day}
                  onClick={(e) => { e.preventDefault(); toggleDay(day); }}
                  className={`px-2 py-1 rounded-md text-xs font-semibold transition-colors ${
                    currentTiming.days.includes(day)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Time range */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Start Time</p>
              <input
                type="time"
                value={currentTiming.startTime}
                onChange={(e) => update({ startTime: e.target.value })}
                className="w-full bg-background border border-border rounded-md px-2 py-1.5 text-xs outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">End Time</p>
              <input
                type="time"
                value={currentTiming.endTime}
                onChange={(e) => update({ endTime: e.target.value })}
                className="w-full bg-background border border-border rounded-md px-2 py-1.5 text-xs outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
