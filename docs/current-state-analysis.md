# Current State Analysis (Repo Baseline)

## Snapshot
- Repo is a static website with 7 HTML pages and 1 shared CSS file.
- Total code volume is about 1,110 lines.
- Interactivity exists, but only as page-local inline JavaScript.
- No build system, package manager, tests, analytics, or content model.

## Existing Pages
- `index.html`: intro landing page.
- `about.html`: CVN program overview.
- `careers.html`: role cards with salary claims.
- `cyber.html`: strongest interactive page (hashing, entropy, packet sniffing mini-game).
- `network.html`: packet routing choice simulation.
- `virt.html`: VM malware/snapshot simulation.
- `python.html`: pseudo-code editor simulation.

## Strengths to Keep
- Mission-based framing is already present and motivational.
- Module structure (Cyber, Networking, Virtualization, Python) is clear.
- Several activities already offer immediate feedback loops.
- Visual theme and terminology align with cybersecurity culture.

## Gaps vs. Target Product
- No persistent progress, identity, achievements, or adaptive learning path.
- No unified game loop across pages (points, progression, rewards are isolated).
- No explicit student funnel from exploration to enrollment action.
- No mobile-first interaction design patterns beyond basic responsiveness.
- No analytics events to measure engagement or conversion.
- No trusted citation layer for salary/career facts shown to students.
- No accessibility hardening for keyboard/screen reader users.

## Risks in Current Content
- Some salary and technical claims are uncited and may age quickly.
- Inline JavaScript makes reuse and testing difficult.
- Copy occasionally assumes prior technical context; can intimidate newcomers.
- Interactions are mostly single-attempt and non-adaptive.

## Recommendation
Treat the current repo as a functional prototype library, not as the final architecture. Reuse activity concepts and narrative style, then rebuild into a modular app with shared state, content/data files, analytics instrumentation, and accessibility standards.
