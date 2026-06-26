import api from '../lib/axios';

export const testimonialService = {
  getTestimonials: async () => {
    const response = await api.get('/testimonials');
    return response.data;
  },

  createTestimonial: async (testimonialData) => {
    const response = await api.post('/testimonials', testimonialData);
    return response.data;
  }
};
