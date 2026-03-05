import { MissionDefinition } from '../types';

interface MissionCardProps {
  mission: MissionDefinition;
  isComplete: boolean;
  isLocked: boolean;
  attempts: number;
  badge: string | null;
  onLaunch: () => void;
}

export function MissionCard({
  mission,
  isComplete,
  isLocked,
  attempts,
  badge,
  onLaunch
}: MissionCardProps) {
  let actionLabel = 'Start Mission';
  if (!mission.isLive) {
    actionLabel = 'Coming Soon';
  } else if (isLocked) {
    actionLabel = 'Locked';
  } else if (isComplete) {
    actionLabel = 'Replay Mission';
  } else if (attempts > 0) {
    actionLabel = 'Resume Mission';
  }

  return (
    <article className={`mission-card ${isComplete ? 'is-complete' : ''} ${isLocked ? 'is-locked' : ''}`}>
      <div className="mission-meta">
        <span className="mission-domain">{mission.domain}</span>
        <span className="mission-level">{mission.difficulty}</span>
      </div>
      <h3>{mission.title}</h3>
      <p>{mission.objective}</p>
      <div className="mission-footer">
        <span>{mission.durationMinutes} min</span>
        <span>+{mission.rewardPoints} pts</span>
      </div>

      <p className="fine-print">
        Attempts: {attempts}
        {badge ? ` | Badge: ${badge}` : ''}
      </p>

      <button
        type="button"
        className="mission-button"
        onClick={onLaunch}
        disabled={!mission.isLive || isLocked}
        aria-label={actionLabel}
      >
        {actionLabel}
      </button>
    </article>
  );
}
