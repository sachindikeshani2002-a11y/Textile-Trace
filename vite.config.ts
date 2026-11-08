import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({plugins:[react(),tailwindcss()],build:{rollupOptions:{output:{manualChunks:{charts:['recharts'],validation:['zod','react-hook-form'],framework:['react','react-dom','react-router-dom']}}}}});
