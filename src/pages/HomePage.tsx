import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <section className="hero-grid">
      <div className="hero-panel">
        <p className="badge">For High School Seniors</p>
        <h2>Build your tech future through live missions.</h2>
        <p>
          Explore cybersecurity, networking, and virtualization through fast interactive challenges,
          then map your strengths to CVNP pathways at Alexandria Tech.
        </p>
        <div className="cta-row">
          <Link to="/missions" className="primary-cta">
            Start Missions
          </Link>
          <Link to="/pathways" className="secondary-cta">
            Explore Programs
          </Link>
        </div>
      </div>

      <aside className="stat-panel" aria-label="Career momentum">
        <h3>Why this field is hot</h3>
        <ul>
          <li>
            <strong>33%</strong> projected growth for InfoSec analysts (2024-2034).
          </li>
          <li>
            <strong>$124,910</strong> median annual pay (BLS, 2025) for InfoSec analysts.
          </li>
          <li>
            <strong>317,700</strong> projected annual openings across computer and IT occupations.
          </li>
        </ul>
      </aside>
    </section>
  );
}
