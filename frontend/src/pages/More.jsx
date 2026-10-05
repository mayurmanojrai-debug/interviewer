import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  FlaskConical, Brain, Map, FileText, BarChart3, Shield, PlayCircle, Upload,
  CalendarDays, Trophy, Users, Activity, TrendingUp, CheckCircle2,
} from 'lucide-react';
import api from '../services/api.js';
import {
  Card, PageHeader, Badge, Meter, StatCard, Ring, EmptyState, Skeleton, Alert,
  scoreTone, fmtDate,
} from '../components/UI.jsx';

const PLAN = [
  'Java fundamentals & OOP',
  'Spring Boot & REST APIs',
  'SQL, joins and indexing',
  'React components & state',
  'System design basics',
  'Behavioral (STAR method)',
  'Full adaptive mock interview',
];

const DRILLS = [
  { t: 'Quick Question', d: 'One random question from the pool for a fast warm-up.', role: 'Full Stack Developer', n: 1 },
  { t: 'Weakness Practice', d: 'Targets your highest-impact skill gap.', role: 'Full Stack Developer', n: 5 },
  { t: 'Rapid Fire', d: 'Five quick questions with minimal thinking time.', role: 'Java Developer', n: 5 },
  { t: 'Behavioral Practice', d: 'STAR-structured scenario questions.', role: 'Full Stack Developer', n: 5 },
];

