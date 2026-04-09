import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Esto permite que Railway acceda al servidor de Vite
    allowedHosts: [
      'encuestas-puce.up.railway.app' 
    ],
    // También puedes usar 'true' para permitir todos los hosts en desarrollo:
    // allowedHosts: true, 
    host: true,
    port: 8080
  }
})
