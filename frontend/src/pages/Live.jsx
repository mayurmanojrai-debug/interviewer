import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Send, SkipForward, Flag, Timer, Lightbulb, TrendingUp } from 'lucide-react';
import api from '../services/api.js';
import { Card, Badge, Alert, Meter, scoreTone } from '../components/UI.jsx';

/** Difficulty is not a score, so map it to a badge tone directly. */
function diffTone(d) {
  return { Easy: 'success', Medium: 'brand', Hard: 'warn' }[d] || 'brand';
}

export default function Live() {
  const nav = useNavigate();
  const [data, setData] = useState(() => { try { return JSON.parse(sessionStorage.getItem('iq_live')); } catch { return null; } });
  const [idx, setIdx] = useState(0);
  const [ans, setAns] = useState('');
  const [ev, setEv] = useState(null);
  const [busy, setBusy] = useState(false);
  const [sec, setSec] = useState(0);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState('');
  const rec = useRef(null);

  useEffect(() => { const t = setInterval(() => setSec((s) => s + 1), 1000); return () => clearInterval(t); }, []);
  useEffect(() => { if (!data) nav('/app/setup'); }, [data, nav]);

  if (!data) return null;

  const qs = data.questions;
  const q = qs[idx];
  const mm = String(Math.floor(sec / 60)).padStart(2, '0');
  const ss = String(sec % 60).padStart(2, '0');
  const total = Math.min(qs.length, data.interview.totalQuestions);

  const toggleVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setError('Voice input is not supported in this browser. Please type your answer instead.'); return; }
    if (listening) { rec.current && rec.current.stop(); setListening(false); return; }
    const r = new SR();
    rec.current = r;
    r.lang = 'en-US';
    r.interimResults = false;
    r.onresult = (e) => setAns((a) => `${a ? `${a} ` : ''}${e.results[0][0].transcript}`);
    r.onend = () => setListening(false);
    r.onerror = () => { setListening(false); setError('Could not access the microphone. Please type your answer instead.'); };
    r.start();
    setListening(true);
  };

  const submit = async (skip) => {
    if (!skip && ans.trim().length < 3) { setError('Please write a short answer before submitting.'); return; }
    setError('');
    setBusy(true);
    try {
      const r = await api.post(`/api/interviews/${data.interview.id}/answers`, {
        questionId: q.id,
        questionText: q.questionText,
        answerText: skip ? '(skipped)' : ans,
        difficulty: q.difficulty,
      });
      setEv({ ...r.data, skipped: skip });
    } catch (e) {
      setError(e.response?.data?.message || 'Submit failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const next = () => {
    const nq = ev && ev.nextQuestion && ev.nextQuestion.id ? ev.nextQuestion : null;
    if (nq && !qs.some((x) => x.id === nq.id)) qs.push(nq);
    setEv(null);
    setAns('');
    if (idx + 1 >= total) finish();
    else setIdx(idx + 1);
  };

  const finish = async () => {
    try {
      await api.post(`/api/interviews/${data.interview.id}/complete`);
      nav(`/app/report/${data.interview.id}`);
    } catch {
      setError('Could not finalise the interview. Please try again.');
    }
  };

  const lastScore = ev?.evaluation?.score;
  const dims = ev?.evaluation
    ? [
      ['Technical', ev.evaluation.technical],
      ['Relevance', ev.evaluation.relevance],
      ['Completeness', ev.evaluation.completeness],
      ['Clarity', ev.evaluation.clarity],
    ]
    : [];
return (
    <div className="page-wrap">
      <div className="live-grid">
        {/* ------------------------------------------------------ Question */}
        <Card>
          <div className="live-top">
            <div>
              <span className="tiny subtle strong">QUESTION {idx + 1} OF {total}</span>
              <div className="bar lg" style={{ marginTop: 8, width: 220 }}>
                <i style={{ width: `${((idx + (ev ? 1 : 0)) / Math.max(1, total)) * 100}%` }} />
              </div>
            </div>
            <span className="live-timer"><Timer size={14} /> {mm}:{ss}</span>
          </div>

          <h2 className="q-text">{q.questionText}</h2>
          <div className="q-meta">
            <Badge tone="brand">{q.category}</Badge>
            <Badge tone={diffTone(q.difficulty)}>{q.difficulty}</Badge>
          </div>

          {error && <div className="mt-3"><Alert tone="err">{error}</Alert></div>}

          {!ev ? (
            <div className="mt-3">
              <textarea
                rows={8}
                placeholder="Type your answer — 4 to 6 sentences with a concrete example works best…"
                value={ans}
                onChange={(e) => setAns(e.target.value)}
              />
              <div className="row mt-3">
                <button className={`btn ghost mic-btn${listening ? ' live' : ''}`} onClick={toggleVoice}>
                  {listening ? <MicOff size={17} /> : <Mic size={17} />} {listening ? 'Stop listening' : 'Answer by voice'}
                </button>
                <button className="btn ghost" onClick={() => submit(true)} disabled={busy}>
                  <SkipForward size={17} /> Skip
                </button>
                <button className="btn primary" onClick={() => submit(false)} disabled={busy}>
                  <Send size={17} /> {busy ? 'Evaluating…' : 'Submit answer'}
                </button>
                <span className="spacer" />
                <button className="btn quiet" onClick={finish}><Flag size={16} /> End interview</button>
              </div>
            </div>
          ) : (
            <div className="eval-result mt-4">
              <div className="eval-head">
                <div>
                  <div className="eh-label">AI evaluation</div>
                  <div className="eh-score" style={{ color: `var(--${scoreTone(lastScore)})` }}>{lastScore}%</div>
                </div>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <div className="eval-chips">
                    {dims.map(([l, v]) => (
                      <Badge key={l} tone={scoreTone(v)}>{l} {v}%</Badge>
                    ))}
                  </div>
                </div>
              </div>

              <p className="qa-feedback">{ev.evaluation.feedback}</p>

              <div className="mt-3">
                <Alert tone="info" title={`Next difficulty: ${ev.nextDifficulty}.`}>
                  {ev.adaptiveReason}
                </Alert>
              </div>

              <div className="row mt-3">
                <button className="btn primary lg" onClick={next}>
                  {idx + 1 >= total ? 'Finish & view report' : 'Continue'}
                </button>
              </div>
            </div>
          )}
        </Card>

        {/* ----------------------------------------------------- Coach panel */}
        <Card className="coach-panel">
          <div className="card-head">
            <div>
              <h3>AI Interviewer</h3>
              <p className="sub small muted">Session telemetry</p>
            </div>
          </div>

          <div className="cp-row"><span>Current difficulty</span><b>{q.difficulty}</b></div>
          <div className="cp-row"><span>Progress</span><b>{idx + 1} / {total}</b></div>
          <div className="cp-row"><span>Role</span><b className="truncate">{data.interview.jobRole}</b></div>
          {ev && <div className="cp-row"><span>Last answer</span><b>{ev.evaluation.score}%</b></div>}

          <hr className="divider" />

          <div className="stack-sm">
            <div className="row" style={{ gap: 8, alignItems: 'flex-start' }}>
              <Lightbulb size={16} style={{ color: 'var(--brand)', flex: '0 0 auto', marginTop: 2 }} />
              <p className="small muted" style={{ margin: 0 }}>
                Structure every answer: <b>definition → how it works → real example → trade-off</b>.
              </p>
            </div>
            <div className="row" style={{ gap: 8, alignItems: 'flex-start' }}>
              <TrendingUp size={16} style={{ color: 'var(--brand)', flex: '0 0 auto', marginTop: 2 }} />
              <p className="small muted" style={{ margin: 0 }}>
                Longer answers score higher on completeness, but filler words reduce clarity.
              </p>
            </div>
          </div>

          {ev && (
            <div className="mt-3">
              <Meter label="Latest answer" value={lastScore} />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}