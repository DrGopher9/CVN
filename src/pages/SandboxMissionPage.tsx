import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { missions } from '../content/missions';
import { trackEvent } from '../lib/analytics';
import {
  calculateMissionScore,
  isMissionUnlocked,
  sandboxBadge
} from '../lib/mission-rules';
import { useProgress } from '../state/progress-context';

type RoundState = 'idle' | 'active' | 'failed' | 'success';

const hintDeck = [
  'Containment first: isolate the VM from the network before anything else.',
  'Snapshots should be captured before running deeper recovery actions.',
  'Final order: Isolate -> Snapshot -> Scan -> Revert -> Validate.'
];

export function SandboxMissionPage() {
  const mission = useMemo(() => missions.find((item) => item.id === 'sandbox-reset'), []);
  const { progress, recordAttempt, recordHintUsed, completeMission } = useProgress();

  const [roundState, setRoundState] = useState<RoundState>('idle');
  const [timeLeft, setTimeLeft] = useState(60);
  const [threatLevel, setThreatLevel] = useState(20);
  const [isolateDone, setIsolateDone] = useState(false);
  const [snapshotDone, setSnapshotDone] = useState(false);
  const [scanDone, setScanDone] = useState(false);
  const [revertDone, setRevertDone] = useState(false);
  const [message, setMessage] = useState('Launch the scenario and contain the incident before spread reaches 100%.');
  const [logs, setLogs] = useState<string[]>(['[SYSTEM] Sandbox waiting for incident simulation...']);
  const [failureCounted, setFailureCounted] = useState(false);

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

  useEffect(() => {
    if (roundState !== 'active') {
      return;
    }

    const intervalId = window.setInterval(() => {
      setTimeLeft((previous) => {
        if (previous <= 1) {
          setRoundState('failed');
          setMessage('Mission failed: response window expired. Restart and contain faster.');
          setLogs((current) => [...current, '[ALERT] Response timer expired.']);
          return 0;
        }
        return previous - 1;
      });

      setThreatLevel((previous) => {
        const growth = isolateDone ? 1 : 8;
        const next = Math.min(100, previous + growth);

        if (next >= 100) {
          setRoundState('failed');
          setMessage('Mission failed: malware spread to critical systems. Restart scenario.');
          setLogs((current) => [...current, '[ALERT] Threat level reached critical threshold.']);
        }

        return next;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isolateDone, roundState]);

  useEffect(() => {
    if (!mission || roundState !== 'failed' || failureCounted) {
      return;
    }

    recordAttempt(mission.id);
    setFailureCounted(true);
  }, [failureCounted, mission, recordAttempt, roundState]);

  if (!mission) {
    return <Navigate to="/missions" replace />;
  }

  const missionDef = mission;
  const stats = progress.missionStats[missionDef.id];

  if (!unlocked) {
    return <Navigate to="/missions" replace />;
  }

  function addLog(entry: string): void {
    setLogs((current) => {
      const next = [...current, entry];
      if (next.length > 12) {
        return next.slice(next.length - 12);
      }
      return next;
    });
  }

  function resetRound(): void {
    setRoundState('idle');
    setTimeLeft(60);
    setThreatLevel(20);
    setIsolateDone(false);
    setSnapshotDone(false);
    setScanDone(false);
    setRevertDone(false);
    setFailureCounted(false);
    setMessage('Scenario reset. Launch when ready.');
    setLogs(['[SYSTEM] Sandbox reset to clean state.']);
  }

  function launchRound(): void {
    if (roundState === 'active') {
      return;
    }

    setRoundState('active');
    setFailureCounted(false);
    setMessage('Incident started. Execute containment sequence in correct order.');
    addLog('[ALERT] suspicious_file.exe detonated in VM sandbox.');
  }

  function handleHint(): void {
    if (stats.hintsUsed >= hintDeck.length) {
      return;
    }

    recordHintUsed(missionDef.id);
  }

  function handleIsolate(): void {
    if (roundState !== 'active') {
      setMessage('Launch the incident first.');
      return;
    }

    if (isolateDone) {
      return;
    }

    setIsolateDone(true);
    setThreatLevel((previous) => Math.max(10, previous - 12));
    addLog('[ACTION] VM network interface isolated. Lateral movement reduced.');
    setMessage('Containment step complete. Capture a clean snapshot next.');
  }

  function handleSnapshot(): void {
    if (roundState !== 'active') {
      setMessage('Launch the incident first.');
      return;
    }

    if (!isolateDone) {
      setThreatLevel((previous) => Math.min(100, previous + 10));
      addLog('[WARN] Snapshot attempt rejected: isolate VM before backup.');
      setMessage('Wrong order: isolate first, then snapshot.');
      return;
    }

    if (snapshotDone) {
      return;
    }

    setSnapshotDone(true);
    addLog('[ACTION] Recovery snapshot captured.');
    setMessage('Snapshot secured. Run a malware scan.');
  }

  function handleScan(): void {
    if (roundState !== 'active') {
      setMessage('Launch the incident first.');
      return;
    }

    if (!snapshotDone) {
      setThreatLevel((previous) => Math.min(100, previous + 10));
      addLog('[WARN] Scan command blocked: snapshot not ready.');
      setMessage('Wrong order: create snapshot before scan.');
      return;
    }

    if (scanDone) {
      return;
    }

    setScanDone(true);
    setThreatLevel((previous) => Math.max(0, previous - 8));
    addLog('[ACTION] Malware scan completed. Rootkit signatures identified.');
    setMessage('Good. Revert to snapshot to purge the infection.');
  }

  function handleRevert(): void {
    if (roundState !== 'active') {
      setMessage('Launch the incident first.');
      return;
    }

    if (!scanDone) {
      setThreatLevel((previous) => Math.min(100, previous + 10));
      addLog('[WARN] Revert blocked: scan verification incomplete.');
      setMessage('Wrong order: run scan before revert.');
      return;
    }

    if (revertDone) {
      return;
    }

    setRevertDone(true);
    setThreatLevel((previous) => Math.max(0, previous - 18));
    addLog('[ACTION] VM reverted to clean snapshot state.');
    setMessage('Final step: validate services and close incident.');
  }

  function handleValidate(): void {
    if (roundState !== 'active') {
      setMessage('Launch the incident first.');
      return;
    }

    if (!revertDone) {
      setThreatLevel((previous) => Math.min(100, previous + 8));
      addLog('[WARN] Validation failed: rollback incomplete.');
      setMessage('Complete the rollback before validation.');
      return;
    }

    const attemptsAfterSubmit = stats.attempts + 1;
    recordAttempt(missionDef.id);

    const score = calculateMissionScore(missionDef.rewardPoints, attemptsAfterSubmit, stats.hintsUsed, 80);
    const badge = sandboxBadge(attemptsAfterSubmit, stats.hintsUsed, threatLevel);

    completeMission(missionDef.id, score, badge);
    setRoundState('success');
    setMessage(`Incident resolved. Score +${score}. Badge unlocked: ${badge}.`);
    addLog('[SUCCESS] Service validation complete. Incident closed.');
  }

  const visibleHints = hintDeck.slice(0, stats.hintsUsed);

  return (
    <section>
      <div className="section-head">
        <h2>{missionDef.title}</h2>
        <Link className="secondary-cta inline-control" to="/missions">
          Back to Hub
        </Link>
      </div>
      <p className="section-copy">
        Run a full blue-team recovery flow: isolate, snapshot, scan, revert, validate.
      </p>

      <div className="interactive-panel">
        <div className="sandbox-grid">
          <div className="status-chip">
            <span>Round</span>
            <strong>{roundState.toUpperCase()}</strong>
          </div>
          <div className="status-chip">
            <span>Threat</span>
            <strong>{threatLevel}%</strong>
          </div>
          <div className="status-chip">
            <span>Time Left</span>
            <strong>{timeLeft}s</strong>
          </div>
        </div>

        <div className="control-row">
          <button type="button" className="primary-cta" onClick={launchRound} disabled={roundState === 'active'}>
            Launch Incident
          </button>
          <button type="button" className="secondary-cta" onClick={resetRound}>
            Restart Round
          </button>
          <button
            type="button"
            className="secondary-cta"
            onClick={handleHint}
            disabled={stats.hintsUsed >= hintDeck.length}
          >
            {stats.hintsUsed >= hintDeck.length ? 'No More Hints' : 'Use Hint'}
          </button>
        </div>

        <div className="control-row">
          <button type="button" className="secondary-cta" onClick={handleIsolate}>
            1. Isolate VM
          </button>
          <button type="button" className="secondary-cta" onClick={handleSnapshot}>
            2. Capture Snapshot
          </button>
          <button type="button" className="secondary-cta" onClick={handleScan}>
            3. Run Scan
          </button>
          <button type="button" className="secondary-cta" onClick={handleRevert}>
            4. Revert Snapshot
          </button>
          <button type="button" className="primary-cta" onClick={handleValidate}>
            5. Validate Services
          </button>
        </div>

        <div className="sniffer-log" role="log" aria-live="polite" aria-label="Sandbox incident log">
          {logs.map((entry, index) => (
            <div key={`${entry}-${index}`} className="packet-line">
              {entry}
            </div>
          ))}
        </div>
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

      <p className={`result-box ${roundState === 'success' ? 'is-success' : 'is-error'}`} aria-live="polite">
        {message}
      </p>

      <p className="fine-print">
        Attempts: {progress.missionStats[missionDef.id].attempts} | Hints used:{' '}
        {progress.missionStats[missionDef.id].hintsUsed}
      </p>
    </section>
  );
}
