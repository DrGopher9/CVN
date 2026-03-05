import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { missions } from '../content/missions';
import { trackEvent } from '../lib/analytics';
import {
  calculateMissionScore,
  isMissionUnlocked,
  packetPathBadge
} from '../lib/mission-rules';
import { useProgress } from '../state/progress-context';

const routeOptions = [
  {
    id: 'A',
    title: 'Gigabit 0/1',
    detail: 'Main Campus Backbone',
    status: 'Heavy congestion'
  },
  {
    id: 'B',
    title: 'TenGigabit 0/2',
    detail: 'Fiber core route',
    status: 'Optimal route'
  },
  {
    id: 'C',
    title: 'FastEthernet 0/0',
    detail: 'Legacy copper route',
    status: 'Interface down'
  }
] as const;

export function PacketPathPage() {
  const mission = useMemo(() => missions.find((item) => item.id === 'packet-path'), []);
  const { progress, recordAttempt, recordHintUsed, completeMission } = useProgress();

  const [selectedRoute, setSelectedRoute] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [didSucceed, setDidSucceed] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
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

  function handleHint(): void {
    if (hintVisible) {
      return;
    }

    setHintVisible(true);
    recordHintUsed(missionDef.id);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (!selectedRoute) {
      setFeedback('Select a route first.');
      setDidSucceed(false);
      return;
    }

    const attemptsAfterSubmit = stats.attempts + 1;
    recordAttempt(missionDef.id);

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
      return;
    }

    if (selectedRoute === 'A') {
      setFeedback('Route A delivered packets but jitter exploded to 400ms. Retry for cleaner traffic.');
      setDidSucceed(false);
      return;
    }

    setFeedback('Route C failed. Interface is down and packets were dropped. Retry with a stable interface.');
    setDidSucceed(false);
  }

  return (
    <section>
      <div className="section-head">
        <h2>{missionDef.title}</h2>
        <Link className="secondary-cta inline-control" to="/missions">
          Back to Hub
        </Link>
      </div>
      <p className="section-copy">
        Goal: pick the route that keeps esports stream traffic stable with minimum latency.
      </p>

      <form onSubmit={handleSubmit} className="interactive-panel" aria-describedby="packet-help">
        <fieldset className="choice-grid">
          <legend id="packet-help" className="legend-text">
            Choose one route and submit. Keyboard: use Tab and Space/Enter to select.
          </legend>
          {routeOptions.map((route) => (
            <label key={route.id} className="choice-card">
              <input
                type="radio"
                name="route"
                value={route.id}
                checked={selectedRoute === route.id}
                onChange={(event) => setSelectedRoute(event.target.value)}
              />
              <span className="choice-title">{route.title}</span>
              <span className="choice-detail">{route.detail}</span>
              <span className="choice-status">{route.status}</span>
            </label>
          ))}
        </fieldset>

        <div className="control-row">
          <button type="submit" className="primary-cta">
            Route Packet
          </button>
          <button
            type="button"
            className="secondary-cta"
            onClick={handleHint}
            disabled={hintVisible}
          >
            {hintVisible ? 'Hint Used' : 'Use Hint'}
          </button>
        </div>
      </form>

      {hintVisible ? (
        <p className="hint-box">
          Hint: prioritize the route labeled <strong>optimal</strong> and avoid interfaces with failure states.
        </p>
      ) : null}

      <p className={`result-box ${didSucceed ? 'is-success' : 'is-error'}`} aria-live="polite">
        {feedback || 'Awaiting routing decision...'}
      </p>

      <p className="fine-print">
        Attempts: {progress.missionStats[missionDef.id].attempts} | Hints used:{' '}
        {progress.missionStats[missionDef.id].hintsUsed}
      </p>
    </section>
  );
}
