// src/modules/menu/data/taxes.mock.js
// Mock taxes — replace with menuService.fetchTaxes() when backend is ready.
// categoryIds: [] means tax is global (applies to all categories).

export const MOCK_TAXES = [
  { id: 't1', name: 'GST 5%',  cgst: '2.5', sgst: '2.5', categoryIds: [] },
  { id: 't2', name: 'GST 12%', cgst: '6',   sgst: '6',   categoryIds: ['c2'] },
  { id: 't3', name: 'GST 18%', cgst: '9',   sgst: '9',   categoryIds: [] },
];
