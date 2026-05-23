import { useState, useRef, useEffect } from 'react';
import { Search, Download, Filter, ChevronDown, AlertCircle, RefreshCw, PlusCircle, Gift, ArrowRight, XOctagon, CreditCard, PackageX, UserX, AlertTriangle, Calendar, CheckCircle2 } from 'lucide-react';
import EmptyState from '@shared/components/common/EmptyState';

const mockFailedOrders = [
  { 
    id: '#1045', date: 'Oct 24, 09:15 PM', customer: 'Rahul Sharma', phone: '+91 98*** **123', type: 'Delivery', 
    category: 'Inventory Issue', reason: 'Paneer Out of Stock', stage: 'Before Accept', accountability: 'Staff (Kitchen)',
    financials: { lostRevenue: 35.00, refundAmount: 35.00 },
    payment: { method: 'UPI', txId: 'UPI987654321', status: 'Refunded Automatically' },
    sla: 'Cancelled at 0m',
    cart: [{ item: 'Paneer Butter Masala', qty: 2, price: 17.50 }]
  },
  { 
    id: '#1042', date: 'Oct 24, 08:50 PM', customer: 'Priya Patel', phone: '+91 99*** **456', type: 'Dine-in', 
    category: 'Payment Issue', reason: 'Gateway Timeout', stage: 'Before Accept', accountability: 'System',
    financials: { lostRevenue: 120.00, refundAmount: 0 },
    payment: { method: 'Card', txId: 'CARD112233', failCode: 'ERR_TIMEOUT', status: 'Failed' },
    sla: 'Failed at 0m',
    cart: [{ item: 'Family Combo', qty: 1, price: 120.00 }]
  },
  { 
    id: '#1038', date: 'Oct 24, 08:10 PM', customer: 'Amit Kumar', phone: '+91 97*** **789', type: 'Delivery', 
    category: 'Operational Issue', reason: 'No Rider Available', stage: 'After Ready', accountability: 'System',
    financials: { lostRevenue: 45.00, refundAmount: 45.00 },
    payment: { method: 'UPI', txId: 'UPI55667788', status: 'Refund Processing' },
    sla: 'Cancelled after 45m',
    cart: [{ item: 'Chicken Tikka', qty: 1, price: 25.00 }, { item: 'Garlic Naan', qty: 4, price: 20.00 }]
  },
  { 
    id: '#1030', date: 'Oct 24, 07:30 PM', customer: 'Neha Singh', phone: '+91 88*** **111', type: 'Take Away', 
    category: 'Customer Issue', reason: 'Customer Cancelled', stage: 'After Accept', accountability: 'Customer',
    financials: { lostRevenue: 18.50, refundAmount: 0 },
    payment: { method: 'Cash', txId: '-', status: 'N/A' },
    sla: 'Cancelled after 5m',
    cart: [{ item: 'Veg Burger Combo', qty: 1, price: 18.50 }]
  },
  { 
    id: '#1025', date: 'Oct 24, 06:45 PM', customer: 'Karan Patel', phone: '+91 77*** **222', type: 'Delivery', 
    category: 'Customer Issue', reason: 'Unreachable', stage: 'After Ready', accountability: 'Customer',
    financials: { lostRevenue: 65.00, refundAmount: 0 },
    payment: { method: 'Card', txId: 'CARD998877', status: 'Non-Refundable (Food Wasted)' },
    sla: 'Cancelled after 55m',
    cart: [{ item: 'Large Pepperoni Pizza', qty: 2, price: 65.00 }]
  },
  { 
    id: '#1018', date: 'Oct 24, 05:20 PM', customer: 'Suresh Raina', phone: '+91 91*** **333', type: 'Delivery', 
    category: 'Inventory Issue', reason: 'Packaging Material Out', stage: 'Before Accept', accountability: 'Staff (Manager)',
    financials: { lostRevenue: 28.00, refundAmount: 28.00 },
    payment: { method: 'UPI', txId: 'UPI44332211', status: 'Refunded' },
    sla: 'Cancelled at 0m',
    cart: [{ item: 'Hakka Noodles', qty: 2, price: 28.00 }]
  }
];

