import apiClient from './client';

export const login = (credentials) =>
  apiClient.post('/auth/login', credentials).then((r) => r.data);

export const register = (payload) =>
  apiClient.post('/auth/register', payload).then((r) => r.data);
