import { create } from 'zustand';

// Mock Data — persists across navigation
const initialOrders = [
  { id: '#1044', type: 'Delivery', priority: 'High', status: 'Ready', items: 3, timeElapsed: 22, timeExpected: 20, amount: '$35', mods: [], offer: { code: 'RAIN50', discount: 5.00 } },
  { id: '#1042', type: 'Delivery', priority: 'High', status: 'New', items: 5, timeElapsed: 2, timeExpected: 15, amount: '$45', mods: ['+ Extra spicy', '- No onions'] },
  { id: '#1043', type: 'Dine-in', priority: 'Medium', status: 'New', items: 2, timeElapsed: 1, timeExpected: 10, amount: '$18', mods: [] },
  { id: '#1041', type: 'Take Away', priority: 'Low', status: 'Preparing', items: 3, timeElapsed: 12, timeExpected: 10, amount: '$24', mods: [], delayed: true },
  { id: '#1039', type: 'Delivery', priority: 'High', status: 'Preparing', items: 8, timeElapsed: 18, timeExpected: 20, amount: '$85', mods: [], offer: { code: 'WELCOME10', discount: 8.50 } },
  { id: '#1038', type: 'Dine-in', priority: 'Medium', status: 'Ready', items: 4, timeElapsed: 25, timeExpected: 20, amount: '$52', mods: [] },
  { id: '#1037', type: 'Take Away', priority: 'Medium', status: 'New', items: 1, timeElapsed: 1, timeExpected: 10, amount: '$12', mods: [] },
  { id: '#1036', type: 'Delivery', priority: 'High', status: 'Preparing', items: 6, timeElapsed: 15, timeExpected: 20, amount: '$60', mods: [] },
  { id: '#1035', type: 'Dine-in', priority: 'Low', status: 'New', items: 2, timeElapsed: 0, timeExpected: 15, amount: '$25', mods: [] },
  { id: '#1034', type: 'Delivery', priority: 'High', status: 'Ready', items: 4, timeElapsed: 19, timeExpected: 20, amount: '$42', mods: [] },
];

export const useOrderStore = create((set, get) => ({
  orders: initialOrders,

  // Move an order to a new status
  moveOrder: (id, newStatus) => set((state) => ({
    orders: state.orders.map(o => o.id === id ? { ...o, status: newStatus } : o)
  })),

  // Increment all order timers (called by interval from component)
  tickTimers: () => set((state) => ({
    orders: state.orders.map(o => ({
      ...o,
      timeElapsed: o.timeElapsed + 1,
      delayed: (o.timeElapsed + 1) > o.timeExpected
    }))
  })),

  // Get filtered orders for live board
  getFilteredOrders: (statusFilter, focusMode) => {
    return get().orders.filter(o => {
      if (statusFilter !== 'All' && o.status !== statusFilter) return false;
      if (focusMode && o.status !== 'New' && !o.delayed) return false;
      if (['Delivered'].includes(o.status)) return false;
      return true;
    });
  },

  // Get order by ID
  getOrderById: (id) => get().orders.find(o => o.id === id),
}));
