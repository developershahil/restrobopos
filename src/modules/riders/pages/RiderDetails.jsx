import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Bike, MapPin, Phone, Mail, Calendar, Clock, CheckCircle } from 'lucide-react';
import { useRiderStore } from '../store/useRiderStore';

export default function RiderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const getRiderById = useRiderStore((state) => state.getRiderById);
  const getRiderOrders = useRiderStore((state) => state.getRiderOrders);
  
  const rider = getRiderById(id);
  const orders = getRiderOrders(id);
  const [filter, setFilter] = useState('All Time');

  if (!rider) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-background">
        <h2 className="text-2xl font-black mb-4">Rider Not Found</h2>
        <button onClick={() => navigate('/riders')} className="px-6 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90">
          Back to Riders
        </button>
      </div>
    );
  }

  const activeDeliveries = orders.filter(o => ['Assigned', 'Picked Up / Dispatch', 'Out for Delivery'].includes(o.delivery_status)).length;
  const completedDeliveries = orders.filter(o => o.delivery_status === 'Delivered').length;

  const filteredOrders = orders.filter((order) => {
    if (filter === 'All Time') return true;
    const orderDate = new Date(order.assigned_at);
    const today = new Date();
    if (filter === 'Today') {
      return orderDate.toDateString() === today.toDateString();
    }
    if (filter === 'This Week') {
      const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
      return orderDate >= firstDay;
    }
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 p-6 border-b border-border bg-card shrink-0">
        <button onClick={() => navigate('/riders')} className="p-2 rounded-lg border border-border hover:bg-muted text-muted-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-3">
            Rider Profile
            <span className={`text-xs px-2 py-0.5 rounded uppercase tracking-wider font-bold ${rider.online_status === 'Online' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
              {rider.online_status}
            </span>
          </h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">Detailed statistics and history</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Top Row: Profile & Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col items-center text-center lg:col-span-1">
              <img src={rider.profile_photo} alt={rider.name} className="w-24 h-24 rounded-full border-4 border-muted object-cover mb-4" />
              <h2 className="text-xl font-black mb-1">{rider.name}</h2>
              <p className="text-sm font-medium text-muted-foreground mb-4">ID: {rider.id}</p>
              
              <div className="w-full space-y-3 mt-4 text-left border-t border-border pt-4">
                <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                  <Phone className="w-4 h-4 text-primary" /> {rider.phone}
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary" /> {rider.email || 'N/A'}
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                  <Bike className="w-4 h-4 text-primary" /> {rider.vehicle_type} - {rider.vehicle_number}
                </div>
                <div className="flex items-start gap-3 text-sm font-medium text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" /> {rider.address}
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-muted-foreground mb-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <span className="font-bold text-sm uppercase tracking-wider">Active Deliveries</span>
                </div>
                <span className="text-5xl font-black text-foreground">{activeDeliveries}</span>
              </div>
              <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-muted-foreground mb-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="font-bold text-sm uppercase tracking-wider">Total Delivered</span>
                </div>
                <span className="text-5xl font-black text-foreground">{completedDeliveries}</span>
              </div>
            </div>
          </div>

          {/* Delivery History */}
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-border gap-4">
              <h3 className="text-lg font-black flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" /> Delivery History
              </h3>
              <div className="flex bg-muted rounded-lg p-1 border border-border shadow-inner">
                {['Today', 'This Week', 'All Time'].map(f => (
                  <button 
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${filter === f ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-black text-xs text-muted-foreground uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 font-black text-xs text-muted-foreground uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 font-black text-xs text-muted-foreground uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 font-black text-xs text-muted-foreground uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-4 font-black text-xs text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 font-black text-xs text-muted-foreground uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-muted-foreground font-medium">
                        No delivery history found for this period.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map(order => (
                      <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 font-bold">{order.order_id}</td>
                        <td className="px-6 py-4 text-muted-foreground font-medium">{order.customer_name}</td>
                        <td className="px-6 py-4 font-bold">{order.amount}</td>
                        <td className="px-6 py-4">
                          <span className="bg-muted px-2 py-1 rounded text-xs font-bold text-muted-foreground">{order.payment_type}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                            order.delivery_status === 'Delivered' ? 'bg-green-100 text-green-700' :
                            order.delivery_status === 'Out for Delivery' ? 'bg-blue-100 text-blue-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {order.delivery_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-muted-foreground">
                          {new Date(order.assigned_at).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
