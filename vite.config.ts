import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({plugins:[react(),tailwindcss()],server:{host:'localhost',port:5173,strictPort:true,proxy:{'/api':{target:'http://127.0.0.1:5000',changeOrigin:true}}},build:{rollupOptions:{output:{manualChunks:{charts:['recharts'],validation:['zod','react-hook-form'],framework:['react','react-dom','react-router-dom']}}}}});
