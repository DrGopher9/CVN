import { MISSION_IDS, MissionId, MissionStat, MissionStats, ProgressState } from '../types';
import { createAnonymousSessionId } from './session';

const STORAGE_KEY = 'cvn_mission_progress_v2';

function defaultMissionStat(): MissionStat {
  return {
    attempts: 0,
    hintsUsed: 0,
    bestScore: 0,
    completed: false,
    badge: null
  };
}

export function createDefaultMissionStats(): MissionStats {
  return {
    'packet-path': defaultMissionStat(),
    'password-pulse': defaultMissionStat(),
    'sandbox-reset': defaultMissionStat(),
    'python-fix': defaultMissionStat(),
    'phishing-detective': defaultMissionStat(),
    'wifi-defense': defaultMissionStat(),
    'forensics-timeline': defaultMissionStat(),
    'python-log-parser': defaultMissionStat(),
    'career-boss': defaultMissionStat()
  };
}

function mergeMissionStats(rawStats: unknown): MissionStats {
  const defaults = createDefaultMissionStats();
  if (!rawStats || typeof rawStats !== 'object') {
    return defaults;
  }

  const parsed = rawStats as Partial<Record<MissionId, Partial<MissionStat>>>;

  for (const missionId of MISSION_IDS) {
    const source = parsed[missionId];
    if (!source) {
      continue;
    }

    defaults[missionId] = {
      attempts: Number.isFinite(source.attempts) ? Number(source.attempts) : 0,
      hintsUsed: Number.isFinite(source.hintsUsed) ? Number(source.hintsUsed) : 0,
      bestScore: Number.isFinite(source.bestScore) ? Number(source.bestScore) : 0,
      completed: Boolean(source.completed),
      badge: typeof source.badge === 'string' ? source.badge : null
    };
  }

  return defaults;
}

export function createDefaultProgressState(): ProgressState {
  return {
    sessionId: createAnonymousSessionId(),
    completedMissionIds: [],
    points: 0,
    badges: [],
    missionStats: createDefaultMissionStats(),
    lastUpdatedIso: new Date().toISOString()
  };
}

export function loadProgressState(): ProgressState {
  if (typeof window === 'undefined') {
    return createDefaultProgressState();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return createDefaultProgressState();
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    if (!parsed.sessionId) {
      return createDefaultProgressState();
    }

    const missionStats = mergeMissionStats(parsed.missionStats);
    const completedMissionIds = MISSION_IDS.filter((missionId) => missionStats[missionId].completed);

    return {
      sessionId: parsed.sessionId,
      completedMissionIds,
      points: Number.isFinite(parsed.points) ? Number(parsed.points) : 0,
      badges: Array.isArray(parsed.badges)
        ? parsed.badges.filter((badge): badge is string => typeof badge === 'string')
        : [],
      missionStats,
      lastUpdatedIso:
        typeof parsed.lastUpdatedIso === 'string' ? parsed.lastUpdatedIso : new Date().toISOString()
    };
  } catch {
    return createDefaultProgressState();
  }
}

export function saveProgressState(state: ProgressState): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
