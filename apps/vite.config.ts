
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, 'shared'),
      '@micro-apps': path.resolve(__dirname, 'micro-apps')
    }
  },
  server: {
    port: 8080
  }
})
