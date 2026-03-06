# Python Log Parser Mission — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a hard second Python mission ("Threat Log Parser") between forensics-timeline and career-boss, where students fix four independent bugs in a firewall log analysis script.

**Architecture:** New mission page follows the exact same pattern as PythonMissionPage.tsx — textarea editor, simulated console, string-analysis validation. Four independent checks run on each submission and print per-check PASS/FAIL output. All four must pass to complete. Chain update: forensics-timeline → python-log-parser → career-boss.

**Tech Stack:** React 18, TypeScript, existing CSS classes (python-layout, editor-shell, console-shell, python-editor, console-line, panel-head, console-scroll), react-router-dom, progress context.

---

## Task 1: Add mission ID to types

**Files:**
- Modify: `src/types.ts`

**Step 1: Read the file**
```bash
# confirm current MISSION_IDS array before editing
```

**Step 2: Add `python-log-parser` to MISSION_IDS**

Find this line:
```typescript
export const MISSION_IDS = [
  'packet-path',
  'password-pulse',
  'sandbox-reset',
  'python-fix',
  'phishing-detective',
  'wifi-defense',
  'forensics-timeline',
  'career-boss'
] as const;
```

Replace with:
```typescript
export const MISSION_IDS = [
  'packet-path',
  'password-pulse',
  'sandbox-reset',
  'python-fix',
  'phishing-detective',
  'wifi-defense',
  'forensics-timeline',
  'python-log-parser',
  'career-boss'
] as const;
```

**Step 3: Verify tsc**
```bash
cd /Users/mattmccullough/Desktop/CVN && npx tsc --noEmit
```
Expected: no errors.

**Step 4: Commit**
```bash
git add src/types.ts
git commit -m "feat: add python-log-parser to MissionId type"
```

---

## Task 2: Add mission definition and update chain

**Files:**
- Modify: `src/content/missions.ts`

**Step 1: Read the file**

**Step 2: Insert mission definition**

After the `forensics-timeline` entry (before career-boss), add:
```typescript
  {
    id: 'python-log-parser',
    title: 'Threat Log Parser',
    domain: 'Automation',
    difficulty: 'Advanced',
    objective: 'Fix four bugs in a firewall log analysis script so it correctly detects and reports suspicious IPs.',
    rewardPoints: 220,
    durationMinutes: 5,
    route: '/missions/python-log-parser',
    unlockRequires: ['forensics-timeline'],
    isLive: true
  },
```

**Step 3: Update career-boss unlockRequires**

Find:
```typescript
    unlockRequires: ['forensics-timeline'],
    isLive: true
  }
```
(the career-boss entry — it's the last entry so it won't have a comma after the closing brace)

Replace with:
```typescript
    unlockRequires: ['python-log-parser'],
    isLive: true
  }
```

**Step 4: Verify tsc**
```bash
npx tsc --noEmit
```
Expected: no errors.

**Step 5: Commit**
```bash
git add src/content/missions.ts
git commit -m "feat: add python-log-parser mission definition, update chain"
```

---

## Task 3: Add badge function to mission-rules

**Files:**
- Modify: `src/lib/mission-rules.ts`

**Step 1: Read the file to find the end**

**Step 2: Append badge function**

Add after the last existing badge function (`careerBossBadge`):

```typescript
export function pythonLogParserBadge(attemptsAfterSubmit: number, hintsUsed: number): string {
  if (attemptsAfterSubmit === 1 && hintsUsed === 0) {
    return 'Threat Intel Ace';
  }
  if (attemptsAfterSubmit <= 2 && hintsUsed <= 1) {
    return 'Log Analysis Pro';
  }
  return 'Incident Analyst';
}
```

**Step 3: Verify tsc**
```bash
npx tsc --noEmit
```

**Step 4: Commit**
```bash
git add src/lib/mission-rules.ts
git commit -m "feat: add pythonLogParserBadge function"
```

---

## Task 4: Create the mission page

**Files:**
- Create: `src/pages/PythonLogParserPage.tsx`

**Step 1: Write the complete file**

```tsx
import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { missions } from '../content/missions';
import { trackEvent } from '../lib/analytics';
import {
  calculateMissionScore,
  isMissionUnlocked,
  pythonLogParserBadge
} from '../lib/mission-rules';
import { useProgress } from '../state/progress-context';
import { MissionDebrief } from '../components/MissionDebrief';
import { debriefContent } from '../content/debrief-content';

const starterCode = `# CVNP THREAT LOG PARSER — log_parser.py
# Mission: The SOC team's detection script is broken.
# Fix all bugs so it correctly identifies and alerts on suspicious IPs.

