# CVN Mission Control (Rebuild)

Interactive web app for high school seniors exploring cybersecurity, networking, and virtualization careers plus CVNP pathways at Alexandria Tech.

## Stack
- React + TypeScript + Vite
- React Router (HashRouter for GitHub Pages compatibility)
- Anonymous localStorage progress tracking

## Current Build Status
- Phase 1 complete: app shell, routing, progress store, Pages deployment workflow.
- Phase 2 active: eight playable missions live, including phishing, Wi-Fi defense, forensics, and a career boss round.
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

Build uses a relative asset base (`./`) so it works for both project pages (`/repo/`) and custom root domains.

## Primary CTA
Campus visit URL used in app:
- https://www.alextech.edu/about-atcc/campus-visits
