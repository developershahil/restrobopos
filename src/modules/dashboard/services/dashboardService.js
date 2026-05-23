// src/modules/dashboard/services/dashboardService.js
import { ENV } from '@shared/config/env';
// import { apiClient } from '@shared/services/apiClient';

export const dashboardService = {
  async fetchKPIs(filters = {}) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({});
    return apiClient.get('/api/v1/analytics/kpis', { params: filters });
  },
  async fetchSummary(filters = {}) {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({});
    return apiClient.get('/api/v1/analytics/summary', { params: filters });
  },
};
