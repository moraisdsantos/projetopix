import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Para GitHub Pages em subpasta, defina no repositório:
  // VITE_BASE_PATH=/nome-do-repositorio/
  base: mode === 'production' ? process.env.VITE_BASE_PATH || './' : '/',
}))
