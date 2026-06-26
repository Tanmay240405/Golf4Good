import api from '../lib/axios';

export const subscriptionService = {
  getCurrentSubscription: async () => {
    const response = await api.get('/subscriptions/current');
    return response.data;
  },

  getSubscriptionHistory: async () => {
    const response = await api.get('/subscriptions/history');
    return response.data;
  },

  checkout: async (plan) => {
    const response = await api.post('/subscriptions/checkout', { plan });
    return response.data;
  },

  cancelSubscription: async () => {
    const response = await api.post('/subscriptions/cancel');
    return response.data;
  }
};
