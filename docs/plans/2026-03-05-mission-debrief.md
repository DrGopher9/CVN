# Mission Debrief Feature Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a visually distinctive post-success debrief panel to every mission that bridges gameplay to real IT careers and CVNP pathways.

**Architecture:** Debrief state is managed locally per mission page (each page already owns `didSucceed`; we add `showDebrief` alongside it). A single reusable `MissionDebrief` component receives debrief content, score, badge, and next-mission route as props. Debrief content data lives in a dedicated `src/content/debrief-content.ts` file keyed by `MissionId`.

**Tech Stack:** React 18, TypeScript, CSS variables (existing design tokens), CSS `@keyframes` animations (no external animation library).

---

## Design Spec: MissionDebrief Component

**Aesthetic:** "Mission Intel Report" — a classified military-briefing document that materializes after mission success. Feels like receiving a real debrief from a senior analyst. Distinctive, memorable, fits the existing dark navy + cyan/lime cyber design system.

**Visual details:**
- Full-viewport backdrop (`rgba(2, 8, 20, 0.88)`) with `backdrop-filter: blur(6px)`
- Panel slides up from bottom on mobile; scales in from center on desktop
- "CLASSIFICATION: CLEARED" stripe in lime across the top edge of the panel
- Header: `MISSION DEBRIEF` in Chakra Petch with a pulsing lime left-border accent
- Score + badge displayed in a stats bar at the top of the panel
- Five sections separated by `::before` pseudo-element ruled lines with `▸` glyph labels
- Role chips: small cyan pill badges in a flex-wrap row
- CTA row at bottom: primary orange gradient button + secondary cyan outline button
- CSS entry animations: `debrief-slide-up` (mobile) / `debrief-scale-in` (desktop)
- ESC key closes; first CTA button receives focus on open
- `role="dialog"`, `aria-modal="true"`, `aria-labelledby="debrief-title"`

---

## Task 1: Extend TypeScript types

**Files:**
- Modify: `src/types.ts`

**Step 1: Add debrief types**

Add the following to `src/types.ts` after the existing `MissionDefinition` interface:

```typescript
export type DebriefCtaTarget = 'next-mission' | 'pathways' | 'visit';

export interface DebriefCta {
  label: string;
  target: DebriefCtaTarget;
}

export interface DebriefContent {
  summary: string;
  itFieldMapping: string;
  roles: string[];
  cvnpConnection: string;
  primaryCta: DebriefCta;
  secondaryCta: DebriefCta;
}
```

**Step 2: Verify TypeScript compiles**

```bash
cd /Users/mattmccullough/Desktop/CVN
npx tsc --noEmit
```
Expected: no errors.

**Step 3: Commit**

```bash
git add src/types.ts
git commit -m "feat: add DebriefContent and DebriefCta types"
```

---

## Task 2: Create debrief content data

**Files:**
- Create: `src/content/debrief-content.ts`

**Step 1: Create the file**

