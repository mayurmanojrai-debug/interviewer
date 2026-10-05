const FIL=new Set(['um','uh','like','actually','basically','stuff','thing','very','just']);
function ev(answer,q){
  const a=(answer||'').trim(),low=a.toLowerCase();
  const kws=(q.expectedKeywords||'').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);
  const hits=kws.filter(k=>low.includes(k)).length;
  const cov=kws.length?hits/kws.length:0.6;
  const words=a? a.split(/\s+/).length:0;
  const len=words<10?0.3:words<30?0.6:words<80?0.85:words<200?0.95:0.85;
  const filler=low.split(/\W+/).filter(w=>FIL.has(w)).length;
  const clarity=Math.max(0.3,0.92-filler*0.06+(a.includes('.')?0.03:-0.05));
  const ex=/example|for instance|e\.g|use case/.test(low);
  const cl=v=>Math.max(0.15,Math.min(1,v)),pc=v=>Math.round(cl(v)*1000)/10;
  const tech=cl(0.35+cov*0.55+(ex?0.05:0)+(words>25?0.05:0));
  const rel=cl(0.4+cov*0.5+(words>15?0.08:0));
  const comp=cl(len*0.7+cov*0.3);
  const score=pc(tech*0.4+rel*0.25+comp*0.2+clarity*0.15);
  const S=[],W=[];
  if(cov>=0.6)S.push('Good concept coverage ('+Math.round(cov*100)+'%)');
  if(ex)S.push('Included real-world example');
  if(words>=40)S.push('Detailed, well-structured explanation');
  if(!S.length)S.push('Attempted the core concept');
  if(cov<0.4)W.push('Missing concepts: '+(kws.filter(k=>!low.includes(k)).slice(0,3).join(', ')||'core details'));
  if(!ex)W.push('Add a real-world example');
  if(words<30)W.push('Answer too brief — use 3-4 sentences');
  if(filler>2)W.push('Reduce filler words');
  let fb=score>=85?'Excellent answer with strong depth.':'';
  if(score<85&&score>=70)fb='Good explanation. Strengthen coverage ('+Math.round(cov*100)+'%) with an example.';
  if(score<70)fb=words<20?'Too short. Explain in 3-4 sentences with an example and trade-offs.':'Partial understanding. Cover missing concepts step-by-step with an example.';
  if(score>=85&&!ex)fb+=' Add one production example to make it perfect.';
  return{score,technical:pc(tech),relevance:pc(rel),completeness:pc(comp),clarity:pc(clarity),strengths:S,weaknesses:W,feedback:fb};
}
function next(cur,s){if(s>=85)return cur==='Easy'?'Medium':'Hard';if(s>=70)return cur;return cur==='Hard'?'Medium':'Easy';}
function reason(s){if(s>=85)return 'Difficulty increased because your previous answer demonstrated strong understanding.';if(s>=70)return 'Difficulty maintained to consolidate your level.';return 'Reinforcement question selected to strengthen fundamentals.';}
function copilot(msg,ctx){
  const m=(msg||'').toLowerCase();
  const avg=ctx.avg||0,gaps=(ctx.gaps||[]).map(g=>g.skill+ ' ('+g.score+'%)').join(', ');
  if(/improve|weak|gap/.test(m))return 'Based on '+ctx.count+' interviews (avg '+avg+'%), focus on: '+(gaps||'core topics')+'. Top gap: '+(ctx.topGap||'System Design')+'. Do 5 questions/day there, add real examples, then retake an Adaptive mock.';
  if(/ready|hire|job/.test(m))return avg>=80?'Yes — you look READY ('+avg+'%). Attempt advanced/system-design rounds next.':avg>=60?'Almost ('+avg+'%). Close the '+(ctx.topGap||'top')+' gap first, then retake.':'Not yet ('+avg+'%). Complete the 7-day plan in your Roadmap first.';
  if(/plan|study|7.day|week/.test(m))return '7-day plan: Day1 Java fundamentals, Day2 Spring Boot, Day3 SQL, Day4 REST APIs, Day5 System Design, Day6 Behavioral (STAR), Day7 Full mock. Track it under Career Roadmap.';
  if(/score|72|percent|why/.test(m))return 'Your score blends technical accuracy (40%), relevance (25%), completeness (20%) and clarity (15%). Latest avg '+avg+'% across '+ctx.count+' interviews. Add examples + cover missing keywords to gain 8-12%.';
  if(/spring/.test(m))return 'Spring Boot booster: explain DI/IoC, @RestController vs @Controller, JPA repositories, @Transactional, and security filter chain — each with a mini example. Want 5 practice questions? Ask "give me 5 questions".';
  if(/5|question|practice/.test(m))return 'Practice set: 1) HashMap vs ConcurrentHashMap 2) DI in Spring 3) REST status codes 4) SQL JOINs 5) React hooks. Answer in 4-6 sentences with an example each.';
  if(/resume/.test(m))return 'Resume tips: quantify outcomes ("cut API latency 30%"), group skills by category, list 2-3深度 projects with stack + your role. Upload it under Resume Intelligence for a score.';
  if(/star|behavioral|hr/.test(m))return 'Use STAR: Situation, Task, Action, Result — 90 seconds, end with a metric. Example: "Conflict in team project → I proposed standups → shipped 2 days early."';
  return 'I can help with scores, gaps, plans and practice. Try: "What should I improve?", "Am I interview ready?", "Create a 7-day plan", or "Give me 5 Java questions."';
}
module.exports={ev,next,reason,copilot};
