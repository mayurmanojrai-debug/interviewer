const fs=require('fs'),p=require('path');
const R='c:/Users/raima/OneDrive/Desktop/haikyu/frontend';
const W=(f,c)=>{fs.mkdirSync(p.dirname(p.join(R,f)),{recursive:true});fs.writeFileSync(p.join(R,f),c);console.log('wrote',f);};
W('src/pages/Auth.jsx',[
"import { useState } from 'react';","import { Link, useNavigate } from 'react-router-dom';",
"import { Sparkles, Eye, EyeOff } from 'lucide-react';","import { useAuth } from '../context/AuthContext.jsx';",
"const ROLES=['Java Developer','Full Stack Developer','Frontend Developer','Backend Developer','Python Developer','Data Analyst','Cybersecurity Analyst','AI/ML Engineer'];",
"export function Login(){","const {login,loading}=useAuth();const nav=useNavigate();",
"const[f,setF]=useState({email:'demo@interviewiq.com',password:'Demo@123'});const[show,setShow]=useState(false);const[err,setErr]=useState('');",
"const go=async(e)=>{e.preventDefault();setErr('');try{const u=await login(f.email,f.password);nav(u.role==='ADMIN'?'/app/admin':'/app');}catch(ex){setErr(ex.response?.data?.message||'Login failed.');}};",
"return(<div className='auth-wrap'><div className='auth-left glass'><div className='brand'><span className='brand-mark'><Sparkles size={18}/></span>INTERVIEWIQ</div>",
"<h2>AI interviews that make you job-ready.</h2><p>Adaptive questions, instant scoring, skill gaps, roadmap, copilot.</p></div>",
"<form className='auth-card glass' onSubmit={go}><h2>Welcome back</h2>{err&&<div className='alert err'>{err}</div>}",
"<label>Email *<input type='email' value={f.email} onChange={(e)=>setF({...f,email:e.target.value})}/></label>",
"<label>Password *<span className='pass-wrap'><input type={show?'text':'password'} value={f.password} onChange={(e)=>setF({...f,password:e.target.value})}/><button type='button' className='icon-btn' onClick={()=>setShow(!show)}>{show?<EyeOff size={17}/>:<Eye size={17}/>}</button></span></label>",
"<button className='btn primary lg' disabled={loading}>{loading?'Signing in...':'Login'}</button>",
"<p className='muted'>No account? <Link to='/register'>Register</Link></p></form></div>);}",
"export function Register(){","const {register,loading}=useAuth();const nav=useNavigate();",
"const[f,setF]=useState({name:'',email:'',password:'',confirm:'',targetRole:'Full Stack Developer',experienceLevel:'Intermediate'});const[err,setErr]=useState('');",
"const go=async(e)=>{e.preventDefault();setErr('');if(!f.name||!f.email||!f.password)return setErr('All fields required.');if(f.password!==f.confirm)return setErr('Passwords do not match.');if(f.password.length<6)return setErr('Min 6 characters.');try{await register({name:f.name,email:f.email,password:f.password,targetRole:f.targetRole,experienceLevel:f.experienceLevel});nav('/app');}catch(ex){setErr(ex.response?.data?.message||'Registration failed.');}};",
"return(<div className='auth-wrap'><div className='auth-left glass'><div className='brand'><span className='brand-mark'><Sparkles size={18}/></span>INTERVIEWIQ</div><h2>Create your AI career coach.</h2></div>",
"<form className='auth-card glass' onSubmit={go}><h2>Create account</h2>{err&&<div className='alert err'>{err}</div>}",
"<div className='grid2'><label>Name *<input value={f.name} onChange={(e)=>setF({...f,name:e.target.value})} placeholder='Aarav Sharma'/></label>",
"<label>Email *<input type='email' value={f.email} onChange={(e)=>setF({...f,email:e.target.value})} placeholder='you@college.edu'/></label></div>",
"<div className='grid2'><label>Password *<input type='password' value={f.password} onChange={(e)=>setF({...f,password:e.target.value})}/></label>",
"<label>Confirm *<input type='password' value={f.confirm} onChange={(e)=>setF({...f,confirm:e.target.value})}/></label></div>",
"<div className='grid2'><label>Target role<select value={f.targetRole} onChange={(e)=>setF({...f,targetRole:e.target.value})}>{ROLES.map((r)=>(<option key={r}>{r}</option>))}</select></label>",
"<label>Experience<select value={f.experienceLevel} onChange={(e)=>setF({...f,experienceLevel:e.target.value})}>{['Beginner','Intermediate','Advanced','Expert'].map((r)=>(<option key={r}>{r}</option>))}</select></label></div>",
"<button className='btn primary lg' disabled={loading}>{loading?'Creating...':'Register'}</button>",
"<p className='muted'>Have an account? <Link to='/login'>Login</Link></p></form></div>);}"
].join('\n'));
W('src/components/Guard.jsx',[
"import { Navigate } from 'react-router-dom';","import { useAuth } from '../context/AuthContext.jsx';",
"export default function Guard({children,admin}){","const{user}=useAuth();",
"if(!localStorage.getItem('iq_token'))return <Navigate to='/login'/>;",
"if(admin&&user&&user.role!=='ADMIN')return <Navigate to='/app'/>;",
"return children;}"
].join('\n'));
