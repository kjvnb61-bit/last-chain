import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages ke liye base path add karein
  base: '/last-chain/', 
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
