import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Axios instance oluştur
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Token ekle
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Hata yönetimi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token geçersiz, kullanıcıyı login sayfasına yönlendir
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// API fonksiyonları

// Auth
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  register: (data: any) =>
    api.post('/api/auth/register', data),
  getProfile: () =>
    api.get('/api/auth/profile'),
};

// Elevators
export const elevatorAPI = {
  getAll: (params?: any) =>
    api.get('/api/elevators', { params }),
  getById: (id: string) =>
    api.get(`/api/elevators/${id}`),
  create: (data: any) =>
    api.post('/api/elevators', data),
  update: (id: string, data: any) =>
    api.put(`/api/elevators/${id}`, data),
  delete: (id: string) =>
    api.delete(`/api/elevators/${id}`),
  regenerateQR: (id: string) =>
    api.post(`/api/elevators/${id}/qrcode`),
};

// Maintenances
export const maintenanceAPI = {
  getAll: (params?: any) =>
    api.get('/api/maintenances', { params }),
  getById: (id: string) =>
    api.get(`/api/maintenances/${id}`),
  create: (data: any) =>
    api.post('/api/maintenances', data),
  update: (id: string, data: any) =>
    api.put(`/api/maintenances/${id}`, data),
  complete: (id: string, data: any) =>
    api.post(`/api/maintenances/${id}/complete`, data),
  updateChecklistItem: (id: string, data: any) =>
    api.put(`/api/maintenances/checklist/${id}`, data),
  addMaterial: (maintenanceId: string, data: any) =>
    api.post(`/api/maintenances/${maintenanceId}/materials`, data),
  downloadPDF: (id: string) =>
    api.get(`/api/maintenances/${id}/pdf`, { responseType: 'blob' }),
  downloadExcel: (id: string) =>
    api.get(`/api/maintenances/${id}/excel`, { responseType: 'blob' }),
};
