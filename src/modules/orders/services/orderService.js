// src/modules/orders/services/orderService.js
// API bridge for orders module. Stubs ready for backend integration.

import { ENV } from '@shared/config/env';
// import { apiClient } from '@shared/services/apiClient';

export const orderService = {
  async fetchLiveOrders() {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve([]);
    return apiClient.get('/api/v1/orders?status=live');
  },
  async fetchPastOrders(filters = {}) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({ data: [], total: 0 });
    return apiClient.get('/api/v1/orders/past', { params: filters });
  },
  async fetchFailedOrders(filters = {}) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({ data: [], total: 0 });
    return apiClient.get('/api/v1/orders/failed', { params: filters });
  },
  async updateOrderStatus(id, status) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({ id, status });
    return apiClient.patch(`/api/v1/orders/${id}/status`, { status });
  },
};
