import apiClient from './client';

// User-level:
export const submitServiceRequest = (payload) =>
  apiClient.post('/service-requests', payload).then((r) => r.data);

export const getMyServiceRequests = () =>
  apiClient.get('/service-requests/my').then((r) => r.data);

// Admin-only:
export const listServiceRequests = () =>
  apiClient.get('/service-requests').then((r) => r.data);

export const getServiceRequest = (id) =>
  apiClient.get(`/service-requests/${id}`).then((r) => r.data);

export const getServiceRequestsByStatus = (status) =>
  apiClient.get(`/service-requests/by-status/${encodeURIComponent(status)}`).then((r) => r.data);

export const updateServiceRequestStatus = (id, status) =>
  apiClient.patch(`/service-requests/${id}/status`, { status }).then((r) => r.data);

export const deleteServiceRequest = (id) =>
  apiClient.delete(`/service-requests/${id}`);
