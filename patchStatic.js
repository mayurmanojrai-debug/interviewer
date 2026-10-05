const fs=require('fs'),path=require('path');
const DIST='c:/Users/raima/OneDrive/Desktop/haikyu/frontend/dist';
const SRV='c:/Users/raima/OneDrive/Desktop/haikyu/backend/server.js';
let s=fs.readFileSync(SRV,'utf8');
if(!s.includes('frontend/dist')){
s=s.replace("const PORT=process.env.PORT||8080;",
`const PORT=process.env.PORT||8080;
const FS=require('fs'),PATH=require('path');
const DIST=PATH.join(__dirname,'..','frontend','dist');
const MIME={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon'};`);
s=s.replace(" if(p==='/api/health')return send(res,200,{status:'UP',service:'INTERVIEWIQ'});",
` if(p==='/api/health')return send(res,200,{status:'UP',service:'INTERVIEWIQ'});
 if(!p.startsWith('/api/')){try{let fp=PATH.join(DIST,p==='/'?'/index.html':p);if(!FS.existsSync(fp)||FS.statSync(fp).isDirectory())fp=PATH.join(DIST,'index.html');const ext=PATH.extname(fp);res.writeHead(200,{'Content-Type':MIME[ext]||'text/html'});FS.createReadStream(fp).pipe(res);return;}catch(e){}}
`);
fs.writeFileSync(SRV,s);console.log('static-serve patched');
}