/* ------------------------------------------------------------- PRACTICE */
export function Practice() {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const go = async (role, n) => {
    setErr('');
    setBusy(true);
    try {
      const r = await api.post('/api/interviews', { jobRole: role, totalQuestions: n, difficulty: 'Adaptive AI', interviewType: 'Mixed' });
      sessionStorage.setItem('iq_live', JSON.stringify(r.data));
      window.location.hash = '#/app/live';
    } catch (e) {
      setErr(e.response?.data?.message || 'Could not start the practice session.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="page-wrap">
      <PageHeader
        icon={FlaskConical}
        eyebrow="Practice lab"
        title="Focused practice sessions"
        subtitle="Short, targeted drills for warming up or fixing one specific gap."
      />
      {err && <Alert tone="err">{err}</Alert>}
      <div className="practice-grid">
        {DRILLS.map((c) => (
          <Card key={c.t} className="practice-card hoverable">
            <div className="pc-top">
              <span className="icon-tile"><FlaskConical size={19} /></span>
              <Badge>{c.n} question{c.n === 1 ? '' : 's'}</Badge>
            </div>
            <h3>{c.t}</h3>
            <p>{c.d}</p>
            <button className="btn primary sm" disabled={busy} onClick={() => go(c.role, c.n)}>
              <PlayCircle size={15} /> Start drill
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- SKILLS */
export function Skills() {
  const [g, setG] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get('/api/skills/gaps').then((r) => setG(r.data)).catch(() => setErr('Could not load skill data.'));
  }, []);

  if (err) return <div className="page-wrap"><Alert tone="err">{err}</Alert></div>;
  if (!g) return <div className="page-wrap"><Card><Skeleton tall lines={5} /></Card></div>;

  const gaps = g.gaps || [];
  const weakest = gaps.length ? gaps.reduce((a, b) => (a.score <= b.score ? a : b)) : null;

  return (
    <div className="page-wrap">
      <PageHeader
        icon={Brain}
        eyebrow="Skill intelligence"
        title="Where you stand"
        subtitle="Scores are recalculated after every interview you complete."
        actions={weakest ? <Badge tone="danger">Critical gap: {weakest.skill}</Badge> : null}
      />

      <div className="grid-sidebar">
        <Card>
          <div className="card-head">
            <div>
              <h3>Skill scores</h3>
              <p className="sub small muted">Sorted weakest first — fix these first</p>
            </div>
          </div>
          {gaps.length === 0 ? (
            <EmptyState
              title="No skill data yet"
              message="Complete an interview and your skill profile will be generated automatically."
              action={<Link to="/app/setup" className="btn primary sm mt-2"><PlayCircle size={15} /> Take an interview</Link>}
            />
          ) : (
            <div className="stack">
              {gaps.slice().sort((a, b) => a.score - b.score).map((x) => (
                <Meter key={x.skill} label={x.skill} value={x.score} />
              ))}
            </div>
          )}
        </Card>

        <Card className="setup-preview">
          <div className="card-head">
            <div>
              <h3>Critical gap</h3>
              <p className="sub small muted">Highest impact on your score</p>
            </div>
          </div>
          {weakest ? (
            <>
              <div className="center" style={{ padding: '10px 0 18px' }}>
                <Ring value={weakest.score} size={140} stroke={13} sub="Current" />
              </div>
              <h3 style={{ textAlign: 'center' }}>{weakest.skill}</h3>
              <p className="small muted center">
                Closing this single gap is the fastest way to lift your overall readiness.
              </p>
              <div className="row center mt-3">
                <Link to="/app/practice" className="btn primary sm"><PlayCircle size={15} /> Practise this</Link>
                <Link to="/app/roadmap" className="btn ghost sm">View roadmap</Link>
              </div>
            </>
          ) : (
            <EmptyState title="Nothing to show" message="Take an interview to reveal your critical gap." />
          )}
        </Card>
      </div>
    </div>
  );
}
/* ------------------------------------------------------------- ROADMAP */
export function Roadmap() {
  const [r, setR] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get('/api/roadmap').then((x) => setR(x.data)).catch(() => setErr('Could not load your roadmap.'));
  }, []);

  if (err) return <div className="page-wrap"><Alert tone="err">{err}</Alert></div>;
  if (!r) return <div className="page-wrap"><Card><Skeleton tall lines={5} /></Card></div>;

  const done = r.filter((s) => s.progress >= 100).length;

  return (
    <div className="page-wrap">
      <PageHeader
        icon={Map}
        eyebrow="Career roadmap"
        title="Your path to job-ready"
        subtitle="Generated from your target role and refreshed after every interview."
        actions={<Badge tone="brand">{done} of {r.length} steps complete</Badge>}
      />

      <div className="grid-sidebar">
        <Card>
          <div className="card-head">
            <div>
              <h3>Roadmap steps</h3>
              <p className="sub small muted">Work through these in order</p>
            </div>
          </div>
          {r.length === 0 ? (
            <EmptyState
              icon={Map}
              title="No roadmap yet"
              message="Complete an interview and your personalised roadmap will be created."
              action={<Link to="/app/setup" className="btn primary sm mt-2"><PlayCircle size={15} /> Take an interview</Link>}
            />
          ) : r.map((s) => (
            <div className={`road-step${s.progress >= 100 ? ' done' : ''}`} key={s.id}>
              <span className="rs-dot">{s.progress >= 100 ? <CheckCircle2 size={16} /> : s.priority}</span>
              <div className="rs-body">
                <div className="rs-title">{s.title}</div>
                {s.description && <div className="rs-desc">{s.description}</div>}
                <Meter label="Progress" value={s.progress} />
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <div className="card-head">
            <div>
              <h3>7-day improvement plan</h3>
              <p className="sub small muted">One focused topic per day</p>
            </div>
          </div>
          <div className="stack-sm">
            {PLAN.map((p, i) => (
              <div className="plan-day" key={p}>
                <span className="pd-n">D{i + 1}</span>
                <span>{p}</span>
              </div>
            ))}
          </div>
          <hr className="divider" />
          <p className="small muted" style={{ margin: 0 }}>
            Finish the week with a full adaptive mock to see how far you have moved.
          </p>
          <Link to="/app/setup" className="btn primary block mt-3">
            <PlayCircle size={16} /> Start day-one drill
          </Link>
        </Card>
      </div>
    </div>
  );
}
/* -------------------------------------------------------------- RESUME */
const SAMPLE = 'Java Spring Boot React SQL REST. Built React + Spring Boot app with JWT authentication and MySQL.';

export function Resume() {
  const [txt, setTxt] = useState(SAMPLE);
  const [out, setOut] = useState(null);
  const [list, setList] = useState(null);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get('/api/resume').then((r) => setList(r.data)).catch(() => setList([]));
  }, []);

  const up = async () => {
    setErr('');
    setBusy(true);
    try {
      const r = await api.post('/api/resume/upload', { text: txt, fileName: 'resume.txt' });
      setOut(r.data);
      setList((l) => [r.data.resume, ...(l || [])]);
    } catch (e) {
      setErr(e.response?.data?.message || 'Could not analyse the resume.');
    } finally {
      setBusy(false);
    }
  };

  const best = list && list.length ? Math.max(...list.map((r) => r.resumeScore)) : 0;

  return (
    <div className="page-wrap">
      <PageHeader
        icon={FileText}
        eyebrow="Resume intelligence"
        title="Analyse your resume"
        subtitle="Paste your resume text and get an instant strength score with concrete fixes."
        actions={best ? <Badge tone={scoreTone(best)}>Best score {best}/100</Badge> : null}
      />

      {err && <Alert tone="err">{err}</Alert>}

      <div className="grid-sidebar">
        <Card>
          <div className="card-head">
            <div>
              <h3>Resume text</h3>
              <p className="sub small muted">Plain text works best</p>
            </div>
          </div>
          <textarea rows={11} value={txt} onChange={(e) => setTxt(e.target.value)} placeholder="Paste your resume text here…" />
          <div className="row mt-3">
            <button className="btn primary" onClick={up} disabled={busy || !txt.trim()}>
              <Upload size={16} /> {busy ? 'Analysing…' : 'Analyse resume'}
            </button>
            <span className="tiny subtle">{txt.trim().split(/\s+/).filter(Boolean).length} words</span>
          </div>

          {out && (
            <div className="mt-4">
              <Alert tone="ok" title={`Resume strength: ${out.resume.resumeScore}/100`}>
                <ul>{out.insights.map((i, x) => <li key={x}>{i}</li>)}</ul>
              </Alert>
            </div>
          )}
        </Card>

        <Card>
          <div className="card-head">
            <div>
              <h3>Previous uploads</h3>
              <p className="sub small muted">Your analysed resumes</p>
            </div>
          </div>
          {out && (
            <div className="center" style={{ paddingBottom: 18 }}>
              <Ring value={out.resume.resumeScore} size={130} stroke={12} sub="Strength" />
            </div>
          )}
          {!list ? (
            <Skeleton lines={3} />
          ) : list.length === 0 ? (
            <EmptyState icon={FileText} title="No uploads yet" message="Analyse your first resume above." />
          ) : list.map((r) => (
            <div className="list-row" key={r.id}>
              <span className="lr-ico"><FileText size={16} /></span>
              <div className="lr-main">
                <div className="lr-title">{r.fileName}</div>
                <div className="lr-sub">{fmtDate(r.uploadedAt)}</div>
              </div>
              <Badge tone={scoreTone(r.resumeScore)}>{r.resumeScore}/100</Badge>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
/* ----------------------------------------------------------- ANALYTICS */
function PerfTip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="chart-tip">
      <div className="ct-label">{fmtDate(label)}</div>
      {payload.map((p) => (
        <div className="ct-val" key={p.dataKey} style={{ color: p.color }}>{p.name}: {p.value}%</div>
      ))}
    </div>
  );
}

export function Analytics() {
  const [h, setH] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get('/api/analytics/performance')
      .then((r) => setH(r.data.history || []))
      .catch(() => setErr('Could not load performance data.'));
  }, []);

  if (err) return <div className="page-wrap"><Alert tone="err">{err}</Alert></div>;
  if (!h) return <div className="page-wrap"><Card><Skeleton tall lines={5} /></Card></div>;

  const best = h.length ? Math.max(...h.map((x) => x.score)) : 0;
  const latest = h[h.length - 1];
  const delta = h.length > 1 ? latest.score - h[0].score : 0;

  return (
    <div className="page-wrap stack-lg">
      <PageHeader
        icon={BarChart3}
        eyebrow="Performance analytics"
        title="How you are progressing"
        subtitle="Overall, technical and communication scores across every completed interview."
      />

      {h.length === 0 ? (
        <Card>
          <EmptyState
            icon={BarChart3}
            title="No data yet"
            message="Complete an interview to unlock your performance analytics."
            action={<Link to="/app/setup" className="btn primary sm mt-2"><PlayCircle size={15} /> Take an interview</Link>}
          />
        </Card>
      ) : (
        <>
          <section className="stat-grid">
            <StatCard icon={Trophy} label="Best score" value={best} unit="%" hint="Personal best" tone="success" />
            <StatCard icon={Activity} label="Latest" value={latest.score} unit="%" hint={latest.role} />
            <StatCard
              icon={TrendingUp} label="Improvement" value={`${delta >= 0 ? '+' : ''}${delta}`} unit=" pts"
              hint="Since first interview" tone={delta >= 0 ? 'success' : 'danger'}
            />
            <StatCard icon={BarChart3} label="Sessions" value={h.length} hint="Completed interviews" tone="accent" />
          </section>

          <Card>
            <div className="card-head">
              <div>
                <h3>Score breakdown over time</h3>
                <p className="sub small muted">Three dimensions tracked per session</p>
              </div>
            </div>
            <div className="chart-box" style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={h} margin={{ top: 8, right: 10, left: -22, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tickFormatter={(v) => String(v).slice(5)} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 100]} tickLine={false} axisLine={false} width={44} />
                  <Tooltip content={<PerfTip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" name="Overall" dataKey="score" stroke="var(--brand)" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" name="Technical" dataKey="tech" stroke="var(--success)" strokeWidth={2} dot={{ r: 2.5 }} />
                  <Line type="monotone" name="Communication" dataKey="comm" stroke="var(--accent)" strokeWidth={2} dot={{ r: 2.5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <div className="card-head">
              <div>
                <h3>Session history</h3>
                <p className="sub small muted">Every completed interview</p>
              </div>
            </div>
            {h.map((x) => (
              <div className="list-row" key={x.id}>
                <span className="lr-ico"><CalendarDays size={16} /></span>
                <div className="lr-main">
                  <div className="lr-title">{x.role}</div>
                  <div className="lr-sub">{fmtDate(x.date)} · Tech {x.tech}% · Comm {x.comm}%</div>
                </div>
                <Badge tone={scoreTone(x.score)}>{x.score}%</Badge>
                <Link to={`/app/report/${x.id}`} className="btn ghost sm">Report</Link>
              </div>
            ))}
          </Card>
        </>
      )}
    </div>
  );
}
/* --------------------------------------------------------------- ADMIN */
export function Admin() {
  const [a, setA] = useState(null);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    api.get('/api/admin/analytics')
      .then((r) => setA(r.data))
      .catch(() => setDenied(true));
  }, []);

  if (denied) {
    return (
      <div className="page-wrap">
        <Alert tone="err" title="Administrator access required.">
          Log in with an administrator account to view this page.
        </Alert>
      </div>
    );
  }

  if (!a) return <div className="page-wrap"><Card><Skeleton tall lines={4} /></Card></div>;

  return (
    <div className="page-wrap stack-lg">
      <PageHeader
        icon={Shield}
        eyebrow="Administration"
        title="Admin console"
        subtitle="Platform-wide usage and recent interview activity."
        actions={<Badge tone="brand">Restricted area</Badge>}
      />

      <section className="stat-grid">
        <StatCard icon={Users} label="Users" value={a.users} hint="Registered accounts" />
        <StatCard icon={BarChart3} label="Interviews" value={a.interviews} hint="Total conducted" tone="accent" />
        <StatCard icon={Trophy} label="Average" value={a.avg} unit="%" hint="Across all users" tone="success" />
      </section>

      <Card>
        <div className="card-head">
          <div>
            <h3>Recent platform interviews</h3>
            <p className="sub small muted">Most recent sessions across all users</p>
          </div>
        </div>
        {(a.recent || []).length === 0 ? (
          <EmptyState icon={BarChart3} title="No interviews yet" message="Platform activity will appear here." />
        ) : a.recent.map((i) => (
          <div className="list-row" key={i.id}>
            <span className="lr-ico"><FileText size={16} /></span>
            <div className="lr-main">
              <div className="lr-title">{i.jobRole}</div>
              <div className="lr-sub">{fmtDate(i.createdAt)} · {i.difficulty}</div>
            </div>
            <Badge tone={scoreTone(i.overallScore)}>{i.overallScore}%</Badge>
          </div>
        ))}
      </Card>
    </div>
  );
}