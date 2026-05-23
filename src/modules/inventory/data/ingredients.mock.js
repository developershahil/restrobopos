// src/modules/inventory/data/ingredients.mock.js
// Mock ingredients master — replace with inventoryService.fetchIngredients() when backend is ready.

export const MOCK_INGREDIENTS = [
  { id: 'ING-001', name: 'Premium Flour',       category: 'Dry Goods',    unit: 'kg',     costPerUnit: 1.20, minStock: 50,  reorderQty: 100,  vendorId: 'V-001' },
  { id: 'ING-002', name: 'Mozzarella Cheese',   category: 'Dairy',        unit: 'kg',     costPerUnit: 8.50, minStock: 20,  reorderQty: 40,   vendorId: 'V-002' },
  { id: 'ING-003', name: 'Tomato Paste',        category: 'Canned Goods', unit: 'liters', costPerUnit: 3.40, minStock: 15,  reorderQty: 30,   vendorId: 'V-001' },
  { id: 'ING-004', name: 'Pizza Boxes (Large)', category: 'Packaging',    unit: 'pieces', costPerUnit: 0.45, minStock: 500, reorderQty: 1000, vendorId: 'V-003' },
  { id: 'ING-005', name: 'Chicken',             category: 'Meat',         unit: 'kg',     costPerUnit: 6.00, minStock: 30,  reorderQty: 60,   vendorId: 'V-002' },
];
