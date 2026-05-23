// src/modules/auth/services/authService.js
// API bridge for authentication. Currently uses localStorage/sessionStorage.
// When backend is ready: replace with real API calls.

import { ENV } from '@shared/config/env';
import { SESSION_KEY } from '@shared/utils/auth';
// import { apiClient } from '@shared/services/apiClient';

export const authService = {
  async login(credentials) {
    if (ENV.ENABLE_MOCK_API) {
      // Mock: any credentials work
      sessionStorage.setItem(SESSION_KEY, 'mock-token-123');
      localStorage.setItem('isLoggedIn', 'true');
      return Promise.resolve({ token: 'mock-token-123', user: { name: 'John Doe', email: 'john@restro.com' } });
    }
    const res = await apiClient.post('/api/v1/auth/login', credentials);
    sessionStorage.setItem(SESSION_KEY, res.token);
    localStorage.setItem('isLoggedIn', 'true');
    return res;
  },

  async logout() {
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('isLoggedIn');
    if (!ENV.ENABLE_MOCK_API) {
      await apiClient.post('/api/v1/auth/logout').catch(() => {});
    }
  },

  async refreshToken() {
    if (ENV.ENABLE_MOCK_API) return Promise.resolve({ token: 'mock-token-refreshed' });
    return apiClient.post('/api/v1/auth/refresh');
  },

  isAuthenticated() {
    return !!sessionStorage.getItem(SESSION_KEY) && localStorage.getItem('isLoggedIn') === 'true';
  },
};
