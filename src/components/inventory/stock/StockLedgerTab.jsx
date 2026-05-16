import { useState } from 'react';
import { TrendingUp, TrendingDown, ShoppingCart, AlertTriangle, ArrowDownToLine, ArrowUpFromLine, FileText, Filter } from 'lucide-react';
import { useInventoryStore } from '../../../store/useInventoryStore';

const TYPE_CONFIG = {
  stock_in:  { label: 'Stock In',  color: 'bg-green-100 text-green-700 border-green-200',  icon: ArrowDownToLine,  iconColor: 'text-green-600' },
  stock_out: { label: 'Stock Out', color: 'bg-red-100 text-red-700 border-red-200',        icon: ArrowUpFromLine,  iconColor: 'text-red-600'   },
  po:        { label: 'PO',        color: 'bg-blue-100 text-blue-700 border-blue-200',     icon: ShoppingCart,     iconColor: 'text-blue-600'  },
};

const PO_STATUS = {
  Pending:  'bg-yellow-100 text-yellow-700 border-yellow-200',
  Ordered:  'bg-blue-100 text-blue-700 border-blue-200',
  Received: 'bg-green-100 text-green-700 border-green-200',
  Cancelled:'bg-red-100 text-red-700 border-red-200',
};

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function StockLedgerTab() {
  const {
    transactions, purchaseOrders, ingredients, selectedOutlet,
    OUTLETS, getStock, updatePOStatus,
  } = useInventoryStore();

  const [activeSection, setActiveSection] = useState('overview'); // overview | ledger | po
  const [typeFilter, setTypeFilter] = useState('all');
  const [ingFilter, setIngFilter]   = useState('all');

  // ── Summary Calculations ──────────────────────────────────
  const stock = getStock(selectedOutlet);

  const totalIngredients = ingredients.length;
  const lowStockCount = ingredients.filter((ing) => (stock[ing.id] ?? 0) < ing.minStock).length;
  const criticalCount  = ingredients.filter((ing) => (stock[ing.id] ?? 0) < ing.minStock * 0.5).length;

  const totalStockValue = ingredients.reduce((sum, ing) => {
    return sum + (stock[ing.id] ?? 0) * ing.costPerUnit;
  }, 0);

  const todayTxns = transactions.filter((t) => {
    const d = new Date(t.date);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  });
  const todayIn  = todayTxns.filter((t) => t.type === 'stock_in').reduce((s, t)  => s + t.qty, 0);
  const todayOut = todayTxns.filter((t) => t.type === 'stock_out').reduce((s, t) => s + t.qty, 0);

  const pendingPOs = purchaseOrders.filter((p) => p.status === 'Pending' || p.status === 'Ordered');

  // ── Filtered Transactions ─────────────────────────────────
  const filteredTxns = transactions
    .filter((t) => selectedOutlet === 'all' || t.outletId === selectedOutlet)
    .filter((t) => typeFilter === 'all' || t.type === typeFilter)
    .filter((t) => ingFilter === 'all' || t.ingredientId === ingFilter);

  // ── Filtered POs ──────────────────────────────────────────
  const filteredPOs = purchaseOrders.filter(
    (p) => selectedOutlet === 'all' || p.outletId === selectedOutlet
  );

  // ── Reports ───────────────────────────────────────────────
  const getWastageSummary = useInventoryStore(state => state.getWastageSummary);
  const getDailyReport = useInventoryStore(state => state.getDailyReport);

  const wastageSummary = getWastageSummary(selectedOutlet);
  const totalWastageLoss = wastageSummary.reduce((sum, t) => sum + t.lossValue, 0);
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const dailyReport = getDailyReport(reportDate, selectedOutlet);

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">

      {/* Section Tabs */}
      <div className="bg-card border-b border-border px-4 flex gap-1 shrink-0 overflow-x-auto scrollbar-hide">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'ledger',   label: 'Transaction Ledger' },
          { id: 'po',       label: `Purchase Orders (${pendingPOs.length} Pending)` },
          { id: 'wastage',  label: 'Wastage Report' },
          { id: 'daily',    label: 'Daily Stock Report' },
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`py-3 px-4 text-sm font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeSection === s.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">

        {/* ════ OVERVIEW ════ */}
        {activeSection === 'overview' && (
          <div className="p-6 space-y-6">

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Total Stock Value</p>
                <h3 className="text-2xl font-black text-foreground">₹{totalStockValue.toFixed(2)}</h3>
                <p className="text-xs text-muted-foreground mt-1 font-medium">{totalIngredients} ingredients tracked</p>
              </div>
              <div className={`bg-card border rounded-2xl p-5 shadow-sm ${criticalCount > 0 ? 'border-red-200' : 'border-border'}`}>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Low Stock Alerts</p>
                <h3 className={`text-2xl font-black ${lowStockCount > 0 ? 'text-orange-600' : 'text-foreground'}`}>{lowStockCount}</h3>
                <p className="text-xs mt-1 font-bold text-red-600">{criticalCount} Critical</p>
              </div>
              <div className="bg-card border border-green-200 rounded-2xl p-5 shadow-sm">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Today's Stock In</p>
                <h3 className="text-2xl font-black text-green-600">+{todayIn}</h3>
                <p className="text-xs text-muted-foreground mt-1 font-medium">{todayTxns.filter(t=>t.type==='stock_in').length} transactions</p>
              </div>
              <div className="bg-card border border-red-200 rounded-2xl p-5 shadow-sm">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Today's Stock Out</p>
                <h3 className="text-2xl font-black text-red-600">−{todayOut}</h3>
                <p className="text-xs text-muted-foreground mt-1 font-medium">{todayTxns.filter(t=>t.type==='stock_out').length} transactions</p>
              </div>
            </div>

            {/* Per-Ingredient Balance */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-border bg-muted/20">
                <h3 className="font-black text-foreground">Current Stock Balance</h3>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">
                  {OUTLETS[selectedOutlet] || 'All Outlets'} — Live remaining quantities
                </p>
              </div>
              <div className="divide-y divide-border">
                {ingredients.map((ing) => {
                  const current  = stock[ing.id] ?? 0;
                  const isLow    = current < ing.minStock;
                  const isCrit   = current < ing.minStock * 0.5;
                  const pct      = Math.min(100, Math.round((current / (ing.minStock * 2)) * 100));
                  return (
                    <div key={ing.id} className="px-5 py-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-foreground">{ing.name}</span>
                          {isCrit && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
                        </div>
                        <span className={`font-black text-sm ${isCrit ? 'text-red-600' : isLow ? 'text-orange-500' : 'text-green-600'}`}>
                          {current} <span className="text-xs font-bold text-muted-foreground">{ing.unit}</span>
                          <span className="text-xs font-medium text-muted-foreground ml-2">/ min {ing.minStock}</span>
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${isCrit ? 'bg-red-500' : isLow ? 'bg-orange-400' : 'bg-green-500'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Transactions Preview */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-border bg-muted/20 flex justify-between items-center">
                <h3 className="font-black text-foreground">Recent Transactions</h3>
                <button onClick={() => setActiveSection('ledger')} className="text-primary text-xs font-bold hover:underline">
                  View All →
                </button>
              </div>
              <div className="divide-y divide-border">
                {transactions.slice(0, 5).map((txn) => {
                  const ing = ingredients.find((i) => i.id === txn.ingredientId);
                  const cfg = TYPE_CONFIG[txn.type];
                  const Icon = cfg?.icon;
                  return (
                    <div key={txn.id} className="px-5 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-muted`}>
                          {Icon && <Icon className={`w-4 h-4 ${cfg.iconColor}`} />}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-foreground">{ing?.name || txn.ingredientId}</p>
                          <p className="text-xs text-muted-foreground">{txn.note} • {OUTLETS[txn.outletId]}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-black text-sm ${txn.type === 'stock_in' ? 'text-green-600' : 'text-red-600'}`}>
                          {txn.type === 'stock_in' ? '+' : '−'}{txn.qty} {ing?.unit}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(txn.date)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ════ LEDGER ════ */}
        {activeSection === 'ledger' && (
          <div className="flex flex-col h-full">
            {/* Filter Bar */}
            <div className="p-4 border-b border-border bg-muted/10 shrink-0 flex flex-wrap gap-3 items-center">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border bg-background outline-none focus:border-primary text-sm font-bold"
              >
                <option value="all">All Types</option>
                <option value="stock_in">Stock In</option>
                <option value="stock_out">Stock Out</option>
              </select>
              <select
                value={ingFilter}
                onChange={(e) => setIngFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border bg-background outline-none focus:border-primary text-sm font-bold"
              >
                <option value="all">All Ingredients</option>
                {ingredients.map((ing) => (
                  <option key={ing.id} value={ing.id}>{ing.name}</option>
                ))}
              </select>
              <span className="text-xs font-bold text-muted-foreground ml-auto">{filteredTxns.length} records</span>
            </div>

            <div className="flex-1 overflow-auto">
              <div className="overflow-x-auto min-h-0">
                <table className="w-full text-sm text-left whitespace-nowrap min-w-[1000px]">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50 sticky top-0 z-10">
                  <tr>
                    <th className="px-5 py-4 font-bold">Txn ID</th>
                    <th className="px-5 py-4 font-bold">Date & Time</th>
                    <th className="px-5 py-4 font-bold">Type</th>
                    <th className="px-5 py-4 font-bold">Ingredient</th>
                    <th className="px-5 py-4 font-bold">Outlet</th>
                    <th className="px-5 py-4 font-bold text-right">Qty</th>
                    <th className="px-5 py-4 font-bold text-right">Balance After</th>
                    <th className="px-5 py-4 font-bold">Note / PO Ref</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredTxns.map((txn) => {
                    const ing = ingredients.find((i) => i.id === txn.ingredientId);
                    const cfg = TYPE_CONFIG[txn.type];
                    return (
                      <tr key={txn.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{txn.id}</td>
                        <td className="px-5 py-3 text-xs font-medium text-muted-foreground whitespace-nowrap">{formatDate(txn.date)}</td>
                        <td className="px-5 py-3">
                          <span className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-bold border w-max ${cfg?.color}`}>
                            {txn.type === 'stock_in' ? <ArrowDownToLine className="w-3 h-3" /> : <ArrowUpFromLine className="w-3 h-3" />}
                            {cfg?.label}
                          </span>
                        </td>
                        <td className="px-5 py-3 font-bold text-foreground">{ing?.name || txn.ingredientId}</td>
                        <td className="px-5 py-3 text-xs text-muted-foreground font-medium">{OUTLETS[txn.outletId]}</td>
                        <td className={`px-5 py-3 font-black text-right ${txn.type === 'stock_in' ? 'text-green-600' : 'text-red-600'}`}>
                          {txn.type === 'stock_in' ? '+' : '−'}{txn.qty} {ing?.unit}
                        </td>
                        <td className="px-5 py-3 font-black text-right text-foreground">
                          {txn.balance} {ing?.unit}
                        </td>
                        <td className="px-5 py-3 text-xs text-muted-foreground">
                          <div>{txn.note}</div>
                          {txn.poRef && <span className="font-bold text-blue-600">{txn.poRef}</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        )}

        {/* ════ PURCHASE ORDERS ════ */}
        {activeSection === 'po' && (
          <div className="p-6 space-y-4">
            {filteredPOs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <ShoppingCart className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-bold">No Purchase Orders</p>
              </div>
            ) : (
              filteredPOs.map((po) => {
                const statusClass = PO_STATUS[po.status] || 'bg-muted text-foreground border-border';
                return (
                  <div key={po.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                    <div className="px-5 py-4 flex items-center justify-between border-b border-border bg-muted/20">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <span className="font-black text-foreground">{po.id}</span>
                          <span className="ml-2 text-xs font-medium text-muted-foreground">{formatDate(po.date)}</span>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded border ${statusClass}`}>{po.status}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground font-medium">{OUTLETS[po.outletId]}</span>
                        <span className="font-black text-foreground">₹{po.totalCost.toFixed(2)}</span>
                        {po.status !== 'Received' && po.status !== 'Cancelled' && (
                          <div className="flex gap-2">
                            {po.status === 'Pending' && (
                              <button
                                onClick={() => updatePOStatus(po.id, 'Ordered')}
                                className="text-xs font-bold px-3 py-1.5 bg-blue-100 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-200 transition-colors"
                              >
                                Mark Ordered
                              </button>
                            )}
                            <button
                              onClick={() => updatePOStatus(po.id, 'Received')}
                              className="text-xs font-bold px-3 py-1.5 bg-green-100 text-green-700 border border-green-200 rounded-lg hover:bg-green-200 transition-colors"
                            >
                              Mark Received
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      {po.items.map((item, idx) => {
                        const ing = ingredients.find((i) => i.id === item.ingredientId);
                        return (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="font-medium text-foreground">{ing?.name || item.ingredientId}</span>
                            <div className="flex items-center gap-4 text-muted-foreground">
                              <span>{item.qty} {ing?.unit}</span>
                              <span className="font-bold text-foreground">₹{(item.qty * item.costPerUnit).toFixed(2)}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ════ WASTAGE REPORT ════ */}
        {activeSection === 'wastage' && (
          <div className="p-6 space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-red-700 uppercase tracking-wider mb-1">Total Loss Value</p>
                <h3 className="text-2xl font-black text-red-800">₹{totalWastageLoss.toFixed(2)}</h3>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500 opacity-50" />
            </div>

            {wastageSummary.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="font-bold">No Wastage Recorded</p>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left whitespace-nowrap min-w-[800px]">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50 sticky top-0">
                    <tr>
                      <th className="px-5 py-4 font-bold">Date</th>
                      <th className="px-5 py-4 font-bold">Ingredient</th>
                      <th className="px-5 py-4 font-bold">Reason</th>
                      <th className="px-5 py-4 font-bold">Qty Lost</th>
                      <th className="px-5 py-4 font-bold text-right">Loss Value</th>
                      <th className="px-5 py-4 font-bold">Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {wastageSummary.map((t) => (
                      <tr key={t.id} className="hover:bg-muted/30">
                        <td className="px-5 py-3 text-xs text-muted-foreground">{formatDate(t.date)}</td>
                        <td className="px-5 py-3 font-bold text-foreground">{t.ingredientName}</td>
                        <td className="px-5 py-3">
                          <span className={`text-xs font-bold px-2 py-1 rounded ${t.reason === 'damage' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                            {t.reason}
                          </span>
                        </td>
                        <td className="px-5 py-3 font-bold text-red-600">{t.qty} {t.unit}</td>
                        <td className="px-5 py-3 font-black text-right text-red-600">₹{t.lossValue.toFixed(2)}</td>
                        <td className="px-5 py-3 text-xs text-muted-foreground">{t.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            )}
          </div>
        )}

        {/* ════ DAILY STOCK REPORT ════ */}
        {activeSection === 'daily' && (
          <div className="p-6 flex flex-col h-full space-y-4">
            <div className="flex items-center gap-4 bg-muted/20 p-4 rounded-xl border border-border shrink-0">
              <label className="text-sm font-bold text-muted-foreground">Report Date:</label>
              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border bg-background outline-none focus:border-primary text-sm font-bold"
              />
              <span className="text-xs text-muted-foreground ml-auto">Data for: {OUTLETS[selectedOutlet] || 'All Outlets'}</span>
            </div>

            <div className="flex-1 overflow-auto bg-card border border-border rounded-2xl shadow-sm">
              <div className="overflow-x-auto min-h-0">
                <table className="w-full text-sm text-left whitespace-nowrap min-w-[900px]">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50 sticky top-0 z-10">
                  <tr>
                    <th className="px-5 py-4 font-bold">Ingredient</th>
                    <th className="px-5 py-4 font-bold text-right bg-muted/30">Opening Balance</th>
                    <th className="px-5 py-4 font-bold text-right text-green-700">Stock In (+)</th>
                    <th className="px-5 py-4 font-bold text-right text-blue-700">Consumed (-)</th>
                    <th className="px-5 py-4 font-bold text-right text-red-700">Wastage (-)</th>
                    <th className="px-5 py-4 font-bold text-right bg-muted/30">Closing Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {dailyReport.map((row) => (
                    <tr key={row.ingredient.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-bold text-foreground">{row.ingredient.name}</p>
                        <p className="text-[10px] text-muted-foreground">{row.ingredient.id}</p>
                      </td>
                      <td className="px-5 py-3 font-medium text-right bg-muted/10">{row.openingBalance} {row.ingredient.unit}</td>
                      <td className="px-5 py-3 font-bold text-right text-green-600">{row.totalIn > 0 ? `+${row.totalIn}` : '-'}</td>
                      <td className="px-5 py-3 font-bold text-right text-blue-600">{row.totalOut > row.wastage ? `-${row.totalOut - row.wastage}` : '-'}</td>
                      <td className="px-5 py-3 font-bold text-right text-red-600">{row.wastage > 0 ? `-${row.wastage}` : '-'}</td>
                      <td className="px-5 py-3 font-black text-right bg-muted/10">{row.closingBalance} {row.ingredient.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
