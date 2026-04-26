import apiClient from './client';
import storage from '../utils/storage';

export const listBlogs = () => apiClient.get('/blogs').then((r) => r.data);

export const getBlog = (id) => apiClient.get(`/blogs/${id}`).then((r) => r.data);

export const getBlogsByCategory = (category) =>
    apiClient.get(`/blogs/category/${encodeURIComponent(category)}`).then((r) => r.data);

export const searchBlogs = (keyword) =>
    apiClient.get('/blogs/search', { params: { keyword } }).then((r) => r.data);

export const createBlog = (payload) =>
    apiClient.post('/blogs', payload).then((r) => r.data);

export const updateBlog = (id, payload) =>
    apiClient.put(`/blogs/${id}`, payload).then((r) => r.data);

export const deleteBlog = (id) => apiClient.delete(`/blogs/${id}`);

export const uploadBlogCover = (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = storage.getItemSync('token');
    const headers = { 'Content-Type': 'multipart/form-data' };
    if (token) headers.Authorization = `Bearer ${token}`;

    return apiClient
        .post('/uploads/blog-covers', formData, { headers })
        .then((r) => r.data);
};