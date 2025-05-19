// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  const repoName = 'Final-Fantasy-X'; // Your GitHub repository name

  return {
    plugins: [react()],
    base: mode === 'production' ? `/${repoName}/` : '/',
  };
})