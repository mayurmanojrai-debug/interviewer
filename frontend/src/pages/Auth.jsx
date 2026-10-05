import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import AuthSplit from '../components/AuthSplit.jsx';

const DEMO = { email: 'demo@interviewiq.com', password: 'Demo@123' };
const ROLES = ['Java Developer', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'Python Developer', 'Data Analyst', 'Cybersecurity Analyst', 'AI/ML Engineer'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const LOGIN_BLURB =
  'InterviewIQ runs adaptive AI mock interviews that score every answer, find your skill gaps and build a 7-day plan — so you walk in knowing exactly what to practise.';
const JOIN_BLURB =
  'Create your free account and get adaptive mock interviews, instant answer scoring, skill-gap analysis and a personalised roadmap built around your target role.';

function Foot({ isLogin }) {
  return (
    <p className="sfoot">
      &copy; {new Date().getFullYear()} InterviewIQ. All rights reserved.{' '}
      {isLogin ? (
        <Link to="/register">Create an account</Link>
      ) : (
        <Link to="/login">Back to login</Link>
      )}
    </p>
  );
}

/* ---------------------------------------------------------------- LOGIN */
export function Login() {
  const { login, loading } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState(DEMO);
  const [show, setShow] = useState(false);
  const [agree, setAgree] = useState(true);
  const [err, setErr] = useState('');
  const [info, setInfo] = useState('');

  const go = async (e) => {
    e.preventDefault();
    setErr('');
    setInfo('');
    try {
      const u = await login(f.email, f.password);
      nav(u.role === 'ADMIN' ? '/app/admin' : '/app');
    } catch (ex) {
      setErr(ex.response?.data?.message || 'Login failed. Please check your email and password.');
    }
  };

  const focusField = () => {
    const el = document.getElementById('s-email');
    if (el) el.focus();
  };

  return (
    <AuthSplit
      eyebrow="Say hello"
      headline="Welcome Back"
      blurb={LOGIN_BLURB}
      ctaLabel="Get Started"
      onCta={focusField}
    >
      <h2 className="split-title">Log In</h2>
      <p className="split-tagline">Pick up your preparation where you left off.</p>

      <form onSubmit={go}>
        {err && <div className="salert"><AlertCircle size={15} /> {err}</div>}
        {info && <div className="salert info"><AlertCircle size={15} /> {info}</div>}

        <div className="sfield">
          <label htmlFor="s-email">Email</label>
          <input
            id="s-email" type="email" autoComplete="email" required
            value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })}
            placeholder="you@college.edu"
          />
        </div>

        <div className="sfield">
          <label htmlFor="s-password">Password</label>
          <span className="s-wrap">
            <input
              id="s-password" type={show ? 'text' : 'password'} autoComplete="current-password" required
              value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })}
              placeholder="Your password"
            />
            <button type="button" className="s-eye" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </span>
        </div>

        <label className="scheck">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          <span>I agree to the Terms of Use and Privacy Policy</span>
        </label>

        <button className="ssubmit" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Login'}
        </button>
      </form>

      <button
        type="button" className="sdemo"
        onClick={() => { setF(DEMO); setErr(''); setInfo('Demo credentials loaded — press Login.'); }}
      >
        <span>
          <b>Use the demo account</b>
          <small>{DEMO.email} · {DEMO.password}</small>
        </span>
        <ArrowRight size={15} className="sd-go" />
      </button>

      <p className="slink">
        <button type="button" onClick={() => { setInfo('Password reset is not enabled in this demo — use the demo credentials, or ask an admin.'); setErr(''); }}>
          Forgot user id or password?
        </button>
      </p>

      <Foot isLogin />
    </AuthSplit>
  );
}
/* ------------------------------------------------------------- REGISTER */
export function Register() {
  const { register, loading } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({
    name: '', email: '', password: '', confirm: '',
    targetRole: 'Full Stack Developer', experienceLevel: 'Intermediate',
  });
  const [show, setShow] = useState(false);
  const [agree, setAgree] = useState(false);
  const [err, setErr] = useState('');

  const go = async (e) => {
    e.preventDefault();
    setErr('');
    if (!f.name || !f.email || !f.password) return setErr('Please complete all required fields.');
    if (f.password !== f.confirm) return setErr('The two passwords do not match.');
    if (f.password.length < 6) return setErr('Password must be at least 6 characters.');
    if (!agree) return setErr('Please accept the Terms of Use and Privacy Policy.');
    try {
      await register({
        name: f.name, email: f.email, password: f.password,
        targetRole: f.targetRole, experienceLevel: f.experienceLevel,
      });
      nav('/app');
    } catch (ex) {
      setErr(ex.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const focusField = () => {
    const el = document.getElementById('s-name');
    if (el) el.focus();
  };

  return (
    <AuthSplit
      eyebrow="Say hello"
      headline="Create Account"
      blurb={JOIN_BLURB}
      ctaLabel="Get Started"
      onCta={focusField}
    >
      <h2 className="split-title">Join Us</h2>
      <p className="split-tagline">Create your account. It's free.</p>

      <form onSubmit={go}>
        {err && <div className="salert"><AlertCircle size={15} /> {err}</div>}

        <div className="sfield">
          <label htmlFor="s-name">Name</label>
          <input id="s-name" value={f.name} onChange={set('name')} placeholder="Your full name" required autoComplete="name" />
        </div>

        <div className="sfield">
          <label htmlFor="s-email">Email</label>
          <input id="s-email" type="email" value={f.email} onChange={set('email')} placeholder="you@college.edu" required autoComplete="email" />
        </div>

        <div className="sfield">
          <label htmlFor="s-password">Password</label>
          <span className="s-wrap">
            <input
              id="s-password" type={show ? 'text' : 'password'} value={f.password} onChange={set('password')}
              placeholder="At least 6 characters" required autoComplete="new-password"
            />
            <button type="button" className="s-eye" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </span>
        </div>

        <div className="sfield">
          <label htmlFor="s-confirm">Confirm password</label>
          <input id="s-confirm" type="password" value={f.confirm} onChange={set('confirm')} placeholder="Repeat password" required autoComplete="new-password" />
        </div>

        <div className="sfield">
          <label htmlFor="s-role">Target role</label>
          <select id="s-role" value={f.targetRole} onChange={set('targetRole')}>
            {ROLES.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>

        <div className="sfield">
          <label htmlFor="s-level">Experience</label>
          <select id="s-level" value={f.experienceLevel} onChange={set('experienceLevel')}>
            {LEVELS.map((l) => <option key={l}>{l}</option>)}
          </select>
        </div>

        <label className="scheck">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          <span>I agree to Conditions of Use and Privacy Policy</span>
        </label>

        <button className="ssubmit" type="submit" disabled={loading}>
          {loading ? 'Creating…' : 'Create account'}
        </button>
      </form>

      <p className="slink">
        Already have an account? <Link to="/login">Log in</Link>
      </p>

      <Foot isLogin={false} />
    </AuthSplit>
  );
}