
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, 'shared'),
      '@micro-apps': path.resolve(__dirname, 'micro-apps')
    }
  },
  server: {
    host: "::",
    port: 8080
    allowedHosts: [
      'localhost',
      '904cff78-0618-4fe1-bbce-147582d1c5f8.lovableproject.com'
    ],
    proxy: {
      // your proxy configuration if any
    }
  }
}));
