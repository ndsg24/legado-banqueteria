import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/legado-banqueteria/',
  build: {
    rollupOptions: {
      input: {
        home: 'index.html',
        catalog: 'carta.html',
      },
    },
  },
})
