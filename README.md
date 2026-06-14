# Voice Lab

> Real-time voice training for trans & non-binary voices — free, open-source, and 100% local.

[![Tests](https://github.com/kushiemoon-dev/voice-lab/actions/workflows/ci.yml/badge.svg)](https://github.com/kushiemoon-dev/voice-lab/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**[voice-lab.kushie.dev](https://voice-lab.kushie.dev)** — No account. No server. Nothing leaves your device.

---

## What it does

Voice Lab gives you real-time audio feedback to help explore, train, and understand your voice. It runs entirely in your browser using the Web Audio API — your microphone data never touches a server.

| Tool | What you get |
|------|-------------|
| **Pitch** | Live pitch graph with band indicators for masculine, non-binary, and feminine ranges; scrolling history; target line |
| **Tones** | Reference notes and scales across your vocal range — useful for ear training |
| **Phrases** | Practice sentences across 9 themes — with live pitch graph and recording so you can hear yourself back |
| **Record** | Record, replay, and export as WAV — locally, nothing is sent anywhere |
| **Lab — Spectrogram** | Time × frequency heatmap scrolling in real time |
| **Lab — Harmonics** | FFT harmonic series visualisation |
| **Lab — Voice Quality** | Jitter, shimmer, and HNR (harmonics-to-noise ratio) with qualitative interpretation |
| **Lab — Statistics** | Session pitch stats: min, max, mean, range, dominant range, target % |

Available in **English and French** — toggleable at any time, persisted to localStorage.

---

## Privacy

- **No server** — all processing happens in your browser via the Web Audio API
- **No account** — nothing to sign up for
- **No tracking** — no analytics, no cookies, no third-party scripts
- **No data retention** — recordings exist only in memory and are lost on page close
- **HTTPS required** — microphone access is gated by the browser's permission model

> Voice Lab is a practice tool and does not replace guidance from a qualified speech therapist.

---

## Tech stack

| Layer | Choice | Why |
|-------|--------|-----|
| Language | TypeScript 5 (strict) | Type safety across all audio/DSP code |
| Bundler | Vite 5 | Fast dev server, ES module output |
| Audio | Web Audio API | `getUserMedia` → `AnalyserNode` → `AudioWorklet` |
| Pitch | [pitchy](https://github.com/ianprime0509/pitchy) | MPM algorithm, only runtime dependency |
| Tests | Vitest + happy-dom | Fast, native ESM, no transpilation |
| PWA | vite-plugin-pwa + Workbox | Offline-capable, installable |

No framework. No build-time server. One runtime dependency.

---

## Getting started

```bash
git clone https://github.com/kushiemoon-dev/voice-lab.git
cd voice-lab
npm install
npm run dev        # dev server at http://localhost:5173
```

```bash
npm run build      # tsc + vite build → dist/
npm run preview    # preview the production build locally
npm test           # run test suite (vitest)
```

> Requires a browser with microphone access and a secure context (HTTPS or localhost).

---

## Project structure

```
src/
├── analysis/           # DSP algorithms (jitter, shimmer, HNR, harmonics, pitch stats)
├── app/                # App bootstrap, store, state, router
├── audio/
│   ├── AudioEngine.ts  # RAF loop, AnalyserNode, frame dispatch
│   ├── pitch/          # Pitch estimation + smoothing (MedianSmoother)
│   ├── recorder/       # RingBuffer, WAV encoding
│   ├── tones/          # Tone synthesis (OscillatorNode)
│   ├── volume/         # RMS computation
│   └── worklet/        # AudioWorklet loader
├── domain/             # Voice ranges, note frequencies, phrases
├── i18n/               # EN/FR string catalog with t() helper
├── lib/                # Pure utilities (Result type, DOM helpers, math)
├── styles/             # CSS custom properties + component styles
└── ui/
    ├── canvas/         # Canvas renderers (pitch graph, spectrogram, harmonics)
    ├── components/     # Reusable UI components (Meter, ScreenReaderLive, …)
    ├── layout/         # AppShell, TabBar
    └── views/          # One file per screen/tab
public/
├── worklet/            # AudioWorklet processor (runs in audio thread)
├── .htaccess           # SPA fallback for Apache/LiteSpeed (Hostinger)
├── robots.txt
└── sitemap.xml
```

---

## Deployment

### Hostinger hPanel (static hosting)

```bash
npm run build
# Upload the contents of dist/ to your subdomain root via File Manager or FTP
```

The `.htaccess` file in `dist/` handles SPA routing (History API fallback) automatically on Apache/LiteSpeed. No server-side configuration needed beyond HTTPS.

### Any static host (Netlify, Vercel, Cloudflare Pages…)

Point the build output (`dist/`) at your host and configure a catch-all redirect to `index.html`. For nginx:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

---

## Regenerating assets

Icons require `rsvg-convert` (librsvg) and ImageMagick 7 (`magick`).

```bash
cp assets/icons/icon.svg public/favicon.svg
rsvg-convert -w 180 -h 180 assets/icons/icon.svg -o public/apple-touch-icon-raw.png
magick public/apple-touch-icon-raw.png -background "#0e1116" -flatten -resize 180x180 public/apple-touch-icon.png
rsvg-convert -w 192 -h 192 assets/icons/icon.svg -o public/icon-192.png
rsvg-convert -w 512 -h 512 assets/icons/icon.svg -o public/icon-512.png
rsvg-convert -w 512 -h 512 assets/icons/icon-maskable.svg -o public/icon-maskable-512.png
rsvg-convert -w 1200 -h 630 assets/icons/og.svg -o public/og-image.png
magick -background none assets/icons/icon.svg -define icon:auto-resize=16,32,48 public/favicon.ico
```

---

## Contributing

Contributions are welcome — bug reports, accessibility improvements, new phrases, language translations, or DSP refinements.

1. Fork the repo and create a branch (`git checkout -b feat/your-feature`)
2. Write tests first if you're touching analysis or audio code
3. Make sure `npm test` and `npm run build` pass
4. Open a pull request with a clear description

This project is specifically built for trans and non-binary people. Contributions that reflect that intent and lived experience are especially valued.

---

## License

[MIT](LICENSE) — free to use, modify, and redistribute.
