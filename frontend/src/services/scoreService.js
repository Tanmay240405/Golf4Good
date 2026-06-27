import api from '../lib/axios';

export const getScores = async () => {
  const response = await api.get('/scores');
  return response.data;
};

export const addScore = async (data) => {
  const response = await api.post('/scores', data);
  return response.data;
};

export const updateScore = async (id, data) => {
  const response = await api.put(`/scores/${id}`, data);
  return response.data;
};

export const deleteScore = async (id) => {
  const response = await api.delete(`/scores/${id}`);
  return response.data;
};
