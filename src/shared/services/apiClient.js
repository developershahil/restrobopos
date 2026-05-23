import axios from 'axios';

// Configure a baseline Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // Hardcoded for development: "La Milano Pizzeria" Tenant ID
    'X-Restaurant-ID': '019e53a4-8839-73d1-aef4-4996967d62d5'
  }
});

// Response interceptor to format responses universally
apiClient.interceptors.response.use(
  (response) => {
    // Laravel API Resources return data in 'data' wrapper
    return response.data.data !== undefined ? response.data.data : response.data;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default apiClient;
