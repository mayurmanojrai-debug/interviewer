import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, SlidersHorizontal, Info } from 'lucide-react';
import api from '../services/api.js';
import { Alert, Card, PageHeader, Badge } from '../components/UI.jsx';

const ROLES = ['Java Developer', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'Python Developer', 'Data Analyst', 'Cybersecurity Analyst', 'AI/ML Engineer'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const TYPES = ['Technical', 'Behavioral', 'HR', 'Mixed', 'Role Specific'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Adaptive AI'];
const COUNTS = [5, 10, 15, 20];

const TYPE_DESC = {
  Technical: 'Core concepts, internals and implementation details.',
  Behavioral: 'STAR-structured scenarios and situational questions.',
  HR: 'Motivation, culture fit and general screening questions.',
  Mixed: 'A balanced mix across every category.',
  'Role Specific': 'Questions mapped precisely to your target role.',
};

const DIFF_DESC = {
  Easy: 'Build confidence with foundational questions.',
  Medium: 'Standard interview-level difficulty.',
  Hard: 'Senior-level depth and tricky edge cases.',
  'Adaptive AI': 'Difficulty shifts live based on your answers.',
};

/** Segmented button group — a clearer alternative to a long <select>. */
function Segmented({ label, options, value, onChange, hint }) {
  return (
    <div className="field">
      <span className="label">{label}</span>
      <div className="segmented" role="group" aria-label={label}>
        {options.map((o) => (
          <button key={o} type="button" aria-pressed={value === o} onClick={() => onChange(o)}>
            {o}
          </button>
        ))}
      </div>
      {hint && (
        <p className="small muted" style={{ margin: '8px 0 0' }}>
          <Info size={13} style={{ verticalAlign: '-2px', marginRight: 5 }} />{hint}
        </p>
      )}
    </div>
  );
}

export default function Setup() {
  const nav = useNavigate();
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [f, setF] = useState({
    jobRole: 'Full Stack Developer',
    experienceLevel: 'Intermediate',
    interviewType: 'Mixed',
    difficulty: 'Adaptive AI',
    totalQuestions: 5,
  });

  const go = async () => {
    setErr('');
    setBusy(true);
    try {
      const r = await api.post('/api/interviews', f);
      sessionStorage.setItem('iq_live', JSON.stringify(r.data));
      nav('/app/live');
    } catch (e) {
      setErr(e.response?.data?.message || 'Could not start the interview. Is the API running on port 8080?');
    } finally {
      setBusy(false);
    }
  };

  const estMinutes = Math.max(3, Math.round(f.totalQuestions * 2.2));

  return (
    <div className="page-wrap">
      <PageHeader
        icon={SlidersHorizontal}
        eyebrow="Interview setup"
        title="Configure your session"
        subtitle="Choose the role, level and difficulty. You can change all of this for your next run."
        actions={<Badge tone="brand">Adaptive AI enabled</Badge>}
      />

      <div className="setup-grid">
        <Card>
          {err && <Alert tone="err">{err}</Alert>}

          <div className="field">
            <span className="label">Target role</span>
            <select value={f.jobRole} onChange={(e) => setF({ ...f, jobRole: e.target.value })}>
              {ROLES.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>

          <Segmented
            label="Experience level" options={LEVELS} value={f.experienceLevel}
            onChange={(v) => setF({ ...f, experienceLevel: v })}
          />
          <Segmented
            label="Interview type" options={TYPES} value={f.interviewType}
            onChange={(v) => setF({ ...f, interviewType: v })}
            hint={TYPE_DESC[f.interviewType]}
          />
          <Segmented
            label="Difficulty" options={DIFFICULTIES} value={f.difficulty}
            onChange={(v) => setF({ ...f, difficulty: v })}
            hint={DIFF_DESC[f.difficulty]}
          />
          <Segmented
            label="Number of questions" options={COUNTS} value={f.totalQuestions}
            onChange={(v) => setF({ ...f, totalQuestions: v })}
          />

          <hr className="divider" />

          <button className="btn primary lg block" onClick={go} disabled={busy}>
            <PlayCircle size={18} /> {busy ? 'Starting session…' : 'Start AI Interview'}
          </button>
        </Card>

        <Card className="setup-preview">
          <div className="card-head">
            <div>
              <h3>Session summary</h3>
              <p className="sub small muted">Review before you begin</p>
            </div>
          </div>
          <div className="sp-list">
            <div className="sp-row"><span>Role</span><b>{f.jobRole}</b></div>
            <div className="sp-row"><span>Level</span><b>{f.experienceLevel}</b></div>
            <div className="sp-row"><span>Type</span><b>{f.interviewType}</b></div>
            <div className="sp-row"><span>Difficulty</span><b>{f.difficulty}</b></div>
            <div className="sp-row"><span>Questions</span><b>{f.totalQuestions}</b></div>
            <div className="sp-row"><span>Estimated time</span><b>~{estMinutes} min</b></div>
          </div>
          <hr className="divider" />
          <ul className="small muted" style={{ paddingLeft: 18, margin: 0 }}>
            <li>Answer by voice or by typing.</li>
            <li>Each answer is scored the moment you submit it.</li>
            <li>Skipping a question is allowed and recorded.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}