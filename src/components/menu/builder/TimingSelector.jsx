import { useMenuStore } from '../../../store/useMenuStore';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function TimingSelector({ itemId }) {
  const { itemTiming, setItemTiming } = useMenuStore();
  const timing = itemTiming[itemId] || { alwaysAvailable: true, days: [], startTime: '', endTime: '' };

  const update = (patch) => setItemTiming(itemId, { ...timing, ...patch });

  const toggleDay = (day) => {
    const days = timing.days.includes(day)
      ? timing.days.filter(d => d !== day)
      : [...timing.days, day];
    update({ days });
  };

  return (
    <div className="space-y-3">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Availability</span>

      {/* Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => update({ alwaysAvailable: true })}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
            timing.alwaysAvailable
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background text-muted-foreground border-border hover:bg-muted'
          }`}
        >
          Always Available
        </button>
        <button
          onClick={() => update({ alwaysAvailable: false })}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
            !timing.alwaysAvailable
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background text-muted-foreground border-border hover:bg-muted'
          }`}
        >
          Custom Timing
        </button>
      </div>

      {/* Custom timing config */}
      {!timing.alwaysAvailable && (
        <div className="space-y-3 border border-border rounded-lg p-3">
          {/* Days */}
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1.5">Select Days</p>
            <div className="flex flex-wrap gap-1">
              {DAYS.map(day => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`px-2 py-1 rounded-md text-xs font-semibold transition-colors ${
                    timing.days.includes(day)
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
                value={timing.startTime}
                onChange={(e) => update({ startTime: e.target.value })}
                className="w-full bg-background border border-border rounded-md px-2 py-1.5 text-xs outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">End Time</p>
              <input
                type="time"
                value={timing.endTime}
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
