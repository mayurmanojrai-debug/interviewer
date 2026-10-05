import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves project sites from /<repo>/, whereas Render serves from /.
  // Set BASE_PATH in the Pages workflow; it stays '/' everywhere else.
  base: process.env.BASE_PATH || '/',
  server: { port: 5173, proxy: { '/api': 'http://localhost:8080' } },
  build: { outDir: 'dist' },
});
