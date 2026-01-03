import api from './api';

export const messagesService = {
  async getConversations() {
    const response = await api.get('/messages/conversations/');
    return response.data;
  },

  async getConversation(id) {
    const response = await api.get(`/messages/conversations/${id}/`);
    return response.data;
  },

  async createConversation(data) {
    const response = await api.post('/messages/conversations/', data);
    return response.data;
  },

  async sendMessage(conversationId, text) {
    const response = await api.post(`/messages/conversations/${conversationId}/messages/`, {
      conversation: conversationId,
      text,
    });
    return response.data;
  },

  async getUnreadCount() {
    const response = await api.get('/messages/unread-count/');
    return response.data;
  },
};
