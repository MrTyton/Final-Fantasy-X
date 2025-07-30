// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/Final-Fantasy-X/' : '/',
  // The server config is still good practice
  server: {
    port: 5173,
    strictPort: true,
  },
})