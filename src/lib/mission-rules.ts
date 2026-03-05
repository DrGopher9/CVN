import { MissionDefinition, MissionId } from '../types';

export function isMissionUnlocked(
  mission: MissionDefinition,
  completedMissionIds: MissionId[]
): boolean {
  if (!mission.unlockRequires || mission.unlockRequires.length === 0) {
    return true;
  }

  return mission.unlockRequires.every((dependency) => completedMissionIds.includes(dependency));
}

export function calculateMissionScore(
  basePoints: number,
  attemptsAfterSubmit: number,
  hintsUsed: number,
  minScore: number
): number {
  const retryPenalty = Math.max(attemptsAfterSubmit - 1, 0) * 20;
  const hintPenalty = hintsUsed * 15;
  const rawScore = basePoints - retryPenalty - hintPenalty;
  return Math.max(minScore, rawScore);
}

export function packetPathBadge(attemptsAfterSubmit: number, hintsUsed: number): string {
  if (attemptsAfterSubmit === 1 && hintsUsed === 0) {
    return 'Zero-Lag Legend';
  }
  if (hintsUsed === 0) {
    return 'Routing Pro';
  }
  return 'Traffic Troubleshooter';
}

export function snifferBadge(attemptsAfterSubmit: number, hintsUsed: number): string {
  if (attemptsAfterSubmit <= 2 && hintsUsed === 0) {
    return 'Packet Hunter';
  }
  if (hintsUsed <= 1) {
    return 'Signal Tracker';
  }
  return 'Blue Team Closer';
}
