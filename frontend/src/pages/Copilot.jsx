import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles } from 'lucide-react';
import api from '../services/api.js';
import { Card, PageHeader, Badge } from '../components/UI.jsx';

const QUICK = [
  'Analyse my performance',
  'What are my weaknesses?',
  'Create a 7-day plan',
  'Am I interview ready?',
  'Give me 5 practice questions',
];

const GREETING = 'Hi! I am your InterviewIQ Career Copilot. Ask me about your scores, skill gaps, study plan or what to practise next.';

export default function Copilot() {
  const [msgs, setMsgs] = useState([{ me: false, text: GREETING }]);
  const [inp, setInp] = useState('');
  const [busy, setBusy] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [msgs, busy]);

  const ask = async (preset) => {
    const q = (preset || inp).trim();
    if (!q || busy) return;
    setMsgs((m) => [...m, { me: true, text: q }]);
    setInp('');
    setBusy(true);
    try {
      const r = await api.post('/api/copilot/chat', { message: q });
      setMsgs((m) => [...m, { me: false, text: r.data.reply }]);
    } catch {
      setMsgs((m) => [...m, { me: false, text: 'The copilot is unavailable right now. Please make sure the API is running on port 8080.' }]);
    } finally {
      setBusy(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(); }
  };

  return (
    <div className="page-wrap">
      <PageHeader
        icon={Bot}
        eyebrow="AI Career Copilot"
        title="Ask about your preparation"
        subtitle="Every answer is grounded in your real interview history and skill scores."
        actions={<Badge tone="brand"><Sparkles size={12} /> Context aware</Badge>}
      />

      <div className="chat-layout">
        <Card>
          <div className="chat" role="log" aria-live="polite">
            {msgs.map((m, i) => (
              <div className={`msg${m.me ? ' me' : ''}`} key={i}>
                <span className="m-avatar">{m.me ? <User size={16} /> : <Bot size={16} />}</span>
                <div>
                  <div className="bubble">{m.text}</div>
                </div>
              </div>
            ))}
            {busy && (
              <div className="msg">
                <span className="m-avatar"><Bot size={16} /></span>
                <div className="bubble"><span className="typing" aria-label="Copilot is typing"><i /><i /><i /></span></div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="chip-row mt-3">
            {QUICK.map((q) => (
              <button key={q} className="chip" onClick={() => ask(q)} disabled={busy}>{q}</button>
            ))}
          </div>

          <div className="chat-input">
            <textarea
              rows={1}
              value={inp}
              onChange={(e) => setInp(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask: What should I improve before my next interview?"
              aria-label="Message the copilot"
            />
            <button className="btn primary" onClick={() => ask()} disabled={busy || !inp.trim()} aria-label="Send message">
              <Send size={17} />
            </button>
          </div>
          <p className="tiny subtle mt-2" style={{ marginBottom: 0 }}>
            Press Enter to send · Shift + Enter for a new line
          </p>
        </Card>

        <Card className="copilot-side">
          <div className="card-head">
            <div>
              <h3>Suggested topics</h3>
              <p className="sub small muted">Tap to ask instantly</p>
            </div>
          </div>
          <div className="stack-sm">
            {QUICK.map((q) => (
              <button key={q} className="btn ghost sm block" onClick={() => ask(q)} disabled={busy} style={{ justifyContent: 'flex-start', textAlign: 'left' }}>
                {q}
              </button>
            ))}
          </div>
          <hr className="divider" />
          <p className="small muted" style={{ margin: 0 }}>
            The copilot uses your completed interviews, skill scores and roadmap — it does not guess.
          </p>
        </Card>
      </div>
    </div>
  );
}