import { DebriefContent, MissionId } from '../types';

export const debriefContent: Record<MissionId, DebriefContent> = {
  'packet-path': {
    summary:
      'You analyzed three network routes under live traffic pressure and selected the one with optimal throughput and zero packet loss. That split-second decision is exactly what keeps real networks running.',
    itFieldMapping:
      'Traffic engineering, latency optimization, and fault-aware routing are core daily tasks for network engineers. When a video call drops or a stream buffers, someone with your skills figures out why and reroutes traffic before users notice.',
    roles: ['Network Engineer', 'NOC Analyst', 'Infrastructure Engineer'],
    cvnpConnection:
      'CVNP Networking labs at ATCC put you on real Cisco gear doing exactly this — routing table analysis, interface troubleshooting, and performance tuning across live topologies.',
    primaryCta: { label: 'Next Mission', target: 'next-mission' },
    secondaryCta: { label: 'Explore Pathways', target: 'pathways' }
  },

  'password-pulse': {
    summary:
      'You intercepted unencrypted network traffic and identified exposed credentials before an attacker could. Recognizing what data should never travel in plaintext is a foundational defensive skill.',
    itFieldMapping:
      'Packet inspection and insecure protocol identification are front-line skills in security operations centers. Analysts use tools like Wireshark daily to catch credential leaks, detect suspicious traffic patterns, and harden communication channels.',
    roles: ['Cybersecurity Analyst', 'SOC Analyst', 'Penetration Tester'],
    cvnpConnection:
      'CVNP Security courses at ATCC include hands-on packet capture labs where you work through real traffic captures and defensive monitoring workflows — exactly the skills employers are hiring for.',
    primaryCta: { label: 'Next Mission', target: 'next-mission' },
    secondaryCta: { label: 'Explore Pathways', target: 'pathways' }
  },

  'sandbox-reset': {
    summary:
      'You contained a malware outbreak, sequenced the right recovery actions, and rolled back to a clean snapshot before the threat spread. Knowing when to isolate and when to restore is what separates a good incident responder from a great one.',
    itFieldMapping:
      'Incident containment, recovery sequencing, and rollback strategy are the core of virtualization and security operations. Every organization running VMs needs people who can execute this under pressure — calmly and correctly.',
    roles: ['Incident Responder', 'Systems Security Administrator', 'Virtualization Engineer'],
    cvnpConnection:
      'CVNP Virtualization labs at ATCC use enterprise hypervisors where you practice snapshot management, VM isolation, and security response in environments that mirror real data centers.',
    primaryCta: { label: 'Next Mission', target: 'next-mission' },
    secondaryCta: { label: 'Explore Pathways', target: 'pathways' }
  },

  'python-fix': {
    summary:
      'You debugged a Python firewall deployment script and got it running correctly under attack conditions. Security tools are only as good as the code behind them — and you just proved you can fix that code.',
    itFieldMapping:
      'Security automation and defensive tooling are how modern teams scale their defenses. Scripting languages like Python are used to automate log parsing, trigger alerts, deploy configs, and patch vulnerabilities faster than any manual process.',
    roles: ['Security Automation Analyst', 'Junior DevSecOps Engineer', 'Security Engineer'],
    cvnpConnection:
      'ATCC CVNP programs include Python-based automation coursework where you write and debug scripts that run real security operations — not toy examples, but production-style tooling.',
    primaryCta: { label: 'Next Mission', target: 'next-mission' },
    secondaryCta: { label: 'Explore Pathways', target: 'pathways' }
  },

  'phishing-detective': {
    summary:
      'You triaged a full inbox of suspicious messages, correctly flagged social engineering attempts, and protected users from credential theft. Most successful cyberattacks start with a single bad click — you just stopped them.',
    itFieldMapping:
      'Email triage, social engineering defense, and user safety operations are among the highest-volume tasks in security awareness and SOC roles. Analysts review reported phishing attempts daily and create detection rules based on what they find.',
    roles: ['Security Awareness Analyst', 'SOC Analyst', 'Email Security Specialist'],
    cvnpConnection:
      'CVNP cybersecurity coursework covers detection policy, response procedures, and real-world phishing simulation — the exact workflow you practiced in this mission.',
    primaryCta: { label: 'Next Mission', target: 'next-mission' },
    secondaryCta: { label: 'Explore Pathways', target: 'pathways' }
  },

  'wifi-defense': {
    summary:
      'You identified wireless vulnerabilities and hardened a school network against common attacks — changing weak encryption, removing rogue access points, and locking down guest access. Wireless security is one of the most overlooked and most exploited surfaces in any organization.',
    itFieldMapping:
      'Wireless hardening, network segmentation, and secure access control configuration are hands-on tasks for network and infrastructure security roles. Every hospital, school, and business with Wi-Fi needs this expertise.',
    roles: ['Network Engineer', 'Infrastructure Security Specialist', 'Wireless Network Administrator'],
    cvnpConnection:
      'ATCC CVNP Networking labs cover wireless security standards, access point configuration, and segmentation strategies on real enterprise-grade equipment.',
    primaryCta: { label: 'Next Mission', target: 'next-mission' },
    secondaryCta: { label: 'Explore Pathways', target: 'pathways' }
  },

  'forensics-timeline': {
    summary:
      'You reconstructed an incident chain from fragmented log data, identified patient zero, and mapped the kill chain from initial access to lateral movement. Digital forensics is detective work with a keyboard.',
    itFieldMapping:
      'Evidence sequencing, kill-chain reconstruction, and root cause analysis are the core of digital forensics and incident response. DFIR analysts are called in after breaches to answer the hardest question: exactly what happened, and how do we make sure it never happens again?',
    roles: ['DFIR Analyst', 'Cybersecurity Investigator', 'Incident Response Lead'],
    cvnpConnection:
      'CVNP Security programs at ATCC build the investigative mindset and technical toolkit — log analysis, timeline reconstruction, and evidence documentation — that DFIR careers demand.',
    primaryCta: { label: 'Next Mission', target: 'next-mission' },
    secondaryCta: { label: 'Explore Pathways', target: 'pathways' }
  },

  'python-log-parser': {
    summary:
      'You diagnosed and fixed four independent bugs in a live threat detection script — wrong threshold, bad string parsing, a logic operator edge case, and a missing function call. Every one of those bugs would have let a real attacker go unreported.',
    itFieldMapping:
      'Log parsing and automated threat detection are core to how SOC teams scale. No one reads 100,000 log lines manually — scripts do it. When those scripts have bugs, threats slip through. Security engineers who can read, debug, and fix detection tooling are among the most valuable on any team.',
    roles: ['Security Automation Engineer', 'SOC Analyst', 'Detection Engineer', 'Junior DevSecOps'],
    cvnpConnection:
      'ATCC CVNP programs include Python-based security automation coursework where you build and debug real detection and response tooling — not toy scripts, but the kind of code that runs in production SOC environments.',
    primaryCta: { label: 'Final Mission', target: 'next-mission' },
    secondaryCta: { label: 'Explore Pathways', target: 'pathways' }
  },

  'career-boss': {
    summary:
      'You matched real IT job tasks to the roles that perform them and discovered where your strengths naturally land. Understanding the career landscape means you can make a deliberate choice — not just take whatever job comes first.',
    itFieldMapping:
      'Role-task alignment is exactly how hiring managers think. They hire for specific responsibilities: can you monitor and triage (SOC)? Design and maintain infrastructure (networking)? Automate defenses (DevSecOps)? Investigate incidents (DFIR)? You now know the difference.',
    roles: ['SOC Analyst', 'Network Engineer', 'Cloud Security Engineer', 'Penetration Tester', 'DFIR Analyst'],
    cvnpConnection:
      'ATCC CVNP programs offer pathways toward AAS degrees and industry certifications — CompTIA Security+, Network+, CySA+ — that directly map to the career roles you just explored. The next step is a campus visit to see exactly where you fit.',
    primaryCta: { label: 'Schedule Campus Visit', target: 'visit' },
    secondaryCta: { label: 'Explore Pathways', target: 'pathways' }
  }
};
