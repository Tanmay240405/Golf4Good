import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('g4g_token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getScores = async () => {
  const response = await axios.get(`${API_URL}/scores`, getAuthHeaders());
  return response.data;
};

export const addScore = async (data) => {
  const response = await axios.post(`${API_URL}/scores`, data, getAuthHeaders());
  return response.data;
};

export const updateScore = async (id, data) => {
  const response = await axios.put(`${API_URL}/scores/${id}`, data, getAuthHeaders());
  return response.data;
};

export const deleteScore = async (id) => {
  const response = await axios.delete(`${API_URL}/scores/${id}`, getAuthHeaders());
  return response.data;
};
