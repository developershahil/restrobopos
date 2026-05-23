import { useState } from 'react';
import { ArrowDownToLine, ArrowUpFromLine, AlertTriangle, X, Plus, Trash2, Zap } from 'lucide-react';
import { useInventoryStore } from '@modules/inventory/store/useInventoryStore';

const REASON_OUT = [
  { value: 'consumption', label: 'Consumption', color: 'text-blue-600' },
  { value: 'wastage',     label: 'Wastage (Expired/Spoiled)', color: 'text-orange-600' },
  { value: 'damage',      label: 'Damage',      color: 'text-red-600' },
  { value: 'adjustment',  label: 'Adjustment',  color: 'text-purple-600' },
];

function AutoPOBanner({ poId, onDismiss }) {
  if (!poId) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[200] bg-amber-50 border border-amber-300 rounded-lg shadow-2xl p-4 max-w-sm animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-start gap-3">
        <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-bold text-amber-900 text-sm">Auto-PO Generated!</p>
          <p className="text-xs text-amber-700 mt-0.5">Stock dropped below minimum threshold. A draft Purchase Order <strong>{poId}</strong> has been automatically created.</p>
        </div>
        <button onClick={onDismiss} className="p-1 hover:bg-amber-100 rounded transition-colors">
          <X className="w-4 h-4 text-amber-600" />
        </button>
      </div>
    </div>
  );
}

