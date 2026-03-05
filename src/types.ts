export const MISSION_IDS = ['packet-path', 'password-pulse', 'sandbox-reset', 'python-fix'] as const;

export type MissionId = (typeof MISSION_IDS)[number];

export interface MissionDefinition {
  id: MissionId;
  title: string;
  domain: 'Cybersecurity' | 'Networking' | 'Virtualization' | 'Automation';
  difficulty: 'Rookie' | 'Intermediate' | 'Advanced';
  objective: string;
  rewardPoints: number;
  durationMinutes: number;
  route: string;
  unlockRequires?: MissionId[];
  isLive: boolean;
}

export interface MissionStat {
  attempts: number;
  hintsUsed: number;
  bestScore: number;
  completed: boolean;
  badge: string | null;
}

export type MissionStats = Record<MissionId, MissionStat>;

export interface ProgressState {
  sessionId: string;
  completedMissionIds: MissionId[];
  points: number;
  badges: string[];
  missionStats: MissionStats;
  lastUpdatedIso: string;
}
