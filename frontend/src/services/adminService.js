import api from '../lib/axios';

const adminService = {
  // Stats
  async getStats() {
    const { data } = await api.get('/admin/stats');
    return data;
  },

  // Users
  async getUsers() {
    const { data } = await api.get('/admin/users');
    return data;
  },
  async updateUser(id, updateData) {
    const { data } = await api.put(`/admin/users/${id}`, updateData);
    return data;
  },
  async deleteUser(id) {
    const { data } = await api.delete(`/admin/users/${id}`);
    return data;
  },

  // Scores
  async getScores() {
    const { data } = await api.get('/admin/scores');
    return data;
  },
  async deleteScore(id) {
    const { data } = await api.delete(`/admin/scores/${id}`);
    return data;
  },

  // Subscriptions
  async getSubscriptions() {
    const { data } = await api.get('/admin/subscriptions');
    return data;
  },
  async updateSubscription(id, status) {
    const { data } = await api.put(`/admin/subscriptions/${id}`, { status });
    return data;
  },

  // Charities
  async getCharities() {
    const { data } = await api.get('/admin/charities');
    return data;
  },
  async createCharity(charityData) {
    const { data } = await api.post('/admin/charities', charityData);
    return data;
  },
  async updateCharity(id, charityData) {
    const { data } = await api.put(`/admin/charities/${id}`, charityData);
    return data;
  },
  async deleteCharity(id) {
    const { data } = await api.delete(`/admin/charities/${id}`);
    return data;
  },

  // Draws
  async getDrawsHistory() {
    const { data } = await api.get('/admin/draws');
    return data;
  },
  async getUpcomingDraws() {
    const { data } = await api.get('/admin/draws/upcoming');
    return data;
  },
  async createDraw(drawData) {
    const { data } = await api.post('/admin/draws', drawData);
    return data;
  },
  async runDraw(id) {
    const { data } = await api.post(`/admin/draws/${id}/run`);
    return data;
  },

  // Winners
  async getPendingWinners() {
    const { data } = await api.get('/admin/winners/pending');
    return data;
  },
  async updateWinnerStatus(id, status) {
    const { data } = await api.put(`/admin/winners/${id}/status`, { status });
    return data;
  },

  // Reports
  async getReports() {
    const { data } = await api.get('/admin/reports');
    return data;
  }
};

export default adminService;
