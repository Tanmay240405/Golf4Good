import api from '../lib/axios';

export const drawService = {
  // Admin endpoints
  createUpcomingDraw: async (data) => {
    const response = await api.post('/draws', data);
    return response.data;
  },

  runDraw: async (id) => {
    const response = await api.post(`/draws/${id}/run`);
    return response.data;
  },
  
  getPendingVerifications: async () => {
    const response = await api.get('/draws/winners/pending');
    return response.data;
  },
  
  updateWinnerStatus: async (id, status) => {
    const response = await api.put(`/draws/winners/${id}/status`, { status });
    return response.data;
  },

  // User endpoints
  getUpcomingDraws: async () => {
    const response = await api.get('/draws/upcoming');
    return response.data;
  },

  getDrawHistory: async () => {
    const response = await api.get('/draws/history');
    return response.data;
  },

  getMyWinnings: async () => {
    const response = await api.get('/draws/my-winnings');
    return response.data;
  },

  uploadProof: async (id, file) => {
    const formData = new FormData();
    formData.append('proofImage', file);
    
    const response = await api.post(`/draws/winners/${id}/proof`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
