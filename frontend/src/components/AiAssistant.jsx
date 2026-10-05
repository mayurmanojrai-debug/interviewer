import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Bot, Sparkles, Send, X, User, RotateCcw } from 'lucide-react';
import api from '../services/api.js';

const KEY = 'iq_ai';
const GREETING = "Hi! I'm your InterviewIQ AI assistant. Ask me about your scores, skill gaps, what to improve, or anything about your interview preparation.";

/** Quick prompts tailored to the screen the user is currently on. */
const SUGGESTIONS = {
  '/app': ['Am I interview ready?', 'What should I improve first?', 'Analyse my last interview'],
  '/app/setup': ['Which role should I practise?', 'How many questions should I take?'],
  '/app/live': ['How should I structure an answer?', 'What makes an answer score well?'],
  '/app/skills': ['What is my weakest skill?', 'How do I close my skill gaps?'],
  '/app/roadmap': ['What should I do this week?', 'How long until I am ready?'],
  '/app/history': ['Which interview was my best?', 'How am I improving?'],
  '/app/practice': ['What should I practise today?'],
  '/app/resume': ['How do I improve my resume?'],
  '/app/analytics': ['Am I improving over time?'],
  '/app/copilot': ['Show my weaknesses', 'Create a 7-day plan'],
};
const DEFAULT_SUGGESTIONS = ['Am I interview ready?', 'What should I improve?', 'Create a 7-day plan'];

function load() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(KEY));
    if (Array.isArray(saved) && saved.length) return saved;
  } catch { /* ignore */ }
  return [{ me: false, text: GREETING }];
}

export default function AiAssistant() {
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState(load);
  const [inp, setInp] = useState('');
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  const suggestions = SUGGESTIONS[loc.pathname] || DEFAULT_SUGGESTIONS;

  // Keep the conversation while navigating between screens.
  useEffect(() => {
    try { sessionStorage.setItem(KEY, JSON.stringify(msgs)); } catch { /* ignore */ }
  }, [msgs]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (open) bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, busy, open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && open) setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const ask = useCallback(async (preset) => {
    const text = (preset || inp).trim();
    if (!text || busy) return;
    setMsgs((m) => [...m, { me: true, text }]);
    setInp('');
    setBusy(true);
    try {
      const r = await api.post('/api/copilot/chat', { message: text });
      setMsgs((m) => [...m, { me: false, text: r.data.reply }]);
    } catch {
      setMsgs((m) => [...m, { me: false, text: "I can't reach the assistant service right now. Please make sure the API is running on port 8080." }]);
    } finally {
      setBusy(false);
    }
  }, [inp, busy]);

  const reset = () => {
    setMsgs([{ me: false, text: GREETING }]);
    setOpen(false);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(); }
  };
return (
    <>
      {/* Launcher */}
      <button
        className={`ai-fab${open ? ' is-open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="ai-assistant-panel"
        aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}
        title="AI assistant"
      >
        {open ? <X size={24} /> : <Bot size={25} />}
        {!open && <span className="ai-fab-dot" aria-hidden="true" />}
      </button>

      {/* Panel */}
      {open && (
        <section className="ai-panel" id="ai-assistant-panel" role="dialog" aria-label="AI assistant">
          <header className="ai-head">
            <span className="ai-avatar"><Sparkles size={18} /></span>
            <div className="ai-head-text">
              <h3>AI Assistant</h3>
              <span className="ai-status"><i /> Online · knows your data</span>
            </div>
            <button className="icon-btn sm" onClick={reset} aria-label="Start a new conversation" title="New conversation">
              <RotateCcw size={16} />
            </button>
          </header>

          <div className="ai-body" ref={bodyRef}>
            {msgs.map((m, i) => (
              <div className={`msg${m.me ? ' me' : ''}`} key={i}>
                <span className="m-avatar">{m.me ? <User size={15} /> : <Bot size={15} />}</span>
                <div className="bubble">{m.text}</div>
              </div>
            ))}
            {busy && (
              <div className="msg">
                <span className="m-avatar"><Bot size={15} /></span>
                <div className="bubble"><span className="typing" aria-label="Assistant is typing"><i /><i /><i /></span></div>
              </div>
            )}
          </div>

          <div className="ai-foot">
            <div className="ai-suggest">
              {suggestions.map((s) => (
                <button key={s} className="chip" onClick={() => ask(s)} disabled={busy}>{s}</button>
              ))}
            </div>
            <div className="chat-input" style={{ marginTop: 10 }}>
              <input
                ref={inputRef}
                type="text"
                value={inp}
                onChange={(e) => setInp(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask your assistant…"
                aria-label="Message the AI assistant"
              />
              <button className="btn primary" onClick={() => ask()} disabled={busy || !inp.trim()} aria-label="Send message">
                <Send size={16} />
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}