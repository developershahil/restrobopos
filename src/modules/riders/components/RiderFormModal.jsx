import { useState, useEffect } from 'react';
import { X, Save, User, MapPin, Bike, FileText, Store } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRiderStore } from '../store/useRiderStore';
import { useOutletStore } from '@shared/store/useOutletStore';

export default function RiderFormModal({ isOpen, onClose, rider, activeBrand, activeOutlet }) {
  const addRider = useRiderStore((state) => state.addRider);
  const updateRider = useRiderStore((state) => state.updateRider);
  const outlets = useOutletStore((state) => state.outlets);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    vehicle_type: 'Bike',
    vehicle_number: '',
    address: '',
    id_proof: '',
    profile_photo: '',
    outlet_id: activeOutlet.id,
  });

  useEffect(() => {
    if (rider) {
      setFormData({
        name: rider.name,
        phone: rider.phone,
        email: rider.email,
        password: rider.password,
        vehicle_type: rider.vehicle_type,
        vehicle_number: rider.vehicle_number,
        address: rider.address,
        id_proof: rider.id_proof,
        profile_photo: rider.profile_photo,
        outlet_id: rider.outlet_id,
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        password: '',
        vehicle_type: 'Bike',
        vehicle_number: '',
        address: '',
        id_proof: '',
        profile_photo: '',
        outlet_id: activeOutlet.id,
      });
    }
  }, [rider]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Auto-generate profile photo if empty
    const profile_photo = formData.profile_photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`;
    
    const dataToSave = {
      ...formData,
      profile_photo,
      status: rider ? rider.status : 'Active',
      online_status: rider ? rider.online_status : 'Offline'
    };

    if (rider) {
      updateRider(rider.id, dataToSave);
      toast.success(`${formData.name} updated successfully`);
    } else {
      addRider(dataToSave);
      toast.success(`${formData.name} added as rider`);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border bg-muted/20 shrink-0">
          <div>
            <h2 className="text-xl font-black">{rider ? 'Edit Rider' : 'Add New Rider'}</h2>
            <p className="text-sm font-medium text-muted-foreground mt-1">
              For outlet: <span className="font-bold text-foreground">{activeBrand.name}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <form id="rider-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Personal Details */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                <Store className="w-4 h-4" /> Assignment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground">Assigned Outlet *</label>
                  <select name="outlet_id" value={formData.outlet_id} onChange={handleChange} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-medium focus:border-primary outline-none transition-colors">
                    {outlets.map(o => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                <User className="w-4 h-4" /> Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground">Full Name *</label>
                  <input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-medium focus:border-primary outline-none transition-colors" placeholder="e.g. Rahul Sharma" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground">Mobile Number *</label>
                  <input required name="phone" value={formData.phone} onChange={handleChange} type="tel" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-medium focus:border-primary outline-none transition-colors" placeholder="+91 98765 43210" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground">Email</label>
                  <input name="email" value={formData.email} onChange={handleChange} type="email" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-medium focus:border-primary outline-none transition-colors" placeholder="rahul@example.com" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground">Password / PIN *</label>
                  <input required name="password" value={formData.password} onChange={handleChange} type="password" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-medium focus:border-primary outline-none transition-colors" placeholder="••••••••" />
                </div>
              </div>
            </div>

            {/* Vehicle & ID Details */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                <Bike className="w-4 h-4" /> Vehicle & ID Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground">Vehicle Type *</label>
                  <select name="vehicle_type" value={formData.vehicle_type} onChange={handleChange} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-medium focus:border-primary outline-none transition-colors">
                    <option value="Bike">Bike</option>
                    <option value="Scooter">Scooter</option>
                    <option value="Cycle">Cycle</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground">Vehicle Number *</label>
                  <input required name="vehicle_number" value={formData.vehicle_number} onChange={handleChange} type="text" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-medium focus:border-primary outline-none transition-colors uppercase" placeholder="KA 01 AB 1234" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground flex items-center gap-1"><FileText className="w-3.5 h-3.5"/> ID Proof (Aadhaar / DL) *</label>
                  <input required name="id_proof" value={formData.id_proof} onChange={handleChange} type="text" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-medium focus:border-primary outline-none transition-colors uppercase" placeholder="Enter ID number" />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Address
              </h3>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground">Current Address *</label>
                <textarea required name="address" value={formData.address} onChange={handleChange} rows={3} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-medium focus:border-primary outline-none transition-colors resize-none" placeholder="Enter full address..."></textarea>
              </div>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-card shrink-0 flex justify-end gap-3">
          <button onClick={onClose} type="button" className="px-6 py-2.5 rounded-lg border border-border font-bold text-sm hover:bg-muted transition-colors">
            Cancel
          </button>
          <button type="submit" form="rider-form" className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm">
            <Save className="w-4 h-4" /> {rider ? 'Save Changes' : 'Add Rider'}
          </button>
        </div>

      </div>
    </div>
  );
}
