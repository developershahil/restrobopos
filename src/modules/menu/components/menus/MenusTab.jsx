import { useState } from 'react';
import { Plus, Search, Calendar, Clock, CheckCircle2, Edit2, Trash2, X, BookOpen } from 'lucide-react';
import { useMenuStore } from '@modules/menu/store/useMenuStore';
import { ConfirmModal } from '../builder/modals/FormModals';

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">{label}</label>
    {children}
  </div>
);

// ─── Create / Edit Modal ──────────────────────────────────────────────────────
function MenuFormModal({ initial, onSave, onClose }) {
  const [name, setName]       = useState(initial?.name || '');
  const [type, setType]       = useState(initial?.type || 'Default');
  const [priority, setPriority] = useState(initial?.priority ?? 0);
  const [startDate, setStart] = useState(initial?.startDate || '');
  const [endDate, setEnd]     = useState(initial?.endDate || '');
  const [timeFrom, setFrom]   = useState(initial?.timeFrom || '');
  const [timeTo, setTo]       = useState(initial?.timeTo || '');
  const [outlets, setOutlets] = useState(initial?.outlets || 'All');

  const handleSave = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), type, priority: Number(priority), startDate, endDate, timeFrom, timeTo, outlets, status: initial?.status || 'Active' });
    onClose();
  };

  const inputCls = "w-full bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-md shadow-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-5 py-2 border-b border-border">
          <h3 className="text-base font-bold">{initial ? 'Edit Menu' : 'Create Menu'}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSave}>
          <div className="p-5 space-y-4">
            <Field label="Menu Name *">
              <input className={inputCls} placeholder="e.g. Diwali Special" value={name} onChange={e => setName(e.target.value)} autoFocus />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Type">
                <select className={inputCls} value={type} onChange={e => setType(e.target.value)}>
                  <option>Default</option>
                  <option>Festive</option>
                  <option>Time-Based</option>
                  <option>Outlet</option>
                </select>
              </Field>
              <Field label="Priority">
                <input type="number" className={inputCls} placeholder="0 = lowest" value={priority} onChange={e => setPriority(e.target.value)} />
              </Field>
            </div>

            {/* Festive date range */}
            {type === 'Festive' && (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Start Date">
                  <input type="date" className={inputCls} value={startDate} onChange={e => setStart(e.target.value)} />
                </Field>
                <Field label="End Date">
                  <input type="date" className={inputCls} value={endDate} onChange={e => setEnd(e.target.value)} />
                </Field>
              </div>
            )}

            {/* Time-based range */}
            {type === 'Time-Based' && (
              <div className="grid grid-cols-2 gap-3">
                <Field label="From Time">
                  <input type="time" className={inputCls} value={timeFrom} onChange={e => setFrom(e.target.value)} />
                </Field>
                <Field label="To Time">
                  <input type="time" className={inputCls} value={timeTo} onChange={e => setTo(e.target.value)} />
                </Field>
              </div>
            )}

            <Field label="Outlets">
              <select className={inputCls} value={outlets} onChange={e => setOutlets(e.target.value)}>
                <option>All</option>
                <option>1 Outlet</option>
                <option>2 Outlets</option>
                <option>3 Outlets</option>
              </select>
            </Field>
          </div>
          <div className="px-5 pb-5 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted transition-colors">Cancel</button>
            <button type="submit" className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors">
              {initial ? 'Save Changes' : 'Create Menu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Tab ─────────────────────────────────────────────────────────────────
export default function MenusTab() {
  const { menus, addMenu, updateMenu, deleteMenu } = useMenuStore();
  const [search, setSearch] = useState('');
  const [modal, setModal]   = useState(null); // null | {mode:'add'} | {mode:'edit',menu}

  const filtered = menus.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.type.toLowerCase().includes(search.toLowerCase())
  );

  const getValid = (m) => {
    if (m.type === 'Festive' && m.startDate) return `${m.startDate} → ${m.endDate || '…'}`;
    if (m.type === 'Time-Based' && m.timeFrom) return `Daily ${m.timeFrom} - ${m.timeTo || '…'}`;
    return 'Always';
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative">



      {/* Action Bar */}
      <div className="p-4 border-b border-border bg-card flex justify-between items-center shrink-0">
        <div className="relative w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text" placeholder="Search menus..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background outline-none focus:border-primary text-sm"
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setModal({ mode: 'add' })}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Menu
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <p className="text-lg font-bold text-foreground mb-1">No menus created yet</p>
            <p className="text-sm text-muted-foreground max-w-md mb-6">
              Create your first menu to start adding categories and items. You can create different menus for breakfast, lunch, or festive events.
            </p>
            <button
              onClick={() => setModal({ mode: 'add' })}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-md text-sm font-bold hover:bg-primary/90 transition-all hover:-translate-y-0.5 shadow-md"
            >
              <Plus className="w-4 h-4" /> Create Your First Menu
            </button>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/50 sticky top-0 z-10 border-b border-border backdrop-blur-sm">
              <tr>
                <th className="p-4 font-bold text-muted-foreground text-xs uppercase tracking-wider">Menu Name</th>
                <th className="p-4 font-bold text-muted-foreground text-xs uppercase tracking-wider">Type</th>
                <th className="p-4 font-bold text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                <th className="p-4 font-bold text-muted-foreground text-xs uppercase tracking-wider">Valid</th>
                <th className="p-4 font-bold text-muted-foreground text-xs uppercase tracking-wider">Priority</th>
                <th className="p-4 font-bold text-muted-foreground text-xs uppercase tracking-wider">Outlets</th>
                <th className="p-4 font-bold text-muted-foreground text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(menu => (
                <tr key={menu.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="p-4">
                    <p className="font-bold text-foreground flex items-center gap-2">
                      {menu.name}
                      {menu.type === 'Default' && (
                        <span className="bg-primary/10 text-primary text-[10px] uppercase px-1.5 py-0.5 rounded font-black tracking-wider">Base</span>
                      )}
                      {menu.type === 'Festive' && <span className="text-base">🎉</span>}
                    </p>
                  </td>
                  <td className="p-4">
                    <span className="text-xs px-2.5 py-1 rounded-md uppercase tracking-wider font-bold bg-muted text-muted-foreground">{menu.type}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      {menu.status === 'Active'
                        ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                        : <Clock className="w-4 h-4 text-orange-500" />}
                      <span className={`text-sm font-bold ${menu.status === 'Active' ? 'text-green-600' : 'text-orange-600'}`}>{menu.status}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                      <Calendar className="w-4 h-4 shrink-0" /> {getValid(menu)}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-bold bg-background border border-border px-2 py-1 rounded text-foreground">{menu.priority ?? 0}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium text-muted-foreground">{menu.outlets || 'All'}</span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={(e) => { e.stopPropagation(); setModal({ mode: 'edit', menu }); }}
                        className="p-1.5 rounded hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setModal({ mode: 'delete', menu }); }}
                        className="p-1.5 rounded hover:bg-red-50 hover:text-red-500 text-muted-foreground transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modals */}
      {modal?.mode === 'add' && (
        <MenuFormModal onSave={(data) => addMenu(data)} onClose={() => setModal(null)} />
      )}
      {modal?.mode === 'edit' && (
        <MenuFormModal initial={modal.menu} onSave={(data) => updateMenu(modal.menu.id, data)} onClose={() => setModal(null)} />
      )}
      {modal?.mode === 'delete' && (
        <ConfirmModal 
          title="Delete Menu" 
          message={`Are you sure you want to delete the "${modal.menu.name}" menu? This action cannot be undone.`} 
          onConfirm={() => deleteMenu(modal.menu.id)} 
          onClose={() => setModal(null)} 
        />
      )}
    </div>
  );
}
