import { create } from 'zustand';

export const MOCK_BRANDS = [
  { id: 'b1', name: 'Burger King', role: 'Super Admin', outlets: 12, status: 'Active',          color: 'bg-orange-500', initials: 'BK' },
  { id: 'b2', name: 'Pizza Hut',   role: 'Owner',       outlets: 5,  status: 'Active',          color: 'bg-red-600',    initials: 'PH' },
  { id: 'b3', name: 'Taco Bell',   role: 'Manager',     outlets: 2,  status: 'Pending Billing', color: 'bg-purple-600', initials: 'TB' },
  { id: 'b4', name: 'KFC',         role: 'Owner',       outlets: 8,  status: 'Active',          color: 'bg-red-700',    initials: 'KF' },
];

export const useBrandStore = create((set) => ({
  brands: MOCK_BRANDS,
  activeBrand: MOCK_BRANDS[0],
  setActiveBrand: (brandId) => set((state) => ({
    activeBrand: state.brands.find(b => b.id === brandId) || state.brands[0]
  }))
}));
