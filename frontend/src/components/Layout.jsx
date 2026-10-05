import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, PlayCircle, FlaskConical, Bot, BarChart3, Brain,
  Map, History, FileText, Settings, LogOut, Menu, X, Mic, Sparkles, Sun, Moon, CloudOff,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { onDemoChange } from '../services/demoData.js';
import AiAssistant from './AiAssistant.jsx';

const NAV_GROUPS = [
  { label: 'Overview', items: [['/app', 'Dashboard', LayoutDashboard]] },
  {
    label: 'Practice',
    items: [
      ['/app/setup', 'Start Interview', PlayCircle, 'NEW'],
      ['/app/practice', 'Practice Lab', FlaskConical],
    ],
  },
  {
    label: 'Insights',
    items: [
      ['/app/skills', 'Skill Intelligence', Brain],
      ['/app/roadmap', 'Career Roadmap', Map],
      ['/app/analytics', 'Performance', BarChart3],
    ],
  },
  {
    label: 'Career Tools',
    items: [
      ['/app/copilot', 'AI Career Copilot', Bot],
      ['/app/resume', 'Resume Intelligence', FileText],
      ['/app/history', 'Interview History', History],
    ],
  },
];

const TITLES = {
  '/app': 'Dashboard',
  '/app/setup': 'Start a New Interview',
  '/app/live': 'Live Interview',
  '/app/practice': 'Practice Lab',
  '/app/copilot': 'AI Career Copilot',
  '/app/skills': 'Skill Intelligence',
  '/app/roadmap': 'Career Roadmap',
  '/app/resume': 'Resume Intelligence',
  '/app/analytics': 'Performance Analytics',
  '/app/history': 'Interview History',
  '/app/admin': 'Admin Console',
};

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const nav = useNavigate();
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const [offline, setOffline] = useState(false);

  // Flip the demo-mode banner when the API turns out to be unreachable.
  useEffect(() => onDemoChange(setOffline), []);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => { setOpen(false); }, [loc.pathname]);

  // Lock background scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const out = async () => { await logout(); nav('/login'); };

  const isLive = loc.pathname === '/app/live';
  const title = TITLES[loc.pathname] || 'Dashboard';

  const sidebar = (
    <div className="side-inner">
      <div className="side-brand">
        <NavLink to="/app" className="brand" aria-label="InterviewIQ home">
          <span className="brand-mark"><Sparkles size={18} /></span>
          <span className="brand-name">Interview<em>IQ</em></span>
        </NavLink>
        <button className="icon-btn only-mobile" onClick={() => setOpen(false)} aria-label="Close navigation">
          <X size={18} />
        </button>
      </div>

      <div className="side-scroll">
        {NAV_GROUPS.map((g) => (
          <div className="side-group" key={g.label}>
            <div className="side-group-label">{g.label}</div>
            <nav className="side-nav">
              {g.items.map(([to, label, Icon, tag]) => (
                <NavLink
                  key={to} to={to} end={to === '/app'}
                  className={({ isActive }) => 'side-link' + (isActive ? ' active' : '')}
                >
                  <Icon size={18} />
                  {label}
                  {tag && <span className="s-tag">{tag}</span>}
                </NavLink>
              ))}
            </nav>
          </div>
        ))}

        {user?.role === 'ADMIN' && (
          <div className="side-group">
            <div className="side-group-label">Administration</div>
            <nav className="side-nav">
              <NavLink to="/app/admin" className={({ isActive }) => 'side-link' + (isActive ? ' active' : '')}>
                <Settings size={18} />Admin Console
              </NavLink>
            </nav>
          </div>
        )}
      </div>

      <div className="side-foot">
        <div className="user-chip">
          <div className="avatar">{(user?.name || 'U').slice(0, 1).toUpperCase()}</div>
          <div className="u-body">
            <div className="u-name">{user?.name || 'Candidate'}</div>
            <div className="u-role">{user?.targetRole || 'Set your target role'}</div>
          </div>
        </div>
        <button className="btn ghost sm block" onClick={out}>
          <LogOut size={15} /> Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="shell">
      <aside className={'sidebar' + (open ? ' open' : '')}>{sidebar}</aside>
      {open && <div className="scrim" onClick={() => setOpen(false)} aria-hidden="true" />}

      <div className="main">
        <header className="topbar">
          <button className="icon-btn only-mobile" onClick={() => setOpen(true)} aria-label="Open navigation" aria-expanded={open}>
            <Menu size={20} />
          </button>
          <div>
            <div className="tb-crumb">InterviewIQ</div>
            <div className="tb-title">{title}</div>
          </div>
          <div className="tb-spacer" />
          <div className="tb-meta">
            {!isLive && (
              <NavLink to="/app/setup" className="btn soft sm">
                <PlayCircle size={16} /> Start Interview
              </NavLink>
            )}
            {isLive && <span className="badge danger"><Mic size={12} /> Live session</span>}
            <button
              className="icon-btn"
              onClick={toggle}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>
        <main className="content" id="main">
          {offline && (
            <div className="demo-banner" role="status">
              <CloudOff size={16} />
              <span>
                <b>Demo mode.</b> No backend is connected, so this session runs entirely in
                your browser with sample data. Sign in with any details.
              </span>
            </div>
          )}
          {children}
        </main>
      </div>

      {/* Floating AI assistant, available on every app screen. */}
      <AiAssistant />
    </div>
  );
}