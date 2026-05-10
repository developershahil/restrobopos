import { useState } from 'react';
import { 
  BarChart3, PieChart, Users, ShoppingBag, Package, DollarSign, Tag,
  Download, FileText, FileSpreadsheet, Calendar, MapPin, Filter, TrendingUp, AlertCircle
} from 'lucide-react';

const reportTabs = [
  { id: 'sales', name: 'Sales & Revenue', icon: BarChart3 },
  { id: 'items', name: 'Item Performance', icon: PieChart },
  { id: 'orders', name: 'Order Operations', icon: ShoppingBag },
  { id: 'customers', name: 'Customer CRM', icon: Users },
  { id: 'inventory', name: 'Inventory & Cost', icon: Package },
  { id: 'profit', name: 'Profit & Margin', icon: DollarSign },
  { id: 'offers', name: 'Offers & Campaigns', icon: Tag },
];

export default function Reports() {
  const [activeTab, setActiveTab] = useState('sales');
  const [isExporting, setIsExporting] = useState(false);
  const [showExportToast, setShowExportToast] = useState(false);

  const handleExport = (type) => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setShowExportToast(true);
      setTimeout(() => setShowExportToast(false), 5000);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative">
      
      {/* Toast Notification for Async Export */}
      {showExportToast && (
        <div className="absolute top-6 right-6 bg-primary text-primary-foreground px-6 py-4 rounded-xl shadow-2xl flex items-start gap-3 z-50 animate-in slide-in-from-top-5">
          <FileText className="w-6 h-6 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Report Generated!</h4>
            <p className="text-sm opacity-90">Your requested report is ready for download.</p>
            <button className="mt-2 text-xs font-black underline">Download Now</button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-6 border-b border-border bg-card shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Business Intelligence</h1>
          <p className="text-muted-foreground text-sm mt-1">Deep-dive historical analysis, filters, and audit-ready exports.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            className="px-4 py-2 bg-background border border-border text-foreground font-bold rounded-lg shadow-sm hover:bg-muted transition-colors flex items-center gap-2"
          >
            {isExporting ? <span className="animate-pulse">Preparing...</span> : <><FileSpreadsheet className="w-4 h-4 text-green-600" /> Export CSV</>}
          </button>
          <button 
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="px-4 py-2 bg-background border border-border text-foreground font-bold rounded-lg shadow-sm hover:bg-muted transition-colors flex items-center gap-2"
          >
            {isExporting ? <span className="animate-pulse">Preparing...</span> : <><FileText className="w-4 h-4 text-red-500" /> Export PDF</>}
          </button>
        </div>
      </div>

      {/* Universal Filter Bar */}
      <div className="px-6 py-4 bg-muted/30 border-b border-border shrink-0 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground">
          <Filter className="w-4 h-4" /> Filters:
        </div>
        
        <select className="bg-card border border-border rounded-lg px-3 py-1.5 text-sm font-medium outline-none focus:border-primary">
          <option>📅 Last 7 Days</option>
          <option>📅 Today</option>
          <option>📅 Yesterday</option>
          <option>📅 This Month</option>
          <option>📅 Custom Range...</option>
        </select>

        <select className="bg-card border border-border rounded-lg px-3 py-1.5 text-sm font-medium outline-none focus:border-primary">
          <option>📍 All Outlets (Consolidated)</option>
          <option>📍 Koramangala Branch</option>
          <option>📍 Indiranagar Branch</option>
        </select>

        <select className="bg-card border border-border rounded-lg px-3 py-1.5 text-sm font-medium outline-none focus:border-primary">
          <option>🛵 All Channels</option>
          <option>🛵 Delivery Only</option>
          <option>🛵 Takeaway Only</option>
          <option>🛵 Dine-in Only</option>
        </select>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar Tabs */}
        <div className="w-64 border-r border-border bg-card p-4 flex flex-col gap-1.5 shrink-0 overflow-y-auto">
          {reportTabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === tab.id ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}
            >
              <tab.icon className="w-4 h-4" /> {tab.name}
            </button>
          ))}
        </div>

        {/* Report Content Area */}
        <div className="flex-1 overflow-y-auto bg-background p-6">
          
          {activeTab === 'sales' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-xl font-black">Sales & Revenue Breakdown</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard title="Gross Revenue" value="$42,500.00" trend="+12.5%" />
                <MetricCard title="Net Revenue" value="$38,250.00" trend="+11.2%" />
                <MetricCard title="Tax Collected" value="$4,250.00" trend="+12.5%" />
                <MetricCard title="Avg Order Value (AOV)" value="$28.40" trend="-1.2%" trendDownIsBad />
              </div>

              {/* Data Table */}
              <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden mt-8">
                <div className="p-4 border-b border-border bg-muted/30">
                  <h3 className="font-bold">Daily Sales Log (Flattened for Export)</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-muted text-muted-foreground font-bold">
                      <tr>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Orders</th>
                        <th className="px-4 py-3">Gross Sales</th>
                        <th className="px-4 py-3">Discounts</th>
                        <th className="px-4 py-3">Net Sales</th>
                        <th className="px-4 py-3">Tax</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="px-4 py-3 font-medium">Oct 24, 2026</td>
                        <td className="px-4 py-3">142</td>
                        <td className="px-4 py-3">$4,200.00</td>
                        <td className="px-4 py-3 text-red-500">-$120.00</td>
                        <td className="px-4 py-3 font-bold">$4,080.00</td>
                        <td className="px-4 py-3">$408.00</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium">Oct 23, 2026</td>
                        <td className="px-4 py-3">128</td>
                        <td className="px-4 py-3">$3,850.00</td>
                        <td className="px-4 py-3 text-red-500">-$95.00</td>
                        <td className="px-4 py-3 font-bold">$3,755.00</td>
                        <td className="px-4 py-3">$375.50</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium">Oct 22, 2026</td>
                        <td className="px-4 py-3">156</td>
                        <td className="px-4 py-3">$4,800.00</td>
                        <td className="px-4 py-3 text-red-500">-$210.00</td>
                        <td className="px-4 py-3 font-bold">$4,590.00</td>
                        <td className="px-4 py-3">$459.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'items' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-xl font-black">Item Performance (Menu Intelligence)</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                  <h3 className="font-bold flex items-center gap-2 mb-4"><TrendingUp className="w-5 h-5 text-green-500"/> Top 5 Bestsellers</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center"><span className="font-medium">1. Chicken Biryani</span><span className="font-bold">420 units</span></li>
                    <li className="flex justify-between items-center"><span className="font-medium">2. Butter Naan</span><span className="font-bold">385 units</span></li>
                    <li className="flex justify-between items-center"><span className="font-medium">3. Paneer Tikka</span><span className="font-bold">290 units</span></li>
                  </ul>
                </div>
                <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                  <h3 className="font-bold flex items-center gap-2 mb-4"><AlertCircle className="w-5 h-5 text-red-500"/> The Laggards (Bottom 3)</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex justify-between items-center"><span>1. Diet Coke (Can)</span><span>12 units</span></li>
                    <li className="flex justify-between items-center"><span>2. Veg Sandwich</span><span>8 units</span></li>
                    <li className="flex justify-between items-center"><span>3. Apple Pie</span><span>2 units</span></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Placeholders for other tabs to show structure */}
          {['orders', 'customers', 'inventory', 'profit', 'offers'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground animate-in fade-in duration-300">
              <BarChart3 className="w-16 h-16 mb-4 opacity-20" />
              <h2 className="text-xl font-black text-foreground">Detailed {reportTabs.find(t=>t.id===activeTab)?.name} Report</h2>
              <p className="mt-2 text-center max-w-md">The grid data for this specific dimension will load based on the universal filters applied above.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, trendDownIsBad = false }) {
  const isUp = trend.startsWith('+');
  const isGood = isUp ? !trendDownIsBad : trendDownIsBad;

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">{title}</h3>
      <div className="flex items-end gap-3">
        <span className="text-2xl font-black">{value}</span>
        <span className={`text-xs font-bold mb-1 ${isGood ? 'text-green-500' : 'text-red-500'}`}>{trend}</span>
      </div>
    </div>
  );
}
