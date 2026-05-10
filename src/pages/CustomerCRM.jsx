import { useState } from 'react';
import { Search, Phone, Mail, MessageCircle, Clock, ShoppingBag, ChevronDown, ChevronUp, Package, CheckCircle, XCircle, Truck, IndianRupee, MapPin, CreditCard, Store, StickyNote, User, Calendar, Hash } from 'lucide-react';

const CUSTOMER_ORDERS = {
  1: [
    { id: '#1024', date: '2 days ago', dateStr: '06 May 2026, 8:42 PM', status: 'Delivered', total: '₹680', subtotal: '₹620', tax: '₹31', discount: '₹0', deliveryFee: '₹29', channel: 'Delivery', payment: 'UPI (PhonePe)', outlet: 'Koramangala Branch', address: '42, 1st Cross, HSR Layout, Bangalore', notes: 'Extra spicy, no onions in Dal', items: [
      { name: 'Chicken Tikka Masala', qty: 1, price: '₹320' },
      { name: 'Garlic Naan (2 pcs)', qty: 1, price: '₹120' },
      { name: 'Dal Makhani', qty: 1, price: '₹180' },
      { name: 'Lassi', qty: 1, price: '₹60' },
    ]},
    { id: '#1018', date: '5 days ago', dateStr: '03 May 2026, 1:15 PM', status: 'Delivered', total: '₹490', subtotal: '₹490', tax: '₹25', discount: '₹25', deliveryFee: '—', channel: 'Dine-in', payment: 'Card (Visa)', outlet: 'Indiranagar Branch', address: '—', notes: '', items: [
      { name: 'Paneer Butter Masala', qty: 1, price: '₹280' },
      { name: 'Butter Naan (3 pcs)', qty: 1, price: '₹150' },
      { name: 'Raita', qty: 1, price: '₹60' },
    ]},
    { id: '#1005', date: '1 week ago', dateStr: '01 May 2026, 7:30 PM', status: 'Delivered', total: '₹1,250', subtotal: '₹1,150', tax: '₹58', discount: '₹0', deliveryFee: '₹42', channel: 'Delivery', payment: 'Cash on Delivery', outlet: 'Koramangala Branch', address: '42, 1st Cross, HSR Layout, Bangalore', notes: 'Ring the bell twice', items: [
      { name: 'Family Combo (4 pax)', qty: 1, price: '₹999' },
      { name: 'Gulab Jamun (4 pcs)', qty: 1, price: '₹160' },
      { name: 'Cold Drink 750ml', qty: 1, price: '₹91' },
    ]},
    { id: '#982', date: '10 days ago', dateStr: '28 Apr 2026, 9:00 PM', status: 'Cancelled', total: '₹350', subtotal: '₹350', tax: '₹18', discount: '₹0', deliveryFee: '₹29', channel: 'Delivery', payment: 'Refunded to UPI', outlet: 'Koramangala Branch', address: '42, 1st Cross, HSR Layout, Bangalore', notes: 'Cancelled — restaurant closed early', items: [
      { name: 'Veg Biryani', qty: 1, price: '₹220' },
      { name: 'Mirchi Ka Salan', qty: 1, price: '₹130' },
    ]},
    { id: '#961', date: '2 weeks ago', dateStr: '24 Apr 2026, 12:30 PM', status: 'Delivered', total: '₹560', subtotal: '₹520', tax: '₹26', discount: '₹0', deliveryFee: '₹14', channel: 'Takeaway', payment: 'UPI (GPay)', outlet: 'HSR Layout Branch', address: '—', notes: '', items: [
      { name: 'Chicken Biryani (Full)', qty: 1, price: '₹380' },
      { name: 'Raita', qty: 1, price: '₹60' },
      { name: 'Coke 300ml', qty: 2, price: '₹120' },
    ]},
    { id: '#940', date: '3 weeks ago', dateStr: '17 Apr 2026, 8:15 PM', status: 'Delivered', total: '₹890', subtotal: '₹820', tax: '₹41', discount: '₹0', deliveryFee: '₹29', channel: 'Delivery', payment: 'Card (Mastercard)', outlet: 'Koramangala Branch', address: '42, 1st Cross, HSR Layout, Bangalore', notes: '', items: [
      { name: 'Mutton Rogan Josh', qty: 1, price: '₹420' },
      { name: 'Chicken Seekh Kebab', qty: 1, price: '₹280' },
      { name: 'Rumali Roti (4 pcs)', qty: 1, price: '₹120' },
      { name: 'Phirni', qty: 1, price: '₹70' },
    ]},
  ],
  2: [
    { id: '#1020', date: '1 week ago', dateStr: '01 May 2026, 6:45 PM', status: 'Delivered', total: '₹420', subtotal: '₹380', tax: '₹19', discount: '₹0', deliveryFee: '₹21', channel: 'Delivery', payment: 'UPI (Paytm)', outlet: 'Whitefield Branch', address: '15, Palm Meadows, Whitefield, Bangalore', notes: '', items: [
      { name: 'Margherita Pizza (Large)', qty: 1, price: '₹350' },
      { name: 'Garlic Bread', qty: 1, price: '₹70' },
    ]},
    { id: '#998', date: '2 weeks ago', dateStr: '25 Apr 2026, 1:00 PM', status: 'Delivered', total: '₹310', subtotal: '₹310', tax: '₹16', discount: '₹16', deliveryFee: '—', channel: 'Dine-in', payment: 'Cash', outlet: 'Indiranagar Branch', address: '—', notes: 'Birthday celebration', items: [
      { name: 'Pasta Alfredo', qty: 1, price: '₹250' },
      { name: 'Iced Tea', qty: 1, price: '₹60' },
    ]},
    { id: '#970', date: '3 weeks ago', dateStr: '18 Apr 2026, 7:20 PM', status: 'Delivered', total: '₹580', subtotal: '₹540', tax: '₹27', discount: '₹0', deliveryFee: '₹13', channel: 'Delivery', payment: 'UPI (GPay)', outlet: 'Whitefield Branch', address: '15, Palm Meadows, Whitefield, Bangalore', notes: '', items: [
      { name: 'Pepperoni Pizza (Medium)', qty: 1, price: '₹320' },
      { name: 'Chicken Wings (6 pcs)', qty: 1, price: '₹200' },
      { name: 'Coke 300ml', qty: 1, price: '₹60' },
    ]},
  ],
  3: [
    { id: '#1025', date: 'Today', dateStr: '08 May 2026, 11:30 AM', status: 'Delivered', total: '₹250', subtotal: '₹250', tax: '₹13', discount: '₹13', deliveryFee: '—', channel: 'Takeaway', payment: 'Cash', outlet: 'MG Road Branch', address: '—', notes: 'First time customer', items: [
      { name: 'Veg Thali', qty: 1, price: '₹180' },
      { name: 'Sweet Lassi', qty: 1, price: '₹70' },
    ]},
  ],
};

