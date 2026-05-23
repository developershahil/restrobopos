import { TrendingUp, TrendingDown, EyeOff, ArrowRight } from 'lucide-react';

const mockInsights = {
  top: [
    { name: 'Butter Chicken', orders: 1240, revenue: '$22,320' },
    { name: 'Garlic Bread', orders: 980, revenue: '$7,840' },
  ],
  low: [
    { name: 'Spring Rolls', orders: 12, revenue: '$120' },
    { name: 'Mushroom Soup', orders: 5, revenue: '$40' },
  ],
  hidden: [
    { name: 'Paneer Tikka (Spicy)', searches: 450, status: 'Hidden/Disabled' }
  ]
};

export default function InsightsTab() {
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative">
      <div className="p-6 border-b border-border bg-card shrink-0">
        <h2 className="text-xl font-black text-foreground">Menu Insights</h2>
        <p className="text-sm text-muted-foreground font-medium mt-1">Data-driven recommendations to optimize your menu performance.</p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Top Performers */}
          <div className="bg-card border border-border rounded-xl shadow-sm p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-4 text-green-600">
              <div className="p-2 bg-green-50 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
              <h3 className="font-black text-lg text-foreground">Top Performers</h3>
            </div>
            <div className="flex-1 space-y-4">
              {mockInsights.top.map((item, i) => (
                <div key={i} className="flex justify-between items-center pb-4 border-b border-border last:border-0 last:pb-0">
                  <div>
                    <p className="font-bold text-foreground text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.orders} Orders</p>
                  </div>
                  <span className="font-black text-green-600 text-sm">{item.revenue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Low Performers */}
          <div className="bg-card border border-border rounded-xl shadow-sm p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-4 text-red-600">
              <div className="p-2 bg-red-50 rounded-lg"><TrendingDown className="w-5 h-5" /></div>
              <h3 className="font-black text-lg text-foreground">Underperforming</h3>
            </div>
            <div className="flex-1 space-y-4">
              {mockInsights.low.map((item, i) => (
                <div key={i} className="flex justify-between items-center pb-4 border-b border-border last:border-0 last:pb-0">
                  <div>
                    <p className="font-bold text-foreground text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.orders} Orders</p>
                  </div>
                  <span className="font-black text-red-600 text-sm">{item.revenue}</span>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full text-center text-xs font-bold text-primary hover:underline">Review & Optimize</button>
          </div>

          {/* Missed Opportunities */}
          <div className="bg-card border border-border rounded-xl shadow-sm p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-4 text-orange-600">
              <div className="p-2 bg-orange-50 rounded-lg"><EyeOff className="w-5 h-5" /></div>
              <h3 className="font-black text-lg text-foreground">Missed Demand</h3>
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-sm text-muted-foreground mb-4">Items customers are searching for but are currently unavailable or hidden.</p>
              {mockInsights.hidden.map((item, i) => (
                <div key={i} className="flex justify-between items-center pb-4 border-b border-border last:border-0 last:pb-0 bg-muted/30 p-3 rounded-lg">
                  <div>
                    <p className="font-bold text-foreground text-sm">{item.name}</p>
                    <p className="text-xs text-orange-600 font-bold">{item.searches} Searches</p>
                  </div>
                  <button className="text-primary hover:text-primary/80"><ArrowRight className="w-5 h-5" /></button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
