const fs=require('fs'),p=require('path');
const R='c:/Users/raima/OneDrive/Desktop/haikyu/frontend';
const W=(f,c)=>{fs.mkdirSync(p.dirname(p.join(R,f)),{recursive:true});fs.writeFileSync(p.join(R,f),c);console.log('wrote',f);};
W('src/pages/Setup.jsx',[
"import { useState } from 'react';","import { useNavigate } from 'react-router-dom';","import api from '../services/api.js';",
"const ROLES=['Java Developer','Full Stack Developer','Frontend Developer','Backend Developer','Python Developer','Data Analyst','Cybersecurity Analyst','AI/ML Engineer'];",
"export default function Setup(){","const nav=useNavigate();const[err,setErr]=useState('');const[busy,setBusy]=useState(false);",
"const[f,setF]=useState({jobRole:'Full Stack Developer',experienceLevel:'Intermediate',difficulty:'Adaptive AI',interviewType:'Mixed',totalQuestions:5});",
"const go=async()=>{setErr('');setBusy(true);try{const r=await api.post('/api/interviews',f);sessionStorage.setItem('iq_live',JSON.stringify(r.data));nav('/app/live');}catch(e){setErr(e.response?.data?.message||'Could not start interview. Check API.');}finally{setBusy(false);}};",
"return(<div className='glass pad narrow'><h2>Start AI Interview</h2><p className='muted'>Role, level, type, difficulty, count.</p>{err&&<div className='alert err'>{err}</div>}",
"<div className='grid2'><label>Job role<select value={f.jobRole} onChange={(e)=>setF({...f,jobRole:e.target.value})}>{ROLES.map((r)=>(<option key={r}>{r}</option>))}</select></label>",
"<label>Experience<select value={f.experienceLevel} onChange={(e)=>setF({...f,experienceLevel:e.target.value})}>{['Beginner','Intermediate','Advanced','Expert'].map((r)=>(<option key={r}>{r}</option>))}</select></label></div>",
"<div className='grid2'><label>Type<select value={f.interviewType} onChange={(e)=>setF({...f,interviewType:e.target.value})}>{['Technical','Behavioral','HR','Mixed','Role Specific'].map((r)=>(<option key={r}>{r}</option>))}</select></label>",
"<label>Difficulty<select value={f.difficulty} onChange={(e)=>setF({...f,difficulty:e.target.value})}>{['Easy','Medium','Hard','Adaptive AI'].map((r)=>(<option key={r}>{r}</option>))}</select></label></div>",
"<label>Questions<div className='chip-row'>{[5,10,15,20].map((n)=>(<button key={n} type='button' className={'chip'+(f.totalQuestions===n?' on':'')} onClick={()=>setF({...f,totalQuestions:n})}>{n}</button>))}</div></label>",
"<button className='btn primary lg' onClick={go} disabled={busy}>{busy?'Starting...':'Start AI Interview'}</button></div>);}"
].join('\n'));
