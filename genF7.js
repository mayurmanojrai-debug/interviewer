const fs=require('fs'),p=require('path');
const R='c:/Users/raima/OneDrive/Desktop/haikyu/frontend';
const W=(f,c)=>{fs.mkdirSync(p.dirname(p.join(R,f)),{recursive:true});fs.writeFileSync(p.join(R,f),c);console.log('wrote',f);};
W('src/pages/Report.jsx',[
"import { useEffect, useState } from 'react';","import { useParams, Link } from 'react-router-dom';","import api from '../services/api.js';",
"export default function Report(){","const{id}=useParams();const[d,setD]=useState(null);",
"useEffect(()=>{api.get('/api/interviews/'+id).then((r)=>setD(r.data));},[id]);",
"if(!d)return<div className='glass pad'>Loading report...</div>;",
"const iv=d.interview;const rep={status:iv.overallScore>=80?'READY':iv.overallScore>=60?'NEEDS_IMPROVEMENT':'NOT_READY'};",
"return(<div className='dash'><div className='glass pad center'><h2>INTERVIEW COMPLETE</h2>",
"<div className='ring-num big'>{iv.overallScore}%</div><div className='hv-status'>{rep.status.replace('_',' ')}</div>",
"<div className='stat-grid four'>",
[['Technical',iv.technicalScore],['Communication',iv.communicationScore],['Problem Solving',iv.problemSolvingScore],['Confidence',iv.confidenceScore]].map(([l,v])=>(<div key={l} className='glass stat'><b>{v}%</b><span>{l}</span></div>))}</div>",
"<div className='row center'><Link to='/app/history' className='btn ghost'>History</Link><Link to='/app/practice' className='btn ghost'>Practice Weak Areas</Link><Link to='/app/copilot' className='btn primary'>Ask AI Copilot</Link>",
"<button className='btn ghost' onClick={()=>window.print()}>Print / Recruiter Report</button></div></div>",
"<div className='glass pad'><h3>Question-by-question evaluation</h3>{(d.answers||[]).map((a,i)=>(<div key={a.id} className='eval-card'><b>Q{i+1}: {a.questionText}</b><p className='muted'>Score {a.score}% - Tech {a.technicalScore}% - Clarity {a.clarityScore}%</p><p>{a.feedback}</p></div>))}</div>",
"</div>);}"
].join('\n'));
W('src/pages/History.jsx',[
"import { useEffect, useState } from 'react';","import { Link } from 'react-router-dom';","import api from '../services/api.js';",
"export default function History(){","const[list,setList]=useState([]);const[f,setF]=useState('');",
"useEffect(()=>{api.get('/api/interviews').then((r)=>setList(r.data));},[]);",
"const rows=list.filter((i)=>!f||i.jobRole.toLowerCase().includes(f.toLowerCase()));",
"return(<div className='glass pad'><h2>Interview History</h2>",
"<input placeholder='Search by role...' value={f} onChange={(e)=>setF(e.target.value)}/><div className='top8'/>",
"{rows.length===0?<p className='muted'>No interviews yet. <Link to='/app/setup'>Start your first interview</Link>.</p>",
":rows.map((i)=>(<div key={i.id} className='list-row'><span>{new Date(i.createdAt).toLocaleDateString()} - {i.jobRole} - {i.difficulty}</span><b>{i.overallScore}%</b><Link to={'/app/report/'+i.id} className='btn ghost sm'>Report</Link></div>))}</div>);}"
].join('\n'));
W('src/pages/Copilot.jsx',[
"import { useState } from 'react';","import { Bot, Send } from 'lucide-react';","import api from '../services/api.js';",
"const QUICK=['Analyze my performance','Show my weaknesses','Create 7-day plan','Am I interview ready?','Give me 5 Java questions'];",
"export default function Copilot(){","const[msgs,setMsgs]=useState([{me:false,text:'Hi! I am your INTERVIEWIQ Career Copilot. Ask about scores, gaps, plans, or practice.'}]);",
"const[inp,setInp]=useState('');const[busy,setBusy]=useState(false);",
"const ask=async(t)=>{const q=t||inp;if(!q.trim())return;setMsgs((m)=>[...m,{me:true,text:q}]);setInp('');setBusy(true);",
"try{const r=await api.post('/api/copilot/chat',{message:q});setMsgs((m)=>[...m,{me:false,text:r.data.reply}]);}catch{setMsgs((m)=>[...m,{me:false,text:'Copilot unavailable. Is the API running?'}]);}finally{setBusy(false);}};",
"return(<div className='glass pad narrow'><h2><Bot size={20}/> AI Career Copilot</h2>",
"<div className='chat'>{msgs.map((m,i)=>(<div key={i} className={'bubble'+(m.me?' me':'')}>{m.text}</div>))}{busy&&<div className='bubble'>typing...</div>}</div>",
"<div className='chip-row'>{QUICK.map((q)=>(<button key={q} className='chip' onClick={()=>ask(q)}>{q}</button>))}</div>",
"<div className='row'><input value={inp} onChange={(e)=>setInp(e.target.value)} placeholder='Ask: What should I improve?' onKeyDown={(e)=>e.key==='Enter'&&ask()}/><button className='btn primary' onClick={()=>ask()}><Send size={17}/></button></div></div>);}"
].join('\n'));
