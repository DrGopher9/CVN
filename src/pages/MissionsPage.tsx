import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MissionCard } from '../components/MissionCard';
import { missions } from '../content/missions';
import { isMissionUnlocked } from '../lib/mission-rules';
import { useProgress } from '../state/progress-context';

export function MissionsPage() {
  const navigate = useNavigate();
  const { progress, resetProgress } = useProgress();

  const completionPercent = useMemo(() => {
    const liveMissions = missions.filter((mission) => mission.isLive).length;
    if (liveMissions === 0) {
      return 0;
    }
    return Math.round((progress.completedMissionIds.length / liveMissions) * 100);
  }, [progress.completedMissionIds.length]);

  return (
    <section>
      <div className="section-head">
        <h2>Mission Hub</h2>
        <button type="button" className="text-button" onClick={resetProgress}>
          Reset my progress
        </button>
      </div>

      <p className="section-copy">
        Phase 2 missions are now interactive. Complete the first mission to unlock the second.
      </p>

      <div className="progress-bar-wrap" aria-label="Mission completion progress">
        <div className="progress-bar" style={{ width: `${completionPercent}%` }} />
      </div>
      <p className="fine-print">Completion: {completionPercent}%</p>

      {progress.badges.length > 0 ? (
        <div className="badge-row" aria-label="Unlocked badges">
          {progress.badges.map((badge) => (
            <span key={badge} className="badge-pill">
              {badge}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mission-grid">
        {missions.map((mission) => {
          const stats = progress.missionStats[mission.id];
          const isLocked = !isMissionUnlocked(mission, progress.completedMissionIds);

          return (
            <MissionCard
              key={mission.id}
              mission={mission}
              isComplete={stats.completed}
              isLocked={isLocked}
              attempts={stats.attempts}
              badge={stats.badge}
              onLaunch={() => navigate(mission.route)}
            />
          );
        })}
      </div>
    </section>
  );
}
