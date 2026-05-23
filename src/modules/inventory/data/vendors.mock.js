// src/modules/inventory/data/vendors.mock.js
// Mock vendors — replace with inventoryService.fetchVendors() when backend is ready.

export const MOCK_VENDORS = [
  { id: 'V-001', name: 'AgroFresh Supplies',  contact: '+91 98765 00001', email: 'agro@fresh.com',     category: 'Dry Goods & Canned', leadTime: 2, paymentTerms: 'Net 30', active: true },
  { id: 'V-002', name: 'Prime Dairy & Meats', contact: '+91 98765 00002', email: 'prime@dairy.com',    category: 'Dairy & Meat',       leadTime: 1, paymentTerms: 'COD',    active: true },
  { id: 'V-003', name: 'PackRight Solutions', contact: '+91 98765 00003', email: 'info@packright.com', category: 'Packaging',          leadTime: 3, paymentTerms: 'Net 15', active: true },
];
