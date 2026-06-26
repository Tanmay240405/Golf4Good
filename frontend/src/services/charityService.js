import api from '../lib/axios';

export const charityService = {
  getCharities: async () => {
    const response = await api.get('/charities');
    return response.data;
  },

  getCharityById: async (id) => {
    const response = await api.get(`/charities/${id}`);
    return response.data;
  },

  selectCharity: async (charityId, donationPercentage) => {
    const response = await api.put('/charities/select', {
      charityId,
      donationPercentage,
    });
    return response.data;
  },
  
  createCharity: async (charityData) => {
    const response = await api.post('/charities', charityData);
    return response.data;
  }
};
