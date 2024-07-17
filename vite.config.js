import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.glb'],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  },
  css: {
    postcss: true // This tells Vite to simply use your `postcss.config.js`
  },
});
