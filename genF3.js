const fs=require('fs'),path=require('path');
const R='c:/Users/raima/OneDrive/Desktop/haikyu/frontend';
const W=(f,c)=>{const p=path.join(R,f);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,c);console.log('wrote',f);};
W('src/pages/Landing.jsx', [
"import { Link } from 'react-router-dom';",
"import { Sparkles, Brain, Target, Mic, Map, Bot, ArrowRight, CheckCircle2 } from 'lucide-react';",
"export default function Landing() {",
"  const feats = [[Brain,'AI Answer Evaluation','Scores relevance, accuracy, completeness and clarity.'],",
"    [Target,'Adaptive Difficulty','Harder or easier questions based on live performance.'],",
"    [Mic,'Voice + Text Mode','Speak with Web Speech API or type your answer.'],",
"    [Map,'Roadmap + 7-Day Plan','Skill gaps become a personalized improvement plan.'],",
"    [Bot,'Career Copilot','Ask why you scored 72% and what to improve.'],",
"    [CheckCircle2,'Recruiter Report','Downloadable readiness report with status.']];",
"  return (<div className='landing'>",
"    <nav className='land-nav'><div className='brand'><span className='brand-mark'><Sparkles size={18}/></span>INTERVIEWIQ</div>",
"      <div className='land-links'><Link to='/login' className='btn ghost sm'>Login</Link><Link to='/register' className='btn primary sm'>Start AI Interview</Link></div></nav>",
"    <header className='hero'><div className='hero-copy'>",
"      <div className='pill'>AI-Powered Adaptive Mock Interviews</div>",
"      <h1>Practice Smarter.<br/>Interview Better.<br/><span className='grad'>Get Hired.</span></h1>",
"      <p className='sub'>AI mock interviews that analyze answers, find skill gaps, adapt difficulty, and build your roadmap.</p>",
"      <div className='hero-cta'><Link to='/register' className='btn primary lg'>Start AI Interview <ArrowRight size={18}/></Link>",
"        <Link to='/login' className='btn ghost lg'>Explore Platform</Link></div>",
"      <div className='demo-box'>Demo login: <b>demo@interviewiq.com</b> / <b>Demo@123</b></div></div>",
"      <div className='hero-visual glass'><div className='hv-head'>Interview Readiness</div>",
"        <div className='hv-score'>82<span>%</span></div><div className='hv-status'>INTERMEDIATE - INTERVIEW READY</div>",
"        <div className='hv-note'>AI: strong fundamentals - improve system design + behavioral answers next.</div></div></header>",
"    <section className='feat-grid'>{feats.map(([I,t,d]) => (<div key={t} className='glass feat'><I size={22}/><h3>{t}</h3><p>{d}</p></div>))}</section>",
"    <section className='cta-band glass'><h2>Ready to become interview-ready?</h2><Link to='/register' className='btn primary lg'>Start Your First AI Interview</Link></section>",
"    <footer className='land-foot'><span>INTERVIEWIQ - PBL HackExpo PS-15</span><span>Product - Features - About - GitHub - Contact</span></footer>",
"  </div>);",
"}"
].join('\n'));
