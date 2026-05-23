// src/shared/config/env.js
// Centralised environment variable access.
// Toggle between mock and real API with VITE_ENABLE_MOCK_API in .env files.

export const ENV = {
  API_BASE_URL:    import.meta.env.VITE_API_BASE_URL    || '',
  API_VERSION:     import.meta.env.VITE_API_VERSION     || 'v1',
  // True by default (no .env needed for dev). Set VITE_ENABLE_MOCK_API=false in .env.production.
  ENABLE_MOCK_API: import.meta.env.VITE_ENABLE_MOCK_API !== 'false',
  APP_ENV:         import.meta.env.VITE_APP_ENV         || 'development',
};