```typescript
import { DebriefContent } from '../types';

export const debriefContent: Record<string, DebriefContent> = {
  'packet-path': {
    summary:
      'You analyzed three network routes under live traffic pressure and selected the one with optimal throughput and zero packet loss. That split-second decision is exactly what keeps real networks running.',
    itFieldMapping:
      'Traffic engineering, latency optimization, and fault-aware routing are core daily tasks for network engineers. When a video call drops or a stream buffers, someone with your skills figures out why and reroutes traffic before users notice.',
    roles: ['Network Engineer', 'NOC Analyst', 'Infrastructure Engineer'],
    cvnpConnection:
      'CVNP Networking labs at ATCC put you on real Cisco gear doing exactly this — routing table analysis, interface troubleshooting, and performance tuning across live topologies.',
    primaryCta: { label: 'Next Mission', target: 'next-mission' },
    secondaryCta: { label: 'Explore Pathways', target: 'pathways' }
  },

  'password-pulse': {
    summary:
      'You intercepted unencrypted network traffic and identified exposed credentials before an attacker could. Recognizing what data should never travel in plaintext is a foundational defensive skill.',
    itFieldMapping:
      'Packet inspection and insecure protocol identification are front-line skills in security operations centers. Analysts use tools like Wireshark daily to catch credential leaks, detect suspicious traffic patterns, and harden communication channels.',
    roles: ['Cybersecurity Analyst', 'SOC Analyst', 'Penetration Tester'],
    cvnpConnection:
      'CVNP Security courses at ATCC include hands-on packet capture labs where you work through real traffic captures and defensive monitoring workflows — exactly the skills employers are hiring for.',
    primaryCta: { label: 'Next Mission', target: 'next-mission' },
    secondaryCta: { label: 'Explore Pathways', target: 'pathways' }
  },

  'sandbox-reset': {
    summary:
      'You contained a malware outbreak, sequenced the right recovery actions, and rolled back to a clean snapshot before the threat spread. Knowing when to isolate and when to restore is what separates a good incident responder from a great one.',
    itFieldMapping:
      'Incident containment, recovery sequencing, and rollback strategy are the core of virtualization and security operations. Every organization running VMs needs people who can execute this under pressure — calmly and correctly.',
    roles: ['Incident Responder', 'Systems Security Administrator', 'Virtualization Engineer'],
    cvnpConnection:
      'CVNP Virtualization labs at ATCC use enterprise hypervisors where you practice snapshot management, VM isolation, and security response in environments that mirror real data centers.',
    primaryCta: { label: 'Next Mission', target: 'next-mission' },
    secondaryCta: { label: 'Explore Pathways', target: 'pathways' }
  },

  'python-fix': {
    summary:
      'You debugged a Python firewall deployment script and got it running correctly under attack conditions. Security tools are only as good as the code behind them — and you just proved you can fix that code.',
    itFieldMapping:
      'Security automation and defensive tooling are how modern teams scale their defenses. Scripting languages like Python are used to automate log parsing, trigger alerts, deploy configs, and patch vulnerabilities faster than any manual process.',
    roles: ['Security Automation Analyst', 'Junior DevSecOps Engineer', 'Security Engineer'],
    cvnpConnection:
      'ATCC CVNP programs include Python-based automation coursework where you write and debug scripts that run real security operations — not toy examples, but production-style tooling.',
    primaryCta: { label: 'Next Mission', target: 'next-mission' },
    secondaryCta: { label: 'Explore Pathways', target: 'pathways' }
  },

  'phishing-detective': {
    summary:
      'You triaged a full inbox of suspicious messages, correctly flagged social engineering attempts, and protected users from credential theft. Most successful cyberattacks start with a single bad click — you just stopped them.',
    itFieldMapping:
      'Email triage, social engineering defense, and user safety operations are among the highest-volume tasks in security awareness and SOC roles. Analysts review reported phishing attempts daily and create detection rules based on what they find.',
    roles: ['Security Awareness Analyst', 'SOC Analyst', 'Email Security Specialist'],
    cvnpConnection:
      'CVNP cybersecurity coursework covers detection policy, response procedures, and real-world phishing simulation — the exact workflow you practiced in this mission.',
    primaryCta: { label: 'Next Mission', target: 'next-mission' },
    secondaryCta: { label: 'Explore Pathways', target: 'pathways' }
  },

  'wifi-defense': {
    summary:
      'You identified wireless vulnerabilities and hardened a school network against common attacks — changing weak encryption, removing rogue access points, and locking down guest access. Wireless security is one of the most overlooked and most exploited surfaces in any organization.',
    itFieldMapping:
      'Wireless hardening, network segmentation, and secure access control configuration are hands-on tasks for network and infrastructure security roles. Every hospital, school, and business with Wi-Fi needs this expertise.',
    roles: ['Network Engineer', 'Infrastructure Security Specialist', 'Wireless Network Administrator'],
    cvnpConnection:
      'ATCC CVNP Networking labs cover wireless security standards, access point configuration, and segmentation strategies on real enterprise-grade equipment.',
    primaryCta: { label: 'Next Mission', target: 'next-mission' },
    secondaryCta: { label: 'Explore Pathways', target: 'pathways' }
  },

  'forensics-timeline': {
    summary:
      'You reconstructed an incident chain from fragmented log data, identified patient zero, and mapped the kill chain from initial access to lateral movement. Digital forensics is detective work with a keyboard.',
    itFieldMapping:
      'Evidence sequencing, kill-chain reconstruction, and root cause analysis are the core of digital forensics and incident response. DFIR analysts are called in after breaches to answer the hardest question: exactly what happened, and how do we make sure it never happens again?',
    roles: ['DFIR Analyst', 'Cybersecurity Investigator', 'Incident Response Lead'],
    cvnpConnection:
      'CVNP Security programs at ATCC build the investigative mindset and technical toolkit — log analysis, timeline reconstruction, and evidence documentation — that DFIR careers demand.',
    primaryCta: { label: 'Next Mission', target: 'next-mission' },
    secondaryCta: { label: 'Explore Pathways', target: 'pathways' }
  },

  'career-boss': {
    summary:
      'You matched real IT job tasks to the roles that perform them and discovered where your strengths naturally land. Understanding the career landscape means you can make a deliberate choice — not just take whatever job comes first.',
    itFieldMapping:
      'Role-task alignment is exactly how hiring managers think. They hire for specific responsibilities: can you monitor and triage (SOC)? Design and maintain infrastructure (networking)? Automate defenses (DevSecOps)? Investigate incidents (DFIR)? You now know the difference.',
    roles: ['SOC Analyst', 'Network Engineer', 'Cloud Security Engineer', 'Penetration Tester', 'DFIR Analyst'],
    cvnpConnection:
      'ATCC CVNP programs offer pathways toward AAS degrees and industry certifications — CompTIA Security+, Network+, CySA+ — that directly map to the career roles you just explored. The next step is a campus visit to see exactly where you fit.',
    primaryCta: { label: 'Schedule Campus Visit', target: 'visit' },
    secondaryCta: { label: 'Explore Pathways', target: 'pathways' }
  }
};
```

**Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

**Step 3: Commit**

```bash
git add src/content/debrief-content.ts
git commit -m "feat: add mission debrief content for all 8 missions"
```

---

## Task 3: Build the MissionDebrief component

**Files:**
- Create: `src/components/MissionDebrief.tsx`

**Step 1: Create the component**

```tsx
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '../lib/analytics';
import { DebriefContent, MissionId } from '../types';

interface MissionDebriefProps {
  missionId: MissionId;
  debrief: DebriefContent;
  score: number;
  badge: string;
  nextMissionRoute: string | null;
  sessionId: string;
  onClose: () => void;
}

export function MissionDebrief({
  missionId,
  debrief,
  score,
  badge,
  nextMissionRoute,
  sessionId,
  onClose
}: MissionDebriefProps) {
  const navigate = useNavigate();
  const primaryRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    trackEvent('mission_debrief_viewed', { missionId, sessionId, score, badge });
    primaryRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        handleDismiss();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleDismiss() {
    trackEvent('mission_debrief_dismissed', { missionId, sessionId, score, badge });
    onClose();
  }

  function handlePrimaryCta() {
    trackEvent('mission_debrief_cta_clicked', {
      missionId,
      sessionId,
      score,
      badge,
      ctaTarget: debrief.primaryCta.target
    });

    if (debrief.primaryCta.target === 'next-mission' && nextMissionRoute) {
      navigate(nextMissionRoute);
    } else if (debrief.primaryCta.target === 'pathways') {
      navigate('/pathways');
    } else if (debrief.primaryCta.target === 'visit') {
      window.open('https://www.alextech.edu/about-atcc/campus-visits', '_blank', 'noopener');
    } else {
      navigate('/missions');
    }
  }

  function handleSecondaryCta() {
    trackEvent('mission_debrief_cta_clicked', {
      missionId,
      sessionId,
      score,
      badge,
      ctaTarget: debrief.secondaryCta.target
    });

    if (debrief.secondaryCta.target === 'pathways') {
      navigate('/pathways');
    } else if (debrief.secondaryCta.target === 'visit') {
      window.open('https://www.alextech.edu/about-atcc/campus-visits', '_blank', 'noopener');
    } else if (debrief.secondaryCta.target === 'next-mission' && nextMissionRoute) {
      navigate(nextMissionRoute);
    } else {
      navigate('/missions');
    }
  }

  return (
    <div
      className="debrief-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="debrief-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleDismiss();
      }}
    >
      <div className="debrief-panel">
        <div className="debrief-classification">CLASSIFICATION: CLEARED</div>

        <div className="debrief-header">
          <p className="debrief-eyebrow">Debrief Report</p>
          <h2 id="debrief-title" className="debrief-title">Mission Complete</h2>
        </div>

        <div className="debrief-stats-bar">
          <div className="debrief-stat">
            <span className="debrief-stat-label">Score</span>
            <strong className="debrief-stat-value">+{score}</strong>
          </div>
          <div className="debrief-divider-v" />
          <div className="debrief-stat">
            <span className="debrief-stat-label">Badge Earned</span>
            <strong className="debrief-stat-badge">{badge}</strong>
          </div>
        </div>

        <div className="debrief-sections">
          <section className="debrief-section">
            <h3 className="debrief-section-label">What You Just Did</h3>
            <p className="debrief-section-body">{debrief.summary}</p>
          </section>

          <section className="debrief-section">
            <h3 className="debrief-section-label">How This Maps to Real IT Work</h3>
            <p className="debrief-section-body">{debrief.itFieldMapping}</p>
          </section>

          <section className="debrief-section">
            <h3 className="debrief-section-label">Career Roles Using This Skill</h3>
            <div className="debrief-roles">
              {debrief.roles.map((role) => (
                <span key={role} className="debrief-role-chip">{role}</span>
              ))}
            </div>
          </section>

          <section className="debrief-section">
            <h3 className="debrief-section-label">ATCC / CVNP Connection</h3>
            <p className="debrief-section-body">{debrief.cvnpConnection}</p>
          </section>
        </div>

        <div className="debrief-cta-row">
          <button
            ref={primaryRef}
            className="primary-cta debrief-primary-cta"
            onClick={handlePrimaryCta}
          >
            {debrief.primaryCta.label}
          </button>
          <button
            className="secondary-cta"
            onClick={handleSecondaryCta}
          >
            {debrief.secondaryCta.label}
          </button>
          <button
            className="debrief-dismiss"
            onClick={handleDismiss}
            aria-label="Close debrief"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

**Step 3: Commit**

```bash
git add src/components/MissionDebrief.tsx
git commit -m "feat: add MissionDebrief reusable component"
```

---

## Task 4: Add MissionDebrief CSS to styles.css

**Files:**
- Modify: `src/styles.css` (append to end of file)

**Step 1: Append the following CSS block to the end of `src/styles.css`**

```css
/* ── Mission Debrief ──────────────────────────────────────── */

