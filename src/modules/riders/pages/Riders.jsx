import { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Bike, Plus, Search, Edit2, Eye, Power, PowerOff, Filter, Store } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRiderStore } from '../store/useRiderStore';
import RiderFormModal from '../components/RiderFormModal';
import { useOutletStore } from '@shared/store/useOutletStore';

export default function Riders() {
  const { activeBrand, activeOutlet } = useOutletContext();
  const navigate = useNavigate();
  
  const outlets = useOutletStore((state) => state.outlets);
  const [selectedOutletFilter, setSelectedOutletFilter] = useState(activeOutlet.id);

  const getRidersByOutlet = useRiderStore((state) => state.getRidersByOutlet);
  const riders = getRidersByOutlet(selectedOutletFilter);
  const updateRider = useRiderStore((state) => state.updateRider);
  const getRiderOrders = useRiderStore((state) => state.getRiderOrders);
  const getActiveDeliveriesCount = useRiderStore((state) => state.getActiveDeliveriesCount);

  const [searchQuery, setSearchQuery] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingRider, setEditingRider] = useState(null);

  const filteredRiders = riders.filter((r) => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.phone.includes(searchQuery)
  );

  const toggleStatus = (rider) => {
    const newStatus = rider.status === 'Active' ? 'Inactive' : 'Active';
    updateRider(rider.id, { status: newStatus });
    toast.success(`${rider.name} is now ${newStatus}`);
  };

  const openEditModal = (rider) => {
    setEditingRider(rider);
    setIsFormModalOpen(true);
  };

  const openAddModal = () => {
    setEditingRider(null);
    setIsFormModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-background p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <Bike className="w-6 h-6 text-primary" /> Rider Management
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            Manage delivery personnel for <span className="text-foreground font-bold">{activeBrand.name}</span>
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Rider
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search by name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm font-medium transition-all"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2">
            <Store className="w-4 h-4 text-muted-foreground" />
            <select
              value={selectedOutletFilter}
              onChange={(e) => setSelectedOutletFilter(e.target.value)}
              className="bg-transparent outline-none text-sm font-medium text-foreground min-w-[140px]"
            >
              <option value="All">All Outlets</option>
              {outlets.map((o) => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-foreground font-bold rounded-lg hover:bg-muted transition-colors text-sm">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-black text-xs text-muted-foreground uppercase tracking-wider">Rider</th>
                <th className="px-6 py-4 font-black text-xs text-muted-foreground uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 font-black text-xs text-muted-foreground uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-4 font-black text-xs text-muted-foreground uppercase tracking-wider text-center">Deliveries</th>
                <th className="px-6 py-4 font-black text-xs text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-black text-xs text-muted-foreground uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRiders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-muted-foreground font-medium">
                    No riders found {selectedOutletFilter === 'All' ? 'across all outlets' : `for this outlet`}.
                  </td>
                </tr>
              ) : (
                filteredRiders.map((rider) => {
                  const totalDeliveries = getRiderOrders(rider.id).length;
                  const activeDeliveries = getActiveDeliveriesCount(rider.id);
                  
                  return (
                    <tr key={rider.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={rider.profile_photo} alt={rider.name} className="w-10 h-10 rounded-full border border-border object-cover" />
                          <div>
                            <p className="font-bold text-foreground">{rider.name}</p>
                            <p className="text-xs text-muted-foreground font-medium">ID: {rider.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-foreground">{rider.phone}</p>
                        <p className="text-xs text-muted-foreground">{rider.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-foreground">{rider.vehicle_type}</p>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">{rider.vehicle_number}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-black text-lg">{totalDeliveries}</span>
                          {activeDeliveries > 0 && (
                            <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded uppercase tracking-wider">
                              {activeDeliveries} Active
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2 items-start">
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                            rider.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {rider.status}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                            <span className={`w-2 h-2 rounded-full ${rider.online_status === 'Online' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                            {rider.online_status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => navigate(`/riders/${rider.id}`)}
                            className="p-2 bg-card border border-border rounded-md hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => openEditModal(rider)}
                            className="p-2 bg-card border border-border rounded-md hover:bg-muted text-muted-foreground hover:text-blue-600 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => toggleStatus(rider)}
                            className={`p-2 bg-card border border-border rounded-md hover:bg-muted transition-colors ${rider.status === 'Active' ? 'text-red-500 hover:text-red-600' : 'text-green-600 hover:text-green-700'}`}
                            title={rider.status === 'Active' ? 'Disable' : 'Enable'}
                          >
                            {rider.status === 'Active' ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormModalOpen && (
        <RiderFormModal 
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          rider={editingRider}
          activeBrand={activeBrand}
          activeOutlet={activeOutlet}
        />
      )}
    </div>
  );
}
