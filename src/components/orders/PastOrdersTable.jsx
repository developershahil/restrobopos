import { useState, useRef, useEffect } from 'react';
import { Search, Download, FileText, RotateCcw, Filter, ChevronDown, CheckCircle2, XCircle, Printer, Calendar, Bike } from 'lucide-react';

const mockPastOrders = [
  { id: '#0981', date: 'Oct 24, 08:30 PM', customer: 'Anjali Desai', phone: '+91 98*** **442', type: 'Delivery', amount: '$45.00', status: 'Completed', payment: 'Paid via UPI', paymentMethod: 'UPI',
    rider: { name: 'Ramesh Kumar', phone: '+91 98765 43210', assignedTime: '08:15 PM', pickedUpTime: '08:20 PM', deliveryTime: '08:45 PM', duration: '30m' } 
  },
  { id: '#0980', date: 'Oct 24, 08:15 PM', customer: 'Vikram Singh', phone: '+91 99*** **111', type: 'Dine-in', amount: '$120.00', status: 'Completed', payment: 'Paid via Card', paymentMethod: 'Card' },
  { id: '#0979', date: 'Oct 24, 07:45 PM', customer: 'Neha Sharma', phone: '+91 88*** **999', type: 'Take Away', amount: '$18.50', status: 'Refunded', payment: 'Refunded', paymentMethod: 'UPI' },
  { id: '#0978', date: 'Oct 24, 07:10 PM', customer: 'Rohan Gupta', phone: '+91 77*** **222', type: 'Delivery', amount: '$32.00', status: 'Completed', payment: 'Paid via Cash', paymentMethod: 'Cash',
    rider: { name: 'Suresh Singh', phone: '+91 91234 56780', assignedTime: '07:12 PM', pickedUpTime: '07:18 PM', deliveryTime: '07:40 PM', duration: '28m' }
  },
  { id: '#0977', date: 'Oct 24, 06:50 PM', customer: 'Priya Patel', phone: '+91 91*** **333', type: 'Delivery', amount: '$85.00', status: 'Completed', payment: 'Paid via Card', paymentMethod: 'Card',
    rider: { name: 'Abdul Khan', phone: '+91 99887 76655', assignedTime: '06:55 PM', pickedUpTime: '07:05 PM', deliveryTime: '07:35 PM', duration: '40m' }
  },
  { id: '#0976', date: 'Oct 24, 06:15 PM', customer: 'Arun Kumar', phone: '+91 81*** **555', type: 'Delivery', amount: '$55.00', status: 'Failed', payment: 'Payment Failed', paymentMethod: 'Card' },
  { id: '#0975', date: 'Oct 24, 05:40 PM', customer: 'Sneha Reddy', phone: '+91 78*** **777', type: 'Dine-in', amount: '$65.00', status: 'Completed', payment: 'Paid via Card', paymentMethod: 'Card' },
  { id: '#0974', date: 'Oct 24, 05:15 PM', customer: 'Karan Malhotra', phone: '+91 90*** **888', type: 'Take Away', amount: '$22.00', status: 'Completed', payment: 'Paid via UPI', paymentMethod: 'UPI' },
  { id: '#0973', date: 'Oct 24, 04:30 PM', customer: 'Divya Iyer', phone: '+91 85*** **111', type: 'Delivery', amount: '$40.00', status: 'Refunded', payment: 'Refunded', paymentMethod: 'Card' },
  { id: '#0972', date: 'Oct 24, 04:00 PM', customer: 'Mohammed Ali', phone: '+91 96*** **222', type: 'Dine-in', amount: '$150.00', status: 'Completed', payment: 'Paid via Cash', paymentMethod: 'Cash' },
  { id: '#0971', date: 'Oct 24, 03:20 PM', customer: 'Pooja Verma', phone: '+91 89*** **333', type: 'Delivery', amount: '$28.00', status: 'Completed', payment: 'Paid via UPI', paymentMethod: 'UPI',
    rider: { name: 'Ramesh Kumar', phone: '+91 98765 43210', assignedTime: '03:25 PM', pickedUpTime: '03:30 PM', deliveryTime: '03:55 PM', duration: '30m' }
  },
  { id: '#0970', date: 'Oct 24, 02:45 PM', customer: 'Vikash Jain', phone: '+91 93*** **444', type: 'Take Away', amount: '$35.00', status: 'Completed', payment: 'Paid via Card', paymentMethod: 'Card' },
];