LOG_DATA = [
    "192.168.1.105 | 10:22:01 | PORT 443 | BLOCKED",
    "10.0.0.23     | 10:22:03 | PORT 22  | ALLOWED",
    "192.168.1.105 | 10:22:05 | PORT 80  | BLOCKED",
    "172.16.8.44   | 10:22:09 | PORT 3389| BLOCKED",
    "192.168.1.105 | 10:22:11 | PORT 443 | BLOCKED",
    "10.0.0.23     | 10:22:14 | PORT 80  | ALLOWED",
    "192.168.1.105 | 10:22:18 | PORT 22  | BLOCKED",
    "172.16.8.44   | 10:22:20 | PORT 443 | BLOCKED",
    "192.168.1.105 | 10:22:25 | PORT 3389| BLOCKED",
    "10.0.0.99     | 10:22:30 | PORT 80  | ALLOWED",
    "172.16.8.44   | 10:22:33 | PORT 22  | BLOCKED",
    "10.0.0.99     | 10:22:38 | PORT 443 | ALLOWED",
]

# BUG 1: Threshold is too high — SOC teams alert at 5+ blocked attempts, not 50
ALERT_THRESHOLD = 50

def extract_ip(log_line):
    # BUG 2: Wrong index — IP is the FIRST field (index 0), not the third
    parts = log_line.split(" | ")
    return parts[2]

def count_blocked(logs):
    counts = {}
    for line in logs:
        if "BLOCKED" in line:
            ip = extract_ip(line)
            counts[ip] = counts.get(ip, 0) + 1
    return counts

def alert_admin(ip, count):
    print(f"!! ALERT: {ip} flagged — {count} blocked attempts detected.")

def analyze_logs(logs):
    counts = count_blocked(logs)
    flagged = []
    for ip, count in counts.items():
        # BUG 3: Wrong comparator — should be >= to catch IPs exactly at threshold
        if count > ALERT_THRESHOLD:
            flagged.append(ip)
            # BUG 4: alert_admin() is defined but never called here
    return flagged

print("--- CVNP Threat Log Parser v2.1 ---")
results = analyze_logs(LOG_DATA)
if results:
    print(f"Flagged IPs: {results}")
else:
    print("No threats detected.")
