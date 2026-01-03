import api from './api';

export const authService = {
  async register(userData) {
    const response = await api.post('/users/register/', userData);
    return response.data;
  },

  async login(email, password) {
    const response = await api.post('/users/login/', { email, password });
    const { access, refresh, user } = response.data;
    
    // Store tokens
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    
    return { user, access, refresh };
  },

  async getProfile() {
    const response = await api.get('/users/profile/');
    return response.data;
  },

  async updateProfile(data) {
    const response = await api.put('/users/profile/', data);
    return response.data;
  },

  async verifyEmail(code) {
    const response = await api.post('/users/verify/email/', { code });
    return response.data;
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },

  getToken() {
    return localStorage.getItem('access_token');
  }
};