@keyframes debrief-slide-up {
  from {
    opacity: 0;
    transform: translateY(48px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes debrief-scale-in {
  from {
    opacity: 0;
    transform: scale(0.94) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes debrief-backdrop-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.debrief-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(2, 8, 20, 0.88);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;
  animation: debrief-backdrop-in 200ms ease both;
}

@media (min-width: 640px) {
  .debrief-backdrop {
    align-items: center;
    padding: 1.5rem;
  }
}

.debrief-panel {
  position: relative;
  width: 100%;
  max-width: 640px;
  max-height: 92dvh;
  overflow-y: auto;
  background: linear-gradient(160deg, #0c1e3d 0%, #071428 100%);
  border: 1px solid rgba(182, 255, 59, 0.45);
  border-radius: 20px 20px 0 0;
  padding: 0 0 1.5rem;
  animation: debrief-slide-up 320ms cubic-bezier(0.22, 1, 0.36, 1) both;
  box-shadow:
    0 0 0 1px rgba(0, 210, 255, 0.12),
    0 -8px 48px rgba(0, 0, 0, 0.55),
    0 0 80px rgba(182, 255, 59, 0.07);
}

@media (min-width: 640px) {
  .debrief-panel {
    border-radius: 20px;
    animation: debrief-scale-in 300ms cubic-bezier(0.22, 1, 0.36, 1) both;
  }
}

.debrief-classification {
  background: linear-gradient(90deg, var(--accent-lime), #8fd52b);
  color: #061000;
  font-family: 'Chakra Petch', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  text-align: center;
  padding: 0.3rem 1rem;
  border-radius: 18px 18px 0 0;
}

@media (min-width: 640px) {
  .debrief-classification {
    border-radius: 18px 18px 0 0;
  }
}

.debrief-header {
  padding: 1.1rem 1.4rem 0;
  border-left: 3px solid var(--accent-lime);
  margin: 1rem 1.4rem 0;
}

.debrief-eyebrow {
  margin: 0;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--accent-lime);
}

.debrief-title {
  margin: 0.25rem 0 0;
  font-family: 'Chakra Petch', sans-serif;
  font-size: clamp(1.4rem, 3.5vw, 2rem);
  color: var(--text-main);
  letter-spacing: 0.02em;
}

.debrief-stats-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 1.4rem;
  padding: 0.75rem 1rem;
  background: rgba(5, 16, 36, 0.75);
  border: 1px solid rgba(0, 210, 255, 0.25);
  border-radius: 12px;
}

.debrief-stat {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.debrief-stat-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-soft);
  font-weight: 700;
}

.debrief-stat-value {
  font-family: 'Chakra Petch', sans-serif;
  font-size: 1.55rem;
  color: var(--accent-cyan);
  line-height: 1;
}

.debrief-stat-badge {
  font-family: 'Chakra Petch', sans-serif;
  font-size: 1rem;
  color: var(--accent-lime);
  line-height: 1.2;
}

.debrief-divider-v {
  width: 1px;
  align-self: stretch;
  background: rgba(154, 195, 231, 0.25);
  flex-shrink: 0;
}

.debrief-sections {
  display: grid;
  gap: 0;
  margin: 0 1.4rem;
}

.debrief-section {
  padding: 0.9rem 0;
  border-top: 1px solid rgba(154, 195, 231, 0.14);
}

.debrief-section:first-child {
  border-top: none;
}

.debrief-section-label {
  margin: 0 0 0.4rem;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--accent-cyan);
}

.debrief-section-body {
  margin: 0;
  font-size: 0.93rem;
  line-height: 1.6;
  color: var(--text-soft);
}

.debrief-roles {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.1rem;
}

.debrief-role-chip {
  display: inline-flex;
  align-items: center;
  padding: 0.28rem 0.65rem;
  border: 1px solid rgba(0, 210, 255, 0.5);
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--accent-cyan);
  background: rgba(0, 210, 255, 0.07);
  letter-spacing: 0.03em;
}

.debrief-cta-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.65rem;
  margin: 1.1rem 1.4rem 0;
}

