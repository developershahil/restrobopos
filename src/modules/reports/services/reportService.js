// src/modules/reports/services/reportService.js
import { ENV } from '@shared/config/env';
// import { apiClient } from '@shared/services/apiClient';

export const reportService = {
  async fetchSalesSummary(filters = {}) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({});
    return apiClient.get('/api/v1/reports/sales', { params: filters });
  },
  async fetchDailyReport(date, outletId) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({});
    return apiClient.get(`/api/v1/reports/daily?date=${date}&outlet=${outletId}`);
  },
  async fetchStockValuation(outletId) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({});
    return apiClient.get(`/api/v1/reports/valuation?outlet=${outletId}`);
  },
  async fetchWastageSummary(outletId) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({});
    return apiClient.get(`/api/v1/reports/wastage?outlet=${outletId}`);
  },
};
