 // INTERVIEWS
 if(p==='/api/interviews'&&m==='POST'){const d=DB.get();
  const iv={id:DB.nid('interview'),userId:cur.id,jobRole:b.jobRole||'Java Developer',experienceLevel:b.experienceLevel||'Intermediate',difficulty:b.difficulty||'Adaptive AI',interviewType:b.interviewType||'Mixed',totalQuestions:b.totalQuestions||5,overallScore:0,technicalScore:0,communicationScore:0,problemSolvingScore:0,confidenceScore:0,durationSeconds:0,status:'IN_PROGRESS',createdAt:new Date().toISOString()};
  d.interviews.push(iv);
  let pool=d.questions.filter(q=>q.active&&q.jobRole===iv.jobRole);if(!pool.length)pool=d.questions.filter(q=>q.active);
  pool=[...pool].sort(()=>Math.random()-0.5);
  const pick=pool.slice(0,iv.totalQuestions);DB.save();
  return send(res,201,{interview:iv,questions:pick,nextDifficulty:'Medium'});}
 if(p==='/api/interviews'&&m==='GET'){const d=DB.get();return send(res,200,d.interviews.filter(i=>i.userId===cur.id).sort((a,b)=>b.id-a.id));}
 let mm=p.match(/^\/api\/interviews\/(\d+)$/);
 if(mm&&m==='GET'){const d=DB.get();const iv=d.interviews.find(i=>i.id==mm[1]&&i.userId===cur.id);if(!iv)return send(res,404,{message:'Not found'});return send(res,200,{interview:iv,answers:d.answers.filter(a=>a.interviewId===iv.id)});}
 mm=p.match(/^\/api\/interviews\/(\d+)\/answers$/);
 if(mm&&m==='POST'){const d=DB.get();const iv=d.interviews.find(i=>i.id==mm[1]&&i.userId===cur.id);if(!iv)return send(res,404,{message:'Not found'});
  let q=null;if(b.questionId)q=d.questions.find(x=>x.id==b.questionId);
  if(!q)q={id:null,questionText:b.questionText||'',expectedKeywords:'',difficulty:b.difficulty||'Medium'};
  const r=AI.ev(b.answerText||'',q);
  const a={id:DB.nid('answer'),interviewId:iv.id,questionId:q.id,questionText:q.questionText,answerText:b.answerText||'',score:r.score,technicalScore:r.technical,relevanceScore:r.relevance,completenessScore:r.completeness,clarityScore:r.clarity,feedback:r.feedback,strengths:r.strengths.join(' | '),weaknesses:r.weaknesses.join(' | '),difficultyAtTime:q.difficulty,createdAt:new Date().toISOString()};
  d.answers.push(a);
  const adapt=iv.difficulty.includes('Adaptive');const nd=adapt?AI.next(q.difficulty,r.score):iv.difficulty;
  let pool=d.questions.filter(x=>x.active&&x.jobRole===iv.jobRole);if(!pool.length)pool=d.questions;
  let cand=pool.filter(x=>x.difficulty===nd);if(!cand.length)cand=pool;
  const nq=cand[Math.floor(Math.random()*cand.length)]||null;DB.save();
  return send(res,200,{evaluation:r,nextDifficulty:nd,adaptiveReason:AI.reason(r.score),nextQuestion:nq});}
 mm=p.match(/^\/api\/interviews\/(\d+)\/complete$/);
 if(mm&&m==='POST'){const d=DB.get();const iv=d.interviews.find(i=>i.id==mm[1]&&i.userId===cur.id);if(!iv)return send(res,404,{message:'Not found'});
  const list=d.answers.filter(a=>a.interviewId===iv.id);
  const avg=list.length?list.reduce((s,a)=>s+a.score,0)/list.length:0;
  const tech=list.length?list.reduce((s,a)=>s+a.technicalScore,0)/list.length:0;
  const comm=list.length?list.reduce((s,a)=>s+a.clarityScore,0)/list.length:0;
  Object.assign(iv,{overallScore:rd(avg),technicalScore:rd(tech),communicationScore:rd(comm),problemSolvingScore:rd(avg*0.97),confidenceScore:rd(Math.min(100,avg+3)),status:'COMPLETED'});DB.save();
  updSkills(cur.id,avg);mkRoadmap(cur.id,iv.jobRole);grant(cur.id,avg);DB.save();
  const st=[],wk=[];
  if(iv.technicalScore>=75)st.push('Strong technical fundamentals');else wk.push('Technical depth needs work');
  if(iv.communicationScore>=75)st.push('Clear, structured explanations');else wk.push('Use STAR-structured answers');
  if(iv.overallScore>=80)st.push('Interview-ready consistency');else wk.push('Practice '+iv.jobRole+' core topics');
  const status=iv.overallScore>=80?'READY':iv.overallScore>=60?'NEEDS_IMPROVEMENT':'NOT_READY';
  return send(res,200,{interview:iv,answers:list,report:{status,strengths:st,weaknesses:wk,recommendation:iv.overallScore>=80?'Strong foundation. Attempt advanced rounds next.':'Focus on '+iv.jobRole+' fundamentals with examples, then retake.'}});}
 function updSkills(uid,avg){const d=DB.get();const base={'Java':avg,'Spring Boot':Math.max(20,avg-8),'React':Math.max(20,avg-5),'SQL':Math.max(20,avg-3),'REST APIs':Math.min(100,avg+4),'System Design':Math.max(15,avg-18),'Communication':Math.min(100,avg+2)};
  for(const[n,v]of Object.entries(base)){let sk=d.skills.find(s=>s.name===n);if(!sk){sk={id:DB.nid('skill'),name:n,category:'Technical',description:n};d.skills.push(sk);}let us=d.userSkills.find(x=>x.userId===uid&&x.skillId===sk.id);if(!us){us={id:d.userSkills.length+1,userId:uid,skillId:sk.id};d.userSkills.push(us);}us.currentScore=rd(v);us.targetScore=90;us.gapScore=rd(90-v);}}
 function mkRoadmap(uid,role){const d=DB.get();if(d.roadmaps.some(r=>r.userId===uid))return;['Master '+role+' fundamentals','Build 2 portfolio projects','Practice system design and APIs','STAR behavioral prep','Full advanced mock'].forEach((t,i)=>d.roadmaps.push({id:DB.nid('roadmap'),userId:uid,title:'Step '+(i+1)+': '+t,description:t,priority:i+1,progress:0,status:'PENDING'}));}
 function grant(uid,avg){const d=DB.get();const has=n=>d.achievements.some(a=>a.userId===uid&&a.achievementName===n);
  if(!has('First Interview'))d.achievements.push({id:DB.nid('ach'),userId:uid,achievementName:'First Interview',description:'Completed first mock',earnedAt:new Date().toISOString()});
  if(avg>=80&&!has('80% Club'))d.achievements.push({id:DB.nid('ach'),userId:uid,achievementName:'80% Club',description:'Scored 80%+',earnedAt:new Date().toISOString()});}
