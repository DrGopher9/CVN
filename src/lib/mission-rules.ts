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

export function sandboxBadge(
  attemptsAfterSubmit: number,
  hintsUsed: number,
  threatLevelAtValidation: number
): string {
  if (attemptsAfterSubmit === 1 && hintsUsed === 0 && threatLevelAtValidation <= 35) {
    return 'Containment Commander';
  }
  if (hintsUsed <= 1) {
    return 'Snapshot Specialist';
  }
  return 'Recovery Operator';
}

export function pythonBadge(attemptsAfterSubmit: number, hintsUsed: number): string {
  if (attemptsAfterSubmit === 1 && hintsUsed === 0) {
    return 'Syntax Sniper';
  }
  if (hintsUsed <= 1) {
    return 'Bug Buster';
  }
  return 'Code Defender';
}

export function phishingBadge(
  attemptsAfterSubmit: number,
  hintsUsed: number,
  correctCount: number
): string {
  if (attemptsAfterSubmit === 1 && hintsUsed === 0 && correctCount === 6) {
    return 'Inbox Guardian';
  }
  if (correctCount >= 5) {
    return 'Phish Spotter';
  }
  return 'Awareness Rookie';
}

export function wifiBadge(
  attemptsAfterSubmit: number,
  hintsUsed: number,
  hardeningScore: number
): string {
  if (attemptsAfterSubmit === 1 && hintsUsed === 0 && hardeningScore === 100) {
    return 'Wireless Warden';
  }
  if (hardeningScore >= 84) {
    return 'Access Point Defender';
  }
  return 'Network Hardener';
}

export function forensicsBadge(attemptsAfterSubmit: number, hintsUsed: number): string {
  if (attemptsAfterSubmit === 1 && hintsUsed === 0) {
    return 'Evidence Ace';
  }
  if (hintsUsed <= 1) {
    return 'Incident Sleuth';
  }
  return 'Log Analyst';
}

export function careerBossBadge(
  attemptsAfterSubmit: number,
  hintsUsed: number,
  accuracyPercent: number
): string {
  if (attemptsAfterSubmit === 1 && hintsUsed === 0 && accuracyPercent === 100) {
    return 'Career Boss';
  }
  if (accuracyPercent >= 80) {
    return 'Role Strategist';
  }
  return 'Pathway Explorer';
}

export function pythonLogParserBadge(attemptsAfterSubmit: number, hintsUsed: number): string {
  if (attemptsAfterSubmit === 1 && hintsUsed === 0) {
    return 'Threat Intel Ace';
  }
  if (attemptsAfterSubmit <= 2 && hintsUsed <= 1) {
    return 'Log Analysis Pro';
  }
  return 'Incident Analyst';
}
