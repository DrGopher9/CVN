# Product Blueprint: CVNP Interactive Web App

## Product Concept
A challenge-driven web app where high school seniors complete short cyber/network missions, discover matching careers, and map those interests directly to Alexandria Tech CVNP pathways.

## Core Outcomes
- Students complete at least 3 activities in one session.
- Students understand at least 2 career options connected to completed activities.
- Students identify a CVNP program path (diploma or AAS).
- Students take an actionable next step (campus visit RSVP).

## Primary User Journey
1. Land on a dynamic mission dashboard.
2. Pick a mission track: `Defend`, `Connect`, `Automate`, or `Build`.
3. Complete short activities with score, badges, and narrative feedback.
4. Unlock a career match card tied to demonstrated interests.
5. Review program pathway map (courses, credentials, timeline).
6. Click a clear next-step CTA.

## Feature Set (MVP)
- Mission Hub with level cards and completion state.
- Cyber Lab:
  - packet analysis game with progressive difficulty.
  - password and auth challenge with real-time feedback.
- Networking Lab:
  - topology puzzle and routing optimization challenge.
  - latency/throughput tradeoff simulator.
- Virtualization/Cloud Lab:
  - sandbox incident response and snapshot recovery challenge.
- Career Matcher:
  - 8-12 question interest and skill quiz.
  - recommendations mapped to job families and CVNP pathways.
- Program Explorer:
  - CVNP diploma + AAS comparisons.
  - certs and outcomes in simple visual cards.
- Progress and Rewards:
  - badges, streaks, score summary, and session recap.

## Experience Design for High School Seniors
- Use 2-5 minute challenge loops and immediate scoring.
- Use social proof modules: student stories, competition highlights, outcomes.
- Use visual status cues: progress bars, unlock states, rank tiers.
- Use challenge language that feels game-native but still academic.
- Avoid text-heavy pages without interaction every screen.

## Content Strategy
- Structure content by challenge, not by department.
- Translate technical terms with plain-language hover help.
- Tie each module to one concrete real-world job task.
- Keep career facts current and sourced.

## Conversion Strategy
- Primary CTA: RSVP for campus visit.
- CTA destination URL: `https://www.alextech.edu/about-atcc/campus-visits`.
- Supporting CTA: download pathway guide.
- Trigger CTA timing after mission completion when motivation is highest.

## KPI Framework
- Activation: first mission started.
- Engagement: mission completion count, average session time, return rate.
- Learning proxy: challenge correctness and improvement over retries.
- Conversion: clicks to program pages and inquiry form starts/submits.

## Out of Scope (MVP)
- Formal gradebook.
- Deep personalization by school district.
- Multiplayer real-time competition backend.
