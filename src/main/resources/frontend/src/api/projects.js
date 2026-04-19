import apiClient from './client';

export const listProjects = () => apiClient.get('/projects').then((r) => r.data);
export const getProject = (id) => apiClient.get(`/projects/${id}`).then((r) => r.data);
export const searchProjects = (keyword) =>
  apiClient.get('/projects/search', { params: { keyword } }).then((r) => r.data);
export const createProject = (payload) =>
  apiClient.post('/projects', payload).then((r) => r.data);
export const updateProject = (id, payload) =>
  apiClient.put(`/projects/${id}`, payload).then((r) => r.data);
export const deleteProject = (id) => apiClient.delete(`/projects/${id}`);
