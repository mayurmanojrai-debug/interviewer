import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, History as HistoryIcon, FileText, PlayCircle } from 'lucide-react';
import api from '../services/api.js';
import { Card, PageHeader, Badge, EmptyState, Skeleton, Alert, scoreTone, fmtDate } from '../components/UI.jsx';

const FILTERS = ['All', 'Ready', 'Needs work'];

export default function History() {
  const [list, setList] = useState(null);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('All');
  const [err, setErr] = useState('');

  useEffect(() => {
    api.get('/api/interviews')
      .then((r) => setList(r.data))
      .catch((e) => setErr(e.response?.data?.message || 'Could not load interview history.'));
  }, []);

  const rows = useMemo(() => {
    if (!list) return [];
    return list.filter((i) => {
      const matchesQ = !q
        || (i.jobRole || '').toLowerCase().includes(q.toLowerCase())
        || (i.difficulty || '').toLowerCase().includes(q.toLowerCase())
        || (i.interviewType || '').toLowerCase().includes(q.toLowerCase());
      const s = i.overallScore;
      const matchesF = filter === 'All'
        || (filter === 'Ready' && s >= 80)
        || (filter === 'Needs work' && s < 80);
      return matchesQ && matchesF;
    });
  }, [list, q, filter]);

  const best = list && list.length ? Math.max(...list.map((i) => i.overallScore)) : 0;
  const avg = list && list.length ? Math.round(list.reduce((a, i) => a + i.overallScore, 0) / list.length) : 0;

  return (
    <div className="page-wrap">
      <PageHeader
        icon={HistoryIcon}
        eyebrow="History"
        title="Interview history"
        subtitle="Every session you have run, with a link to its full report."
        actions={list && list.length ? (
          <>
            <Badge tone="success">Best {best}%</Badge>
            <Badge tone="brand">Average {avg}%</Badge>
          </>
        ) : null}
      />

      {err && <Alert tone="err">{err}</Alert>}

      {!list ? (
        <Card><Skeleton tall lines={5} /></Card>
      ) : list.length === 0 ? (
        <Card>
          <EmptyState
            icon={HistoryIcon}
            title="No interviews yet"
            message="Once you complete your first mock interview it will appear here with a full report."
            action={<Link to="/app/setup" className="btn primary sm mt-2"><PlayCircle size={15} /> Start your first interview</Link>}
          />
        </Card>
      ) : (
        <>
          <div className="hist-filters">
            <div className="search-wrap">
              <Search size={16} />
              <input
                type="search"
                placeholder="Search by role, difficulty or type…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Search interviews"
              />
            </div>
            <div className="chip-row">
              {FILTERS.map((f) => (
                <button
                  key={f} className="chip" aria-pressed={filter === f} onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <Card>
            {rows.length === 0 ? (
              <EmptyState
                title="No matching interviews"
                message="Try a different search term or filter."
                action={<button className="btn ghost sm mt-2" onClick={() => { setQ(''); setFilter('All'); }}>Clear filters</button>}
              />
            ) : rows.map((i) => (
              <div className="hist-row" key={i.id}>
                <span className="lr-ico"><FileText size={16} /></span>
                <div>
                  <div className="h-role">{i.jobRole}</div>
                  <div className="h-date">{fmtDate(i.createdAt)}</div>
                </div>
                <div className="chip-row">
                  <Badge>{i.difficulty}</Badge>
                  <Badge>{i.interviewType}</Badge>
                  <Badge>{i.experienceLevel}</Badge>
                </div>
                <span className="h-score-cell">
                  <Badge tone={scoreTone(i.overallScore)}>{i.overallScore}%</Badge>
                </span>
                <Link to={`/app/report/${i.id}`} className="btn ghost sm">Report</Link>
              </div>
            ))}
          </Card>
        </>
      )}
    </div>
  );
}