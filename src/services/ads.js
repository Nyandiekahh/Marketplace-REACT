import api from './api';

export const adsService = {
  async getAds(params = {}) {
    const response = await api.get('/ads/', { params });
    return response.data;
  },

  async getAdBySlug(slug) {
    const response = await api.get(`/ads/${slug}/`);
    return response.data;
  },

  async createAd(formData) {
    const response = await api.post('/ads/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateAd(slug, data) {
    const response = await api.put(`/ads/${slug}/`, data);
    return response.data;
  },

  async deleteAd(slug) {
    const response = await api.delete(`/ads/${slug}/`);
    return response.data;
  },

  async searchAds(query, params = {}) {
    const response = await api.get('/ads/search/', {
      params: { q: query, ...params },
    });
    return response.data;
  },

  async getMyAds() {
    const response = await api.get('/ads/my-ads/');
    return response.data;
  },

  async getFavorites() {
    const response = await api.get('/ads/favorites/');
    return response.data;
  },

  async addToFavorites(adId) {
    const response = await api.post('/ads/favorites/', { ad_id: adId });
    return response.data;
  },

  async removeFromFavorites(adId) {
    const response = await api.delete(`/ads/favorites/${adId}/`);
    return response.data;
  },

  async markAsSold(slug) {
    const response = await api.post(`/ads/${slug}/mark-sold/`);
    return response.data;
  },
};