export default function PastOrdersTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const filterRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOrders = mockPastOrders.filter(o => {
    if (typeFilter !== 'All' && o.type !== typeFilter) return false;
    if (searchTerm && !o.id.toLowerCase().includes(searchTerm.toLowerCase()) && !o.customer.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Auto-adjust page if current page becomes empty due to filtering
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  return (
    <div className="flex h-full bg-background relative overflow-hidden">
      
      {/* Left Panel: Table View */}
      <div className={`flex flex-col bg-background transition-all duration-300 ${selectedOrder ? 'w-1/2 border-r border-border' : 'w-full'}`}>
        
        {/* Quick Insights & Filters */}
        <div className="p-6 border-b border-border bg-card shrink-0 space-y-6">
          {/* Top Row: Insights */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-background border border-border p-4 rounded-xl shadow-sm">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Total Orders</p>
              <p className="text-3xl font-black mt-1">1,248</p>
            </div>
            <div className="bg-background border border-border p-4 rounded-xl shadow-sm">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Revenue</p>
              <p className="text-3xl font-black mt-1">$45,210</p>
            </div>
            <div className="bg-background border border-border p-4 rounded-xl shadow-sm">
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Avg Order Value</p>
              <p className="text-3xl font-black mt-1">$36.22</p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search Order ID or Customer..." 
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background outline-none focus:border-primary font-medium"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select 
                className="px-4 py-2.5 rounded-lg border border-border bg-background outline-none focus:border-primary font-medium"
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
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background font-bold hover:bg-muted transition-colors"
                >
                  <Filter className="w-4 h-4" /> Filters
                </button>
                
                {showFilters && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-3 border-b border-border bg-muted/30">
                      <p className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" /> Quick Filters
                      </p>
                    </div>
                    <div className="p-2 space-y-0.5">
                      {['Today', 'Yesterday', 'This Week', 'This Month', 'All Time'].map(f => (
                        <button key={f} className="w-full text-left px-3 py-2 text-sm font-semibold rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-between group">
                          {f}
                          {f === 'All Time' && <CheckCircle2 className="w-4 h-4 opacity-50 group-hover:opacity-100" />}
                        </button>
                      ))}
                    </div>
                    <div className="p-3 border-t border-border bg-muted/10">
                      <p className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3">Custom Range</p>
                      <div className="flex flex-col gap-2">
                        <input type="date" className="w-full bg-background border border-border rounded-lg p-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium text-muted-foreground" />
                        <input type="date" className="w-full bg-background border border-border rounded-lg p-2.5 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium text-muted-foreground" />
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <button className="px-3 py-2.5 rounded-lg border border-border bg-background font-bold text-sm hover:bg-muted transition-colors">
                          Clear
                        </button>
                        <button className="px-3 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors shadow-sm">
                          Apply Filters
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background font-bold hover:bg-muted transition-colors">
                <Download className="w-4 h-4" /> Export
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-muted/50 sticky top-0 backdrop-blur-sm z-10 border-b border-border">
              <tr>
                <th className="p-4 font-bold text-muted-foreground text-sm uppercase tracking-wider">Order</th>
                <th className="p-4 font-bold text-muted-foreground text-sm uppercase tracking-wider">Customer</th>
                <th className="p-4 font-bold text-muted-foreground text-sm uppercase tracking-wider">Type</th>
                <th className="p-4 font-bold text-muted-foreground text-sm uppercase tracking-wider">Status</th>
                <th className="p-4 font-bold text-muted-foreground text-sm uppercase tracking-wider text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedOrders.map(order => (
                <tr 
                  key={order.id} 
                  onClick={() => setSelectedOrder(order)}
                  className={`hover:bg-muted/30 cursor-pointer transition-colors ${selectedOrder?.id === order.id ? 'bg-primary/5' : ''}`}
                >
                  <td className="p-4">
                    <p className="font-bold">{order.id}</p>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">{order.date}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-bold">{order.customer}</p>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">{order.phone}</p>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${order.type === 'Delivery' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {order.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      {order.status === 'Completed' ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-500" />}
                      <span className={`text-sm font-bold ${order.status === 'Completed' ? 'text-green-600' : 'text-red-500'}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">{order.payment}</p>
                  </td>
                  <td className="p-4 text-right font-black text-lg">
                    {order.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-border bg-card flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground font-medium">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
              </p>
              <span className="text-sm font-bold bg-muted px-2 py-1 rounded-md text-muted-foreground">Page {currentPage} / {totalPages}</span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-border rounded-lg text-sm font-bold bg-background disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
              >
                Previous
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-4 py-2 border border-border rounded-lg text-sm font-bold bg-background disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel: Expanded Details */}
      {selectedOrder && (
        <div className="w-1/2 bg-card overflow-hidden flex flex-col relative z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.05)]">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border shrink-0 bg-muted/10">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-black">{selectedOrder.id}</h2>
                <span className={`text-xs px-2.5 py-1 rounded-md uppercase tracking-wider font-bold ${selectedOrder.type === 'Delivery' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                  {selectedOrder.type}
                </span>
                <span className={`text-xs px-2.5 py-1 rounded-md uppercase tracking-wider font-bold ${selectedOrder.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {selectedOrder.status}
                </span>
              </div>
              <p className="text-muted-foreground font-medium text-sm">{selectedOrder.date}</p>
            </div>
            
            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-muted rounded-full transition-colors border border-border bg-background shadow-sm">
              <ChevronDown className="w-5 h-5 text-muted-foreground -rotate-90" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* Timeline */}
            <div>
              <h4 className="font-bold text-sm text-muted-foreground uppercase tracking-widest mb-4">Order Timeline</h4>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white bg-green-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                  <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] bg-background border border-border p-3 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-bold text-sm text-foreground">Order Accepted</div>
                      <time className="text-xs font-medium text-muted-foreground">08:00 PM</time>
                    </div>
                  </div>
                </div>
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white bg-green-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                  <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] bg-background border border-border p-3 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-bold text-sm text-foreground">Preparing</div>
                      <time className="text-xs font-medium text-muted-foreground">08:05 PM</time>
                    </div>
                  </div>
                </div>
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 border-white ${selectedOrder.status === 'Completed' ? 'bg-green-500' : 'bg-red-500'} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10`}></div>
                  <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] bg-background border border-border p-3 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-bold text-sm text-foreground">{selectedOrder.status}</div>
                      <time className="text-xs font-medium text-muted-foreground">08:30 PM</time>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rider Tracking (Only for Delivery) */}
            {selectedOrder.type === 'Delivery' && selectedOrder.rider && (
              <div className="bg-blue-50/50 rounded-xl border border-blue-100 overflow-hidden">
                <div className="p-4 border-b border-blue-100 font-bold uppercase tracking-wider text-sm text-blue-800 flex items-center gap-2">
                  <Bike className="w-4 h-4" /> Delivery Partner Details
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-foreground">{selectedOrder.rider.name}</p>
                      <p className="text-sm font-medium text-muted-foreground">{selectedOrder.rider.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-blue-700">{selectedOrder.rider.duration}</p>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Time</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-blue-100 grid grid-cols-3 gap-2">
                    <div className="bg-background rounded-lg p-2.5 border border-border shadow-sm text-center">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Dispatched</p>
                      <p className="font-bold text-sm">{selectedOrder.rider.assignedTime}</p>
                    </div>
                    <div className="bg-background rounded-lg p-2.5 border border-border shadow-sm text-center">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Picked Up</p>
                      <p className="font-bold text-sm">{selectedOrder.rider.pickedUpTime}</p>
                    </div>
                    <div className="bg-background rounded-lg p-2.5 border border-border shadow-sm text-center">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Delivered</p>
                      <p className="font-bold text-sm text-green-600">{selectedOrder.rider.deliveryTime}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Receipt Breakdown */}
            <div className="bg-muted/30 rounded-xl border border-border overflow-hidden">
              <div className="p-4 border-b border-border font-bold uppercase tracking-wider text-sm text-muted-foreground">
                Receipt Breakdown
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-foreground">2x Margarita Pizza</span>
                  <span className="font-bold text-muted-foreground">$24.00</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-foreground">1x Garlic Bread</span>
                  <span className="font-bold text-muted-foreground">$6.00</span>
                </div>
                <div className="pt-3 mt-3 border-t border-border/50 space-y-2">
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span>$30.00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-green-600 font-bold">
                    <span>Discount (LOYAL10)</span>
                    <span>-$3.00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Taxes (CGST + SGST)</span>
                    <span>$2.50</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Delivery Fee</span>
                    <span>$2.50</span>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-card border-t border-border flex justify-between items-center">
                <span className="font-bold uppercase tracking-widest text-sm text-foreground">Final Total</span>
                <span className="font-black text-2xl text-foreground">{selectedOrder.amount}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pb-8">
              <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-card font-bold hover:bg-muted transition-colors text-sm shadow-sm">
                <FileText className="w-4 h-4 text-muted-foreground" /> Export PDF
              </button>
              <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-card font-bold hover:bg-muted transition-colors text-sm shadow-sm">
                <Printer className="w-4 h-4 text-muted-foreground" /> Reprint Invoice
              </button>
              
              {selectedOrder.status === 'Failed' || selectedOrder.status === 'Refunded' ? (
                <button 
                  className={`col-span-2 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-colors text-sm shadow-sm ${selectedOrder.status === 'Refunded' ? 'bg-muted text-muted-foreground cursor-not-allowed border border-border' : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'}`}
                  disabled={selectedOrder.status === 'Refunded'}
                >
                  <RotateCcw className="w-4 h-4" /> {selectedOrder.status === 'Refunded' ? 'Refund Already Processed' : 'Process Refund'}
                </button>
              ) : (
                <button className="col-span-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors text-sm shadow-sm">
                  <RotateCcw className="w-4 h-4" /> Repeat Order
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
