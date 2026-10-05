import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Printer, Bot, FlaskConical, History, CheckCircle2, AlertCircle, CalendarDays } from 'lucide-react';
import api from '../services/api.js';
import {
  Card, Ring, Meter, Badge, Skeleton, Alert, EmptyState, scoreTone, fmtDate,
} from '../components/UI.jsx';

const STATUS = {
  READY: { label: 'Interview Ready', tone: 'success', icon: CheckCircle2 },
  NEEDS_IMPROVEMENT: { label: 'Needs Improvement', tone: 'warn', icon: AlertCircle },
  NOT_READY: { label: 'Not Ready Yet', tone: 'danger', icon: AlertCircle },
};

const COMPETENCIES = [
  ['Technical depth', 'technicalScore'],
  ['Communication', 'communicationScore'],
  ['Problem solving', 'problemSolvingScore'],
  ['Confidence', 'confidenceScore'],
];

export default function Report() {
  const { id } = useParams();
  const [d, setD] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get(`/api/interviews/${id}`)
      .then((r) => setD(r.data))
      .catch((e) => setErr(e.response?.data?.message || 'Could not load this report.'));
  }, [id]);

  if (err) {
    return (
      <div className="page-wrap">
        <Alert tone="err" title="Report unavailable.">{err}</Alert>
      </div>
    );
  }

  if (!d) {
    return (
      <div className="page-wrap stack">
        <Card><Skeleton tall lines={2} /></Card>
        <Card><Skeleton tall lines={6} /></Card>
      </div>
    );
  }

  const iv = d.interview;
  const answers = d.answers || [];
  const st = STATUS[iv.overallScore >= 80 ? 'READY' : iv.overallScore >= 60 ? 'NEEDS_IMPROVEMENT' : 'NOT_READY'];
  const StatusIcon = st.icon;

  return (
    <div className="page-wrap stack-lg">
      {/* -------------------------------------------------------- Hero */}
      <Card className="report-hero">
        <Ring value={iv.overallScore} size={168} stroke={15} sub="Overall" />

        <div>
          <span className="eyebrow"><CheckCircle2 size={14} /> Interview complete</span>
          <h1 style={{ margin: '4px 0 6px' }}>{iv.jobRole}</h1>
          <p className="muted small" style={{ margin: 0 }}>
            {iv.experienceLevel} · {iv.interviewType} · {iv.difficulty}
          </p>
          <span className={`badge ${st.tone} rh-status`}><StatusIcon size={13} /> {st.label}</span>

          <div className="report-meta">
            <Badge><CalendarDays size={12} /> {fmtDate(iv.createdAt)}</Badge>
            <Badge>{answers.length} question{answers.length === 1 ? '' : 's'} answered</Badge>
            {iv.durationSeconds > 0 && (
              <Badge>{Math.round(iv.durationSeconds / 60)} min duration</Badge>
            )}
          </div>

          <div className="report-actions mt-3">
            <button className="btn primary" onClick={() => window.print()}><Printer size={16} /> Print / Save PDF</button>
            <Link to="/app/copilot" className="btn ghost"><Bot size={16} /> Ask AI Copilot</Link>
            <Link to="/app/practice" className="btn ghost"><FlaskConical size={16} /> Practise weak areas</Link>
            <Link to="/app/history" className="btn quiet"><History size={16} /> All interviews</Link>
          </div>
        </div>
      </Card>

      {/* -------------------------------------------------- Competencies */}
      <Card>
        <div className="card-head">
          <div>
            <h3>Competency breakdown</h3>
            <p className="sub small muted">How you performed across the four scored dimensions</p>
          </div>
        </div>
        <div className="grid-2">
          {COMPETENCIES.map(([label, key]) => (
            <Meter key={key} label={label} value={iv[key] || 0} />
          ))}
        </div>
      </Card>

      {/* --------------------------------------------- Question breakdown */}
      <Card>
        <div className="card-head">
          <div>
            <h3>Question-by-question evaluation</h3>
            <p className="sub small muted">Every answer, its score and the AI feedback</p>
          </div>
        </div>
        {answers.length === 0 ? (
          <EmptyState title="No answers recorded" message="This interview has no stored answers." />
        ) : answers.map((a, i) => (
          <div className="qa-card card" key={a.id}>
            <div className="qa-head">
              <span className="qa-num">Q{i + 1}</span>
              <p className="qa-q">{a.questionText}</p>
            </div>
            <div className="qa-scores">
              <Badge tone={scoreTone(a.score)}>Overall {a.score}%</Badge>
              <Badge tone={scoreTone(a.technicalScore)}>Technical {a.technicalScore}%</Badge>
              <Badge tone={scoreTone(a.relevanceScore)}>Relevance {a.relevanceScore}%</Badge>
              <Badge tone={scoreTone(a.completenessScore)}>Complete {a.completenessScore}%</Badge>
              <Badge tone={scoreTone(a.clarityScore)}>Clarity {a.clarityScore}%</Badge>
              {a.difficultyAtTime && <Badge>{a.difficultyAtTime}</Badge>}
            </div>
            <div className="qa-feedback">{a.feedback}</div>
            {a.strengths && (
              <p className="small muted mt-2"><b className="strong">Strength:</b> {a.strengths}</p>
            )}
            {a.weaknesses && (
              <p className="small muted"><b className="strong">Improve:</b> {a.weaknesses}</p>
            )}
          </div>
        ))}
      </Card>
    </div>
  );
}