`;

const hints = [
  "Log fields are separated by ' | ' — count the fields from left to right. Which index holds the IP?",
  "Your threshold is set for a very quiet network. Real SOC teams escalate much earlier — think single digits.",
  "alert_admin() exists and works — but something in analyze_logs() never actually calls it."
];

function evaluateCode(code: string): { check1: boolean; check2: boolean; check3: boolean; check4: boolean } {
  const compact = code.replace(/\s+/g, '').toLowerCase();
  const check1 = /alert_threshold=5(?!\d)/.test(compact);
  const check2 = code.replace(/\s+/g, '').includes('parts[0]');
  const check3 = />=alert_threshold/.test(compact);
  const check4 = (code.match(/alert_admin\(/g) ?? []).length >= 2;
  return { check1, check2, check3, check4 };
}

function buildConsoleOutput(
  check1: boolean,
  check2: boolean,
  check3: boolean,
  check4: boolean
): string[] {
  const passCount = [check1, check2, check3, check4].filter(Boolean).length;

  const lines: string[] = [
    '> python3 log_parser.py',
    '--- CVNP Threat Log Parser v2.1 ---',
    'Parsing 12 log entries...',
    ''
  ];

  lines.push('[CHECK 1] Threshold calibration...');
  lines.push(
    check1
      ? '  >> PASS: Alert threshold correctly set to 5.'
      : '  >> FAIL: Threshold set to 50. Real SOC teams alert at 5+ blocked attempts.'
  );
  lines.push('');

  lines.push('[CHECK 2] IP extraction...');
  lines.push(
    check2
      ? '  >> PASS: Correctly reading source IP from log fields.'
      : "  >> FAIL: Extracted 'PORT 443' instead of an IP address. Wrong field index."
  );
  lines.push('');

  lines.push('[CHECK 3] Detection logic...');
  lines.push(
    check3
      ? '  >> PASS: Comparator catches all IPs at or above threshold.'
      : '  >> FAIL: Using strict > — an IP with exactly 5 hits slips through undetected.'
  );
  lines.push('');

  lines.push('[CHECK 4] Alert dispatch...');
  lines.push(
    check4
      ? '  >> PASS: Alerts firing correctly.'
      : '  >> FAIL: alert_admin() defined but never called. Threats go unreported.'
  );

  if (passCount === 4) {
    lines.push('');
    lines.push('!! ALERT: 192.168.1.105 flagged — 5 blocked attempts detected.');
    lines.push('');
    lines.push("Flagged IPs: ['192.168.1.105']");
    lines.push(`${passCount}/4 checks passing. Script nominal. Threat identified and reported.`);
  } else {
    lines.push('');
    lines.push(`${passCount}/4 checks passing. Keep debugging.`);
  }

  return lines;
}

export function PythonLogParserPage() {
  const mission = useMemo(() => missions.find((item) => item.id === 'python-log-parser'), []);
  const { progress, recordAttempt, recordHintUsed, completeMission } = useProgress();

  const [code, setCode] = useState(starterCode);
  const [consoleLines, setConsoleLines] = useState<string[]>(['> Terminal ready. Waiting for execution...']);
  const [message, setMessage] = useState('Fix all four bugs and run the script.');
  const [success, setSuccess] = useState(false);
  const [showDebrief, setShowDebrief] = useState(false);
  const [debriefScore, setDebriefScore] = useState(0);
  const [debriefBadge, setDebriefBadge] = useState('');

  const unlocked = mission
    ? isMissionUnlocked(mission, progress.completedMissionIds)
    : false;

  useEffect(() => {
    if (!mission || !unlocked) return;
    trackEvent('mission_start', { missionId: mission.id, sessionId: progress.sessionId });
  }, [mission, progress.sessionId, unlocked]);

  if (!mission) return <Navigate to="/missions" replace />;

  const missionDef = mission;
  const stats = progress.missionStats[missionDef.id];

  if (!unlocked) return <Navigate to="/missions" replace />;

  function handleReset(): void {
    setCode(starterCode);
    setConsoleLines(['> Editor reset to starter code.']);
    setMessage('Starter template restored.');
    setSuccess(false);
  }

  function handleHint(): void {
    if (stats.hintsUsed >= hints.length) return;
    recordHintUsed(missionDef.id);
  }

  function runSimulation(): void {
    const attemptsAfterSubmit = stats.attempts + 1;
    recordAttempt(missionDef.id);

    const { check1, check2, check3, check4 } = evaluateCode(code);
    const allPass = check1 && check2 && check3 && check4;
    const output = buildConsoleOutput(check1, check2, check3, check4);

    setConsoleLines(output);

    if (!allPass) {
      const passCount = [check1, check2, check3, check4].filter(Boolean).length;
      setMessage(`${passCount}/4 checks passing. Keep debugging.`);
      setSuccess(false);
      return;
    }

    const score = calculateMissionScore(missionDef.rewardPoints, attemptsAfterSubmit, stats.hintsUsed, 80);
    const badge = pythonLogParserBadge(attemptsAfterSubmit, stats.hintsUsed);
    completeMission(missionDef.id, score, badge);
    setDebriefScore(score);
    setDebriefBadge(badge);
    setShowDebrief(true);
    setMessage(`All checks passing. Score +${score}. Badge unlocked: ${badge}.`);
    setSuccess(true);
  }

  const visibleHints = hints.slice(0, stats.hintsUsed);

  return (
    <section>
      <div className="section-head">
        <h2>{missionDef.title}</h2>
        <Link className="secondary-cta inline-control" to="/missions">
          Back to Hub
        </Link>
      </div>
      <p className="section-copy">
        The SOC team's log analysis script has four bugs. Fix them all so it correctly detects
        and reports suspicious IPs before the morning shift review.
      </p>

      <div className="interactive-panel python-layout">
        <div className="editor-shell">
          <div className="panel-head">log_parser.py</div>
          <textarea
            className="python-editor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            aria-label="Python code editor"
          />
        </div>

        <div className="console-shell" aria-live="polite">
          <div className="panel-head">Console</div>
          <div className="console-scroll">
            {consoleLines.map((line, index) => (
              <div key={`${line}-${index}`} className="console-line">
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="control-row">
        <button type="button" className="primary-cta" onClick={runSimulation}>
          Run Script
        </button>
        <button
          type="button"
          className="secondary-cta"
          onClick={handleHint}
          disabled={stats.hintsUsed >= hints.length}
        >
          {stats.hintsUsed >= hints.length ? 'No More Hints' : 'Use Hint'}
        </button>
        <button type="button" className="secondary-cta" onClick={handleReset}>
          Reset Code
        </button>
      </div>

      {visibleHints.length > 0 ? (
        <div className="hint-box" aria-live="polite">
          {visibleHints.map((hint, index) => (
            <p key={hint}>
              Hint {index + 1}: {hint}
            </p>
          ))}
        </div>
      ) : null}

      <p className={`result-box ${success ? 'is-success' : 'is-error'}`} aria-live="polite">
        {message}
      </p>

      <p className="fine-print">
        Attempts: {progress.missionStats[missionDef.id].attempts} | Hints used:{' '}
        {progress.missionStats[missionDef.id].hintsUsed}
      </p>

      {showDebrief ? (
        <MissionDebrief
          missionId={missionDef.id}
          debrief={debriefContent[missionDef.id]}
          score={debriefScore}
          badge={debriefBadge}
          nextMissionRoute="/missions/career-boss"
          sessionId={progress.sessionId}
          onClose={() => setShowDebrief(false)}
        />
      ) : null}
    </section>
  );
}
```

