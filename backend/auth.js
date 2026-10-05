const {get,save,nid}=require('./db');
const crypto=require('crypto');
const SEC=process.env.JWT_SECRET||'interviewiq-super-secret-key-min-32-chars-1234567890';
function b64(o){return Buffer.from(JSON.stringify(o)).toString('base64url');}
function sign(p){const h=b64({alg:'HS256',typ:'JWT'}),b=b64(p);const s=crypto.createHmac('sha256',SEC).update(h+'.'+b).digest('base64url');return h+'.'+b+'.'+s;}
function verify(t){try{const[a,b,s]=t.split('.');const e=crypto.createHmac('sha256',SEC).update(a+'.'+b).digest('base64url');if(e!==s)return null;const p=JSON.parse(Buffer.from(b,'base64url').toString());if(p.exp&&p.exp<Date.now())return null;return p;}catch(e){return null;}}
function hash(p){return 'sha256$'+crypto.createHash('sha256').update('iq$'+p).digest('hex');}
function auth(req){const h=req.headers['authorization']||'';if(!h.startsWith('Bearer '))return null;return verify(h.slice(7));}
function send(res,c,o){res.writeHead(c,{'Content-Type':'application/json','Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'*','Access-Control-Allow-Methods':'*'});res.end(JSON.stringify(o));}
function body(req){return new Promise(r=>{let s='';req.on('data',x=>s+=x);req.on('end',()=>{try{r(s?JSON.parse(s):{});}catch(e){r({});}});});}
module.exports={sign,verify,hash,auth,send,body};