.debrief-primary-cta {
  flex: 1 1 auto;
}

.debrief-dismiss {
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6b94ba;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.5rem 0.3rem;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color 140ms ease;
}

.debrief-dismiss:hover,
.debrief-dismiss:focus-visible {
  color: var(--text-soft);
}
```

**Step 2: Verify dev server renders correctly**

```bash
npm run dev
```
Open the app in a browser and verify no CSS errors in the console.

**Step 3: Commit**

```bash
git add src/styles.css
git commit -m "feat: add MissionDebrief CSS styles and animations"
```

---

## Task 5: Integrate debrief into Packet Path Rush (pilot)

**Files:**
- Modify: `src/pages/PacketPathPage.tsx`

**Step 1: Add these imports at the top of `PacketPathPage.tsx`** (after existing imports)

```tsx
import { MissionDebrief } from '../components/MissionDebrief';
import { debriefContent } from '../content/debrief-content';
```

**Step 2: Add `showDebrief` state and `lastScore`/`lastBadge` refs** (after the existing `useState` declarations, around line 37)

```tsx
const [showDebrief, setShowDebrief] = useState(false);
const [debriefScore, setDebriefScore] = useState(0);
const [debriefBadge, setDebriefBadge] = useState('');
```

**Step 3: In `handleSubmit`, after `completeMission(...)` and `setDidSucceed(true)`, add:**

```tsx
setDebriefScore(score);
setDebriefBadge(badge);
setShowDebrief(true);
```

So the success block looks like:
```tsx
if (selectedRoute === 'B') {
  const score = calculateMissionScore(
    missionDef.rewardPoints,
    attemptsAfterSubmit,
    stats.hintsUsed,
    40
  );
  const badge = packetPathBadge(attemptsAfterSubmit, stats.hintsUsed);
  completeMission(missionDef.id, score, badge);
  setFeedback(
    `Mission clear. Latency held at 2ms. Score +${score}. Badge unlocked: ${badge}.`
  );
  setDidSucceed(true);
  setDebriefScore(score);
  setDebriefBadge(badge);
  setShowDebrief(true);
  return;
}
```

**Step 4: Add debrief render at the bottom of the returned JSX**, just before the closing `</section>` tag:

```tsx
{showDebrief ? (
  <MissionDebrief
    missionId={missionDef.id}
    debrief={debriefContent[missionDef.id]}
    score={debriefScore}
    badge={debriefBadge}
    nextMissionRoute="/missions/password-pulse"
    sessionId={progress.sessionId}
    onClose={() => setShowDebrief(false)}
  />
) : null}
```

**Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

**Step 6: Manually test in dev server**

```bash
npm run dev
```
- Navigate to `/missions/packet-path`
- Select Route B and submit
- Debrief panel should appear over the success state
- Test ESC key dismisses it
- Test "Next Mission" navigates to `/missions/password-pulse`
- Test "Explore Pathways" navigates to `/pathways`
- Test "Skip" dismisses
- Test keyboard tab order within debrief
- Resize to mobile width and verify full-screen sheet appears

**Step 7: Commit**

```bash
git add src/pages/PacketPathPage.tsx
git commit -m "feat: integrate MissionDebrief into Packet Path Rush"
```

---

## Task 6: Integrate debrief into Live Sniffer Hunt (pilot)

**Files:**
- Modify: `src/pages/SnifferPage.tsx`

**Step 1: Read the file first to find the exact completion call location**

Look for the `completeMission(...)` call and the state that controls success display.

**Step 2: Add imports** (same pattern as Task 5)

```tsx
import { MissionDebrief } from '../components/MissionDebrief';
import { debriefContent } from '../content/debrief-content';
```

**Step 3: Add debrief state** (same pattern)

```tsx
const [showDebrief, setShowDebrief] = useState(false);
const [debriefScore, setDebriefScore] = useState(0);
const [debriefBadge, setDebriefBadge] = useState('');
```

**Step 4: After `completeMission(...)` call, add:**

```tsx
setDebriefScore(score);
setDebriefBadge(badge);
setShowDebrief(true);
```

**Step 5: Add debrief render at the bottom of returned JSX** before closing `</section>`:

```tsx
{showDebrief ? (
  <MissionDebrief
    missionId={missionDef.id}
    debrief={debriefContent[missionDef.id]}
    score={debriefScore}
    badge={debriefBadge}
    nextMissionRoute="/missions/sandbox-reset"
    sessionId={progress.sessionId}
    onClose={() => setShowDebrief(false)}
  />
) : null}
```

**Step 6: Verify and commit**

```bash
npx tsc --noEmit
git add src/pages/SnifferPage.tsx
git commit -m "feat: integrate MissionDebrief into Live Sniffer Hunt"
```

---

## Task 7: Integrate debrief into Sandbox Save

**Files:**
- Modify: `src/pages/SandboxMissionPage.tsx`

Follow the same pattern as Tasks 5–6. Next mission route: `/missions/python-fix`.

```bash
git add src/pages/SandboxMissionPage.tsx
git commit -m "feat: integrate MissionDebrief into Sandbox Save"
```

---

## Task 8: Integrate debrief into Python Fix Lab

**Files:**
- Modify: `src/pages/PythonMissionPage.tsx`

Follow the same pattern. Next mission route: `/missions/phishing-detective`.

```bash
git add src/pages/PythonMissionPage.tsx
git commit -m "feat: integrate MissionDebrief into Python Fix Lab"
```

---

## Task 9: Integrate debrief into Phishing Detective

**Files:**
- Modify: `src/pages/PhishingMissionPage.tsx`

Follow the same pattern. Next mission route: `/missions/wifi-defense`.

```bash
git add src/pages/PhishingMissionPage.tsx
git commit -m "feat: integrate MissionDebrief into Phishing Detective"
```

---

## Task 10: Integrate debrief into Wi-Fi Attack/Defend Lab

**Files:**
- Modify: `src/pages/WifiMissionPage.tsx`

Follow the same pattern. Next mission route: `/missions/forensics-timeline`.

```bash
git add src/pages/WifiMissionPage.tsx
git commit -m "feat: integrate MissionDebrief into Wi-Fi Lab"
```

---

## Task 11: Integrate debrief into Forensics Timeline

**Files:**
- Modify: `src/pages/ForensicsMissionPage.tsx`

Follow the same pattern. Next mission route: `/missions/career-boss`.

```bash
git add src/pages/ForensicsMissionPage.tsx
git commit -m "feat: integrate MissionDebrief into Forensics Timeline"
```

---

## Task 12: Integrate debrief into Career Boss Round

**Files:**
- Modify: `src/pages/CareerBossMissionPage.tsx`

Follow the same pattern. `nextMissionRoute` is `null` (this is the final mission). Primary CTA is "Schedule Campus Visit" (target: `visit`) — already specified in the debrief content for `career-boss`.

```tsx
{showDebrief ? (
  <MissionDebrief
    missionId={missionDef.id}
    debrief={debriefContent[missionDef.id]}
    score={debriefScore}
    badge={debriefBadge}
    nextMissionRoute={null}
    sessionId={progress.sessionId}
    onClose={() => setShowDebrief(false)}
  />
) : null}
```

```bash
git add src/pages/CareerBossMissionPage.tsx
git commit -m "feat: integrate MissionDebrief into Career Boss Round"
```

---

## Task 13: Final QA pass

**Step 1: TypeScript clean build**

```bash
npx tsc --noEmit
```
Expected: zero errors.

**Step 2: Dev server smoke test — check every mission**

```bash
npm run dev
```

For each of the 8 missions:
- Complete the mission successfully
- Confirm debrief panel appears
- Confirm score and badge display correctly
- Confirm all three buttons work (primary CTA, secondary CTA, Skip)
- Confirm ESC closes
- Confirm clicking backdrop closes

**Step 3: Mobile viewport test**

In browser DevTools, set viewport to 390×844 (iPhone 14). Verify:
- Debrief appears as a bottom sheet (slide-up animation)
- Content is scrollable if it overflows
- CTA buttons are tappable at full width

**Step 4: Accessibility check**

- Tab through the debrief with keyboard only — confirm focus starts on primary CTA
- Confirm dialog role and aria-modal are present in DevTools Elements panel
- Confirm `aria-labelledby` points to the h2 with id `debrief-title`

**Step 5: Build check**

```bash
npm run build
```
Expected: clean build, no TypeScript or Vite errors.

**Step 6: Final commit**

```bash
git add -A
git commit -m "feat: mission debrief feature complete — all 8 missions integrated"
```

---

## Mission-to-Route Map (reference)

| Mission ID | Page file | Next mission route |
|---|---|---|
| `packet-path` | `PacketPathPage.tsx` | `/missions/password-pulse` |
| `password-pulse` | `SnifferPage.tsx` | `/missions/sandbox-reset` |
| `sandbox-reset` | `SandboxMissionPage.tsx` | `/missions/python-fix` |
| `python-fix` | `PythonMissionPage.tsx` | `/missions/phishing-detective` |
| `phishing-detective` | `PhishingMissionPage.tsx` | `/missions/wifi-defense` |
| `wifi-defense` | `WifiMissionPage.tsx` | `/missions/forensics-timeline` |
| `forensics-timeline` | `ForensicsMissionPage.tsx` | `/missions/career-boss` |
| `career-boss` | `CareerBossMissionPage.tsx` | `null` (final mission) |

## Acceptance Criteria

- [ ] Every successful mission completion shows a debrief before the student exits
- [ ] Debrief includes IT mapping + at least one role connection (all missions have 3+ roles)
- [ ] Debrief CTA click-through emits `mission_debrief_cta_clicked` with `ctaTarget`
- [ ] `mission_debrief_viewed` and `mission_debrief_dismissed` events fire correctly
- [ ] UX works on mobile (bottom sheet) and desktop (centered modal)
- [ ] Keyboard accessible: focus on open, ESC to close, tab order correct
- [ ] `role="dialog"` + `aria-modal="true"` + `aria-labelledby` present
- [ ] TypeScript builds clean with zero errors
