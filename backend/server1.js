const http=require('http');
const DB=require('./db'),{sign,hash,auth,send,body}=require('./auth');
const AI=require('./ai'),{seed}=require('./seed');
const PORT=process.env.PORT||8080;
DB.load();seed(DB.get(),hash);DB.save();
const rd=v=>Math.round(v*10)/10;
function me(req){const p=auth(req);if(!p)return null;return DB.get().users.find(u=>u.id==p.sub)||null;}
function ctxFor(u){const d=DB.get();const ivs=d.interviews.filter(i=>i.userId===u.id&&i.status==='COMPLETED');
 const avg=ivs.length?rd(ivs.reduce((s,i)=>s+i.overallScore,0)/ivs.length):0;
 const gaps=d.userSkills.filter(s=>s.userId===u.id).map(s=>({...s,skill:(d.skills.find(k=>k.id===s.skillId)||{}).name})).sort((a,b)=>a.currentScore-b.currentScore);
 return{avg,count:ivs.length,gaps:gaps.map(g=>({skill:g.skill,score:g.currentScore})),topGap:gaps[0]?gaps[0].skill:'System Design',ivs};}
const server=http.createServer(async(req,res)=>{
 const u=new URL(req.url,'http://x');const p=u.pathname;const m=req.method;
 if(m==='OPTIONS')return send(res,200,{});
 if(p==='/api/health')return send(res,200,{status:'UP',service:'INTERVIEWIQ'});
 const b=m==='POST'||m==='PUT'?await body(req):{};
 // AUTH
 if(p==='/api/auth/register'&&m==='POST'){
  const d=DB.get();
  if(!b.name||!b.email||!b.password)return send(res,400,{message:'Name, email and password required'});
  if(d.users.some(x=>x.email===String(b.email).toLowerCase()))return send(res,409,{message:'Email already registered'});
  const nu={id:DB.nid('user'),name:b.name,email:String(b.email).toLowerCase(),password:hash(b.password),role:'STUDENT',targetRole:b.targetRole||'Full Stack Developer',experienceLevel:b.experienceLevel||'Intermediate',createdAt:new Date().toISOString()};
  d.users.push(nu);DB.save();
  return send(res,201,{token:sign({sub:nu.id,email:nu.email,role:nu.role,exp:Date.now()+864e5}),user:{id:nu.id,name:nu.name,email:nu.email,role:nu.role,targetRole:nu.targetRole,experienceLevel:nu.experienceLevel}});
 }
 if(p==='/api/auth/login'&&m==='POST'){
  const d=DB.get();const f=d.users.find(x=>x.email===String(b.email||'').toLowerCase());
  if(!f||f.password!==hash(b.password||''))return send(res,401,{message:'Invalid email or password'});
  return send(res,200,{token:sign({sub:f.id,email:f.email,role:f.role,exp:Date.now()+864e5}),user:{id:f.id,name:f.name,email:f.email,role:f.role,targetRole:f.targetRole,experienceLevel:f.experienceLevel}});
 }
 if(p==='/api/auth/logout')return send(res,200,{message:'Logged out'});
 const cur=me(req);
 if(p.startsWith('/api/')&&p!=='/api/health'&&!cur)return send(res,401,{message:'Unauthorized'});
 // ME
 if(p==='/api/users/me'&&m==='GET')return send(res,200,{id:cur.id,name:cur.name,email:cur.email,role:cur.role,targetRole:cur.targetRole,experienceLevel:cur.experienceLevel});
 if(p==='/api/users/me'&&m==='PUT'){Object.assign(cur,{name:b.name||cur.name,targetRole:b.targetRole||cur.targetRole,experienceLevel:b.experienceLevel||cur.experienceLevel});DB.save();return send(res,200,{message:'Profile updated',user:{id:cur.id,name:cur.name,email:cur.email,role:cur.role,targetRole:cur.targetRole,experienceLevel:cur.experienceLevel}});}
 // QUESTIONS
 if(p==='/api/questions'&&m==='GET'){const d=DB.get();let q=d.questions.filter(x=>x.active);if(u.searchParams.get('role'))q=q.filter(x=>x.jobRole===u.searchParams.get('role'));return send(res,200,q);}
 if(p==='/api/questions/random'&&m==='GET'){const d=DB.get();let q=d.questions.filter(x=>x.active);const role=u.searchParams.get('role'),diff=u.searchParams.get('difficulty');if(role)q=q.filter(x=>x.jobRole===role);if(diff)q=q.filter(x=>x.difficulty===diff);if(!q.length)q=d.questions;return send(res,200,q[Math.floor(Math.random()*q.length)]||null);}
 if(p==='/api/questions'&&m==='POST'){if(cur.role!=='ADMIN')return send(res,403,{message:'Admin only'});const d=DB.get();const nq={id:DB.nid('question'),questionText:b.questionText,category:b.category||'Technical',jobRole:b.jobRole||'Java Developer',difficulty:b.difficulty||'Medium',expectedKeywords:b.expectedKeywords||'',idealAnswer:b.idealAnswer||'',active:true};d.questions.push(nq);DB.save();return send(res,201,nq);}
