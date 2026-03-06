import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { missions } from '../content/missions';
import { trackEvent } from '../lib/analytics';
import {
  calculateMissionScore,
  forensicsBadge,
  isMissionUnlocked
} from '../lib/mission-rules';
import { useProgress } from '../state/progress-context';
import { MissionDebrief } from '../components/MissionDebrief';
import { debriefContent } from '../content/debrief-content';

interface TimelineEvent {
  id: string;
  label: string;
  expectedOrder: number;
}

const events: TimelineEvent[] = [
  {
    id: 'evt-1',
    label: 'User opens fake internship email attachment on student workstation.',
    expectedOrder: 1
  },
  {
    id: 'evt-2',
    label: 'PowerShell command downloads payload from external host.',
    expectedOrder: 2
  },
  {
    id: 'evt-3',
    label: 'Credential dump attempt appears on domain controller logs.',
    expectedOrder: 3
  },
  {
    id: 'evt-4',
    label: 'Abnormal RDP session from student VLAN to admin subnet.',
    expectedOrder: 4
  },
  {
    id: 'evt-5',
    label: 'Bulk archive exfiltration alert triggers from file server.',
    expectedOrder: 5
  }
];

const hints = [
  'Initial access usually starts on an endpoint, not a server.',
  'Lateral movement tends to happen after credential theft events.',
  'Exfiltration is commonly near the end of the kill chain.'
];

export function ForensicsMissionPage() {
  const mission = useMemo(() => missions.find((item) => item.id === 'forensics-timeline'), []);
  const { progress, recordAttempt, recordHintUsed, completeMission } = useProgress();

  const [shuffledEvents] = useState(() => [...events].sort(() => Math.random() - 0.5));
  const [ordering, setOrdering] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('Assign the correct sequence order to each event.');
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

  function handleChange(event: ChangeEvent<HTMLSelectElement>, eventId: string): void {
    setOrdering((previous) => ({ ...previous, [eventId]: event.target.value }));
  }

  function useHint(): void {
    if (stats.hintsUsed >= hints.length) {
      return;
    }
    recordHintUsed(missionDef.id);
  }

  function submitTimeline(): void {
    const allSelected = events.every((item) => ordering[item.id]);
    if (!allSelected) {
      setMessage('Assign an order number for all events before verifying.');
      setSuccess(false);
      return;
    }

    const attemptsAfterSubmit = stats.attempts + 1;
    recordAttempt(missionDef.id);

    const correctCount = events.reduce((count, item) => {
      return Number(ordering[item.id]) === item.expectedOrder ? count + 1 : count;
    }, 0);

    if (correctCount >= 4) {
      const score = calculateMissionScore(missionDef.rewardPoints, attemptsAfterSubmit, stats.hintsUsed, 100);
      const badge = forensicsBadge(attemptsAfterSubmit, stats.hintsUsed);
      completeMission(missionDef.id, score, badge);
      setMessage(`Timeline reconstructed: ${correctCount}/5 correct. Score +${score}. Badge: ${badge}.`);
      setSuccess(true);
      setDebriefScore(score);
      setDebriefBadge(badge);
      setShowDebrief(true);
      return;
    }

    setMessage(`You placed ${correctCount}/5 correctly. Need at least 4 to pass.`);
    setSuccess(false);
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
        Investigate logs and sequence the breach from initial access to data exfiltration.
      </p>

      <div className="interactive-panel">
        <div className="timeline-grid">
          {shuffledEvents.map((item) => (
            <article key={item.id} className="timeline-card">
              <p>{item.label}</p>
              <label htmlFor={item.id} className="legend-text">Timeline position</label>
              <select
                id={item.id}
                className="action-select"
                value={ordering[item.id] || ''}
                onChange={(event) => handleChange(event, item.id)}
              >
                <option value="">Select position...</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </article>
          ))}
        </div>
      </div>

      <div className="control-row">
        <button type="button" className="primary-cta" onClick={submitTimeline}>
          Verify Timeline
        </button>
        <button type="button" className="secondary-cta" onClick={useHint} disabled={stats.hintsUsed >= hints.length}>
          {stats.hintsUsed >= hints.length ? 'No More Hints' : 'Use Hint'}
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
          nextMissionRoute="/missions/python-log-parser"
          sessionId={progress.sessionId}
          onClose={() => setShowDebrief(false)}
        />
      ) : null}
    </section>
  );
}
