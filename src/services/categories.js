import api from './api';

export const categoriesService = {
  async getCategories() {
    const response = await api.get('/categories/');
    return response.data;
  },

  async getAllCategories() {
    const response = await api.get('/categories/all/');
    return response.data;
  },

  async getCategoryBySlug(slug) {
    const response = await api.get(`/categories/${slug}/`);
    return response.data;
  },
};
