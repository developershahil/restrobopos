import { Clock, Calendar, Plus, AlertCircle, Trash2 } from 'lucide-react';

const mockRules = [
  { id: 'r1', name: 'Late Night Disable', type: 'Time-based', condition: 'After 10:00 PM', action: 'Disable "Beverages" Category', status: true },
  { id: 'r2', name: 'Weekend Only Combos', type: 'Day-based', condition: 'Sat, Sun', action: 'Show "Weekend Combos" Category', status: true },
  { id: 'r3', name: 'Auto-hide empty categories', type: 'Conditional', condition: 'If all items Out of Stock', action: 'Hide Category', status: false },
];

export default function RulesTab() {
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative">
      <div className="p-6 border-b border-border bg-card shrink-0 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black text-foreground">Menu Rules Engine</h2>
          <p className="text-sm text-muted-foreground font-medium mt-1">Automate menu visibility and behavior across your outlets.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Create Rule
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {mockRules.map(rule => (
            <div key={rule.id} className={`bg-card border rounded-xl p-5 shadow-sm transition-colors ${rule.status ? 'border-primary/30' : 'border-border opacity-60'}`}>
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className={`p-3 rounded-xl shrink-0 ${rule.status ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {rule.type === 'Time-based' && <Clock className="w-6 h-6" />}
                    {rule.type === 'Day-based' && <Calendar className="w-6 h-6" />}
                    {rule.type === 'Conditional' && <AlertCircle className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg text-foreground">{rule.name}</h3>
                      <span className="text-[10px] uppercase tracking-wider font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded">
                        {rule.type}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm font-medium mt-2">
                      <span className="text-muted-foreground px-2 py-1 bg-muted rounded-md border border-border">IF</span>
                      <span className="text-foreground font-bold">{rule.condition}</span>
                      <span className="text-muted-foreground px-2 py-1 bg-muted rounded-md border border-border">THEN</span>
                      <span className="text-primary font-bold">{rule.action}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={rule.status} />
                    <div className="w-11 h-6 bg-muted-foreground/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                  <button className="p-2 text-muted-foreground hover:bg-red-50 hover:text-red-500 rounded-md transition-colors border border-transparent">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
