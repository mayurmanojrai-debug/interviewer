const fs=require('fs'),p=require('path');
const R='c:/Users/raima/OneDrive/Desktop/haikyu/frontend';
const W=(f,c)=>{fs.mkdirSync(p.dirname(p.join(R,f)),{recursive:true});fs.writeFileSync(p.join(R,f),c);console.log('wrote',f);};
W('src/pages/Dashboard.jsx',[
"import { useEffect, useState } from 'react';","import { Link } from 'react-router-dom';",
"import { Flame, PlayCircle, Trophy, Target } from 'lucide-react';","import api from '../services/api.js';","import { useAuth } from '../context/AuthContext.jsx';",
"export default function Dashboard(){","const{user}=useAuth();const[d,setD]=useState(null);const[err,setErr]=useState('');",
"useEffect(()=>{api.get('/api/analytics/dashboard').then((r)=>setD(r.data)).catch(()=>setErr('Could not load dashboard.'));},[]);",
"if(err)return<div className='glass pad'><h3>{err}</h3><p className='muted'>Is the API running on port 8080?</p></div>;",
"if(!d)return<div className='glass pad'><div className='skel big'/><div className='skel'/><div className='skel'/></div>;",
"const hour=new Date().getHours();const greet=hour<12?'Good morning':hour<17?'Good afternoon':'Good evening';",
"return(<div className='dash'>",
"<div className='hero-bar glass'><div><h2>{greet}, {(user?.name||'Candidate').split(' ')[0]}</h2><p className='muted'>Ready for your next interview?</p></div><Link to='/app/setup' className='btn primary'><PlayCircle size={18}/> Start AI Interview</Link></div>",
"<div className='stat-grid'>",
"<div className='glass stat ring'><div className='ring-num'>{d.readiness||0}%</div><span>Readiness Score</span><small>{(d.readiness||0)>=80?'Interview Ready':(d.readiness||0)>=60?'Almost Ready':'Keep Practicing'}</small></div>",
"<div className='glass stat'><Flame size={20}/><b>{d.streak||0} Days</b><span>Interview Streak</span></div>",
"<div className='glass stat'><Trophy size={20}/><b>{d.completed||0}</b><span>Interviews Done</span></div>",
"<div className='glass stat'><Target size={20}/><b>{d.avg||0}%</b><span>Average Score</span></div></div>",
"<div className='grid2'>",
"<div className='glass pad'><h3>Score Trend</h3>{(d.trend||[]).length===0?<p className='muted'>No interviews yet. <Link to='/app/setup'>Start your first interview</Link>.</p>:<div className='trend'>{d.trend.map((t,i)=>(<div key={i} className='trend-row'><span>{t.date}</span><div className='bar'><i style={{width:t.score+'%'}}/></div><b>{t.score}%</b></div>))}</div>}</div>",
"<div className='glass pad'><h3>Skill Snapshot</h3>{(d.skills||[]).slice(0,5).map((s)=>(<div key={s.skill} className='trend-row'><span>{s.skill}</span><div className='bar'><i style={{width:s.score+'%'}}/></div><b>{s.score}%</b></div>))}<Link to='/app/skills' className='btn ghost sm top8'>View Skill Intelligence</Link></div></div>",
"<div className='grid2'>",
"<div className='glass pad'><h3>Recent Interviews</h3>{(d.recent||[]).length===0?<p className='muted'>Nothing here yet.</p>:(d.recent||[]).map((r)=>(<div key={r.id} className='list-row'><span>{r.jobRole}</span><b>{r.overallScore}%</b><Link to={'/app/report/'+r.id} className='btn ghost sm'>Report</Link></div>))}</div>",
"<div className='glass pad'><h3>Achievements</h3>{(d.achievements||[]).length===0?<p className='muted'>Complete an interview to earn badges.</p>:(d.achievements||[]).map((a,i)=>(<div key={i} className='list-row'><span>{a.achievementName}</span><small>{a.description}</small></div>))}</div></div>",
"</div>);}"
].join('\n'));
