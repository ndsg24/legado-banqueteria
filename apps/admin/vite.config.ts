import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/admin/',
  plugins: [react()],
  build: {
    outDir: '../../dist/admin',
    emptyOutDir: true,
    manifest: true,
    rollupOptions: { input: { admin: 'index.html', login: 'login.html' } },
  },
})
