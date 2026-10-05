const fs=require('fs'),path=require('path');
const R='c:/Users/raima/OneDrive/Desktop/haikyu/frontend';
const W=(f,c)=>{const p=path.join(R,f);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,c);console.log('wrote',f);};
W('package.json', JSON.stringify({name:'interviewiq-frontend',version:'1.0.0',type:'module',
scripts:{dev:'vite',build:'vite build',preview:'vite preview'},
dependencies:{axios:'^1.7.0','lucide-react':'^0.400.0',react:'^18.3.1','react-dom':'^18.3.1','react-router-dom':'^6.24.0',recharts:'^2.12.0'},
devDependencies:{'@vitejs/plugin-react':'^4.3.0',vite:'^5.4.0'}},null,2));
W('vite.config.js', `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()],
  server: { port: 5173, proxy: { '/api': 'http://localhost:8080' } },
  build: { outDir: 'dist' } });
`);
W('index.html', `<!doctype html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>INTERVIEWIQ — AI Mock Interview Platform</title>
<meta name="description" content="AI-powered adaptive mock interviews with skill-gap analysis and career roadmap." /></head>
<body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body>
</html>`);
W('src/main.jsx', `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles.css';
ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
`);
W('src/services/api.js', `import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '' });
api.interceptors.request.use((c) => { const t = localStorage.getItem('iq_token');
  if (t) c.headers.Authorization = 'Bearer ' + t; return c; });
api.interceptors.response.use((r) => r, (e) => {
  if (e.response && e.response.status === 401 && location.hash !== '#/login') {
    localStorage.removeItem('iq_token'); localStorage.removeItem('iq_user'); location.hash = '#/login'; }
  return Promise.reject(e); });
export default api;
`);
