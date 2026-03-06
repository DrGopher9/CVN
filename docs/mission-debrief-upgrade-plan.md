# Mission Debrief Upgrade Plan

## Objective
Add a post-success content step to each mission that explains how the completed activity maps to real IT work, career roles, and CVNP pathways.

## Product Outcome
- Students immediately connect gameplay to real technical job tasks.
- Students understand why each skill matters in cybersecurity/networking careers.
- Students see a clear bridge from mission completion to ATCC/CVNP action steps.

## Experience Design
- Trigger: appears only after successful mission completion.
- Format:
  - Desktop: modal-style debrief panel.
  - Mobile: full-screen debrief sheet.
- Required sections in each debrief:
  - `What You Just Did`
  - `How This Maps to Real IT Work`
  - `Career Roles Using This Skill`
  - `ATCC/CVNP Connection`
  - `Next Action`
- Actions in debrief:
  - `Continue to Next Mission`
  - `Explore Pathways`
  - `Schedule Campus Visit`

## Technical Plan
1. Data Model
- Add a `debrief` object to mission content entries.
- Structure:
  - `summary`
  - `itFieldMapping`
  - `roles[]`
  - `cvnpConnection`
  - `primaryCta`
  - `secondaryCta`

2. Reusable UI
- Build `MissionDebrief` shared component.
- Inputs:
  - mission id
  - debrief content
  - completion score/badge
  - next mission route
- Accessibility:
  - focus management
  - keyboard navigation
  - ESC to close
  - ARIA labels for dialog/sheet patterns

3. Mission Flow Integration
- After `completeMission(...)`, set local state to show debrief.
- Mission screen remains in success state behind debrief.
- On close/continue, route to next mission or mission hub.

4. Analytics
- Add events:
  - `mission_debrief_viewed`
  - `mission_debrief_cta_clicked`
  - `mission_debrief_dismissed`
- Include payload:
  - `missionId`
  - `sessionId`
  - `score`
  - `badge`
  - `ctaTarget` (when clicked)

## Mission-by-Mission Debrief Content Map
1. Packet Path Rush
- IT Mapping: traffic engineering, latency tuning, fault-aware routing.
- Roles: Network Engineer, NOC Analyst.
- CVNP Connection: routing/switching labs and performance troubleshooting.

2. Live Sniffer Hunt
- IT Mapping: packet inspection, insecure protocol identification, credential risk detection.
- Roles: Cybersecurity Analyst, SOC Analyst.
- CVNP Connection: network security and defensive monitoring workflows.

3. Sandbox Save
- IT Mapping: incident containment, recovery sequencing, rollback strategy.
- Roles: Incident Responder, Systems Security Administrator.
- CVNP Connection: virtualization + security operations labs.

4. Python Fix Lab
- IT Mapping: scripting for automation, bug fixing in defensive tooling.
- Roles: Security Automation Analyst, Junior DevSecOps.
- CVNP Connection: Python-based operations and automation practice.

5. Phishing Detective
- IT Mapping: email triage, social engineering defense, user safety operations.
- Roles: Security Awareness Analyst, SOC Analyst.
- CVNP Connection: policy + detection + response fundamentals.

6. Wi-Fi Attack/Defend Lab
- IT Mapping: wireless hardening, segmentation, secure access control.
- Roles: Network Engineer, Infrastructure Security Specialist.
- CVNP Connection: networking and security configuration labs.

7. Forensics Timeline
- IT Mapping: evidence sequencing, kill-chain reconstruction, root cause analysis.
- Roles: DFIR Analyst, Cybersecurity Investigator.
- CVNP Connection: investigative mindset and incident analysis skill building.

8. Career Boss Round
- IT Mapping: role-task alignment, pathway decision-making.
- Roles: cross-role orientation (SOC, network, cloud, offensive security).
- CVNP Connection: credential selection and career planning decisions.

## Rollout Plan
### Pass 1: Foundation
- Add mission `debrief` content schema.
- Build reusable `MissionDebrief` component.
- Add analytics event hooks.

### Pass 2: Pilot Integration
- Integrate into:
  - `Packet Path Rush`
  - `Live Sniffer Hunt`
- Validate mobile/desktop UX and accessibility.

### Pass 3: Full Integration
- Integrate remaining missions.
- Add mission-specific debrief copy for all 8 missions.
- Verify CTA wiring and completion analytics.

### Pass 4: QA and Content Polish
- Review tone and readability for high school seniors.
- Confirm factual alignment with ATCC/CVNP messaging.
- Perform accessibility and interaction regression checks.

## Acceptance Criteria
- Every successful mission shows a debrief before student exits the mission.
- Debrief includes IT mapping + at least one role connection.
- Debrief CTA click-through is instrumented.
- UX works on both mobile and desktop with keyboard access.
