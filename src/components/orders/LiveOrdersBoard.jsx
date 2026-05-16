import { useState, useEffect } from 'react';
import { AlertTriangle, WifiOff, X, ArrowRight, Printer, User, ShoppingBag, Clock, Bike } from 'lucide-react';

// Mock Data
const initialOrders = [
  { id: '#1044', type: 'Delivery', priority: 'High', status: 'Ready', items: 3, timeElapsed: 22, timeExpected: 20, amount: '$35', mods: [], offer: { code: 'RAIN50', discount: 5.00 } },
  { id: '#1042', type: 'Delivery', priority: 'High', status: 'New', items: 5, timeElapsed: 2, timeExpected: 15, amount: '$45', mods: ['+ Extra spicy', '- No onions'] },
  { id: '#1043', type: 'Dine-in', priority: 'Medium', status: 'New', items: 2, timeElapsed: 1, timeExpected: 10, amount: '$18', mods: [] },
  { id: '#1041', type: 'Take Away', priority: 'Low', status: 'Preparing', items: 3, timeElapsed: 12, timeExpected: 10, amount: '$24', mods: [], delayed: true },
  { id: '#1039', type: 'Delivery', priority: 'High', status: 'Preparing', items: 8, timeElapsed: 18, timeExpected: 20, amount: '$85', mods: [], offer: { code: 'WELCOME10', discount: 8.50 } },
  { id: '#1038', type: 'Dine-in', priority: 'Medium', status: 'Ready', items: 4, timeElapsed: 25, timeExpected: 20, amount: '$52', mods: [] },
  { id: '#1037', type: 'Take Away', priority: 'Medium', status: 'New', items: 1, timeElapsed: 1, timeExpected: 10, amount: '$12', mods: [] },
  { id: '#1036', type: 'Delivery', priority: 'High', status: 'Preparing', items: 6, timeElapsed: 15, timeExpected: 20, amount: '$60', mods: [] },
  { id: '#1035', type: 'Dine-in', priority: 'Low', status: 'New', items: 2, timeElapsed: 0, timeExpected: 15, amount: '$25', mods: [] },
  { id: '#1034', type: 'Delivery', priority: 'High', status: 'Ready', items: 4, timeElapsed: 19, timeExpected: 20, amount: '$42', mods: [] },
];

