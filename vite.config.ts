import { defineConfig, loadEnv } from 'vite'
import { isTurnstileTestKey } from './shared/contact'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command, mode }) => {
  if (command === 'build') {
    const key = loadEnv(mode, process.cwd(), 'VITE_').VITE_TURNSTILE_SITE_KEY?.trim()
    if (!key || isTurnstileTestKey(key)) {
      console.warn('Kontaktformular bleibt im Build deaktiviert: Kein produktiver VITE_TURNSTILE_SITE_KEY gesetzt.')
    }
  }

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      strictPort: true,
      // Netlify Dev applies the live CSP, which blocks React's inline refresh preamble.
      hmr: process.env.NETLIFY_DEV === 'true' ? false : undefined,
    },
    build: {
      target: 'es2020',
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-dom/client', 'react-router-dom'],
            motion: ['motion'],
          },
        },
      },
    },
    test: {
      include: ['tests/**/*.test.ts'],
      environment: 'node',
    },
  }
})
