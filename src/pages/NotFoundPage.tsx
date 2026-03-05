import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section>
      <h2>Route not found</h2>
      <p className="section-copy">Use Mission Control navigation to continue.</p>
      <Link to="/" className="primary-cta inline-cta">
        Back to Home
      </Link>
    </section>
  );
}
