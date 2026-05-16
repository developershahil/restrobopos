import { Plus, ShoppingCart, Clock } from 'lucide-react';
import EmptyState from '../../EmptyState';

export default function PurchaseOrdersTab() {
  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-4 border-b border-border bg-muted/10 shrink-0 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-black">Purchase Orders</h2>
          <p className="text-sm text-muted-foreground">Manage stock refill requests and vendor orders.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg shadow-sm hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Create PO
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <EmptyState 
          icon={ShoppingCart} 
          title="No Purchase Orders" 
          description="You haven't created any purchase orders yet. When your stock runs low, generate a PO here to restock your inventory."
          action={
            <button className="flex items-center gap-2 px-6 py-3 bg-background border border-border text-foreground font-bold rounded-xl shadow-sm hover:bg-muted transition-colors mt-4">
              <Clock className="w-4 h-4" /> View PO History
            </button>
          }
        />
      </div>
    </div>
  );
}
