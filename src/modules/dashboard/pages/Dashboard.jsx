import { useState, useRef, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useRiderStore } from '../../riders/store/useRiderStore';
import { 
  TrendingDown, DollarSign, ShoppingBag, Percent, 
  Bike, Package, Utensils, Calendar, Activity, Trophy, AlertCircle, Settings,
  PackageMinus, Star, Users, Wallet, MessageSquare
} from 'lucide-react';

// --- MOCK DATA ---
const kpis = {
  revenue: '$24,500', tax: '$1,225', orderValue: '$25,725', 
  orderCount: '1,240', cancelRate: '2.4%'
};

const channelBreakdown = [
  { name: 'Delivery', value: '45%', amount: '$11,025', orders: 558, icon: Bike, color: 'text-blue-500', bg: 'bg-blue-100' },
  { name: 'Takeaway', value: '25%', amount: '$6,125', orders: 310, icon: Package, color: 'text-orange-500', bg: 'bg-orange-100' },
  { name: 'Dine-in', value: '30%', amount: '$7,350', orders: 372, icon: Utensils, color: 'text-green-500', bg: 'bg-green-100' },
];

const mockRevenueData = [
  { label: '8 AM', value: 120 },
  { label: '10 AM', value: 340 },
  { label: '12 PM', value: 890 },
  { label: '2 PM', value: 560 },
  { label: '4 PM', value: 410 },
  { label: '6 PM', value: 780 },
  { label: '8 PM', value: 1100 },
  { label: '10 PM', value: 450 },
];

const mockCategoryData = [
  { name: 'Pizzas', sales: 450, color: 'bg-orange-500' },
  { name: 'Burgers', sales: 380, color: 'bg-yellow-500' },
  { name: 'Beverages', sales: 290, color: 'bg-blue-500' },
  { name: 'Desserts', sales: 150, color: 'bg-pink-500' },
  { name: 'Combos', sales: 110, color: 'bg-purple-500' },
];

