import type { IncomingMessage, ServerResponse } from 'node:http'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// Single-user dev server: hold one staged WAV in memory for filename-safe download
let pendingWav: Buffer | null = null

const wavDownloadPlugin = {
  name: 'wav-download',
  configureServer(server: { middlewares: { use: (path: string, fn: (req: IncomingMessage, res: ServerResponse, next: () => void) => void) => void } }) {
    server.middlewares.use('/api/stage-wav', (req, res, next) => {
      if (req.method !== 'POST') { next(); return }
      const chunks: Buffer[] = []
      req.on('data', (chunk: Buffer) => chunks.push(chunk))
      req.on('end', () => {
        pendingWav = Buffer.concat(chunks)
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('ok')
      })
    })
    server.middlewares.use('/api/download-wav', (_req, res, next) => {
      if (!pendingWav) { next(); return }
      const wav = pendingWav
      pendingWav = null
      res.writeHead(200, {
        'Content-Type': 'audio/wav',
        'Content-Disposition': 'attachment; filename="voix-enregistrement.wav"',
        'Content-Length': String(wav.length),
      })
      res.end(wav)
    })
  },
}

export default defineConfig({
  base: '/',
  build: {
    target: 'es2022',
    outDir: 'dist',
  },
  plugins: [
    wavDownloadPlugin,
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: [
        'favicon.ico',
        'favicon.svg',
        'apple-touch-icon.png',
        'robots.txt',
        'worklet/capture-processor.js',
      ],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2,webmanifest}'],
      },
      devOptions: {
        enabled: false,
      },
      manifest: {
        name: 'Voice Lab — Voice Training',
        short_name: 'Voice Lab',
        description:
          'Free, 100% local voice training tool for trans and non-binary voices. Nothing leaves your device.',
        lang: 'en',
        dir: 'ltr',
        theme_color: '#0e1116',
        background_color: '#0e1116',
        display: 'standalone',
        start_url: '/app',
        scope: '/',
        categories: ['health', 'education', 'utilities'],
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  test: {
    environment: 'happy-dom',
    include: ['src/**/__tests__/*.test.ts'],
  },
})