const mockCustomers = [
  { id: 1, name: 'Rahul Sharma', phone: '+91 98765 43123', email: 'rahul.sharma@gmail.com', address: '42, 1st Cross, HSR Layout, Bangalore - 560102', dob: '15 Mar 1992', joinDate: '12 Jan 2024', ltv: '₹4,280', orders: 6, segment: 'VIP', lastOrder: '2 days ago', avgOrder: '₹713' },
  { id: 2, name: 'Priya Patel', phone: '+91 99876 54456', email: 'priya.patel@outlook.com', address: '15, Palm Meadows, Whitefield, Bangalore - 560066', dob: '22 Aug 1995', joinDate: '05 Mar 2025', ltv: '₹1,310', orders: 3, segment: 'Repeat', lastOrder: '1 week ago', avgOrder: '₹437' },
  { id: 3, name: 'Amit Kumar', phone: '+91 97654 32789', email: 'amit.k@yahoo.com', address: '8, Brigade Road, MG Road, Bangalore - 560001', dob: '10 Nov 1998', joinDate: '08 May 2026', ltv: '₹250', orders: 1, segment: 'New', lastOrder: 'Today', avgOrder: '₹250' },
];

const getOrdinal = (n) => { const s = ['th','st','nd','rd']; const v = n % 100; return n + (s[(v-20)%10] || s[v] || s[0]); };

const STATUS_CONFIG = {
  Delivered: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
  Cancelled: { color: 'bg-red-100 text-red-600', icon: XCircle },
  'In Transit': { color: 'bg-blue-100 text-blue-600', icon: Truck },
};

const CHANNEL_COLOR = {
  Delivery: 'bg-blue-50 text-blue-600',
  'Dine-in': 'bg-orange-50 text-orange-600',
  Takeaway: 'bg-purple-50 text-purple-600',
};

