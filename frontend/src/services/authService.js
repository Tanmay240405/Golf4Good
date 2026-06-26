import api from '../lib/axios';

const authService = {
  async login({ email, password, remember }) {
    const { data } = await api.post('/auth/login', { email, password, remember });
    return data;
  },

  async signup({ name, email, password }) {
    const { data } = await api.post('/auth/signup', { name, email, password });
    return data;
  },

  async forgotPassword({ email }) {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  },

  async getMe() {
    const { data } = await api.get('/auth/me');
    return data;
  },

  async updateProfile({ name, email }) {
    const { data } = await api.put('/auth/me', { name, email });
    return data;
  },

  logout() {
    localStorage.removeItem('g4g_token');
    localStorage.removeItem('g4g_user');
  },
};

export default authService;
