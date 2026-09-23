# Changelog

## v0.2.1 (2026-09-23)

### Fixes
- Resolved 8 Dependabot alerts (3 critical) in dev dependencies: `vite` (server.fs.deny bypass, launch-editor NTLMv2 hash disclosure, path traversal in optimized deps map handling), `vitest` (UI server arbitrary file read/execute), `happy-dom` (VM context escape RCE, server-side script execution, cross-origin fetch credential leak), and `esbuild` (dev server allowed any website to read responses).
- Bumped `vitest` to v5 and updated transitive dependencies (`browserslist`, `fast-uri`, `baseline-browser-mapping`, `brace-expansion`, `postcss`) to resolve the remaining npm audit advisories, including a `nanoid` infinite-loop advisory (dev dependency only).
- Unified the project banner background color.

### Internal
- CI now deploys on version tags instead of every push to main.
- Dead code removed (unused `releaseMicrophone` export, `NoteName` type, and the `volumeStats` module).
- MIT LICENSE added; `nvmrc`/`engines` and eslint/prettier tooling added.

## v0.2.0 (2026-08-28)

### Features
- **Resonance tab**: new tab estimating vocal resonance from formant analysis, alongside the existing Pitch and Phrases tabs.
- **Volume level feedback**: PitchView now shows real time input volume, so users can tell a silent reading from a quiet one.
- **Intonation readout**: PhrasesView now reports intonation alongside pitch during phrase practice.
- Gendered pitch bands and curve stripes removed from the pitch display, replaced with a neutral presentation.

### Fixes
- Corrected the GitHub repository URL shown in the footer.

### Internal
- README's Phrases entry updated to mention the pitch graph and recording feature added in v0.1.0.

## v0.1.0 (2026-06-14)

### Features
- Initial release: Pitch and Phrases views, with a pitch graph and recording on the Phrases view, and a live Hz readout.
- Accessibility improvements and pre launch polish.

### Internal
- CI workflow added, with 80%+ coverage configuration.
