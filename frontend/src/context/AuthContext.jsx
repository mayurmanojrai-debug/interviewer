import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';
const Ctx = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('iq_user')); } catch { return null; } });
  const [loading, setLoading] = useState(false);
  useEffect(() => { if (localStorage.getItem('iq_token') && !user) {
    api.get('/api/users/me').then((r) => { setUser(r.data); localStorage.setItem('iq_user', JSON.stringify(r.data)); }).catch(() => {}); } }, []);
  const save = (token, u) => { localStorage.setItem('iq_token', token); localStorage.setItem('iq_user', JSON.stringify(u)); setUser(u); };
  const login = async (email, password) => { setLoading(true);
    try { const r = await api.post('/api/auth/login', { email, password }); save(r.data.token, r.data.user); return r.data.user; }
    finally { setLoading(false); } };
  const register = async (payload) => { setLoading(true);
    try { const r = await api.post('/api/auth/register', payload); save(r.data.token, r.data.user); return r.data.user; }
    finally { setLoading(false); } };
  const logout = async () => { try { await api.post('/api/auth/logout'); } catch {} 
    localStorage.removeItem('iq_token'); localStorage.removeItem('iq_user'); setUser(null); };
  return <Ctx.Provider value={{ user, loading, login, register, logout, setUser }}>{children}</Ctx.Provider>;
}
export const useAuth = () => useContext(Ctx);
