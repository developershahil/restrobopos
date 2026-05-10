import { useState } from 'react';
import LiveOrdersBoard from '../components/orders/LiveOrdersBoard';
import PastOrdersTable from '../components/orders/PastOrdersTable';
import FailedOrdersTable from '../components/orders/FailedOrdersTable';
import { Clock, History, AlertCircle } from 'lucide-react';

export default function Orders() {
  const [activeTab, setActiveTab] = useState('live');

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <div className="flex items-center p-2 border-b border-border bg-muted/30 shrink-0 gap-4 justify-center overflow-x-auto">
        <div className="flex bg-card p-1 rounded-lg shadow-sm border border-border min-w-max">
          <button
            onClick={() => setActiveTab('live')}
            className={`flex items-center gap-2 px-6 py-1.5 rounded-md font-bold text-sm transition-all ${
              activeTab === 'live' 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Clock className="w-4 h-4" /> Live KDS
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex items-center gap-2 px-6 py-1.5 rounded-md font-bold text-sm transition-all ${
              activeTab === 'past' 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <History className="w-4 h-4" /> Past Orders
          </button>
          <button
            onClick={() => setActiveTab('failed')}
            className={`flex items-center gap-2 px-6 py-1.5 rounded-md font-bold text-sm transition-all ${
              activeTab === 'failed' 
                ? 'bg-red-600 text-white shadow-sm' 
                : 'text-muted-foreground hover:text-red-600'
            }`}
          >
            <AlertCircle className="w-4 h-4" /> Failed Orders
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'live' && <LiveOrdersBoard />}
        {activeTab === 'past' && <PastOrdersTable />}
        {activeTab === 'failed' && <FailedOrdersTable />}
      </div>
    </div>
  );
}
