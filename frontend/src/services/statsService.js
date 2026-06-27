import api from '../lib/axios';

export const statsService = {
  getPublicStats: async () => {
    const response = await api.get('/stats');
    return response.data;
  }
};
