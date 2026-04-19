import apiClient from './client';

// All user endpoints require ADMIN role on the backend.
export const listUsers = () => apiClient.get('/users').then((r) => r.data);
export const getUser = (id) => apiClient.get(`/users/${id}`).then((r) => r.data);
export const getUserByUsername = (username) =>
  apiClient.get(`/users/by-username/${encodeURIComponent(username)}`).then((r) => r.data);
export const deleteUser = (id) => apiClient.delete(`/users/${id}`);
