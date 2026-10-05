const fs=require('fs'),path=require('path');
const R='c:/Users/raima/OneDrive/Desktop/haikyu/frontend';
const W=(f,c)=>{const p=path.join(R,f);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,c);console.log('wrote',f);};
W('src/context/AuthContext.jsx', `import { createContext, useContext, useState, useEffect } from 'react';
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
`);
W('src/components/Layout.jsx', `import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PlayCircle, FlaskConical, Bot, BarChart3, Brain, Map, History, FileText, Settings, LogOut, Menu, X, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
const LINKS = [
  ['/app', 'Dashboard', LayoutDashboard], ['/app/setup', 'Start Interview', PlayCircle],
  ['/app/practice', 'Practice Lab', FlaskConical], ['/app/copilot', 'AI Career Copilot', Bot],
  ['/app/history', 'Interview History', History], ['/app/skills', 'Skill Intelligence', Brain],
  ['/app/roadmap', 'Career Roadmap', Map], ['/app/resume', 'Resume Intelligence', FileText],
  ['/app/analytics', 'Performance', BarChart3],
];
export default function Layout({ children }) {
  const { user, logout } = useAuth(); const nav = useNavigate(); const [open, setOpen] = useState(false);
  const out = async () => { await logout(); nav('/login'); };
  const side = (
    <div className="side-inner">
      <div className="brand"><span className="brand-mark"><Sparkles size={18} /></span><span>INTERVIEWIQ</span></div>
      <nav className="side-nav">
        {LINKS.map(([to, label, Icon]) => (
          <NavLink key={to} to={to} end={to === '/app'} onClick={() => setOpen(false)}
            className={({ isActive }) => 'side-link' + (isActive ? ' active' : '')}><Icon size={18} />{label}</NavLink>))}
        {user && user.role === 'ADMIN' && (
          <NavLink to="/app/admin" className={({ isActive }) => 'side-link' + (isActive ? ' active' : '')}><Settings size={18} />Admin</NavLink>)}
      </nav>
      <div className="side-foot">
        <div className="user-chip"><div className="avatar">{(user?.name || 'U').slice(0, 1).toUpperCase()}</div>
          <div><div className="u-name">{user?.name}</div><div className="u-role">{user?.targetRole}</div></div></div>
        <button className="btn ghost sm" onClick={out}><LogOut size={15} /> Logout</button>
      </div>
    </div>);
  return (
    <div className="shell">
      <aside className={'sidebar' + (open ? ' open' : '')}>{side}{open && <button className="icon-btn close" onClick={() => setOpen(false)}><X size={18} /></button>}</aside>
      <div className="main">
        <header className="topbar">
          <button className="icon-btn only-mobile" onClick={() => setOpen(true)}><Menu size={20} /></button>
          <div className="top-title">AI-Powered Career Readiness</div>
          <div className="top-user">{user?.name}</div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>);
}
`);
