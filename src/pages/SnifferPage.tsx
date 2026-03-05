import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { missions } from '../content/missions';
import { trackEvent } from '../lib/analytics';
import {
  calculateMissionScore,
  isMissionUnlocked,
  snifferBadge
} from '../lib/mission-rules';
import { useProgress } from '../state/progress-context';

interface PacketLine {
  id: number;
  text: string;
  isTarget: boolean;
}

const targetPassword = 'fiber_champs';
const clueHints = [
  'Watch for a legacy protocol that still sends credentials in cleartext.',
  'Target traffic is using port 21.',
  'Password starts with: fiber_'
];

const sourceIps = ['10.0.0.25', '192.168.1.44', '172.16.8.7', '10.12.4.200'];
const destinationIps = ['104.21.44.11', '151.101.1.69', '13.107.246.45', '52.84.150.12'];
const noiseProtocols = ['TLSv1.3', 'UDP', 'QUIC', 'HTTPS'];

function randomItem<T>(values: T[]): T {
  return values[Math.floor(Math.random() * values.length)];
}

function createPacketLine(sequence: number): PacketLine {
  if (Math.random() < 0.16) {
    return {
      id: sequence,
      isTarget: true,
      text: `[FTP] ${randomItem(sourceIps)} -> 10.0.0.99:21 | USER=admin PASS=${targetPassword}`
    };
  }

  const protocol = randomItem(noiseProtocols);
  const size = Math.floor(Math.random() * 1200) + 90;

  return {
    id: sequence,
    isTarget: false,
    text: `[${protocol}] ${randomItem(sourceIps)} -> ${randomItem(destinationIps)}:443 | Len=${size} | Encrypted payload`
  };
}

export function SnifferPage() {
  const mission = useMemo(() => missions.find((item) => item.id === 'password-pulse'), []);
  const { progress, recordAttempt, recordHintUsed, completeMission } = useProgress();

  const [packets, setPackets] = useState<PacketLine[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState('Traffic active. Watch the stream and intercept credentials.');
  const [success, setSuccess] = useState(false);
  const [packetCount, setPacketCount] = useState(0);
  const unlocked = mission
    ? isMissionUnlocked(mission, progress.completedMissionIds)
    : false;

  useEffect(() => {
    if (!mission || !unlocked || success || isPaused) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setPacketCount((current) => current + 1);
    }, 350);

    return () => window.clearInterval(intervalId);
  }, [isPaused, mission, success, unlocked]);

  useEffect(() => {
    if (!mission || isPaused || success || !unlocked) {
      return;
    }

    setPackets((previous) => {
      const next = [...previous, createPacketLine(packetCount)];
      if (next.length > 22) {
        return next.slice(next.length - 22);
      }
      return next;
    });
  }, [isPaused, mission, packetCount, success, unlocked]);

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

  function handleHint(): void {
    if (stats.hintsUsed >= clueHints.length) {
      return;
    }

    recordHintUsed(missionDef.id);
  }

  function handleVerify(): void {
    const trimmed = answer.trim();
    if (!trimmed) {
      setMessage('Enter the intercepted password before verifying.');
      setSuccess(false);
      return;
    }

    const attemptsAfterSubmit = stats.attempts + 1;
    recordAttempt(missionDef.id);

    if (trimmed === targetPassword) {
      const score = calculateMissionScore(
        missionDef.rewardPoints,
        attemptsAfterSubmit,
        stats.hintsUsed,
        60
      );
      const badge = snifferBadge(attemptsAfterSubmit, stats.hintsUsed);
      completeMission(missionDef.id, score, badge);
      setMessage(`Credentials confirmed. Score +${score}. Badge unlocked: ${badge}.`);
      setSuccess(true);
      setIsPaused(true);
      return;
    }

    setMessage('Incorrect password. Keep scanning traffic and retry.');
    setSuccess(false);
  }

  const visibleHints = clueHints.slice(0, stats.hintsUsed);

  return (
    <section>
      <div className="section-head">
        <h2>{missionDef.title}</h2>
        <Link className="secondary-cta inline-control" to="/missions">
          Back to Hub
        </Link>
      </div>
      <p className="section-copy">
        Pause traffic, inspect packet lines, then submit exposed credentials.
      </p>

      <div className="interactive-panel">
        <div className="control-row">
          <button
            type="button"
            className="primary-cta"
            onClick={() => setIsPaused((previous) => !previous)}
          >
            {isPaused ? 'Resume Traffic' : 'Pause Traffic'}
          </button>
          <button
            type="button"
            className="secondary-cta"
            onClick={handleHint}
            disabled={stats.hintsUsed >= clueHints.length}
          >
            {stats.hintsUsed >= clueHints.length ? 'No More Hints' : 'Use Hint'}
          </button>
        </div>

        <div className="sniffer-log" role="log" aria-live="polite" aria-label="Live packet capture">
          {packets.length === 0 ? <p className="fine-print">Waiting for traffic...</p> : null}
          {packets.map((packet) => (
            <div key={packet.id} className={packet.isTarget ? 'packet-line is-target' : 'packet-line'}>
              {packet.text}
            </div>
          ))}
        </div>

        <div className="submit-row">
          <label htmlFor="packet-answer" className="legend-text">
            Intercepted password
          </label>
          <input
            id="packet-answer"
            className="answer-input"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="Enter password"
            autoComplete="off"
          />
          <button type="button" className="primary-cta" onClick={handleVerify}>
            Verify
          </button>
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

      <p className={`result-box ${success ? 'is-success' : 'is-error'}`} aria-live="polite">
        {message}
      </p>

      <p className="fine-print">
        Attempts: {progress.missionStats[missionDef.id].attempts} | Hints used:{' '}
        {progress.missionStats[missionDef.id].hintsUsed}
      </p>
    </section>
  );
}
