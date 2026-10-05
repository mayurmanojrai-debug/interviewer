import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Flame, PlayCircle, Trophy, Target, Award, ArrowRight, FileText, Activity } from 'lucide-react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Card, StatCard, Ring, Meter, EmptyState, Alert, Skeleton, scoreTone, greeting, fmtDate,
} from '../components/UI.jsx';

function ChartTip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="chart-tip">
      <div className="ct-label">{fmtDate(label)}</div>
      <div className="ct-val">{payload[0].value}% overall score</div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [d, setD] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get('/api/analytics/dashboard').then((r) => setD(r.data)).catch(() => setErr('Could not load your dashboard.'));
  }, []);

  if (err) {
    return (
      <div className="page-wrap">
        <Alert tone="err" title="Dashboard unavailable.">{err} Make sure the API is running on port 8080.</Alert>
      </div>
    );
  }

  if (!d) {
    return (
      <div className="page-wrap stack">
        <Card><Skeleton tall lines={2} /></Card>
        <div className="grid-4">
          {[0, 1, 2, 3].map((i) => <Card key={i}><Skeleton lines={2} /></Card>)}
        </div>
        <Card><Skeleton tall lines={4} /></Card>
      </div>
    );
  }

  const readiness = d.readiness || 0;
  const firstName = (user?.name || 'Candidate').split(' ')[0];
  const status = readiness >= 80 ? 'Interview ready' : readiness >= 60 ? 'Almost there' : 'Keep practising';
  const tone = scoreTone(readiness);
  const trend = d.trend || [];
  const skills = d.skills || [];
  const recent = d.recent || [];
  const badges = d.achievements || [];
return (
    <div className="page-wrap stack-lg">
      {/* Hero ------------------------------------------------------- */}
      <section className="dash-hero">
        <div>
          <span className="eyebrow"><Activity size={14} /> Career readiness</span>
          <h1>{greeting()}, {firstName}</h1>
          <p>
            {recent.length === 0
              ? 'You have not run an interview yet — your first one takes about five minutes.'
              : `You have completed ${d.completed || 0} interview${d.completed === 1 ? '' : 's'} and you are currently ${status.toLowerCase()}.`}
          </p>
          <div className="row mt-3">
            <Link to="/app/setup" className="btn primary"><PlayCircle size={17} /> Start AI Interview</Link>
            <Link to="/app/copilot" className="btn ghost">Ask the Copilot</Link>
          </div>
        </div>
        <div className="dh-ring">
          <Ring value={readiness} size={146} stroke={13} tone={tone} sub={status} />
        </div>
      </section>

      {/* Stats ------------------------------------------------------ */}
      <section className="stat-grid">
        <StatCard icon={Target} label="Readiness" value={readiness} unit="%" hint={status} />
        <StatCard icon={Flame} label="Streak" value={d.streak || 0} unit=" days" hint="Keep the momentum going" tone="warn" />
        <StatCard icon={Trophy} label="Interviews" value={d.completed || 0} hint="Completed so far" tone="accent" />
        <StatCard icon={Award} label="Average" value={d.avg || 0} unit="%" hint="Across all sessions" tone="success" />
      </section>

      {/* Chart + skills --------------------------------------------- */}
      <section className="grid-sidebar">
        <Card>
          <div className="card-head">
            <div>
              <h3>Score trend</h3>
              <p className="sub small muted">Overall score for each completed interview</p>
            </div>
            <Link to="/app/analytics" className="btn ghost sm">Full analytics <ArrowRight size={14} /></Link>
          </div>
          {trend.length === 0 ? (
            <EmptyState
              title="No score history yet"
              message="Complete your first mock interview and your performance trend will appear here."
              action={<Link to="/app/setup" className="btn primary sm mt-2"><PlayCircle size={15} /> Start first interview</Link>}
            />
          ) : (
            <>
              <div className="chart-box">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend} margin={{ top: 6, right: 6, left: -22, bottom: 0 }}>
                    <defs>
                      <linearGradient id="iqArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" tickFormatter={(v) => String(v).slice(5)} tickLine={false} axisLine={false} />
                    <YAxis domain={[0, 100]} tickLine={false} axisLine={false} width={44} />
                    <Tooltip content={<ChartTip />} cursor={{ stroke: 'var(--border-strong)', strokeWidth: 1 }} />
                    <Area
                      type="monotone" dataKey="score" stroke="var(--brand)" strokeWidth={2.5}
                      fill="url(#iqArea)" dot={{ r: 3.5, fill: 'var(--brand)', strokeWidth: 0 }} activeDot={{ r: 6 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-legend mt-2">
                <span><i style={{ background: 'var(--brand)' }} /> Overall score (%)</span>
              </div>
            </>
          )}
        </Card>

        <Card>
          <div className="card-head">
            <div>
              <h3>Skill snapshot</h3>
              <p className="sub small muted">Your weakest areas first</p>
            </div>
            <Link to="/app/skills" className="btn quiet sm">All skills</Link>
          </div>
          {skills.length === 0 ? (
            <EmptyState title="No skills tracked" message="Finish an interview to generate your skill profile." />
          ) : (
            <div className="stack-sm">
              {skills.slice().sort((a, b) => a.score - b.score).slice(0, 5).map((s) => (
                <Meter key={s.skill} label={s.skill} value={s.score} />
              ))}
            </div>
          )}
        </Card>
      </section>
{/* Recent + achievements -------------------------------------- */}
      <section className="grid-2">
        <Card>
          <div className="card-head">
            <div>
              <h3>Recent interviews</h3>
              <p className="sub small muted">Your last five sessions</p>
            </div>
            <Link to="/app/history" className="btn quiet sm">View all</Link>
          </div>
          {recent.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="Nothing here yet"
              message="Run a mock interview and your results will show up here."
              action={<Link to="/app/setup" className="btn primary sm mt-2"><PlayCircle size={15} /> Start interview</Link>}
            />
          ) : recent.map((r) => (
            <div className="list-row" key={r.id}>
              <span className="lr-ico"><FileText size={16} /></span>
              <div className="lr-main">
                <div className="lr-title">{r.jobRole}</div>
                <div className="lr-sub">{fmtDate(r.createdAt)} · {r.difficulty}</div>
              </div>
              <span className="lr-score">{r.overallScore}%</span>
              <Link to={`/app/report/${r.id}`} className="btn ghost sm">Report</Link>
            </div>
          ))}
        </Card>

        <Card>
          <div className="card-head">
            <div>
              <h3>Achievements</h3>
              <p className="sub small muted">Badges you have unlocked</p>
            </div>
          </div>
          {badges.length === 0 ? (
            <EmptyState
              icon={Trophy}
              title="No badges yet"
              message="Complete an interview to unlock your first achievement."
            />
          ) : badges.map((a, i) => (
            <div className="list-row" key={i}>
              <span className="lr-ico" style={{ background: 'var(--success-soft)', color: 'var(--success)' }}>
                <Trophy size={16} />
              </span>
              <div className="lr-main">
                <div className="lr-title">{a.achievementName}</div>
                <div className="lr-sub">{a.description}</div>
              </div>
            </div>
          ))}
        </Card>
      </section>
    </div>
  );
}