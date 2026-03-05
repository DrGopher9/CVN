# Technical Architecture and Implementation Plan

## Recommended Architecture
- Frontend: React + TypeScript + Vite.
- Routing: `react-router`.
- State: global store for progress, achievements, and career matcher output.
- Content model: JSON/Markdown content files for modules and career cards.
- Persistence: anonymous localStorage with versioned schema (no login/account model).

## Application Structure
- `src/app/`: shell, routes, layout.
- `src/modules/`: cyber, networking, virtualization, careers.
- `src/components/`: shared UI components.
- `src/content/`: pathway data, career facts, challenge config.
- `src/lib/`: scoring, analytics event emitters, accessibility helpers.
- `src/styles/`: design tokens and theme layers.

## Data Contracts (High Level)
- `ChallengeDefinition`
  - id, title, domain, objective, difficulty, timeEstimate, rewards.
- `ChallengeResult`
  - challengeId, attempts, score, completedAt.
  - sessionId (anonymous), no personally identifying fields.
- `CareerProfile`
  - id, roleName, summary, skills, outlookStats, cvnpPathways.
- `ProgramPathway`
  - id, credentialType, duration, keyCourses, certifications, nextStepUrl.

## Interaction System
- Unified score engine across modules.
- Badge criteria shared across all challenges.
- Difficulty ladder with unlock logic.
- Retry and hint model for learning reinforcement.

## Visual System
- Define CSS variables for color, spacing, typography, motion.
- Use one strong visual direction, not generic dark-template styling.
- Prioritize mobile interactions from first implementation.

## Accessibility Baseline
- Keyboard operation for every interactive element.
- ARIA labels and focus management in games/simulators.
- Reduced-motion support for animations.
- Color contrast tested before release.

## Telemetry Plan
- Event naming convention: `domain_action_target`.
- Core events:
  - `mission_start`
  - `mission_complete`
  - `career_match_generated`
  - `pathway_viewed`
  - `campus_visit_cta_clicked`
  - `campus_visit_rsvp_started`
- Add lightweight event validator in development.

## Conversion Config
- Define a single source-of-truth constant for the primary CTA URL:
  - `CAMPUS_VISIT_URL = "https://www.alextech.edu/about-atcc/campus-visits"`
- Use this constant in mission-complete screens, pathway pages, and header CTA.

## Quality Plan
- Unit tests for scoring and recommendation logic.
- Interaction tests for mission completion flows.
- Accessibility checks in CI (axe/lighthouse).
- Performance budget and bundle-size checks.

## Delivery Phases
1. Build foundation and migrate static pages into components.
2. Implement mission hub and two flagship interactive modules.
3. Add career matcher and CVNP pathway explorer.
4. Add analytics instrumentation and conversion funnels.
5. Pilot with student users and iterate based on observed friction.

## Initial Backlog (First Sprint)
- Set up Vite + TypeScript app scaffold.
- Port navigation + visual tokens.
- Build mission hub route and progress store.
- Rebuild packet routing mini-game as reusable challenge component.
- Rebuild packet sniffer mini-game with configurable scenarios.
- Add analytics event logger stub.
