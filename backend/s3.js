 // ANALYTICS
 if(p==='/api/analytics/dashboard'&&m==='GET'){const c=ctxFor(cur);const d=DB.get();
  const streak=ivs=>ivs.length;
  return send(res,200,{readiness:c.avg,avg:c.avg,total:c.count,streak:Math.min(c.count,7),completed:c.count,trend:c.ivs.map(i=>({date:(i.createdAt||'').slice(0,10),score:i.overallScore})),skills:d.userSkills.filter(s=>s.userId===cur.id).map(s=>({skill:(d.skills.find(k=>k.id===s.skillId)||{}).name,score:s.currentScore,target:s.targetScore})),recent:c.ivs.slice(-5).reverse(),achievements:d.achievements.filter(a=>a.userId===cur.id)});}
 if(p==='/api/analytics/performance'&&m==='GET'){const c=ctxFor(cur);return send(res,200,{history:c.ivs.map(i=>({id:i.id,date:(i.createdAt||'').slice(0,10),score:i.overallScore,tech:i.technicalScore,comm:i.communicationScore,role:i.jobRole}))});}
 if(p==='/api/skills/user'&&m==='GET'){const d=DB.get();return send(res,200,d.userSkills.filter(s=>s.userId===cur.id).map(s=>({skill:(d.skills.find(k=>k.id===s.skillId)||{}).name,currentScore:s.currentScore,targetScore:s.targetScore,gapScore:s.gapScore})));}
 if(p==='/api/skills/gaps'&&m==='GET'){const c=ctxFor(cur);return send(res,200,{gaps:c.gaps,topGap:c.topGap});}
 if(p==='/api/roadmap'&&m==='GET'){const d=DB.get();return send(res,200,d.roadmaps.filter(r=>r.userId===cur.id).sort((a,b)=>a.priority-b.priority));}
 if(p==='/api/resume'&&m==='GET'){const d=DB.get();return send(res,200,d.resumes.filter(r=>r.userId===cur.id));}
 if(p==='/api/resume/upload'&&m==='POST'){const d=DB.get();const txt=String(b.text||b.extractedText||'');const lower=txt.toLowerCase();
  const keys=['java','spring','react','sql','rest','python','javascript','node','mysql','aws','docker'];const hit=keys.filter(k=>lower.includes(k)).length;
  const score=Math.min(95,45+hit*6+(txt.length>300?10:0));
  const r={id:DB.nid('resume'),userId:cur.id,fileName:b.fileName||'resume.txt',extractedText:txt,resumeScore:score,uploadedAt:new Date().toISOString()};
  d.resumes.push(r);DB.save();
  return send(res,201,{resume:r,insights:[hit>=4?'Good technology diversity':'Add more technical skills',txt.length>200?'Good project detail':'Add measurable project outcomes',score>=70?'Resume strength is solid':'Improve skill categorization']});}
 if(p==='/api/copilot/chat'&&m==='POST'){const c=ctxFor(cur);return send(res,200,{reply:AI.copilot(b.message||'',c)});}
 if(p==='/api/admin/analytics'&&m==='GET'){if(cur.role!=='ADMIN')return send(res,403,{message:'Admin only'});const d=DB.get();
  const avg=d.interviews.length?rd(d.interviews.reduce((s,i)=>s+i.overallScore,0)/d.interviews.length):0;
  return send(res,200,{users:d.users.length,interviews:d.interviews.length,avg,roles:{},recent:d.interviews.slice(-10).reverse()});}
 if(p==='/api/admin/users'&&m==='GET'){if(cur.role!=='ADMIN')return send(res,403,{message:'Admin only'});const d=DB.get();return send(res,200,d.users.map(u=>({id:u.id,name:u.name,email:u.email,role:u.role,targetRole:u.targetRole})));}
 return send(res,404,{message:'Not found: '+p});
});
server.listen(PORT,()=>console.log('INTERVIEWIQ API on http://localhost:'+PORT));