// ── Bulk Stock In Drawer ──────────────────────────────────────
function BulkStockInDrawer({ onClose }) {
  const { ingredients, selectedOutlet, addBulkStockIn, OUTLETS } = useInventoryStore();
  const [rows, setRows] = useState([{ ingredientId: '', qty: '', note: '' }]);

  const addRow = () => setRows([...rows, { ingredientId: '', qty: '', note: '' }]);
  const removeRow = (idx) => setRows(rows.filter((_, i) => i !== idx));
  const updateRow = (idx, field, val) => setRows(rows.map((r, i) => i === idx ? { ...r, [field]: val } : r));

  const handleSubmit = (e) => {
    e.preventDefault();
    const valid = rows.filter((r) => r.ingredientId && parseFloat(r.qty) > 0);
    if (!valid.length) return;
    addBulkStockIn(valid, selectedOutlet);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-card h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-4 border-b border-border bg-green-50">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-green-800">Bulk Stock In</h3>
              <p className="text-sm text-green-700 mt-1">
                Add multiple ingredients at once — all quantities will accumulate on top of existing stock.
              </p>
              <p className="text-xs font-bold text-green-700 mt-1">Outlet: {OUTLETS[selectedOutlet]}</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-green-100 transition-colors"><X className="w-4 h-4 text-green-700" /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Header */}
          <div className="grid grid-cols-[1fr_100px_1fr_32px] gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">
            <span>Ingredient</span><span className="text-right">Qty</span><span>Note</span><span />
          </div>

          {rows.map((row, idx) => {
            const ing = ingredients.find((i) => i.id === row.ingredientId);
            return (
              <div key={idx} className="grid grid-cols-[1fr_100px_1fr_32px] gap-2 items-center bg-muted/20 p-3 rounded-md border border-border">
                <select
                  value={row.ingredientId}
                  onChange={(e) => updateRow(idx, 'ingredientId', e.target.value)}
                  className="w-full p-2 rounded-lg border border-border bg-background outline-none focus:border-primary text-sm font-medium"
                >
                  <option value="">Select…</option>
                  {ingredients.map((i) => (
                    <option key={i.id} value={i.id}>{i.name} ({i.unit})</option>
                  ))}
                </select>
                <div className="relative">
                  <input
                    type="number" min="0.01" step="0.01"
                    value={row.qty}
                    onChange={(e) => updateRow(idx, 'qty', e.target.value)}
                    placeholder="0"
                    className="w-full p-2 rounded-lg border border-border bg-background outline-none focus:border-primary text-sm font-medium text-right pr-8"
                  />
                  {ing && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">{ing.unit}</span>}
                </div>
                <input
                  type="text"
                  value={row.note}
                  onChange={(e) => updateRow(idx, 'note', e.target.value)}
                  placeholder="Note…"
                  className="w-full p-2 rounded-lg border border-border bg-background outline-none focus:border-primary text-sm font-medium"
                />
                <button onClick={() => removeRow(idx)} disabled={rows.length === 1} className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-30">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}

          <button onClick={addRow} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-border rounded-md text-sm font-bold text-muted-foreground hover:border-primary hover:text-primary transition-colors">
            <Plus className="w-4 h-4" /> Add Another Ingredient
          </button>
        </div>

        <div className="p-4 border-t border-border bg-muted/10 grid grid-cols-2 gap-4">
          <button type="button" onClick={onClose} className="px-3 py-2 rounded-lg font-bold border border-border bg-background hover:bg-muted transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="px-3 py-2 rounded-lg font-bold bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm">
            Confirm Stock In ({rows.filter(r => r.ingredientId && r.qty).length} items)
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Single Stock Out Drawer ───────────────────────────────────
function StockOutDrawer({ onClose }) {
  const { ingredients, selectedOutlet, addStockOut, OUTLETS } = useInventoryStore();
  const [ingredientId, setIngredientId] = useState('');
  const [qty, setQty]    = useState('');
  const [reason, setReason] = useState('consumption');
  const [note, setNote]  = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addStockOut(ingredientId, qty, selectedOutlet, note || REASON_OUT.find(r => r.value === reason)?.label, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-4 border-b border-border bg-red-50">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-red-800">Stock Out</h3>
              <p className="text-sm text-red-700 mt-1">Deduct stock and categorize the reason for accurate reporting.</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-red-100 transition-colors"><X className="w-4 h-4 text-red-700" /></button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-5">
          <div className="p-3 rounded-lg border border-border bg-muted/40 text-sm font-bold">{OUTLETS[selectedOutlet]}</div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground">Ingredient</label>
            <select required value={ingredientId} onChange={(e) => setIngredientId(e.target.value)}
              className="w-full p-3 rounded-lg border border-border bg-background outline-none focus:border-primary font-medium">
              <option value="">Select ingredient…</option>
              {ingredients.map((ing) => <option key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground">Reason for Deduction</label>
            <div className="grid grid-cols-2 gap-2">
              {REASON_OUT.map((r) => (
                <button key={r.value} type="button" onClick={() => setReason(r.value)}
                  className={`p-3 rounded-md border-2 text-left transition-all ${reason === r.value ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-border'}`}>
                  <p className={`text-xs font-black ${reason === r.value ? 'text-primary' : r.color}`}>{r.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground">Quantity {ingredientId && `(${ingredients.find(i=>i.id===ingredientId)?.unit})`}</label>
            <input type="number" required min="0.01" step="0.01" value={qty} onChange={(e) => setQty(e.target.value)}
              placeholder="Enter quantity"
              className="w-full p-3 rounded-lg border border-border bg-background outline-none focus:border-primary font-medium" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground">Note (optional)</label>
            <input type="text" value={note} onChange={(e) => setNote(e.target.value)}
              placeholder="e.g., End-of-day count, Expired batch"
              className="w-full p-3 rounded-lg border border-border bg-background outline-none focus:border-primary font-medium" />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
            <p className="text-xs font-bold text-amber-800">⚡ If stock drops below minimum threshold, a draft Purchase Order will be auto-generated.</p>
          </div>
        </form>

        <div className="p-4 border-t border-border bg-muted/10 grid grid-cols-2 gap-4">
          <button type="button" onClick={onClose} className="px-3 py-2 rounded-lg font-bold border border-border bg-background hover:bg-muted transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="px-3 py-2 rounded-lg font-bold bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm">Deduct Stock</button>
        </div>
      </div>
    </div>
  );
}

// ── Main StockLevelsTab ───────────────────────────────────────
export default function StockLevelsTab() {
  const { ingredients, selectedOutlet, getStock, OUTLETS, lastAutoPO, clearLastAutoPO } = useInventoryStore();
  const [drawer, setDrawer] = useState(null); // 'bulk-in' | 'out' | null

  const stock = getStock(selectedOutlet);

  const handleClose = () => {
    setDrawer(null);
  };

  return (
    <div className="h-full flex flex-col bg-card relative">
      <div className="p-4 border-b border-border bg-muted/10 shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 className="text-lg font-black">{selectedOutlet === 'all' ? 'Global Stock Levels' : OUTLETS[selectedOutlet]}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Live stock balances • Click Stock In/Out to adjust</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={() => setDrawer('bulk-in')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-bold rounded-lg shadow-sm hover:bg-green-700 transition-colors text-sm">
            <ArrowDownToLine className="w-4 h-4" /> Bulk Stock In
          </button>
          <button onClick={() => setDrawer('out')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white font-bold rounded-lg shadow-sm hover:bg-red-700 transition-colors text-sm">
            <ArrowUpFromLine className="w-4 h-4" /> Stock Out
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="overflow-x-auto min-h-0">
          <table className="w-full text-sm text-left whitespace-nowrap min-w-[800px]">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 sticky top-0 z-10">
            <tr>
              <th className="px-3 py-2 font-bold">Ingredient</th>
              <th className="px-3 py-2 font-bold">Category</th>
              <th className="px-3 py-2 font-bold text-right">Current Stock</th>
              <th className="px-3 py-2 font-bold text-right">Min Threshold</th>
              <th className="px-3 py-2 font-bold text-right">Est. Value</th>
              <th className="px-3 py-2 font-bold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {ingredients.map((ing) => {
              const current = stock[ing.id] ?? 0;
              const isLow   = current < ing.minStock;
              const isCrit  = current < ing.minStock * 0.5;
              const value   = current * ing.costPerUnit;
              return (
                <tr key={ing.id} className={`hover:bg-muted/30 transition-colors ${isCrit ? 'bg-red-50/40' : ''}`}>
                  <td className="px-3 py-2">
                    <p className="font-bold text-foreground">{ing.name}</p>
                    <p className="text-[10px] font-bold text-muted-foreground">{ing.id}</p>
                  </td>
                  <td className="px-3 py-2">
                    <span className="px-2 py-1 bg-muted rounded text-xs font-bold text-muted-foreground">{ing.category}</span>
                  </td>
                  <td className="px-3 py-2 text-right">
                    <span className={`text-lg font-bold ${isCrit ? 'text-red-600' : isLow ? 'text-orange-500' : 'text-foreground'}`}>{current}</span>
                    <span className="text-xs font-bold text-muted-foreground ml-1">{ing.unit}</span>
                  </td>
                  <td className="px-3 py-2 text-right text-muted-foreground font-medium">{ing.minStock} {ing.unit}</td>
                  <td className="px-3 py-2 text-right font-bold text-foreground">₹{value.toFixed(2)}</td>
                  <td className="px-3 py-2">
                    {isCrit ? (
                      <span className="flex items-center gap-1.5 px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded border border-red-200 w-max">
                        <AlertTriangle className="w-3.5 h-3.5" /> Critical
                      </span>
                    ) : isLow ? (
                      <span className="flex items-center gap-1.5 px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded border border-orange-200 w-max">
                        <AlertTriangle className="w-3.5 h-3.5" /> Low Stock
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded border border-green-200 w-max">Healthy</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>

      {drawer === 'bulk-in' && <BulkStockInDrawer onClose={handleClose} />}
      {drawer === 'out'     && <StockOutDrawer onClose={handleClose} />}
      <AutoPOBanner poId={lastAutoPO} onDismiss={clearLastAutoPO} />
    </div>
  );
}