export default function CustomerCRM() {
  const [selectedCustomer, setSelectedCustomer] = useState(mockCustomers[0]);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const orders = CUSTOMER_ORDERS[selectedCustomer?.id] || [];

  const toggleOrder = (orderId) => {
    setExpandedOrder(prev => prev === orderId ? null : orderId);
  };

  return (
    <div className="flex h-full">
      {/* Left Panel: Directory */}
      <div className="w-1/3 border-r border-border bg-background flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-bold mb-4">Customer Directory</h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search customers..." 
              className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-md text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            <button className="px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full shrink-0">All</button>
            <button className="px-3 py-1 bg-card border border-border text-xs font-medium rounded-full shrink-0 hover:bg-muted">VIP</button>
            <button className="px-3 py-1 bg-card border border-border text-xs font-medium rounded-full shrink-0 hover:bg-muted">New</button>
            <button className="px-3 py-1 bg-card border border-border text-xs font-medium rounded-full shrink-0 hover:bg-muted">At Risk</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {mockCustomers.map(customer => (
            <div 
              key={customer.id} 
              onClick={() => { setSelectedCustomer(customer); setExpandedOrder(null); }}
              className={`p-3 rounded-md cursor-pointer transition-colors ${selectedCustomer?.id === customer.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted border border-transparent'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-sm">{customer.name}</span>
                <span className="text-xs font-bold text-primary">{customer.ltv}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>{customer.phone}</span>
                <span className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded text-[10px] uppercase font-bold">{customer.segment}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel: Profile */}
      <div className="flex-1 bg-card overflow-y-auto">
        {selectedCustomer ? (
          <div className="p-6 max-w-3xl mx-auto">
            {/* Customer Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-bold">{selectedCustomer.name}</h2>
                <p className="text-muted-foreground mt-1">{selectedCustomer.phone} • Customer since 2024</p>
                <div className="flex gap-2 mt-3">
                  <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-bold rounded uppercase">{selectedCustomer.segment}</span>
                  {selectedCustomer.segment === 'VIP' && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded uppercase">High LTV</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 border border-border rounded-md hover:bg-muted text-muted-foreground" title="Call">
                  <Phone className="w-4 h-4" />
                </button>
                <button className="p-2 border border-green-200 bg-green-50 rounded-md hover:bg-green-100 text-green-600" title="WhatsApp">
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button className="p-2 border border-border rounded-md hover:bg-muted text-muted-foreground" title="Email">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-background border border-border rounded-lg text-center">
                <div className="text-muted-foreground text-xs font-medium uppercase mb-1">Total Spend</div>
                <div className="text-xl font-bold">{selectedCustomer.ltv}</div>
              </div>
              <div className="p-4 bg-background border border-border rounded-lg text-center">
                <div className="text-muted-foreground text-xs font-medium uppercase mb-1">Total Orders</div>
                <div className="text-xl font-bold">{orders.length}</div>
              </div>
              <div className="p-4 bg-background border border-border rounded-lg text-center">
                <div className="text-muted-foreground text-xs font-medium uppercase mb-1">Avg. Order</div>
                <div className="text-xl font-bold">{selectedCustomer.avgOrder}</div>
              </div>
              <div className="p-4 bg-background border border-border rounded-lg text-center">
                <div className="text-muted-foreground text-xs font-medium uppercase mb-1">Last Order</div>
                <div className="text-xl font-bold text-sm mt-1">{selectedCustomer.lastOrder}</div>
              </div>
            </div>

            {/* Customer Details Card */}
            <div className="mb-8 p-5 bg-background border border-border rounded-xl">
              <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2 uppercase tracking-wider">
                <User className="w-4 h-4 text-primary" /> Customer Details
              </h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Phone</p>
                    <p className="text-sm font-semibold text-foreground">{selectedCustomer.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Email</p>
                    <p className="text-sm font-semibold text-foreground">{selectedCustomer.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Address</p>
                    <p className="text-sm font-semibold text-foreground">{selectedCustomer.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Date of Birth</p>
                    <p className="text-sm font-semibold text-foreground">{selectedCustomer.dob}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Member Since</p>
                    <p className="text-sm font-semibold text-foreground">{selectedCustomer.joinDate}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order History */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> Order History
              </h3>
              <span className="text-sm text-muted-foreground font-medium">
                {orders.length} order{orders.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="space-y-3">
              {orders.map((order, idx) => {
                const statusConf = STATUS_CONFIG[order.status] || STATUS_CONFIG.Delivered;
                const StatusIcon = statusConf.icon;
                const isExpanded = expandedOrder === order.id;
                const channelColor = CHANNEL_COLOR[order.channel] || 'bg-gray-50 text-gray-600';
                const orderNumber = orders.length - idx;

                return (
                  <div
                    key={order.id}
                    className={`border rounded-xl transition-all ${
                      isExpanded ? 'border-primary/30 shadow-sm' : 'border-border hover:border-primary/20'
                    }`}
                  >
                    {/* Order Row — clickable */}
                    <button
                      onClick={() => toggleOrder(order.id)}
                      className="w-full flex items-center gap-4 p-4 text-left"
                    >
                      {/* Timeline dot */}
                      <div className="flex flex-col items-center shrink-0">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-500' : 'bg-primary/10 text-primary'
                        }`}>
                          <ShoppingBag className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Order Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className="font-bold text-sm text-foreground">{order.id}</span>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${statusConf.color}`}>
                            {order.status}
                          </span>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${channelColor}`}>
                            {order.channel}
                          </span>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                            {getOrdinal(orderNumber)} order
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{order.dateStr}</p>
                      </div>

                      {/* Total + Expand */}
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-bold text-foreground">{order.total}</span>
                        {isExpanded
                          ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                          : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        }
                      </div>
                    </button>

                    {/* Expanded Full Details */}
                    {isExpanded && (
                      <div className="px-4 pb-5 pt-0 border-t border-border/50">
                        {/* Order Meta Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 mb-4">
                          <div className="flex items-start gap-2">
                            <CreditCard className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                            <div>
                              <p className="text-[10px] uppercase font-bold text-muted-foreground">Payment</p>
                              <p className="text-xs font-semibold text-foreground">{order.payment}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Store className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                            <div>
                              <p className="text-[10px] uppercase font-bold text-muted-foreground">Outlet</p>
                              <p className="text-xs font-semibold text-foreground">{order.outlet}</p>
                            </div>
                          </div>
                          {order.address && order.address !== '—' && (
                            <div className="flex items-start gap-2">
                              <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                              <div>
                                <p className="text-[10px] uppercase font-bold text-muted-foreground">Delivery Address</p>
                                <p className="text-xs font-semibold text-foreground">{order.address}</p>
                              </div>
                            </div>
                          )}
                          {order.notes && (
                            <div className="flex items-start gap-2">
                              <StickyNote className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                              <div>
                                <p className="text-[10px] uppercase font-bold text-muted-foreground">Notes</p>
                                <p className="text-xs font-semibold text-foreground">{order.notes}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Items Table */}
                        <table className="w-full">
                          <thead>
                            <tr className="text-xs text-muted-foreground uppercase border-b border-border">
                              <th className="text-left pb-2 font-semibold">Item</th>
                              <th className="text-center pb-2 font-semibold">Qty</th>
                              <th className="text-right pb-2 font-semibold">Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item, i) => (
                              <tr key={i} className="border-b border-border/30">
                                <td className="py-2 text-sm font-medium text-foreground">{item.name}</td>
                                <td className="py-2 text-sm text-center text-muted-foreground">×{item.qty}</td>
                                <td className="py-2 text-sm text-right font-semibold text-foreground">{item.price}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Price Breakdown */}
                        <div className="mt-3 pt-3 border-t border-border space-y-1.5">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Subtotal</span><span className="font-semibold text-foreground">{order.subtotal}</span>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Tax (GST)</span><span className="font-semibold text-foreground">{order.tax}</span>
                          </div>
                          {order.deliveryFee && order.deliveryFee !== '—' && (
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>Delivery Fee</span><span className="font-semibold text-foreground">{order.deliveryFee}</span>
                            </div>
                          )}
                          {order.discount && order.discount !== '₹0' && (
                            <div className="flex justify-between text-xs text-green-600">
                              <span>Discount</span><span className="font-semibold">-{order.discount}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm font-bold pt-2 border-t border-border">
                            <span>Total</span><span className="text-primary">{order.total}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Select a customer to view their profile.
          </div>
        )}
      </div>
    </div>
  );
}
