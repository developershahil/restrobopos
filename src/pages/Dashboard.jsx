import { useState, useRef, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingBag, Percent, 
  Clock, Map, BarChart3, ListOrdered, Store, Bike, Package, Utensils, Calendar
} from 'lucide-react';

export default function Dashboard() {
  const [timeFilter, setTimeFilter] = useState('Daily');
  const [compareMode, setCompareMode] = useState(false);
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

  // Mock Data
  const kpis = {
    revenue: '$24,500', tax: '$1,225', orderValue: '$25,725', 
    orderCount: '1,240', cancelRate: '2.4%'
  };

  const channelBreakdown = [
    { name: 'Delivery', value: '45%', amount: '$11,025', orders: 558, icon: Bike, color: 'text-blue-500', bg: 'bg-blue-100' },
    { name: 'Takeaway', value: '25%', amount: '$6,125', orders: 310, icon: Package, color: 'text-orange-500', bg: 'bg-orange-100' },
    { name: 'Dine-in', value: '30%', amount: '$7,350', orders: 372, icon: Utensils, color: 'text-green-500', bg: 'bg-green-100' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">

      {/* 1. Filters & Compare Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex bg-card border border-border rounded-lg p-1">
          {['Daily', 'Weekly', 'Monthly'].map(f => (
            <button
              key={f}
              onClick={() => setTimeFilter(f)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors
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
              className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${timeFilter === 'Custom' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Calendar className="w-4 h-4" />
              Custom Date
            </button>
            
            {showDatePicker && (
              <div className="absolute right-0 sm:left-0 top-full mt-2 w-64 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
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

        <button 
          onClick={() => setCompareMode(!compareMode)}
          className={`px-4 py-2 text-sm font-bold rounded-lg border transition-colors flex items-center gap-2
            ${compareMode ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-foreground border-border hover:bg-muted'}`}
        >
          <Store className="w-4 h-4" />
          {compareMode ? 'Exit Compare Mode' : 'Compare Outlets'}
        </button>
      </div>

      {/* Conditional Compare Mode Wrapper */}
      <div className={compareMode ? "grid grid-cols-2 gap-6" : ""}>
        
        {/* Outlet A (Or Main View) */}
        <div className="space-y-6">
          {compareMode && (
            <div className="border-b border-border pb-2">
              <select className="text-xl font-bold bg-transparent outline-none cursor-pointer hover:bg-muted p-1 rounded-md transition-colors w-full max-w-xs">
                <option>📍 Koramangala Branch</option>
                <option>📍 Indiranagar Branch</option>
                <option>📍 Whitefield Branch</option>
                <option>📍 HSR Layout Branch</option>
              </select>
            </div>
          )}
          
          {/* 3. Main KPIs */}
          <div className={`grid gap-4 ${compareMode ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-5'}`}>
            <KPICard title="Total Revenue" value={kpis.revenue} icon={DollarSign} trend="+12%" />
            <KPICard title="Total Tax" value={kpis.tax} icon={Percent} trend="+12%" />
            <KPICard title="Gross Order Value" value={kpis.orderValue} icon={DollarSign} trend="+12%" />
            <KPICard title="Total Orders" value={kpis.orderCount} icon={ShoppingBag} trend="+8%" />
            <KPICard title="Cancel Rate" value={kpis.cancelRate} icon={TrendingDown} trend="-0.5%" trendUpIsBad />
          </div>

          {/* 4. Order Type Breakdown */}
          <h3 className="text-lg font-bold pt-2">Order Type Breakdown</h3>
          <div className={`grid gap-4 ${compareMode ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
            {channelBreakdown.map(channel => (
              <div key={channel.name} className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${channel.bg} ${channel.color}`}>
                  <channel.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">{channel.name}</p>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold">{channel.value}</p>
                    <p className="text-sm text-muted-foreground mb-1">({channel.orders} orders)</p>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                    <div className={`h-1.5 rounded-full ${channel.bg.replace('100', '500')}`} style={{ width: channel.value }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 5. Advanced Analytics Placeholders */}
          <h3 className="text-lg font-bold pt-2">Deep Insights</h3>
          <div className={`grid gap-4 ${compareMode ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
            <ChartPlaceholder title="Category-wise Sales" icon={BarChart3} desc="Visual volume across menu categories" />
            <ChartPlaceholder title="Top Selling Items" icon={ListOrdered} desc="Ranked list of menu items sold" />
            <ChartPlaceholder title="Highest Selling Area" icon={Map} desc="Analysis of delivery destinations" />
            <ChartPlaceholder title="Order Trends (Peak Hours)" icon={Clock} desc="Order volume by time of day" />
          </div>
        </div>

        {/* Outlet B (Compare View) */}
        {compareMode && (
          <div className="space-y-6 border-l border-border pl-6">
            <div className="border-b border-border pb-2">
              <select 
                className="text-xl font-bold bg-transparent outline-none cursor-pointer hover:bg-muted p-1 rounded-md transition-colors w-full max-w-xs" 
                defaultValue="📍 Indiranagar Branch"
              >
                <option>📍 Koramangala Branch</option>
                <option>📍 Indiranagar Branch</option>
                <option>📍 Whitefield Branch</option>
                <option>📍 HSR Layout Branch</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <KPICard title="Total Revenue" value="$18,200" icon={DollarSign} trend="-2%" trendUpIsBad={false} />
              <KPICard title="Total Tax" value="$910" icon={Percent} trend="-2%" />
              <KPICard title="Gross Order Value" value="$19,110" icon={DollarSign} trend="-2%" />
              <KPICard title="Total Orders" value="980" icon={ShoppingBag} trend="+1%" />
              <KPICard title="Cancel Rate" value="4.1%" icon={TrendingDown} trend="+1.2%" trendUpIsBad />
            </div>

            <h3 className="text-lg font-bold pt-2">Order Type Breakdown</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-4 opacity-80">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-blue-100 text-blue-500">
                  <Bike className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Delivery</p>
                  <p className="text-2xl font-bold">60%</p>
                </div>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-4 opacity-80">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-orange-100 text-orange-500">
                  <Package className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Takeaway</p>
                  <p className="text-2xl font-bold">10%</p>
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-bold pt-2">Deep Insights</h3>
            <div className="grid grid-cols-1 gap-4">
              <ChartPlaceholder title="Order Trends (Peak Hours)" icon={Clock} desc="Indiranagar peak is 8PM-10PM" />
              <ChartPlaceholder title="Top Selling Items" icon={ListOrdered} desc="1. Paneer Butter Masala" />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function KPICard({ title, value, icon: Icon, trend, trendUpIsBad = false }) {
  const isUp = trend.startsWith('+');
  const isGood = isUp ? !trendUpIsBad : trendUpIsBad;
  
  return (
    <div className="bg-card p-5 rounded-lg border border-border shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-muted-foreground text-sm font-medium">{title}</h3>
        <div className="p-2 bg-muted rounded-md text-muted-foreground">
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <span className={`text-xs font-bold ${isGood ? 'text-green-500' : 'text-red-500'}`}>
          {trend} vs last week
        </span>
      </div>
    </div>
  );
}

function ChartPlaceholder({ title, icon: Icon, desc }) {
  return (
    <div className="bg-card border border-border rounded-lg p-5 flex flex-col h-48">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-primary" />
        <h4 className="font-bold text-sm">{title}</h4>
      </div>
      <div className="flex-1 bg-muted/50 rounded-md border border-dashed border-border flex flex-col items-center justify-center text-center p-4">
        <span className="text-sm font-medium text-muted-foreground">{desc}</span>
        <span className="text-xs text-muted-foreground mt-2">Chart Visualization</span>
      </div>
    </div>
  );
}
