// src/modules/menu/services/menuService.js
// API bridge for menu module. Currently returns mock data.
// When backend is ready: set VITE_ENABLE_MOCK_API=false and uncomment apiClient lines.

import { ENV } from '@shared/config/env';
import { MOCK_MENUS }      from '../data/menus.mock';
import { MOCK_CATEGORIES } from '../data/categories.mock';
import { MOCK_ITEMS }      from '../data/items.mock';
import { MOCK_TAXES }      from '../data/taxes.mock';
import { MOCK_OFFERS }     from '../data/offers.mock';
// import { apiClient } from '@shared/services/apiClient'; // uncomment when backend ready

export const menuService = {

  // ── Menus ────────────────────────────────────────────────────────────────
  async fetchMenus() {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve([...MOCK_MENUS]);
    return apiClient.get('/api/v1/menus');
  },
  async createMenu(data) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({ id: `m_${Date.now()}`, ...data });
    return apiClient.post('/api/v1/menus', data);
  },
  async updateMenu(id, data) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({ id, ...data });
    return apiClient.patch(`/api/v1/menus/${id}`, data);
  },
  async deleteMenu(id) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({ success: true });
    return apiClient.delete(`/api/v1/menus/${id}`);
  },

  // ── Categories ───────────────────────────────────────────────────────────
  async fetchCategories() {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve([...MOCK_CATEGORIES]);
    return apiClient.get('/api/v1/categories');
  },
  async createCategory(data) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({ id: `c_${Date.now()}`, ...data });
    return apiClient.post('/api/v1/categories', data);
  },
  async updateCategory(id, data) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({ id, ...data });
    return apiClient.patch(`/api/v1/categories/${id}`, data);
  },
  async deleteCategory(id) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({ success: true });
    return apiClient.delete(`/api/v1/categories/${id}`);
  },

  // ── Items ────────────────────────────────────────────────────────────────
  async fetchItems(filters = {}) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve([...MOCK_ITEMS]);
    return apiClient.get('/api/v1/items', { params: filters });
  },
  async createItem(data) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({ id: `i_${Date.now()}`, ...data });
    return apiClient.post('/api/v1/items', data);
  },
  async updateItem(id, data) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({ id, ...data });
    return apiClient.patch(`/api/v1/items/${id}`, data);
  },
  async deleteItem(id) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({ success: true });
    return apiClient.delete(`/api/v1/items/${id}`);
  },

  // ── Taxes ────────────────────────────────────────────────────────────────
  async fetchTaxes() {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve([...MOCK_TAXES]);
    return apiClient.get('/api/v1/taxes');
  },
  async createTax(data) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({ id: `t_${Date.now()}`, ...data });
    return apiClient.post('/api/v1/taxes', data);
  },
  async updateTax(id, data) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({ id, ...data });
    return apiClient.patch(`/api/v1/taxes/${id}`, data);
  },
  async deleteTax(id) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({ success: true });
    return apiClient.delete(`/api/v1/taxes/${id}`);
  },

  // ── Offers ───────────────────────────────────────────────────────────────
  async fetchOffers() {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve([...MOCK_OFFERS]);
    return apiClient.get('/api/v1/menu-offers');
  },
  async createOffer(data) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({ id: `o_${Date.now()}`, ...data });
    return apiClient.post('/api/v1/menu-offers', data);
  },
  async updateOffer(id, data) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({ id, ...data });
    return apiClient.patch(`/api/v1/menu-offers/${id}`, data);
  },
  async deleteOffer(id) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({ success: true });
    return apiClient.delete(`/api/v1/menu-offers/${id}`);
  },
};
