import apiClient from './client';

export const sendMessage = (payload) =>
  apiClient.post('/messages', payload).then((r) => r.data);

// Admin-only:
export const listMessages = () => apiClient.get('/messages').then((r) => r.data);
export const getMessage = (id) => apiClient.get(`/messages/${id}`).then((r) => r.data);
export const getMessagesByEmail = (email) =>
  apiClient.get('/messages/by-email', { params: { email } }).then((r) => r.data);
export const deleteMessage = (id) => apiClient.delete(`/messages/${id}`);
