export const MISSION_IDS = [
  'packet-path',
  'password-pulse',
  'sandbox-reset',
  'python-fix',
  'phishing-detective',
  'wifi-defense',
  'forensics-timeline',
  'career-boss'
] as const;

export type MissionId = (typeof MISSION_IDS)[number];

export interface MissionDefinition {
  id: MissionId;
  title: string;
  domain:
    | 'Cybersecurity'
    | 'Networking'
    | 'Virtualization'
    | 'Automation'
    | 'Career';
  difficulty: 'Rookie' | 'Intermediate' | 'Advanced';
  objective: string;
  rewardPoints: number;
  durationMinutes: number;
  route: string;
  unlockRequires?: MissionId[];
  isLive: boolean;
}

export type DebriefCtaTarget = 'next-mission' | 'pathways' | 'visit';

export interface DebriefCta {
  label: string;
  target: DebriefCtaTarget;
}

export interface DebriefContent {
  summary: string;
  itFieldMapping: string;
  roles: string[];
  cvnpConnection: string;
  primaryCta: DebriefCta;
  secondaryCta: DebriefCta;
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
