// src/modules/inventory/data/transactions.mock.js
// Mock stock transactions — replace with inventoryService.fetchTransactions() when backend is ready.

const now = Date.now();
const daysAgo = (n) => new Date(now - n * 86400000).toISOString();

export const MOCK_TRANSACTIONS = [
  { id: 'TXN-001', date: daysAgo(5), type: 'stock_in',  reason: 'purchase',    ingredientId: 'ING-001', outletId: 'outlet-1', qty: 100, note: 'Weekly purchase',   poRef: 'PO-001', balance: 145, costPerUnit: 1.20 },
  { id: 'TXN-002', date: daysAgo(5), type: 'stock_out', reason: 'consumption', ingredientId: 'ING-001', outletId: 'outlet-1', qty: 55,  note: 'Daily consumption', poRef: null,     balance: 90,  costPerUnit: 1.20 },
  { id: 'TXN-003', date: daysAgo(4), type: 'stock_out', reason: 'wastage',     ingredientId: 'ING-001', outletId: 'outlet-1', qty: 45,  note: 'Expired stock',     poRef: null,     balance: 45,  costPerUnit: 1.20 },
  { id: 'TXN-004', date: daysAgo(3), type: 'stock_in',  reason: 'purchase',    ingredientId: 'ING-002', outletId: 'outlet-1', qty: 30,  note: 'Emergency restock', poRef: 'PO-002', balance: 42,  costPerUnit: 8.50 },
  { id: 'TXN-005', date: daysAgo(3), type: 'stock_out', reason: 'consumption', ingredientId: 'ING-002', outletId: 'outlet-1', qty: 18,  note: 'Daily consumption', poRef: null,     balance: 24,  costPerUnit: 8.50 },
  { id: 'TXN-006', date: daysAgo(2), type: 'stock_out', reason: 'damage',      ingredientId: 'ING-002', outletId: 'outlet-1', qty: 12,  note: 'Packaging damaged', poRef: null,     balance: 12,  costPerUnit: 8.50 },
  { id: 'TXN-007', date: daysAgo(1), type: 'stock_in',  reason: 'purchase',    ingredientId: 'ING-005', outletId: 'outlet-2', qty: 40,  note: 'Vendor delivery',   poRef: 'PO-003', balance: 65,  costPerUnit: 6.00 },
  { id: 'TXN-008', date: daysAgo(1), type: 'stock_out', reason: 'consumption', ingredientId: 'ING-005', outletId: 'outlet-2', qty: 40,  note: 'Daily consumption', poRef: null,     balance: 25,  costPerUnit: 6.00 },
  { id: 'TXN-009', date: daysAgo(0), type: 'stock_in',  reason: 'purchase',    ingredientId: 'ING-003', outletId: 'outlet-3', qty: 20,  note: 'New day stock',     poRef: 'PO-004', balance: 32,  costPerUnit: 3.40 },
  { id: 'TXN-010', date: daysAgo(0), type: 'stock_out', reason: 'wastage',     ingredientId: 'ING-003', outletId: 'outlet-3', qty: 8,   note: 'Spoiled overnight', poRef: null,     balance: 24,  costPerUnit: 3.40 },
];
