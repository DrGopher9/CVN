import { Link } from 'react-router-dom';

export function SandboxComingSoonPage() {
  return (
    <section>
      <div className="section-head">
        <h2>Sandbox Save</h2>
        <Link className="secondary-cta inline-control" to="/missions">
          Back to Hub
        </Link>
      </div>
      <p className="section-copy">
        This Phase 2 route is reserved for the virtualization mission in the next build slice.
      </p>
      <p className="hint-box">Next up: malware simulation, rollback timing, and containment scoring.</p>
    </section>
  );
}
