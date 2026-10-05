import axios from 'axios';
import { serveOffline } from './demoData.js';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '' });

api.interceptors.request.use((c) => {
  const t = localStorage.getItem('iq_token');
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});

api.interceptors.response.use((r) => r, (e) => {
  const res = e.response;
  const contentType = (res && res.headers && (res.headers['content-type'] || res.headers['Content-Type'])) || '';

  // A JSON error body means the real API answered -> honour it.
  if (res && String(contentType).includes('application/json')) {
    if (res.status === 401 && location.hash !== '#/login') {
      localStorage.removeItem('iq_token');
      localStorage.removeItem('iq_user');
      location.hash = '#/login';
    }
    return Promise.reject(e);
  }

  // Anything else - static hosting 404 (HTML), asleep API, offline - means the
  // backend is unreachable, so answer from local data and keep the UI usable.
  return serveOffline(e.config || {}).catch(() => Promise.reject(e));
});

export default api;