export default function LiveOrdersBoard() {
  const [orders, setOrders] = useState(initialOrders);
  const [statusFilter, setStatusFilter] = useState('All');
  const [focusMode, setFocusMode] = useState(false);
  const [offline, setOffline] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(initialOrders[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setOrders(prev => prev.map(o => ({
        ...o,
        timeElapsed: o.timeElapsed + 1,
        delayed: (o.timeElapsed + 1) > o.timeExpected
      })));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const moveOrder = (id, newStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    if (selectedOrder?.id === id) {
      setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    }
  };

  const getNextStatus = (status) => {
    if (status === 'New') return 'Preparing';
    if (status === 'Preparing') return 'Ready';
    if (status === 'Ready') return 'Dispatched';
    return null;
  };

  const getActionText = (status) => {
    if (status === 'New') return 'Accept Order';
    if (status === 'Preparing') return 'Mark Ready';
    if (status === 'Ready') return 'Dispatch';
    return null;
  };

  const filteredOrders = orders.filter(o => {
    if (statusFilter !== 'All' && o.status !== statusFilter) return false;
    if (focusMode && o.status !== 'New' && !o.delayed) return false;
    if (o.status === 'Dispatched') return false; // Hide dispatched
    return true;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Auto-adjust page if current page becomes empty due to action
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Calculate Order Totals
  const rawAmount = selectedOrder ? parseFloat(selectedOrder.amount.replace('$', '')) : 0;
  const discount = selectedOrder?.offer?.discount || 0;
  const deliveryCharge = selectedOrder?.type === 'Delivery' ? 3.00 : 0;
  const packagingCharge = (selectedOrder?.type === 'Delivery' || selectedOrder?.type === 'Take Away') ? 1.50 : 0;
  const subtotalAfterDiscount = rawAmount - discount;
  const cgst = subtotalAfterDiscount * 0.025;
  const sgst = subtotalAfterDiscount * 0.025;
  const finalTotal = subtotalAfterDiscount + cgst + sgst + deliveryCharge + packagingCharge;

  return (
    <div className="flex h-full bg-background relative overflow-hidden flex-col md:flex-row">
      
      {/* Left Panel: Order List */}
      <div className={`${selectedOrder ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 md:min-w-[350px] border-r border-border bg-card flex-col z-10 shadow-sm`}>
        <div className="p-4 border-b border-border shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Live Orders</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setFocusMode(!focusMode)}
                className={`p-2 rounded-md transition-colors border ${focusMode ? 'bg-red-50 text-red-600 border-red-200' : 'bg-background text-muted-foreground border-border hover:bg-muted'}`}
                title="Focus Mode (Show Only Critical)"
              >
                🎯
              </button>
            </div>
          </div>
          
          <div className="flex bg-muted rounded-md p-1 overflow-x-auto hide-scrollbar">
            {['All', 'New', 'Preparing', 'Ready'].map(f => (
              <button 
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`flex-1 px-3 py-1.5 text-sm font-medium rounded transition-colors whitespace-nowrap ${statusFilter === f ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-background/50">
          {paginatedOrders.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">No orders found.</div>
          ) : (
            paginatedOrders.map(order => {
              const isSelected = selectedOrder?.id === order.id;
              const isDelayed = order.timeElapsed > order.timeExpected;
              const isCritical = order.timeElapsed > order.timeExpected + 5;
              
              let timerClass = "text-muted-foreground";
              if (isCritical) timerClass = "text-red-600 font-bold animate-pulse";
              else if (isDelayed) timerClass = "text-orange-500 font-bold";

              return (
                <div 
                  key={order.id} 
                  onClick={() => setSelectedOrder(order)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${isSelected ? 'bg-primary/5 border-primary/30 shadow-sm' : 'bg-card border-border hover:border-primary/20 hover:shadow-sm'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{order.id}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${order.status === 'New' ? 'bg-blue-100 text-blue-700' : order.status === 'Preparing' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className={`text-lg font-black tabular-nums ${timerClass}`}>
                      {order.timeElapsed}m
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <div className="text-muted-foreground flex items-center gap-1.5 font-medium">
                      <ShoppingBag className="w-3.5 h-3.5" /> {order.items} Items
                    </div>
                    <span className="font-semibold">{order.type}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-3 border-t border-border bg-card flex flex-col gap-2 shrink-0">
            <div className="flex justify-between items-center text-xs text-muted-foreground font-medium px-1">
              <span>Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length}</span>
              <span>Page {currentPage} / {totalPages}</span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex-1 py-1.5 border border-border rounded text-xs font-bold bg-background disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
              >
                Prev
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="flex-1 py-1.5 border border-border rounded text-xs font-bold bg-background disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel: Order Details */}
      <div className={`${selectedOrder ? 'flex' : 'hidden md:flex'} flex-1 bg-background overflow-hidden flex-col relative`}>
        {selectedOrder ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-border bg-card shrink-0 shadow-sm z-10">
              <div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="text-sm font-bold text-primary mb-2 flex items-center gap-1 md:hidden"
                >
                  ← Back to Orders
                </button>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-3xl font-black">{selectedOrder.id}</h2>
                  <span className={`text-xs px-3 py-1 rounded-md uppercase tracking-wider font-bold ${selectedOrder.type === 'Delivery' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                    {selectedOrder.type}
                  </span>
                </div>
                <p className="text-muted-foreground font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" /> {selectedOrder.timeElapsed}m elapsed (Target: {selectedOrder.timeExpected}m)
                </p>
              </div>
              
              {getNextStatus(selectedOrder.status) && (
                <button 
                  onClick={() => moveOrder(selectedOrder.id, getNextStatus(selectedOrder.status))}
                  className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-lg flex items-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-primary/20"
                >
                  {getActionText(selectedOrder.status)} <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:px-8 space-y-5 mx-auto w-full max-w-5xl">
              
              {/* Customer Info */}
              <div className="bg-card p-4 rounded-xl flex items-start gap-3 border border-border shadow-sm">
                <div className="bg-muted p-2.5 rounded-full"><User className="w-5 h-5 text-muted-foreground" /></div>
                <div>
                  <p className="font-bold text-base">Rahul Sharma</p>
                  <p className="text-muted-foreground font-medium text-sm">+91 98*** **123</p>
                  {selectedOrder.type === 'Delivery' && (
                    <p className="text-xs text-foreground mt-2 bg-muted p-2 rounded-lg border border-border inline-block">
                      📍 14th Main Rd, HSR Layout Sector 4
                    </p>
                  )}
                </div>
              </div>

              {/* Rider Assignment (Visible only for Delivery orders that are Ready) */}
              {selectedOrder.type === 'Delivery' && selectedOrder.status === 'Ready' && (
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 shadow-sm">
                  <h4 className="font-bold text-xs text-blue-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Bike className="w-3.5 h-3.5" /> Assign Delivery Rider
                  </h4>
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <select className="w-full sm:flex-1 bg-background border border-border rounded-lg p-2 outline-none focus:border-blue-500 font-medium text-foreground text-sm">
                      <option value="">Select an available rider...</option>
                      <option value="r1">🏍️ Zomato Rider (Arriving in 2m)</option>
                      <option value="r2">🏍️ Swiggy Rider (Waiting outside)</option>
                      <option value="r3">🛵 In-house: Ramesh (Available)</option>
                      <option value="r4">🛵 In-house: Suresh (Returning)</option>
                    </select>
                    <button className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm shrink-0 text-sm">
                      Assign Rider
                    </button>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                <div className="bg-muted/50 p-3 border-b border-border flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                  <h4 className="font-bold uppercase tracking-wider text-muted-foreground text-xs">Order Items</h4>
                </div>
                <div className="p-0">
                  <div className="flex justify-between items-start p-3 border-b border-border/50">
                    <div>
                      <p className="font-bold text-sm">1x Chicken Tikka Masala</p>
                      <p className="text-xs text-green-700 font-bold mt-1 bg-green-50 inline-block px-1.5 py-0.5 rounded border border-green-100">+ Extra spicy</p>
                    </div>
                    <p className="font-bold text-sm text-muted-foreground">$18.00</p>
                  </div>
                  <div className="flex justify-between items-start p-3 border-b border-border/50">
                    <div>
                      <p className="font-bold text-sm">2x Garlic Naan</p>
                    </div>
                    <p className="font-bold text-sm text-muted-foreground">$6.00</p>
                  </div>
                  <div className="flex justify-between items-start p-3 border-b border-border/50">
                    <div>
                      <p className="font-bold text-sm">1x Paneer Butter Masala</p>
                      <p className="text-xs text-red-600 font-bold mt-1 bg-red-50 inline-block px-1.5 py-0.5 rounded border border-red-100">- No onions</p>
                    </div>
                    <p className="font-bold text-sm text-muted-foreground">$16.00</p>
                  </div>
                  <div className="flex justify-between items-start p-3">
                    <div>
                      <p className="font-bold text-sm">1x Coke (500ml)</p>
                    </div>
                    <p className="font-bold text-sm text-muted-foreground">$5.00</p>
                  </div>
                </div>
                
                {/* Billing Summary integrated here to save space */}
                <div className="bg-muted/30 p-4 border-t border-border space-y-2">
                  <div className="flex justify-between items-center text-muted-foreground font-medium text-sm">
                    <span>Subtotal</span>
                    <span>${rawAmount.toFixed(2)}</span>
                  </div>
                  {selectedOrder.offer && (
                    <div className="flex justify-between items-center text-green-600 font-bold text-xs">
                      <span>Discount ({selectedOrder.offer.code})</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  {packagingCharge > 0 && (
                    <div className="flex justify-between items-center text-muted-foreground font-medium text-xs">
                      <span>Packaging Charge</span>
                      <span>${packagingCharge.toFixed(2)}</span>
                    </div>
                  )}
                  {deliveryCharge > 0 && (
                    <div className="flex justify-between items-center text-muted-foreground font-medium text-xs">
                      <span>Delivery Partner Fee</span>
                      <span>${deliveryCharge.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-muted-foreground font-medium text-xs">
                    <span>CGST (2.5%)</span>
                    <span>${cgst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground font-medium text-xs">
                    <span>SGST (2.5%)</span>
                    <span>${sgst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 mt-2 border-t border-border/50">
                    <span className="font-bold text-foreground uppercase tracking-widest text-xs">Total Amount</span>
                    <span className="font-black text-xl text-foreground">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Sticky Action Buttons Footer */}
            <div className="bg-card border-t border-border p-4 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
              <div className="mx-auto w-full max-w-5xl grid grid-cols-2 md:grid-cols-3 gap-3">
                <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-background font-bold hover:bg-muted transition-colors text-sm shadow-sm">
                  <Printer className="w-4 h-4 text-muted-foreground" /> Print KOT
                </button>
                <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-background font-bold hover:bg-muted transition-colors text-sm shadow-sm">
                  <Printer className="w-4 h-4 text-muted-foreground" /> Print Bill
                </button>
                <button className="col-span-2 md:col-span-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors text-sm shadow-sm">
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground bg-muted/10">
            <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">Select an order from the list</p>
          </div>
        )}
      </div>
    </div>
  );
}
