const {Q}=require('./seedQ');
function seed(d,hash){
 if(d.questions.length)return;
 let i=1;for(const[q,c,r,df,k,ideal]of Q){d.questions.push({id:i++,questionText:q,category:c,jobRole:r,difficulty:df,expectedKeywords:k,idealAnswer:ideal,active:true});}
 ['Java','Spring Boot','React','SQL','REST APIs','System Design','Communication'].forEach((s,j)=>d.skills.push({id:j+1,name:s,category:'Technical',description:s}));
 const demo={id:d.seq.user++,name:'Demo Candidate',email:'demo@interviewiq.com',password:hash('Demo@123'),role:'STUDENT',targetRole:'Full Stack Developer',experienceLevel:'Intermediate',createdAt:new Date().toISOString()};
 const admin={id:d.seq.user++,name:'Admin',email:'admin@interviewiq.com',password:hash('Admin@123'),role:'ADMIN',targetRole:'Full Stack Developer',experienceLevel:'Expert',createdAt:new Date().toISOString()};
 d.users.push(demo,admin);
 [72,78,84,69,88].forEach((s,k)=>{
  const iv={id:d.seq.interview++,userId:demo.id,jobRole:k%2?'Java Developer':'Full Stack Developer',experienceLevel:'Intermediate',difficulty:'Adaptive AI',interviewType:'Mixed',totalQuestions:5,overallScore:s,technicalScore:Math.min(100,s+2),communicationScore:s-2,problemSolvingScore:s-1,confidenceScore:Math.min(100,s+3),durationSeconds:600+k*40,status:'COMPLETED',createdAt:new Date(Date.now()-(5-k)*86400000).toISOString()};
  d.interviews.push(iv);
  const q=d.questions[k%d.questions.length];
  d.answers.push({id:d.seq.answer++,interviewId:iv.id,questionId:q.id,questionText:q.questionText,answerText:'Sample evaluated answer with concepts and example.',score:s,technicalScore:s+1,relevanceScore:s,completenessScore:s-2,clarityScore:s+2,feedback:'Good answer. Add a real-world example.',strengths:'Good coverage',weaknesses:'Add example',difficultyAtTime:'Medium',createdAt:iv.createdAt});
 });
 [['Java',82],['Spring Boot',64],['React',76],['SQL',80],['REST APIs',88],['System Design',51],['Communication',84]].forEach(([n,v],j)=>d.userSkills.push({id:j+1,userId:demo.id,skillId:j+1,currentScore:v,targetScore:90,gapScore:90-v}));
 ['Master Full Stack fundamentals','Build 2 portfolio projects','Practice system design and APIs','STAR behavioral prep','Full advanced mock'].forEach((t,j)=>d.roadmaps.push({id:d.seq.roadmap++,userId:demo.id,title:'Step '+(j+1)+': '+t,description:t,priority:j+1,progress:j<2?100:j===2?40:0,status:j<2?'DONE':'PENDING'}));
 d.achievements.push({id:d.seq.ach++,userId:demo.id,achievementName:'First Interview',description:'Completed first mock',earnedAt:new Date().toISOString()});
 d.achievements.push({id:d.seq.ach++,userId:demo.id,achievementName:'80% Club',description:'Scored 80%+',earnedAt:new Date().toISOString()});
 d.resumes.push({id:d.seq.resume++,userId:demo.id,fileName:'demo-resume.txt',extractedText:'Java Spring Boot React SQL REST. Built React + Spring Boot app with JWT and MySQL.',resumeScore:78,uploadedAt:new Date().toISOString()});
}
module.exports={seed};
