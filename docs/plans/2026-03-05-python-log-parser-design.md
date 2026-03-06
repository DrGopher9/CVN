# Threat Log Parser Mission — Design Doc

## Overview

A second Python mission placed between `forensics-timeline` and `career-boss`. Students debug a broken firewall log analysis script with four independent bugs that require numeric reasoning, string parsing, logic operator precision, and code tracing to fix.

## Mission Metadata

- **ID:** `python-log-parser`
- **Title:** Threat Log Parser
- **Domain:** Automation
- **Difficulty:** Advanced
- **Points:** 220
- **Duration:** 5 min
- **Chain:** forensics-timeline → python-log-parser → career-boss
- **Unlock requires:** `forensics-timeline`
- **Unlocks:** `career-boss` (career-boss unlockRequires changes from forensics-timeline to python-log-parser)

## The Scenario

The SOC team's automated threat detection script is broken. It parses firewall logs, counts blocked connection attempts per IP, and should alert when an IP exceeds a threshold. Students must fix all four bugs before the morning shift review.

## Log Data Format

12 entries, pipe-delimited:
```
"192.168.1.105 | 10:22:01 | PORT 443 | BLOCKED"
```
`192.168.1.105` has exactly 5 BLOCKED entries — at the threshold boundary, making bugs 1 and 3 interdependent.

## The Four Bugs

| # | Location | Planted | Correct | Skill |
|---|----------|---------|---------|-------|
| 1 | `ALERT_THRESHOLD = 50` | 50 | 5 | Numeric reasoning / domain knowledge |
| 2 | `return parts[2]` in `extract_ip()` | index 2 → "PORT 443" | index 0 → IP | String parsing / indexing |
| 3 | `count > ALERT_THRESHOLD` | `>` | `>=` | Logic operators / edge case |
| 4 | `alert_admin()` defined but not called | missing | call inside flagging loop | Function tracing |

Bugs 1 and 3 are interdependent: the target IP has exactly 5 hits so `5 > 5` still fails even after fixing the threshold.

## Validation Logic (string analysis)

Four independent checks on the student's code string:

1. Compact code contains `alert_threshold=5`
2. Code contains `parts[0]`
3. Compact code contains `>=alert_threshold`
4. `alert_admin(` appears at least twice (definition + call)

## Console Feedback

Each check prints PASS or FAIL with a behavioral description — never a line number or exact fix. All four must pass to complete.

## Hints

1. "Log fields are separated by ' | ' — count the fields from left to right."
2. "Your threshold is set for a very quiet network. Real SOC teams escalate much earlier."
3. "alert_admin() exists and works — but something in analyze_logs() never actually calls it."

## Badges

- 1 attempt, 0 hints → "Threat Intel Ace"
- ≤ 2 attempts, ≤ 1 hint → "Log Analysis Pro"
- Otherwise → "Incident Analyst"

## Chain Updates Required

- `src/types.ts` — add `python-log-parser` to MISSION_IDS
- `src/content/missions.ts` — add mission definition; update `career-boss.unlockRequires` to `['python-log-parser']`
- `src/lib/mission-rules.ts` — add `pythonLogParserBadge()` function
- `src/pages/ForensicsMissionPage.tsx` — update debrief `nextMissionRoute` to `/missions/python-log-parser`
- `src/content/debrief-content.ts` — add debrief entry for `python-log-parser`; update `forensics-timeline` secondaryCta if needed
- `src/App.tsx` — add route for `/missions/python-log-parser`
- Create `src/pages/PythonLogParserPage.tsx`
