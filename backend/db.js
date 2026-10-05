const fs=require('fs'),path=require('path');
const F=path.join(__dirname,'interviewiq.data.json');
let d=null;
function load(){try{d=JSON.parse(fs.readFileSync(F,'utf8'));}catch(e){d={users:[],interviews:[],answers:[],questions:[],skills:[],userSkills:[],roadmaps:[],resumes:[],achievements:[],seq:{user:1,interview:1,answer:1,question:1,roadmap:1,resume:1,ach:1,skill:1}};}return d;}
function save(){fs.writeFileSync(F,JSON.stringify(d,null,1));}
function nid(t){const k={user:'user',interview:'interview',answer:'answer',question:'question',roadmap:'roadmap',resume:'resume',ach:'ach',skill:'skill'}[t];return d.seq[k]++;}
module.exports={load,save,get:()=>d||load(),nid};
