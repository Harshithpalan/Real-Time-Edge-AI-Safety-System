import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    console.error('API Error:', err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export const camerasApi = {
  getAll: () => api.get('/cameras'),
  getById: (id) => api.get(`/cameras/${id}`),
  update: (id, data) => api.put(`/cameras/${id}`, data)
};

export const detectionsApi = {
  getAll: (params) => api.get('/detections', { params }),
  getById: (id) => api.get(`/detections/${id}`)
};

export const alertsApi = {
  getAll: (params) => api.get('/alerts', { params }),
  getById: (id) => api.get(`/alerts/${id}`),
  getStats: () => api.get('/alerts/stats'),
  acknowledge: (id, by) => api.post(`/alerts/${id}/acknowledge`, { acknowledgedBy: by }),
  resolve: (id) => api.post(`/alerts/${id}/resolve`)
};

export const workersApi = {
  getAll: (params) => api.get('/workers', { params }),
  create: (data) => api.post('/workers', data),
  update: (id, data) => api.put(`/workers/${id}`, data),
  remove: (id) => api.delete(`/workers/${id}`)
};

export const zonesApi = {
  getAll: () => api.get('/zones'),
  getById: (id) => api.get(`/zones/${id}`),
  update: (id, data) => api.put(`/zones/${id}`, data)
};

export const statsApi = {
  getDashboard: () => api.get('/stats/dashboard')
};

export default api;
