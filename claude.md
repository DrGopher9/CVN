# Claude Collaboration Guide: CVN Student Experience Web App

## Project Mission
Build a highly interactive, mobile-friendly web app that motivates high school seniors to explore networking and cybersecurity careers and take action toward Alexandria Technical & Community College's Cybersecurity, Virtualization, and Networking (CVNP) programs.

## Target Audience
- Primary: High school seniors (ages 16-18) visiting CVNP content for the first time.
- Secondary: Teachers, counselors, and families reviewing program credibility and outcomes.

## Product Goals
- Increase student engagement with hands-on cyber/networking activities.
- Translate "this is cool" into "I can do this" with confidence-building pathways.
- Make CVNP program value concrete with clear outcomes, pathways, and next steps.
- Capture measurable funnel events: module completion, career explorer completion, program interest CTA clicks.

## Non-Goals (for MVP)
- No full LMS replacement.
- No custom account system in v1.
- No complex multiplayer backend in v1.

## Brand and Voice Direction
- Energy level: confident, playful, challenge-driven.
- Tone: clear, no jargon dumping, no fear-based security messaging.
- Style: mission-based language, instant feedback, visible progress.
- Accessibility: plain language alternatives for technical terms and acronyms.

## Experience Principles
- Learn by doing: every concept should map to an interaction.
- Short loops: 2-5 minute challenge cycles with visible outcomes.
- Choice and agency: let students pick tracks, tools, and challenge difficulty.
- Real-world relevance: show how each task connects to actual careers.
- Actionability: every page should include one concrete next step.

## Functional Pillars
- Interactive mission hub with progress tracker.
- Career exploration with role matcher and day-in-the-life previews.
- CVNP pathways section (programs, certifications, transfer/career outcomes).
- Campus-visit conversion flow with clear RSVP handoff.
- Session analytics for engagement and conversion tracking.

## MVP Scope
- Single-page app + routed modules.
- Anonymous local progress persistence (localStorage only).
- 6-8 interactive mini-challenges across networking and cybersecurity.
- Career quiz and recommended pathway output.
- Program detail pages for CVNP diploma and AAS options.
- Campus visit CTA block and RSVP handoff.

## Suggested Stack
- Frontend: React + TypeScript + Vite.
- State: Zustand or React Context + reducer.
- Styling: CSS variables + utility layer; avoid generic template aesthetics.
- Charts/visuals: lightweight SVG/canvas for packet flow and threat maps.
- Data: JSON content model in repo first; API later.
- Analytics: event schema first, provider integration second.

## Accessibility and Safety Requirements
- WCAG 2.2 AA baseline.
- Keyboard-first interaction for all games and controls.
- Color contrast checks across all themes.
- Avoid glorifying malicious hacking; emphasize legal/ethical practice.
- Privacy-safe telemetry (no unnecessary personal data collection in MVP).

## Build Phases
1. Foundation: app shell, navigation, design tokens, content model.
2. Core interactions: cyber/networking mini-games + scoring and badges.
3. Career and pathway intelligence: role matcher + program mapping.
4. Conversion and instrumentation: CTA funnels + analytics events.
5. Polish and validation: playtesting with students, accessibility fixes, performance tuning.

## Definition of Done (MVP)
- Students can complete at least 3 meaningful learning interactions in one session.
- Students receive personalized career/program recommendations.
- Students can clearly identify at least one CVNP path and one next enrollment step.
- Mobile and desktop performance are acceptable on school hardware.
- Core analytics events are emitted and validated.

## Key Constraints from Current Repo
- Current implementation is static HTML pages with inline JavaScript.
- No shared component architecture, data layer, test suite, or analytics.
- Existing content and interactive snippets can be reused as prototype seeds.

## Locked Decisions
- Rebuild approach: full SPA rebuild (React + TypeScript), not incremental static edits.
- Primary CTA: campus visit RSVP flow.
- Tracking model: anonymous-only session/progress tracking.
- Campus visit endpoint: `https://www.alextech.edu/about-atcc/campus-visits`.

## Open Questions
- Is the primary deployment target GitHub Pages, school-hosted infra, or a managed platform?
- Are there approved branding assets (logos, fonts, colors) from Alexandria Tech/CVNP?
