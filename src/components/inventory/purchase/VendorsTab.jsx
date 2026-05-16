import { useState } from 'react';
import { Search, Plus, Truck, Edit2, Trash2, Phone, Mail, Clock } from 'lucide-react';
import { useInventoryStore } from '../../../store/useInventoryStore';

export default function VendorsTab() {
  const { vendors, addVendor, deleteVendor } = useInventoryStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    category: 'Dry Goods',
    leadTime: 1,
    paymentTerms: 'Net 30'
  });

  const handleAddVendor = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    addVendor({
      ...formData,
      leadTime: parseInt(formData.leadTime) || 1
    });
    setIsDrawerOpen(false);
    setFormData({ name: '', contact: '', email: '', category: 'Dry Goods', leadTime: 1, paymentTerms: 'Net 30' });
  };

  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-card relative">
      {/* Action Bar */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between gap-4 bg-muted/10 shrink-0">
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search vendors..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-lg border border-border bg-background outline-none focus:border-primary text-sm font-medium w-full"
          />
        </div>
        <button 
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg shadow-sm hover:bg-primary/90 transition-colors text-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Vendor
        </button>
      </div>

      {/* Grid Area */}
      <div className="flex-1 overflow-auto p-6">
        {filteredVendors.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Truck className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-bold">No Vendors Found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map((vendor) => (
              <div key={vendor.id} className="bg-background border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="p-5 border-b border-border bg-muted/10 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {vendor.category}
                    </span>
                    <h3 className="text-lg font-black text-foreground mt-2">{vendor.name}</h3>
                    <p className="text-xs text-muted-foreground font-medium">{vendor.id}</p>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteVendor(vendor.id)} className="p-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{vendor.contact || '—'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{vendor.email || '—'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Lead Time: {vendor.leadTime} Day(s)</span>
                  </div>
                  <div className="pt-3 mt-3 border-t border-border flex justify-between items-center text-xs font-bold text-muted-foreground">
                    <span>Terms: {vendor.paymentTerms}</span>
                    <span className={`px-2 py-1 rounded ${vendor.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {vendor.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Vendor Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => setIsDrawerOpen(false)} />
          <div className="relative w-full max-w-md bg-card h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-border bg-muted/30">
              <h3 className="text-xl font-black text-foreground">Add New Vendor</h3>
              <p className="text-sm text-muted-foreground mt-1">Register a new supplier to your vendor network.</p>
            </div>
            
            <form onSubmit={handleAddVendor} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground">Vendor Name</label>
                <input 
                  type="text" required
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., AgroFresh Supplies"
                  className="w-full p-3 rounded-lg border border-border bg-background outline-none focus:border-primary font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground">Primary Category</label>
                <select 
                  value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full p-3 rounded-lg border border-border bg-background outline-none focus:border-primary font-medium"
                >
                  <option value="Dry Goods">Dry Goods</option>
                  <option value="Dairy & Meat">Dairy & Meat</option>
                  <option value="Produce">Produce</option>
                  <option value="Packaging">Packaging</option>
                  <option value="Beverages">Beverages</option>
                  <option value="General Supplier">General Supplier</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Contact Number</label>
                  <input 
                    type="text" 
                    value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})}
                    placeholder="+91..."
                    className="w-full p-3 rounded-lg border border-border bg-background outline-none focus:border-primary font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Email</label>
                  <input 
                    type="email" 
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="contact@vendor.com"
                    className="w-full p-3 rounded-lg border border-border bg-background outline-none focus:border-primary font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Lead Time (Days)</label>
                  <input 
                    type="number" min="1" required
                    value={formData.leadTime} onChange={e => setFormData({...formData, leadTime: e.target.value})}
                    placeholder="1"
                    className="w-full p-3 rounded-lg border border-border bg-background outline-none focus:border-primary font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground">Payment Terms</label>
                  <select 
                    value={formData.paymentTerms} onChange={e => setFormData({...formData, paymentTerms: e.target.value})}
                    className="w-full p-3 rounded-lg border border-border bg-background outline-none focus:border-primary font-medium"
                  >
                    <option value="Net 30">Net 30</option>
                    <option value="Net 15">Net 15</option>
                    <option value="COD">Cash on Delivery (COD)</option>
                    <option value="Advance">Advance Payment</option>
                  </select>
                </div>
              </div>
            </form>

            <div className="p-6 border-t border-border bg-muted/10 grid grid-cols-2 gap-4">
              <button type="button" onClick={() => setIsDrawerOpen(false)} className="px-4 py-3 rounded-lg font-bold border border-border bg-background text-foreground hover:bg-muted transition-colors">Cancel</button>
              <button onClick={handleAddVendor} className="px-4 py-3 rounded-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">Save Vendor</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
