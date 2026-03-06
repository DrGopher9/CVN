import { Link } from 'react-router-dom';
import { CAMPUS_VISIT_URL } from '../constants';

const careerTracks = [
  {
    title: 'Cybersecurity Analyst',
    summary: 'Monitor threats, investigate alerts, and coordinate response when incidents hit.',
    fit: 'Great for students who like investigation, strategy, and protecting people/systems.'
  },
  {
    title: 'Network Engineer',
    summary: 'Design and optimize high-speed, reliable connectivity across campuses and businesses.',
    fit: 'Great for students who like building systems and tuning performance.'
  },
  {
    title: 'Cloud / Virtualization Admin',
    summary: 'Manage virtual infrastructure, identity controls, backups, and service uptime.',
    fit: 'Great for students who enjoy operations, automation, and large-scale systems.'
  },
  {
    title: 'Penetration Tester',
    summary: 'Perform authorized security testing to find weaknesses before attackers do.',
    fit: 'Great for students who enjoy creative problem solving and ethical hacking.'
  }
];

const competitionAndEsports = [
  {
    title: 'Cyber Competitions',
    body: 'ATCC students train through defensive challenge scenarios and participate in events such as CCDC-style environments where teams defend live networks.'
  },
  {
    title: 'High School Cyber Events',
    body: 'ATCC also supports high school cyber engagement events that help students experience the field before college enrollment.'
  },
  {
    title: 'Esports + Networking',
    body: 'Low-latency network design, uptime discipline, and incident response skills connect directly to competitive gaming and esports operations.'
  }
];

const officialLinks = [
  {
    label: 'High School Cyber Resources',
    url: 'https://www.alextech.edu/about-atcc/atcc-center-for-cybersecurity/high-school-cyber-resources'
  },
  {
    label: 'ATCC Center for Cybersecurity',
    url: 'https://www.alextech.edu/about-atcc/atcc-center-for-cybersecurity'
  },
  {
    label: 'Cyber Team Qualifies for Nationals (News)',
    url: 'https://www.alextech.edu/atcc-news/2024/11/04/alexandria-college-cybersecurity-students-qualify-for-nationals-at-the-2-year-college-cyber-defense-competition'
  },
  {
    label: 'Cyber Program Academic Excellence Designation (News)',
    url: 'https://www.alextech.edu/atcc-news/2022/09/06/cybersecurity-program-earns-academic-excellence-designation'
  },
  {
    label: 'CVN Program Page',
    url: 'https://www.alextech.edu/programs/cybersecurity-virtualization-networking'
  },
  {
    label: 'ATCC Esports',
    url: 'https://legends.alextech.edu/sports/esports/index'
  }
] as const;

export function PathwaysPage() {
  return (
    <section className="pathways-stack">
      <div className="pathways-hero">
        <p className="badge">ATCC Pathway Hub</p>
        <h2>Build Your CVNP Path at Alexandria Tech</h2>
        <p className="section-copy">
          Start with hands-on labs, grow your confidence through missions and competition-style
          practice, and move toward real cybersecurity and networking careers.
        </p>
      </div>

      <div className="fact-strip" aria-label="ATCC program facts">
        <article className="fact-card">
          <p className="mini-label">Credential Option</p>
          <h3>Cybersecurity Specialist Diploma</h3>
          <p>30-credit focused path for fast entry into technical roles.</p>
        </article>
        <article className="fact-card">
          <p className="mini-label">Credential Option</p>
          <h3>CVN AAS Degree</h3>
          <p>60-credit pathway with deeper networking, virtualization, and cyber breadth.</p>
        </article>
        <article className="fact-card">
          <p className="mini-label">Program Signal</p>
          <h3>Hands-On + CAE-Aligned Cyber</h3>
          <p>Lab-centered training with strong emphasis on real defensive practices.</p>
        </article>
      </div>

      <div className="pathway-grid">
        <article className="pathway-card">
          <h3>Cybersecurity Specialist Diploma</h3>
          <p>
            Fast-launch pathway with practical defensive skills, system hardening, and incident
            response workflows.
          </p>
          <span className="pathway-tag">30 credits</span>
        </article>

        <article className="pathway-card">
          <h3>Cybersecurity, Virtualization, & Networking AAS</h3>
          <p>
            Expanded pathway for students who want deeper infrastructure, cloud, and enterprise
            network foundations.
          </p>
          <span className="pathway-tag">60 credits</span>
        </article>
      </div>

      <div className="pathway-section">
        <h3>Potential Career Tracks</h3>
        <div className="career-track-grid">
          {careerTracks.map((track) => (
            <article key={track.title} className="career-track-card">
              <h4>{track.title}</h4>
              <p>{track.summary}</p>
              <p className="fine-print">{track.fit}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="pathway-section">
        <h3>Competitions and Esports Connection</h3>
        <div className="competition-grid">
          {competitionAndEsports.map((item) => (
            <article key={item.title} className="competition-card">
              <h4>{item.title}</h4>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="pathway-section">
        <h3>Suggested Next Steps</h3>
        <ol className="next-steps-list">
          <li>Complete missions to identify your strongest track.</li>
          <li>Compare Diploma vs AAS based on your timeline and goals.</li>
          <li>Book a campus visit to see labs, equipment, and student projects.</li>
        </ol>
      </div>

      <div className="pathway-section">
        <h3>Official Links</h3>
        <div className="resource-links-grid">
          {officialLinks.map((item) => (
            <article key={item.url} className="resource-link-card">
              <h4>{item.label}</h4>
              <a className="secondary-cta" href={item.url} target="_blank" rel="noreferrer">
                Open Link
              </a>
            </article>
          ))}
        </div>
      </div>

      <div className="cta-row">
        <a className="primary-cta" href={CAMPUS_VISIT_URL} target="_blank" rel="noreferrer">
          Schedule Campus Visit
        </a>
        <Link to="/missions" className="secondary-cta">
          Back to Missions
        </Link>
      </div>
    </section>
  );
}
