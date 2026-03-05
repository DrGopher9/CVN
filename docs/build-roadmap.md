# Build Roadmap (High Level)

## Phase 0: Alignment (1 week)
- Confirm audience, brand constraints, and hosting.
- Lock and validate campus-visit endpoint integration:
  - `https://www.alextech.edu/about-atcc/campus-visits`
- Validate program facts and approved messaging with CVNP stakeholders.
- Finalize MVP scope from `claude.md` and `docs/product-blueprint.md`.

## Phase 1: Foundation (1-2 weeks)
- Create SPA codebase (React + TypeScript + Vite).
- Implement app shell, routes, theme tokens, responsive nav.
- Add global progress store and anonymous local persistence.
- Add analytics event schema and debug logger.

## Phase 2: Interactive Core (2-3 weeks)
- Build mission hub with unlock/progress states.
- Implement cybersecurity and networking flagship modules.
- Add feedback loops: points, badges, retries, hints.
- Add accessibility support and keyboard controls.

## Phase 3: Career + Program Layer (1-2 weeks)
- Build career matcher and recommendation cards.
- Build CVNP pathway explorer with source-backed facts.
- Connect challenge outcomes to role recommendations.

## Phase 4: Conversion + Validation (1-2 weeks)
- Add campus-visit CTA blocks and RSVP handoff.
- Instrument conversion analytics and funnel dashboards.
- Run usability sessions with high school seniors and advisors.
- Iterate copy and interactions based on observed friction.

## Phase 5: Launch Readiness (1 week)
- Accessibility and performance audit.
- Content verification pass with source date checks.
- Prepare facilitator guide for school demos/events.

## Milestone Gate Criteria
- Gate A: Students can navigate and complete one challenge on mobile.
- Gate B: Students complete 3+ modules and receive career recommendations.
- Gate C: CTA funnel is live and analytics are collecting clean events.
- Gate D: Pilot feedback integrated and production deployment approved.
