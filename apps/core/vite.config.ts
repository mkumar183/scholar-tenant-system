import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@scholar/types': path.resolve(__dirname, '../../packages/types/src'),
      '@scholar/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@scholar/auth': path.resolve(__dirname, '../../packages/auth/src'),
      '@scholar/database': path.resolve(__dirname, '../../packages/database/src'),
      '@scholar/utils': path.resolve(__dirname, '../../packages/utils/src'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
}); 