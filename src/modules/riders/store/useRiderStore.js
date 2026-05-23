import { create } from 'zustand';

// Mock data for riders
const initialRiders = [
  {
    id: 'r1',
    outlet_id: 'o1', // Koramangala
    name: 'Ramesh Singh',
    phone: '+91 98765 43210',
    email: 'ramesh@example.com',
    password: 'password123',
    vehicle_type: 'Bike',
    vehicle_number: 'KA 01 AB 1234',
    profile_photo: 'https://ui-avatars.com/api/?name=Ramesh+Singh&background=random',
    address: '123 Main St, Bangalore',
    id_proof: 'AADHAAR-1234-5678',
    status: 'Active',
    online_status: 'Online',
    created_at: new Date().toISOString(),
  },
  {
    id: 'r2',
    outlet_id: 'o1', // Koramangala
    name: 'Suresh Kumar',
    phone: '+91 98765 00000',
    email: 'suresh@example.com',
    password: 'password123',
    vehicle_type: 'Scooter',
    vehicle_number: 'KA 05 CD 5678',
    profile_photo: 'https://ui-avatars.com/api/?name=Suresh+Kumar&background=random',
    address: '456 Cross Rd, Bangalore',
    id_proof: 'AADHAAR-9876-5432',
    status: 'Active',
    online_status: 'Offline',
    created_at: new Date().toISOString(),
  },
  {
    id: 'r3',
    outlet_id: 'o2', // Indiranagar
    name: 'Anil Das',
    phone: '+91 91234 56789',
    email: 'anil@example.com',
    password: 'password123',
    vehicle_type: 'Bike',
    vehicle_number: 'KA 03 EF 9012',
    profile_photo: 'https://ui-avatars.com/api/?name=Anil+Das&background=random',
    address: '789 Link Rd, Bangalore',
    id_proof: 'AADHAAR-1111-2222',
    status: 'Active',
    online_status: 'Online',
    created_at: new Date().toISOString(),
  }
];

// Mock data for rider orders history
const initialRiderOrders = [
  {
    id: 'ro1',
    rider_id: 'r1',
    order_id: '#1001',
    customer_name: 'Rahul Sharma',
    amount: '$25.00',
    payment_type: 'Card',
    assigned_at: new Date(Date.now() - 3600000).toISOString(),
    picked_up_at: new Date(Date.now() - 3000000).toISOString(),
    delivered_at: new Date(Date.now() - 1000000).toISOString(),
    delivery_status: 'Delivered',
  },
  {
    id: 'ro2',
    rider_id: 'r1',
    order_id: '#1005',
    customer_name: 'Sneha Patel',
    amount: '$35.00',
    payment_type: 'Cash',
    assigned_at: new Date(Date.now() - 7200000).toISOString(),
    picked_up_at: new Date(Date.now() - 6600000).toISOString(),
    delivered_at: new Date(Date.now() - 5000000).toISOString(),
    delivery_status: 'Delivered',
  }
];

export const useRiderStore = create((set, get) => ({
  riders: initialRiders,
  riderOrders: initialRiderOrders,

  // Getters
  getRidersByOutlet: (outletId) => {
    if (outletId === 'All') return get().riders;
    return get().riders.filter((r) => r.outlet_id === outletId);
  },
  
  getRiderById: (id) => {
    return get().riders.find((r) => r.id === id);
  },

  getRiderOrders: (riderId) => {
    return get().riderOrders.filter((ro) => ro.rider_id === riderId).sort((a, b) => new Date(b.assigned_at) - new Date(a.assigned_at));
  },

  getActiveDeliveriesCount: (riderId) => {
    return get().riderOrders.filter((ro) => 
      ro.rider_id === riderId && 
      ['Assigned', 'Picked Up / Dispatch', 'Out for Delivery'].includes(ro.delivery_status)
    ).length;
  },

  // Actions
  addRider: (riderData) => set((state) => ({
    riders: [...state.riders, { 
      ...riderData, 
      id: `r${Date.now()}`, 
      created_at: new Date().toISOString() 
    }]
  })),

  updateRider: (id, updates) => set((state) => ({
    riders: state.riders.map((r) => r.id === id ? { ...r, ...updates } : r)
  })),

  deleteRider: (id) => set((state) => ({
    riders: state.riders.filter((r) => r.id !== id)
  })),

  assignOrderToRider: (riderId, orderDetails) => set((state) => ({
    riderOrders: [
      {
        id: `ro${Date.now()}`,
        rider_id: riderId,
        order_id: orderDetails.id,
        customer_name: orderDetails.customer_name || 'Walk-in Customer',
        amount: orderDetails.amount,
        payment_type: orderDetails.payment_type || 'Online',
        assigned_at: new Date().toISOString(),
        picked_up_at: null,
        delivered_at: null,
        delivery_status: 'Assigned',
      },
      ...state.riderOrders
    ]
  })),

  updateDeliveryStatus: (riderOrderId, status) => set((state) => {
    const now = new Date().toISOString();
    return {
      riderOrders: state.riderOrders.map((ro) => {
        if (ro.id === riderOrderId) {
          const updates = { delivery_status: status };
          if (status === 'Picked Up / Dispatch') updates.picked_up_at = now;
          if (status === 'Delivered') updates.delivered_at = now;
          return { ...ro, ...updates };
        }
        return ro;
      })
    };
  })
}));
