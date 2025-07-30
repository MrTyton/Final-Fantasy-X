// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    base: process.env.NODE_ENV === 'production' ? '/Final-Fantasy-X/' : '/',
    server: {
        port: 5173,
        strictPort: true,
    },
})