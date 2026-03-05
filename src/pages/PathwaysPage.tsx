import { Link } from 'react-router-dom';

export function PathwaysPage() {
  return (
    <section>
      <h2>CVNP Pathways at Alexandria Tech</h2>
      <p className="section-copy">
        Choose the credential that matches your timeline. Start hands-on, build certifications, and
        move straight into high-demand IT roles.
      </p>

      <div className="pathway-grid">
        <article className="pathway-card">
          <h3>Cybersecurity Specialist Diploma</h3>
          <p>42 credits focused on core defensive/offensive security skills and practical labs.</p>
          <span className="pathway-tag">Fast launch path</span>
        </article>

        <article className="pathway-card">
          <h3>Cybersecurity, Virtualization, & Networking AAS</h3>
          <p>60 credits for broader infrastructure, cloud, and network depth plus transfer/career flexibility.</p>
          <span className="pathway-tag">Expanded career options</span>
        </article>
      </div>

      <Link to="/visit" className="primary-cta inline-cta">
        Plan Your Campus Visit
      </Link>
    </section>
  );
}
