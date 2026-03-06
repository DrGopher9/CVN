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
