import axios from 'axios';

const BASE = 'http://localhost:5000/api';

export const api = {
  get: (path, role = 'user') =>
    axios.get(`${BASE}${path}`, { headers: { 'x-user-role': role } }),

  post: (path, data, role = 'admin') =>
    axios.post(`${BASE}${path}`, data, { headers: { 'x-user-role': role } }),
};
