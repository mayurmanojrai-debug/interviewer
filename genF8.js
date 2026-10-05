const fs=require('fs'),p=require('path');
const R='c:/Users/raima/OneDrive/Desktop/haikyu/frontend';
const W=(f,c)=>{fs.mkdirSync(p.dirname(p.join(R,f)),{recursive:true});fs.writeFileSync(p.join(R,f),c);console.log('wrote',f);};
W('src/pages/More.jsx',[
"import { useEffect, useState } from 'react';","import { Link } from 'react-router-dom';","import api from '../services/api.js';",
"export function Practice(){","const[start,setStart]=useState(null);const[busy,setBusy]=useState(false);",
"const cards=[['Quick Question','One random question','Full Stack Developer'],['Weakness Practice','Targets your top gap','Full Stack Developer'],['Rapid Fire','5 fast questions','Java Developer'],['Behavioral Practice','STAR answers','Full Stack Developer']];",
"const go=async(role,n)=>{setBusy(true);try{const r=await api.post('/api/interviews',{jobRole:role,totalQuestions:n||5,difficulty:'Adaptive AI',interviewType:'Mixed'});sessionStorage.setItem('iq_live',JSON.stringify(r.data));location.hash='#/app/live';}finally{setBusy(false);}};",
"return(<div className='glass pad'><h2>AI Practice Lab</h2><div className='feat-grid'>{cards.map(([t,d,role])=>(<div key={t} className='glass feat'><h3>{t}</h3><p>{d}</p><button className='btn primary sm' disabled={busy} onClick={()=>go(role,5)}>Start</button></div>))}</div></div>);}",
"export function Skills(){","const[g,setG]=useState(null);",
"useEffect(()=>{api.get('/api/skills/gaps').then((r)=>setG(r.data));},[]);",
"if(!g)return<div className='glass pad'>Loading skills...</div>;",
"return(<div className='glass pad'><h2>Skill Intelligence</h2><p className='muted'>Critical gap: <b>{g.topGap}</b></p>{(g.gaps||[]).map((x)=>(<div key={x.skill} className='trend-row'><span>{x.skill}</span><div className='bar'><i style={{width:x.score+'%'}}/></div><b>{x.score}%</b></div>))}</div>);}",
"export function Roadmap(){","const[r,setR]=useState([]);",
"useEffect(()=>{api.get('/api/roadmap').then((x)=>setR(x.data));},[]);",
"return(<div className='glass pad'><h2>My Career Roadmap</h2>{r.length===0?<p className='muted'>Complete an interview to generate your roadmap.</p>:r.map((s)=>(<div key={s.id} className='list-row'><span>{s.title}</span><b>{s.progress}%</b></div>))}<div className='glass feat top8'><h3>7-Day AI Improvement Plan</h3><p>Day 1 Java · Day 2 Spring Boot · Day 3 SQL · Day 4 REST APIs · Day 5 System Design · Day 6 Behavioral · Day 7 Full Mock</p></div></div>);}",
"export function Resume(){","const[txt,setTxt]=useState('Java Spring Boot React SQL REST. Built React + Spring Boot app with JWT and MySQL.');const[out,setOut]=useState(null);const[list,setList]=useState([]);",
"useEffect(()=>{api.get('/api/resume').then((r)=>setList(r.data));},[]);",
"const up=async()=>{const r=await api.post('/api/resume/upload',{text:txt,fileName:'resume.txt'});setOut(r.data);setList((l)=>[r.data.resume,...l]);};",
"return(<div className='glass pad'><h2>Resume Intelligence</h2><textarea rows='5' value={txt} onChange={(e)=>setTxt(e.target.value)}/><div className='top8'/><button className='btn primary' onClick={up}>Analyze Resume</button>",
"out&&<div className='alert info top8'>Resume strength: <b>{out.resume.resumeScore}/100</b><ul>{out.insights.map((i,x)=>(<li key={x}>{i}</li>))}</ul></div>}",
"<h3>Uploads</h3>{list.map((r)=>(<div key={r.id} className='list-row'><span>{r.fileName}</span><b>{r.resumeScore}/100</b></div>))}</div>);}",
"export function Analytics(){","const[h,setH]=useState([]);",
"useEffect(()=>{api.get('/api/analytics/performance').then((r)=>setH(r.data.history||[]));},[]);",
"return(<div className='glass pad'><h2>Performance Analytics</h2>{h.length===0?<p className='muted'>No data yet. <Link to='/app/setup'>Take an interview</Link>.</p>:h.map((x)=>(<div key={x.id} className='trend-row'><span>{x.date} - {x.role}</span><div className='bar'><i style={{width:x.score+'%'}}/></div><b>{x.score}%</b></div>))}</div>);}",
"export function Admin(){","const[a,setA]=useState(null);",
"useEffect(()=>{api.get('/api/admin/analytics').then((r)=>setA(r.data)).catch(()=>setA({error:true}));},[]);",
"if(!a)return<div className='glass pad'>Loading admin...</div>;",
"if(a.error)return<div className='glass pad'>Admin only. Login as admin@interviewiq.com / Admin@123.</div>;",
"return(<div className='glass pad'><h2>Admin Dashboard</h2><div className='stat-grid'><div className='glass stat'><b>{a.users}</b><span>Users</span></div><div className='glass stat'><b>{a.interviews}</b><span>Interviews</span></div><div className='glass stat'><b>{a.avg}%</b><span>Avg Score</span></div></div><h3>Recent interviews</h3>{(a.recent||[]).map((i)=>(<div key={i.id} className='list-row'><span>{i.jobRole}</span><b>{i.overallScore}%</b></div>))}</div>);}"
].join('\n'));
