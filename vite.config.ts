import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  base: mode === 'pages' ? '/prato-digital/' : '/',
  plugins: [react()],
  server: { port: 5173 },
  build: { outDir: 'dist' },
}))