**Step 2: Verify tsc**
```bash
npx tsc --noEmit
```
Expected: no errors (debriefContent will error until Task 6 — if so, skip and revisit after Task 6).

**Step 3: Commit**
```bash
git add src/pages/PythonLogParserPage.tsx
git commit -m "feat: add PythonLogParserPage with 4-bug simulation"
```

---

## Task 5: Register route in App.tsx

**Files:**
- Modify: `src/App.tsx`

**Step 1: Read the file**

**Step 2: Add import** — after the PythonMissionPage import line, add:
```tsx
import { PythonLogParserPage } from './pages/PythonLogParserPage';
```

**Step 3: Add route** — after the `python-fix` route line, add:
```tsx
<Route path="missions/python-log-parser" element={<PythonLogParserPage />} />
```

**Step 4: Verify tsc**
```bash
npx tsc --noEmit
```

**Step 5: Commit**
```bash
git add src/App.tsx
git commit -m "feat: register python-log-parser route"
```

---

## Task 6: Add debrief content for new mission

**Files:**
- Modify: `src/content/debrief-content.ts`

**Step 1: Read the file**

**Step 2: Add debrief entry**

Inside the `debriefContent` object, after the `'forensics-timeline'` entry, add:

```typescript
  'python-log-parser': {
    summary:
      'You diagnosed and fixed four independent bugs in a live threat detection script — wrong threshold, bad string parsing, a logic operator edge case, and a missing function call. Every one of those bugs would have let a real attacker go unreported.',
    itFieldMapping:
      'Log parsing and automated threat detection are core to how SOC teams scale. No one reads 100,000 log lines manually — scripts do it. When those scripts have bugs, threats slip through. Security engineers who can read, debug, and fix detection tooling are among the most valuable on any team.',
    roles: ['Security Automation Engineer', 'SOC Analyst', 'Detection Engineer', 'Junior DevSecOps'],
    cvnpConnection:
      'ATCC CVNP programs include Python-based security automation coursework where you build and debug real detection and response tooling — not toy scripts, but the kind of code that runs in production SOC environments.',
    primaryCta: { label: 'Final Mission', target: 'next-mission' },
    secondaryCta: { label: 'Explore Pathways', target: 'pathways' }
  },
```

**Step 3: Verify tsc**
```bash
npx tsc --noEmit
```
Expected: no errors.

**Step 4: Commit**
```bash
git add src/content/debrief-content.ts
git commit -m "feat: add python-log-parser debrief content"
```

---

## Task 7: Update forensics-timeline debrief nextMissionRoute

**Files:**
- Modify: `src/pages/ForensicsMissionPage.tsx`

**Step 1: Read the file**

**Step 2: Find this prop in the MissionDebrief render**

```tsx
          nextMissionRoute="/missions/career-boss"
```
(inside the ForensicsMissionPage MissionDebrief block)

**Step 3: Change to**

```tsx
          nextMissionRoute="/missions/python-log-parser"
```

**Step 4: Verify tsc**
```bash
npx tsc --noEmit
```

**Step 5: Commit**
```bash
git add src/pages/ForensicsMissionPage.tsx
git commit -m "feat: update forensics debrief next route to python-log-parser"
```

---

## Task 8: Final verification

**Step 1: Full TypeScript check**
```bash
cd /Users/mattmccullough/Desktop/CVN && npx tsc --noEmit
```
Expected: zero errors.

**Step 2: Build check**
```bash
npm run build
```
Expected: clean build, 60+ modules transformed.

**Step 3: Smoke test checklist** (manual, in `npm run dev`)
- Navigate to `/missions` — confirm "Threat Log Parser" card appears, locked until forensics-timeline is complete
- Complete forensics-timeline — confirm debrief shows "Next Mission" routing to python-log-parser
- Open python-log-parser — confirm starter code is loaded with all 4 bugs present
- Click "Run Script" without changes — confirm 0/4 checks passing, each check shows FAIL
- Fix only Bug 1 (change 50 to 5) — confirm CHECK 1 passes, others still fail
- Fix Bug 2 (parts[2] → parts[0]) — confirm CHECK 2 passes
- Fix Bug 3 (> → >=) — confirm CHECK 3 passes
- Fix Bug 4 (add alert_admin(ip, count) call in the loop) — confirm 4/4, debrief appears
- Confirm debrief shows "Final Mission" CTA routing to /missions/career-boss
- Confirm career-boss is now locked until python-log-parser is complete

**Step 4: Final commit**
```bash
git add -A
git commit -m "feat: threat log parser mission complete"
```
