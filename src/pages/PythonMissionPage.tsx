import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { missions } from '../content/missions';
import { trackEvent } from '../lib/analytics';
import {
  calculateMissionScore,
  isMissionUnlocked,
  pythonBadge
} from '../lib/mission-rules';
import { useProgress } from '../state/progress-context';
import { MissionDebrief } from '../components/MissionDebrief';
import { debriefContent } from '../content/debrief-content';

const starterCode = `# CVNP PYTHON DEFENSE CHALLENGE
server_name = "ATCC_Esports_Main"
incoming_attack = True

# TODO: fix the bug
firewall_active = False

print("Initializing network scan...")

if incoming_attack:
    print("WARNING: DDoS attack detected!")

    if firewall_active:
        print(">> Firewall deployed.")
        print(">> " + server_name + " is SECURE.")
        print(">> You win!")
    else:
        print(">> Firewall failed to deploy.")
        print(">> CRITICAL BREACH: Server crashed.")
        print(">> Game Over.")
`;

const hints = [
  'Find the boolean that controls firewall deployment.',
  'The bug is on the line: firewall_active = ...',
  'Change firewall_active = False to firewall_active = True.'
];

export function PythonMissionPage() {
  const mission = useMemo(() => missions.find((item) => item.id === 'python-fix'), []);
  const { progress, recordAttempt, recordHintUsed, completeMission } = useProgress();

  const [code, setCode] = useState(starterCode);
  const [consoleLines, setConsoleLines] = useState<string[]>(['> Terminal ready. Waiting for execution...']);
  const [message, setMessage] = useState('Patch the script and run it.');
  const [success, setSuccess] = useState(false);
  const [showDebrief, setShowDebrief] = useState(false);
  const [debriefScore, setDebriefScore] = useState(0);
  const [debriefBadge, setDebriefBadge] = useState('');

  const unlocked = mission
    ? isMissionUnlocked(mission, progress.completedMissionIds)
    : false;

  useEffect(() => {
    if (!mission || !unlocked) {
      return;
    }

    trackEvent('mission_start', {
      missionId: mission.id,
      sessionId: progress.sessionId
    });
  }, [mission, progress.sessionId, unlocked]);

  if (!mission) {
    return <Navigate to="/missions" replace />;
  }

  const missionDef = mission;
  const stats = progress.missionStats[missionDef.id];

  if (!unlocked) {
    return <Navigate to="/missions" replace />;
  }

  function handleResetCode(): void {
    setCode(starterCode);
    setConsoleLines(['> Editor reset to starter code.']);
    setMessage('Starter template restored.');
    setSuccess(false);
  }

  function handleHint(): void {
    if (stats.hintsUsed >= hints.length) {
      return;
    }

    recordHintUsed(missionDef.id);
  }

  function runSimulation(): void {
    const attemptsAfterSubmit = stats.attempts + 1;
    recordAttempt(missionDef.id);

    const compact = code.replace(/\s+/g, '').toLowerCase();
    const fixed = compact.includes('firewall_active=true');

    const baseOutput = [
      '> python3 defender_script.py',
      'Initializing network scan...',
      'WARNING: DDoS attack detected!'
    ];

    if (!fixed) {
      setConsoleLines([
        ...baseOutput,
        '>> Firewall failed to deploy.',
        '>> CRITICAL BREACH: Server crashed.',
        '>> Game Over. Edit the code and rerun.'
      ]);
      setMessage('Script still fails. Keep debugging.');
      setSuccess(false);
      return;
    }

    const score = calculateMissionScore(missionDef.rewardPoints, attemptsAfterSubmit, stats.hintsUsed, 80);
    const badge = pythonBadge(attemptsAfterSubmit, stats.hintsUsed);
    completeMission(missionDef.id, score, badge);
    setDebriefScore(score);
    setDebriefBadge(badge);
    setShowDebrief(true);

    setConsoleLines([
      ...baseOutput,
      '>> Firewall deployed.',
      '>> ATCC_Esports_Main is SECURE.',
      '>> You win! Mission successful.'
    ]);
    setMessage(`Patch accepted. Score +${score}. Badge unlocked: ${badge}.`);
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
        Debug the Python script so the firewall activates during an attack.
      </p>

      <div className="interactive-panel python-layout">
        <div className="editor-shell">
          <div className="panel-head">defender_script.py</div>
          <textarea
            className="python-editor"
            value={code}
            onChange={(event) => setCode(event.target.value)}
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
        <button type="button" className="secondary-cta" onClick={handleHint} disabled={stats.hintsUsed >= hints.length}>
          {stats.hintsUsed >= hints.length ? 'No More Hints' : 'Use Hint'}
        </button>
        <button type="button" className="secondary-cta" onClick={handleResetCode}>
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
          nextMissionRoute="/missions/phishing-detective"
          sessionId={progress.sessionId}
          onClose={() => setShowDebrief(false)}
        />
      ) : null}
    </section>
  );
}
