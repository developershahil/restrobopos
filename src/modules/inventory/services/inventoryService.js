// src/modules/inventory/services/inventoryService.js
// API bridge for inventory module. Currently returns mock data.
// When backend is ready: set VITE_ENABLE_MOCK_API=false and uncomment apiClient lines.

import { ENV } from '@shared/config/env';
import { MOCK_INGREDIENTS }      from '../data/ingredients.mock';
import { MOCK_VENDORS }          from '../data/vendors.mock';
import { MOCK_STOCK_LEVELS }     from '../data/stockLevels.mock';
import { MOCK_TRANSACTIONS }     from '../data/transactions.mock';
import { MOCK_PURCHASE_ORDERS }  from '../data/purchaseOrders.mock';
// import { apiClient } from '@shared/services/apiClient'; // uncomment when backend ready

export const inventoryService = {

  // ── Ingredients ──────────────────────────────────────────────────────────
  async fetchIngredients() {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve([...MOCK_INGREDIENTS]);
    return apiClient.get('/api/v1/ingredients');
  },
  async createIngredient(data) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({ id: `ING-${Date.now()}`, ...data });
    return apiClient.post('/api/v1/ingredients', data);
  },
  async updateIngredient(id, data) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({ id, ...data });
    return apiClient.patch(`/api/v1/ingredients/${id}`, data);
  },

  // ── Vendors ──────────────────────────────────────────────────────────────
  async fetchVendors() {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve([...MOCK_VENDORS]);
    return apiClient.get('/api/v1/vendors');
  },
  async createVendor(data) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({ id: `V-${Date.now()}`, active: true, ...data });
    return apiClient.post('/api/v1/vendors', data);
  },
  async updateVendor(id, data) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({ id, ...data });
    return apiClient.patch(`/api/v1/vendors/${id}`, data);
  },
  async deleteVendor(id) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({ success: true });
    return apiClient.delete(`/api/v1/vendors/${id}`);
  },

  // ── Stock ────────────────────────────────────────────────────────────────
  async fetchStockLevels(outletId) {
    if (ENV.ENABLE_MOCK_API) {
      if (outletId === 'all') {
        const combined = {};
        Object.values(MOCK_STOCK_LEVELS).forEach((outlet) => {
          Object.entries(outlet).forEach(([id, qty]) => {
            combined[id] = (combined[id] || 0) + qty;
          });
        });
        return Promise.resolve(combined);
      }
      return Promise.resolve({ ...(MOCK_STOCK_LEVELS[outletId] || {}) });
    }
    return apiClient.get(`/api/v1/stock?outlet=${outletId}`);
  },
  async addStockIn(payload) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({ success: true });
    return apiClient.post('/api/v1/stock/in', payload);
  },
  async addStockOut(payload) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({ success: true });
    return apiClient.post('/api/v1/stock/out', payload);
  },

  // ── Ledger / Transactions ─────────────────────────────────────────────────
  // When backend is ready these 3 report functions move to reportService
  async fetchTransactions(filters = {}) {
    const { page = 1, pageSize = 20, outletId, ingredientId, type } = filters;
    if (ENV.ENABLE_MOCK_API) {
      let results = [...MOCK_TRANSACTIONS];
      if (outletId)     results = results.filter(t => t.outletId === outletId);
      if (ingredientId) results = results.filter(t => t.ingredientId === ingredientId);
      if (type)         results = results.filter(t => t.type === type);
      return Promise.resolve({
        data:     results.slice((page - 1) * pageSize, page * pageSize),
        total:    results.length,
        page,
        pageSize,
      });
    }
    return apiClient.get('/api/v1/ledger', { params: filters });
  },

  // ── Purchase Orders ───────────────────────────────────────────────────────
  async fetchPurchaseOrders(filters = {}) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve([...MOCK_PURCHASE_ORDERS]);
    return apiClient.get('/api/v1/purchase-orders', { params: filters });
  },
  async createPurchaseOrder(data) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({ id: `PO-${Date.now()}`, ...data });
    return apiClient.post('/api/v1/purchase-orders', data);
  },
  async updatePOStatus(id, status) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({ id, status });
    return apiClient.patch(`/api/v1/purchase-orders/${id}`, { status });
  },
};
