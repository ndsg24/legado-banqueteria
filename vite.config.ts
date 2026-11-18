import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/legado-banqueteria/',
  optimizeDeps: { include: ['pdfmake/build/pdfmake', 'pdfmake/build/vfs_fonts'] },
  build: {
    rollupOptions: {
      input: {
        home: 'index.html',
        catalog: 'carta.html',
        table: 'ambientacion.html',
        quote: 'cotizar.html',
      },
    },
  },
})