const mockFeed = [
  { id: 1, time: '2 mins ago', text: 'New Delivery Order #1046', type: 'order', icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-100' },
  { id: 2, time: '5 mins ago', text: 'Ramesh picked up #1042', type: 'rider', icon: Bike, color: 'text-green-500', bg: 'bg-green-100' },
  { id: 3, time: '12 mins ago', text: 'Low Stock Alert: Paneer', type: 'alert', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-100' },
  { id: 4, time: '18 mins ago', text: 'New Dine-in Order #1045', type: 'order', icon: Utensils, color: 'text-orange-500', bg: 'bg-orange-100' },
];

const mockLeaderboard = [
  { id: 1, name: 'Suresh Kumar', deliveries: 14, rating: 4.9 },
  { id: 2, name: 'Ramesh Singh', deliveries: 12, rating: 4.7 },
  { id: 3, name: 'Abdul Khan', deliveries: 9, rating: 4.8 },
];

const mockInventory = [
  { id: 1, name: 'Mozzarella Cheese', left: '12%', status: 'critical', color: 'bg-red-500', bg: 'bg-red-100' },
  { id: 2, name: 'Pizza Boxes (12")', left: '18%', status: 'warning', color: 'bg-orange-500', bg: 'bg-orange-100' },
  { id: 3, name: 'Tomato Sauce', left: '35%', status: 'ok', color: 'bg-green-500', bg: 'bg-green-100' },
];

const mockReviews = [
  { id: 1, name: 'Aarav M.', rating: 5, text: 'Food was piping hot and arrived early! Loved the garlic bread.', time: '1 hr ago' },
  { id: 2, name: 'Priya T.', rating: 2, text: 'Missed my extra dip, and pizza was slightly cold.', time: '3 hrs ago' },
  { id: 3, name: 'John D.', rating: 5, text: 'Best paneer tikka in the area hands down.', time: '5 hrs ago' },
];

const mockStaff = [
  { id: 1, role: 'Kitchen', active: 4, total: 5, status: 'Optimal' },
  { id: 2, role: 'FOH (Cashiers)', active: 2, total: 2, status: 'Optimal' },
  { id: 3, role: 'Delivery', active: 6, total: 8, status: 'Busy' },
];

const mockFinancials = {
  gross: '$24,500',
  cogs: '$8,200',
  wages: '$1,500',
  netProfit: '$14,800',
  margin: '60.4%'
};


// -----------------

export default function Dashboard() {
  const { activeBrand, activeOutlet } = useOutletContext();
  const navigate = useNavigate();
  const getRidersByOutlet = useRiderStore(state => state.getRidersByOutlet);
  const activeRidersCount = getRidersByOutlet(activeOutlet.id).filter(r => r.status === 'Active').length;

  const [timeFilter, setTimeFilter] = useState('Daily');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dateRef.current && !dateRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="p-4 max-w-full mx-auto space-y-6">

      {/* 1. Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex bg-card border border-border rounded-lg p-1">
          {['Daily', 'Weekly', 'Monthly'].map(f => (
            <button
              key={f}
              onClick={() => setTimeFilter(f)}
              className={`px-3 h-8 flex items-center justify-center text-[13px] font-medium rounded-md transition-colors
                ${timeFilter === f ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {f}
            </button>
          ))}
          <div className="w-px h-6 bg-border mx-2 self-center"></div>
          <div className="relative" ref={dateRef}>
            <button 
              onClick={() => {
                setTimeFilter('Custom');
                setShowDatePicker(!showDatePicker);
              }}
              className={`flex items-center gap-2 px-3 h-8 justify-center text-[13px] font-medium rounded-md transition-colors ${timeFilter === 'Custom' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Calendar className="w-4 h-4" />
              Custom Date
            </button>
            
            {showDatePicker && (
              <div className="absolute right-0 sm:left-0 top-full mt-2 w-64 bg-card border border-border rounded-md shadow-2xl z-50 overflow-hidden">
                <div className="p-4 border-b border-border bg-muted/10">
                  <p className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3">Custom Range</p>
                  <div className="flex flex-col gap-2">
                    <input type="date" className="w-full bg-background border border-border rounded-lg p-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium text-muted-foreground" />
                    <input type="date" className="w-full bg-background border border-border rounded-lg p-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary font-medium text-muted-foreground" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button 
                      onClick={() => setShowDatePicker(false)}
                      className="px-3 py-2 rounded-lg border border-border bg-background font-bold text-sm hover:bg-muted transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => setShowDatePicker(false)}
                      className="px-3 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors shadow-sm"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main View */}
      <div className="space-y-6">
        
        {/* Header Action for Riders */}
        <div className="flex justify-between items-center pb-2 border-b border-border">
          <h2 className="text-lg font-black tracking-tight">{activeBrand.name} Command Center</h2>
          <button 
            onClick={() => navigate('/riders')}
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/20 rounded-lg font-bold text-sm transition-all shadow-sm"
          >
            <Bike className="w-4 h-4" /> Go to Rider Management
          </button>
        </div>
        
        {/* 3. Main KPIs */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-6">
          <KPICard title="Total Revenue" value={kpis.revenue} icon={DollarSign} trend="+12%" />
          <KPICard title="Total Tax" value={kpis.tax} icon={Percent} trend="+12%" />
          <KPICard title="Gross Order Value" value={kpis.orderValue} icon={DollarSign} trend="+12%" />
          <KPICard title="Total Orders" value={kpis.orderCount} icon={ShoppingBag} trend="+8%" />
          <KPICard title="Cancel Rate" value={kpis.cancelRate} icon={TrendingDown} trend="-0.5%" trendUpIsBad />
          <KPICard title="Active Riders" value={activeRidersCount.toString()} icon={Bike} trend="+2%" />
        </div>

        {/* 4. Advanced Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          
          {/* Left Column (Main Analytics) - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
               <RevenueTrendChart data={mockRevenueData} />
               <CategorySalesChart data={mockCategoryData} />
            </div>

            {/* Order Type Breakdown */}
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Channel Distribution</h3>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              {channelBreakdown.map(channel => (
                <div key={channel.name} className="bg-card border border-border rounded-md p-3 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${channel.bg} ${channel.color}`}>
                    <channel.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">{channel.name}</p>
                    <div className="flex items-end gap-2">
                      <p className="text-xl font-bold">{channel.value}</p>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                      <div className={`h-1.5 rounded-full ${channel.bg.replace('100', '500')}`} style={{ width: channel.value }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (Live Feed & Ops) - 1/3 width */}
          <div className="space-y-6">
             <LiveFeed feed={mockFeed} />
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
               <OperationalControls />
               <RiderLeaderboard data={mockLeaderboard} />
             </div>
          </div>
        </div>



      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function KPICard({ title, value, icon: Icon, trend, trendUpIsBad = false }) {
  const isUp = trend.startsWith('+');
  const isGood = isUp ? !trendUpIsBad : trendUpIsBad;
  
  return (
    <div className="bg-card p-4 rounded-md border border-border shadow-sm flex flex-col justify-between hover:border-primary/30 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-muted-foreground text-sm font-medium">{title}</h3>
        <div className="p-2 bg-muted rounded-md text-muted-foreground">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div>
        <p className="text-xl font-bold">{value}</p>
        <span className={`text-[11px] font-medium ${isGood ? 'text-green-500' : 'text-red-500'}`}>
          {trend} vs last week
        </span>
      </div>
    </div>
  );
}

function RevenueTrendChart({ data }) {
  const maxVal = Math.max(...data.map(d => d.value));
  return (
    <div className="bg-card border border-border rounded-lg p-5 flex flex-col h-[300px] shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-bold text-sm">Revenue Trend (Today)</h4>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-muted px-2 py-1 rounded text-muted-foreground">Hourly</span>
      </div>
      <div className="flex-1 flex items-end gap-2 sm:gap-4 mt-auto border-b border-border pb-2">
        {data.map((item, idx) => {
          const height = (item.value / maxVal) * 100;
          const isPeak = height > 80;
          return (
            <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
              <div 
                className={`w-full rounded-t-sm transition-all duration-500 ${isPeak ? 'bg-primary' : 'bg-primary/30 group-hover:bg-primary/50'}`} 
                style={{ height: `${height}%` }}
              ></div>
              <span className="absolute -bottom-6 text-[10px] sm:text-xs text-muted-foreground font-bold">{item.label}</span>
              {/* Tooltip */}
              <div className="absolute -top-8 bg-foreground text-background font-bold text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-10">
                ${item.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CategorySalesChart({ data }) {
  const maxVal = Math.max(...data.map(d => d.sales));
  return (
    <div className="bg-card border border-border rounded-lg p-5 flex flex-col h-[300px] shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-sm">Top Categories</h4>
      </div>
      <div className="flex-1 flex flex-col justify-between">
        {data.map((item, idx) => {
          const width = (item.sales / maxVal) * 100;
          return (
            <div key={idx} className="space-y-1 group">
              <div className="flex justify-between text-xs font-bold">
                <span>{item.name}</span>
                <span className="text-muted-foreground">{item.sales} units</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                <div className={`h-full rounded-full ${item.color} group-hover:opacity-80 transition-opacity`} style={{ width: `${width}%` }}></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LiveFeed({ feed }) {
  return (
    <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-primary animate-pulse" />
        <h4 className="font-bold text-sm">Live Activity Feed</h4>
      </div>
      <div className="space-y-4">
        {feed.map(item => (
          <div key={item.id} className="flex gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${item.bg} ${item.color}`}>
              <item.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold">{item.text}</p>
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full mt-4 py-2 bg-muted/50 text-xs font-bold rounded-md hover:bg-muted transition-colors text-muted-foreground">
        View All Logs
      </button>
    </div>
  );
}

function RiderLeaderboard({ data }) {
  return (
    <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-4 h-4 text-yellow-500" />
        <h4 className="font-bold text-sm">Rider Leaderboard</h4>
      </div>
      <div className="space-y-2">
        {data.map((rider, idx) => (
          <div key={rider.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-black w-5 text-center ${idx === 0 ? 'text-yellow-500' : 'text-muted-foreground'}`}>{idx + 1}.</span>
              <div>
                <p className="text-sm font-bold">{rider.name}</p>
                <p className="text-[10px] text-muted-foreground font-bold tracking-wider">⭐ {rider.rating}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-primary">{rider.deliveries}</p>
              <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Trips</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OperationalControls() {
  const [controls, setControls] = useState({ pauseDelivery: false, busyMode: false });
  return (
    <div className="bg-card border border-border rounded-lg p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-4 h-4 text-muted-foreground" />
        <h4 className="font-bold text-sm">Quick Controls</h4>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between cursor-pointer group" onClick={() => setControls(p => ({...p, pauseDelivery: !p.pauseDelivery}))}>
          <div>
            <p className="text-sm font-bold group-hover:text-foreground transition-colors">Pause Delivery</p>
            <p className="text-xs text-muted-foreground font-medium">Halt online orders</p>
          </div>
          <div className={`w-10 h-6 rounded-full p-1 transition-colors ${controls.pauseDelivery ? 'bg-red-500' : 'bg-muted'}`}>
            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${controls.pauseDelivery ? 'translate-x-4' : 'translate-x-0'}`}></div>
          </div>
        </div>
        <div className="h-px bg-border my-1"></div>
        <div className="flex items-center justify-between cursor-pointer group" onClick={() => setControls(p => ({...p, busyMode: !p.busyMode}))}>
          <div>
            <p className="text-sm font-bold group-hover:text-foreground transition-colors">Surge / Busy Mode</p>
            <p className="text-xs text-muted-foreground font-medium">+15m to all ETAs</p>
          </div>
          <div className={`w-10 h-6 rounded-full p-1 transition-colors ${controls.busyMode ? 'bg-orange-500' : 'bg-muted'}`}>
            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${controls.busyMode ? 'translate-x-4' : 'translate-x-0'}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
}


