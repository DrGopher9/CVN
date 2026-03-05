# CVN Mission Control (Rebuild)

Interactive web app for high school seniors exploring cybersecurity, networking, and virtualization careers plus CVNP pathways at Alexandria Tech.

## Stack
- React + TypeScript + Vite
- React Router (HashRouter for GitHub Pages compatibility)
- Anonymous localStorage progress tracking

## Current Build Status
- Phase 1 complete: app shell, routing, progress store, Pages deployment workflow.
- Phase 2 started: two playable missions live (`Packet Path Rush`, `Live Sniffer Hunt`).
- Gamified loop live: unlock path, retries, hints, score awards, and badges.

## Local Development
```bash
npm install
npm run dev
```

## Production Build
```bash
npm run build
npm run preview
```

## GitHub Pages Deployment
This repo includes `.github/workflows/deploy-pages.yml`.

### One-time GitHub settings
1. In GitHub, open `Settings -> Pages`.
2. Set `Source` to `GitHub Actions`.
3. Push to `main` to trigger deployment.

The workflow sets `VITE_BASE_PATH` dynamically to `/<repo-name>/`, so assets resolve correctly for project pages.

## Primary CTA
Campus visit URL used in app:
- https://www.alextech.edu/about-atcc/campus-visits
