import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '' });
api.interceptors.request.use((c) => { const t = localStorage.getItem('iq_token');
  if (t) c.headers.Authorization = 'Bearer ' + t; return c; });
api.interceptors.response.use((r) => r, (e) => {
  if (e.response && e.response.status === 401 && location.hash !== '#/login') {
    localStorage.removeItem('iq_token'); localStorage.removeItem('iq_user'); location.hash = '#/login'; }
  return Promise.reject(e); });
export default api;
