// src/modules/offers/services/offerService.js
import { ENV } from '@shared/config/env';
// import { apiClient } from '@shared/services/apiClient';

export const offerService = {
  async fetchOffers(filters = {}) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({ data: [], total: 0 });
    return apiClient.get('/api/v1/offers', { params: filters });
  },
  async createOffer(data) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({ id: `offer_${Date.now()}`, ...data });
    return apiClient.post('/api/v1/offers', data);
  },
  async updateOffer(id, data) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({ id, ...data });
    return apiClient.patch(`/api/v1/offers/${id}`, data);
  },
  async deleteOffer(id) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({ success: true });
    return apiClient.delete(`/api/v1/offers/${id}`);
  },
};