export default function FailedOrdersTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All Time');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterRef]);

  const filteredOrders = mockFailedOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || order.category === categoryFilter;
    const matchesType = typeFilter === 'All' || order.type === typeFilter;
    return matchesSearch && matchesCategory && matchesType;
  });

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Inventory Issue': return 'bg-red-100 text-red-700 border-red-200';
      case 'Payment Issue': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Operational Issue': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Customer Issue': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Inventory Issue': return <PackageX className="w-3.5 h-3.5" />;
      case 'Payment Issue': return <CreditCard className="w-3.5 h-3.5" />;
      case 'Operational Issue': return <AlertTriangle className="w-3.5 h-3.5" />;
      case 'Customer Issue': return <UserX className="w-3.5 h-3.5" />;
      default: return <XOctagon className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="flex h-full bg-background overflow-hidden relative">
      
      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col h-full transition-all duration-300 ${selectedOrder ? 'w-1/2 opacity-50 md:opacity-100' : 'w-full'}`}>
        
        {/* Trend Analysis Header */}
        <div className="p-4 md:p-4 bg-card border-b border-border shrink-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 rounded-md border border-red-100 bg-red-50/50 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">Failure Rate</p>
                <h3 className="text-xl font-bold text-red-700">4.2% <span className="text-sm font-medium text-red-600/70 ml-1">of total</span></h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>
            
            <div className="p-4 rounded-md border border-orange-100 bg-orange-50/50 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">Top Bottleneck</p>
                <h3 className="text-lg font-black text-orange-700 leading-tight">Payment Gateway<br/><span className="text-sm font-medium">32% of failures</span></h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                <CreditCard className="w-6 h-6" />
              </div>
            </div>

            <div className="p-4 rounded-md border border-blue-100 bg-blue-50/50 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Lost Revenue</p>
                <h3 className="text-xl font-bold text-blue-700">$311.50 <span className="text-sm font-medium text-blue-600/70 ml-1">Today</span></h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search Order ID or Customer..." 
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background outline-none focus:border-primary font-medium shadow-sm"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <select 
                className="px-4 py-2.5 rounded-lg border border-border bg-background outline-none focus:border-primary font-bold text-sm shadow-sm"
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Delivery">Delivery</option>
                <option value="Dine-in">Dine-in</option>
                <option value="Take Away">Take Away</option>
              </select>

              <div className="relative" ref={filterRef}>
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border font-bold text-sm transition-colors shadow-sm ${showFilters || categoryFilter !== 'All' || dateFilter !== 'All Time' ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-background border-border hover:bg-muted'}`}
                >
                  <Filter className="w-4 h-4" /> Filters
                  {(categoryFilter !== 'All' || dateFilter !== 'All Time') && (
                    <span className="w-2 h-2 rounded-full bg-primary absolute top-2 right-2"></span>
                  )}
                </button>
                
                {showFilters && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-md shadow-2xl z-50 overflow-hidden">
                    <div className="p-3 border-b border-border bg-muted/30 flex justify-between items-center">
                      <p className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Filter className="w-3.5 h-3.5" /> Failure Category
                      </p>
                    </div>
                    <div className="p-2 space-y-0.5 max-h-40 overflow-y-auto">
                      {['All', 'Inventory Issue', 'Payment Issue', 'Operational Issue', 'Customer Issue'].map(cat => (
                        <button 
                          key={cat}
                          onClick={() => setCategoryFilter(cat)}
                          className={`w-full text-left px-3 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center justify-between group ${categoryFilter === cat ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'}`}
                        >
                          {cat}
                          {categoryFilter === cat && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>

                    <div className="p-3 border-t border-border bg-muted/10">
                      <p className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2 mb-3">
                        <Calendar className="w-3.5 h-3.5" /> Date Range
                      </p>
                      <div className="grid grid-cols-2 gap-1 mb-3">
                        {['Today', 'Yesterday', 'This Week', '15 Days', 'This Month', 'All Time'].map(f => (
                          <button 
                            key={f}
                            onClick={() => setDateFilter(f)}
                            className={`px-2 py-1.5 text-xs font-semibold rounded-md transition-colors text-center ${dateFilter === f ? 'bg-primary text-primary-foreground' : 'hover:bg-muted border border-transparent hover:border-border text-foreground'}`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <input type="date" className="w-full bg-background border border-border rounded-lg p-2 text-xs outline-none focus:border-primary font-medium text-muted-foreground" />
                        <input type="date" className="w-full bg-background border border-border rounded-lg p-2 text-xs outline-none focus:border-primary font-medium text-muted-foreground" />
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <button onClick={() => {setCategoryFilter('All'); setDateFilter('All Time');}} className="px-3 py-2 text-xs font-bold bg-muted hover:bg-muted/80 rounded-lg transition-colors">Clear All</button>
                        <button onClick={() => setShowFilters(false)} className="px-3 py-2 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors shadow-sm">Apply</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button className="px-4 py-2.5 border border-border rounded-lg text-sm font-bold bg-background flex items-center gap-2 hover:bg-muted transition-colors shadow-sm whitespace-nowrap">
                <Download className="w-4 h-4" /> Export
              </button>
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="flex-1 overflow-auto bg-card">
          {filteredOrders.length > 0 ? (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 sticky top-0 z-10 shadow-sm backdrop-blur-md">
                <tr>
                  <th className="px-3 py-2 font-bold tracking-wider">Order & Customer</th>
                  <th className="px-3 py-2 font-bold tracking-wider">Failure Forensics</th>
                  <th className="px-3 py-2 font-bold tracking-wider">Accountability</th>
                  <th className="px-3 py-2 font-bold tracking-wider text-right">Financial Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.map(order => (
                  <tr 
                    key={order.id} 
                    onClick={() => setSelectedOrder(order)}
                    className={`hover:bg-muted/50 cursor-pointer transition-colors ${selectedOrder?.id === order.id ? 'bg-primary/5' : ''}`}
                  >
                    <td className="px-3 py-2">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-base">{order.id}</span>
                          <span className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded text-muted-foreground uppercase">{order.type}</span>
                        </div>
                        <span className="font-bold text-foreground">{order.customer}</span>
                        <span className="text-xs text-muted-foreground">{order.date}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-col gap-2 items-start">
                        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${getCategoryColor(order.category)}`}>
                          {getCategoryIcon(order.category)} {order.category}
                        </span>
                        <span className="text-sm font-semibold">{order.reason}</span>
                        <span className="text-xs text-muted-foreground border border-border rounded bg-background px-2 py-0.5">Stage: {order.stage}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold">{order.accountability}</span>
                        <span className="text-xs text-red-500 font-medium">{order.sla}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex flex-col gap-1 items-end">
                        <span className="font-black text-red-600 text-base">-${order.financials.lostRevenue.toFixed(2)}</span>
                        {order.financials.refundAmount > 0 && (
                          <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200">
                            Refunded: ${order.financials.refundAmount.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState 
              icon={XOctagon} 
              title="No failed orders found" 
              description="Everything is running smoothly! Try adjusting your filters or search terms if you're looking for something specific." 
            />
          )}
        </div>
      </div>

      {/* Right Panel: Order Recovery & Details */}
      {selectedOrder && (
        <div className="w-full md:w-1/2 bg-card overflow-hidden flex flex-col relative z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.05)] border-l border-border absolute md:static inset-y-0 right-0 h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border shrink-0 bg-red-50/30">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold">{selectedOrder.id}</h2>
                <span className={`text-xs px-2.5 py-1 rounded-md uppercase tracking-wider font-bold bg-red-100 text-red-700`}>
                  Failed
                </span>
              </div>
              <p className="text-muted-foreground font-medium text-sm">{selectedOrder.customer} • {selectedOrder.phone}</p>
            </div>
            
            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-muted rounded-full transition-colors border border-border bg-background shadow-sm">
              <ChevronDown className="w-4 h-4 text-muted-foreground -rotate-90" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            
            {/* Action Center: Recovery Tools */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-md border border-primary/20 p-5">
              <h3 className="text-sm font-black text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                <RefreshCw className="w-4 h-4" /> Recovery Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-bold rounded-lg shadow-md hover:bg-primary/90 transition-colors">
                  <RefreshCw className="w-4 h-4" /> Retry Order
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-background text-foreground border border-border font-bold rounded-lg shadow-sm hover:bg-muted transition-colors">
                  <PlusCircle className="w-4 h-4" /> Convert to New
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-background text-foreground border border-border font-bold rounded-lg shadow-sm hover:bg-muted transition-colors sm:col-span-2">
                  <Gift className="w-4 h-4 text-orange-500" /> Send Apology & Coupon
                </button>
              </div>
            </div>

            {/* Forensic Details */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-widest border-b border-border pb-2">Forensic Analysis</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 p-4 rounded-md border border-border">
                  <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Root Cause</p>
                  <p className="font-bold text-foreground flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 text-red-500"/> {selectedOrder.reason}</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-md border border-border">
                  <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Stage of Failure</p>
                  <p className="font-bold text-foreground">{selectedOrder.stage}</p>
                </div>
                <div className="bg-muted/30 p-4 rounded-md border border-border col-span-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase mb-1 flex items-center gap-1"><CreditCard className="w-3.5 h-3.5" /> Payment Details</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-medium text-sm">{selectedOrder.payment.method} ({selectedOrder.payment.txId})</span>
                    <span className="text-xs font-bold px-2 py-1 bg-background border border-border rounded">{selectedOrder.payment.status}</span>
                  </div>
                  {selectedOrder.payment.failCode && (
                    <p className="text-xs text-red-500 font-mono mt-2 bg-red-50 p-2 rounded border border-red-100">Error Code: {selectedOrder.payment.failCode}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Cart Snapshot */}
            <div className="bg-background rounded-md border border-border overflow-hidden">
              <div className="p-4 border-b border-border font-bold text-sm">Cart Snapshot</div>
              <div className="p-4 space-y-3">
                {selectedOrder.cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="font-medium">{item.qty}x {item.item}</span>
                    <span className="font-bold">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
                <div className="pt-3 border-t border-border flex justify-between items-center">
                  <span className="font-bold">Total Lost Revenue</span>
                  <span className="font-black text-red-600 text-lg">${selectedOrder.financials.lostRevenue.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
