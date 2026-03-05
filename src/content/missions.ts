import { MissionDefinition } from '../types';

export const missions: MissionDefinition[] = [
  {
    id: 'packet-path',
    title: 'Packet Path Rush',
    domain: 'Networking',
    difficulty: 'Rookie',
    objective: 'Pick the fastest stable route before stream traffic drops.',
    rewardPoints: 100,
    durationMinutes: 3,
    route: '/missions/packet-path',
    isLive: true
  },
  {
    id: 'password-pulse',
    title: 'Live Sniffer Hunt',
    domain: 'Cybersecurity',
    difficulty: 'Intermediate',
    objective: 'Pause packet flow and intercept exposed login credentials.',
    rewardPoints: 150,
    durationMinutes: 4,
    route: '/missions/password-pulse',
    unlockRequires: ['packet-path'],
    isLive: true
  },
  {
    id: 'sandbox-reset',
    title: 'Sandbox Save',
    domain: 'Virtualization',
    difficulty: 'Advanced',
    objective: 'Contain malware spread and roll back to a clean VM snapshot.',
    rewardPoints: 200,
    durationMinutes: 5,
    route: '/missions/sandbox-reset',
    unlockRequires: ['packet-path', 'password-pulse'],
    isLive: true
  },
  {
    id: 'python-fix',
    title: 'Python Fix Lab',
    domain: 'Automation',
    difficulty: 'Intermediate',
    objective: 'Debug a defense script so the firewall deploys under attack.',
    rewardPoints: 180,
    durationMinutes: 4,
    route: '/missions/python-fix',
    unlockRequires: ['sandbox-reset'],
    isLive: true
  }
];

export function findMissionById(missionId: string): MissionDefinition | undefined {
  return missions.find((mission) => mission.id === missionId);
}
