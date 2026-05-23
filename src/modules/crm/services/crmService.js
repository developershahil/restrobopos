// src/modules/crm/services/crmService.js
import { ENV } from '@shared/config/env';
// import { apiClient } from '@shared/services/apiClient';

export const crmService = {
  async fetchCustomers(filters = {}) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({ data: [], total: 0 });
    return apiClient.get('/api/v1/customers', { params: filters });
  },
  async fetchCustomer(id) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve(null);
    return apiClient.get(`/api/v1/customers/${id}`);
  },
  async updateCustomer(id, data) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({ id, ...data });
    return apiClient.patch(`/api/v1/customers/${id}`, data);
  },
  async fetchSegments() {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve([]);
    return apiClient.get('/api/v1/customer-segments');
  },
};
