import { Link } from 'react-router-dom';
import {
  Sparkles, Brain, Target, Mic, Map, Bot, ArrowRight, CheckCircle2, ShieldCheck,
} from 'lucide-react';
import { Card, Ring, Badge } from '../components/UI.jsx';

const PREVIEW_BARS = [
  ['Technical depth', 84],
  ['Communication', 78],
  ['Problem solving', 74],
  ['System design', 61],
];

const FEATURES = [
  { icon: Brain, title: 'AI Answer Evaluation', body: 'Every answer is scored on relevance, accuracy, completeness and clarity — with specific, actionable feedback.' },
  { icon: Target, title: 'Adaptive Difficulty', body: 'Score well and the AI raises the bar. Struggle and it eases off. Every session is calibrated to you.' },
  { icon: Mic, title: 'Voice + Text Mode', body: 'Speak your answer with the Web Speech API, or type it out. Both paths are evaluated identically.' },
  { icon: Map, title: 'Roadmap + 7-Day Plan', body: 'Skill gaps automatically become a prioritised, day-by-day improvement plan you can follow.' },
  { icon: Bot, title: 'Career Copilot', body: 'Ask "why did I score 72%?" or "what should I fix first?" and get an answer grounded in your real data.' },
  { icon: CheckCircle2, title: 'Recruiter Report', body: 'A polished, printable readiness report with competency scores and a clear hiring recommendation.' },
];

const STEPS = [
  { title: 'Pick your setup', body: 'Choose role, experience level, interview type and how hard you want to be pushed.' },
  { title: 'Answer questions', body: 'Type or speak. The AI grades each answer the moment you submit it.' },
  { title: 'Watch it adapt', body: 'Difficulty shifts in real time based on how you are actually performing.' },
  { title: 'Get your plan', body: 'Finish with a full report, skill-gap analysis and a 7-day roadmap.' },
];

export default function Landing() {
  return (
    <div className="landing">
      <nav className="land-nav">
        <div className="brand">
          <span className="brand-mark"><Sparkles size={18} /></span>
          <span className="brand-name">Interview<em>IQ</em></span>
        </div>
        <div className="land-links">
          <Link to="/login" className="btn ghost sm">Log in</Link>
          <Link to="/register" className="btn primary sm">Get started</Link>
        </div>
      </nav>

      {/* ------------------------------------------------------------- HERO */}
      <header className="hero">
        <div>
          <span className="pill"><Sparkles size={14} /> AI-powered adaptive mock interviews</span>
          <h1>
            Practice smarter.<br />
            Interview better.<br />
            <span className="grad-text">Get hired.</span>
          </h1>
          <p className="sub">
            AI mock interviews that analyse every answer, find your skill gaps, adapt the
            difficulty in real time and turn the whole thing into a plan you can act on.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn primary lg">
              Start AI Interview <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn ghost lg">Explore the platform</Link>
          </div>
          <div className="demo-box">
            <ShieldCheck size={16} />
            <span>Demo account</span>
            <code>demo@interviewiq.com</code>
            <code>Demo@123</code>
          </div>
          <div className="trust-row">
            <div className="t-item"><b>8</b><span>Target roles</span></div>
            <div className="t-item"><b>4</b><span>Scored competencies</span></div>
            <div className="t-item"><b>Live</b><span>Difficulty adaptation</span></div>
            <div className="t-item"><b>7-day</b><span>Improvement plan</span></div>
          </div>
        </div>

        <div className="hero-preview">
          <span className="glow" aria-hidden="true" />
          <Card className="hp-card hoverable">
            <div className="hp-head">
              <div>
                <div className="tiny subtle strong">INTERVIEW READINESS</div>
                <div className="small muted">Sample candidate report</div>
              </div>
              <Badge tone="success"><CheckCircle2 size={12} /> Ready</Badge>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
              <Ring value={82} size={118} stroke={11} sub="Ready" />
              <div className="stack-sm" style={{ flex: 1, minWidth: 0 }}>
                {PREVIEW_BARS.map(([l, v]) => (
                  <div key={l} className="meter">
                    <div className="meter-top">
                      <span className="m-name">{l}</span>
                      <span className="m-val">{v}%</span>
                    </div>
                    <div className="bar"><i style={{ width: `${v}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
            <p className="hp-note">
              <b>AI insight:</b> strong fundamentals. Prioritise system design and
              STAR-structured behavioural answers next.
            </p>
          </Card>
        </div>
      </header>

      {/* --------------------------------------------------------- FEATURES */}
      <section className="stack-lg mt-4">
        <div className="section-head">
          <h2>Everything you need to walk in ready</h2>
          <p>One platform covering the full loop — practise, analyse, plan and prove.</p>
        </div>
        <div className="bento">
          {FEATURES.map((f) => (
            <Card key={f.title} className="feature-card hoverable">
              <span className="f-icon"><f.icon size={22} /></span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------ HOW IT WORKS */}
      <section className="stack-lg mt-4">
        <div className="section-head">
          <h2>How it works</h2>
          <p>From setup to signed-off offer in four steps.</p>
        </div>
        <div className="steps">
          {STEPS.map((s) => (
            <Card key={s.title} className="step">
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------ CTA BAND */}
      <section className="mt-4">
        <Card className="cta-band tint pad-lg">
          <h2>Ready to become interview-ready?</h2>
          <p>Create a free account and run your first adaptive mock in under two minutes.</p>
          <div className="row center">
            <Link to="/register" className="btn primary lg">
              Start your first AI interview <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn ghost lg">Use the demo account</Link>
          </div>
        </Card>
      </section>

      <footer className="land-foot">
        <span>© {new Date().getFullYear()} InterviewIQ — PBL HackExpo PS-15</span>
        <nav>
          <Link to="/register">Product</Link>
          <Link to="/login">Features</Link>
          <Link to="/login">About</Link>
          <Link to="/login">Contact</Link>
        </nav>
      </footer>
    </div>
  );
}