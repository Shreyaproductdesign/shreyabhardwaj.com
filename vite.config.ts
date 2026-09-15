import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // A real HTML entry per case study, so each /<slug>-case-study/ resolves as a
  // directory index on any static host without needing rewrite rules.
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        wise: resolve(import.meta.dirname, 'wise-case-study/index.html'),
        quickfix: resolve(import.meta.dirname, 'quickfix-case-study/index.html'),
        dadvice: resolve(import.meta.dirname, 'dadvice-case-study/index.html'),
      },
    },
  },
})
