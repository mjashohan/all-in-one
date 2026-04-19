import axios from 'axios';
import storage from '../utils/storage';

// In dev, VITE_API_BASE_URL defaults to '/api' and Vite proxies to http://localhost:8080.
// In prod, set VITE_API_BASE_URL to your absolute backend URL at build time.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request.
apiClient.interceptors.request.use((config) => {
  const token = storage.getItemSync('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, wipe stored credentials so UI falls back to logged-out state.
// Route redirection is left to components (don't hard-navigate from here — it couples layers).
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.removeItem('token');
      storage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
