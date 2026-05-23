// src/modules/stores/data/brands.mock.js
// Mock brands/restaurants — replace with storeService.fetchBrands() when backend is ready.
// Extracted from DashboardLayout.jsx to isolate domain data from layout logic.

export const MOCK_BRANDS = [
  { id: 'b1', name: 'Burger King', role: 'Super Admin', outlets: 12, status: 'Active',          color: 'bg-orange-500', initials: 'BK' },
  { id: 'b2', name: 'Pizza Hut',   role: 'Owner',       outlets: 5,  status: 'Active',          color: 'bg-red-600',    initials: 'PH' },
  { id: 'b3', name: 'Taco Bell',   role: 'Manager',     outlets: 2,  status: 'Pending Billing', color: 'bg-purple-600', initials: 'TB' },
  { id: 'b4', name: 'KFC',         role: 'Owner',       outlets: 8,  status: 'Active',          color: 'bg-red-700',    initials: 'KF' },
];
