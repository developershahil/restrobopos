// src/modules/stores/services/storeService.js
import { ENV } from '@shared/config/env';
import { MOCK_BRANDS } from '../data/brands.mock';
import { MOCK_OUTLETS } from '@shared/mock/outlets.mock';
// import { apiClient } from '@shared/services/apiClient';

export const storeService = {
  async fetchBrands() {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve([...MOCK_BRANDS]);
    return apiClient.get('/api/v1/brands');
  },
  async fetchOutlets() {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({ ...MOCK_OUTLETS });
    return apiClient.get('/api/v1/outlets');
  },
  async updateBrand(id, data) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({ id, ...data });
    return apiClient.patch(`/api/v1/brands/${id}`, data);
  },
};
