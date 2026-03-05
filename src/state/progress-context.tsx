import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { trackEvent } from '../lib/analytics';
import {
  createDefaultMissionStats,
  createDefaultProgressState,
  loadProgressState,
  saveProgressState
} from '../lib/progress';
import { MissionId, ProgressState } from '../types';

interface ProgressContextValue {
  progress: ProgressState;
  recordAttempt: (missionId: MissionId) => void;
  recordHintUsed: (missionId: MissionId) => void;
  completeMission: (missionId: MissionId, pointsAwarded: number, badge: string) => void;
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

function createResetState(existingSessionId: string): ProgressState {
  const defaultState = createDefaultProgressState();

  return {
    sessionId: existingSessionId,
    completedMissionIds: defaultState.completedMissionIds,
    points: 0,
    badges: [],
    missionStats: createDefaultMissionStats(),
    lastUpdatedIso: new Date().toISOString()
  };
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(() => loadProgressState());

  useEffect(() => {
    saveProgressState(progress);
  }, [progress]);

  const value = useMemo<ProgressContextValue>(
    () => ({
      progress,
      recordAttempt: (missionId) => {
        setProgress((previous) => {
          const missionStats = {
            ...previous.missionStats,
            [missionId]: {
              ...previous.missionStats[missionId],
              attempts: previous.missionStats[missionId].attempts + 1
            }
          };

          const next = {
            ...previous,
            missionStats,
            lastUpdatedIso: new Date().toISOString()
          };

          trackEvent('mission_attempt', {
            missionId,
            attempts: missionStats[missionId].attempts,
            sessionId: next.sessionId
          });

          return next;
        });
      },
      recordHintUsed: (missionId) => {
        setProgress((previous) => {
          const missionStats = {
            ...previous.missionStats,
            [missionId]: {
              ...previous.missionStats[missionId],
              hintsUsed: previous.missionStats[missionId].hintsUsed + 1
            }
          };

          const next = {
            ...previous,
            missionStats,
            lastUpdatedIso: new Date().toISOString()
          };

          trackEvent('mission_hint_used', {
            missionId,
            hintsUsed: missionStats[missionId].hintsUsed,
            sessionId: next.sessionId
          });

          return next;
        });
      },
      completeMission: (missionId, pointsAwarded, badge) => {
        setProgress((previous) => {
          const priorStat = previous.missionStats[missionId];
          const wasAlreadyCompleted = priorStat.completed;

          const missionStats = {
            ...previous.missionStats,
            [missionId]: {
              ...priorStat,
              completed: true,
              bestScore: Math.max(priorStat.bestScore, pointsAwarded),
              badge
            }
          };

          const completedMissionIds = Array.from(
            new Set([...previous.completedMissionIds, missionId])
          ) as MissionId[];

          const badges = previous.badges.includes(badge)
            ? previous.badges
            : [...previous.badges, badge];

          const next = {
            ...previous,
            missionStats,
            completedMissionIds,
            badges,
            points: wasAlreadyCompleted ? previous.points : previous.points + pointsAwarded,
            lastUpdatedIso: new Date().toISOString()
          };

          trackEvent('mission_complete', {
            missionId,
            pointsAwarded,
            totalPoints: next.points,
            badge,
            sessionId: next.sessionId,
            replay: wasAlreadyCompleted
          });

          return next;
        });
      },
      resetProgress: () => {
        setProgress((previous) => {
          const next = createResetState(previous.sessionId);
          trackEvent('progress_reset', { sessionId: next.sessionId });
          return next;
        });
      }
    }),
    [progress]
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used inside ProgressProvider');
  }
  return context;
}
