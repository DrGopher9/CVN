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
  },
  {
    id: 'phishing-detective',
    title: 'Phishing Detective',
    domain: 'Cybersecurity',
    difficulty: 'Intermediate',
    objective: 'Classify suspicious messages and stop social-engineering attacks.',
    rewardPoints: 170,
    durationMinutes: 4,
    route: '/missions/phishing-detective',
    unlockRequires: ['python-fix'],
    isLive: true
  },
  {
    id: 'wifi-defense',
    title: 'Wi-Fi Attack/Defend Lab',
    domain: 'Networking',
    difficulty: 'Advanced',
    objective: 'Harden a school Wi-Fi setup against common wireless attacks.',
    rewardPoints: 190,
    durationMinutes: 5,
    route: '/missions/wifi-defense',
    unlockRequires: ['phishing-detective'],
    isLive: true
  },
  {
    id: 'forensics-timeline',
    title: 'Forensics Timeline',
    domain: 'Cybersecurity',
    difficulty: 'Advanced',
    objective: 'Reconstruct the incident chain and identify patient zero.',
    rewardPoints: 210,
    durationMinutes: 5,
    route: '/missions/forensics-timeline',
    unlockRequires: ['wifi-defense'],
    isLive: true
  },
  {
    id: 'career-boss',
    title: 'Career Boss Round',
    domain: 'Career',
    difficulty: 'Advanced',
    objective: 'Match real-world tasks to roles and discover your strongest career fit.',
    rewardPoints: 240,
    durationMinutes: 6,
    route: '/missions/career-boss',
    unlockRequires: ['forensics-timeline'],
    isLive: true
  }
];

export function findMissionById(missionId: string): MissionDefinition | undefined {
  return missions.find((mission) => mission.id === missionId);
}
