import { CAMPUS_VISIT_URL } from '../constants';
import { trackEvent } from '../lib/analytics';
import { useProgress } from '../state/progress-context';

export function VisitPage() {
  const {
    progress: { points, completedMissionIds, sessionId }
  } = useProgress();

  function handleVisitClick() {
    trackEvent('campus_visit_cta_clicked', {
      points,
      completedMissions: completedMissionIds.length,
      sessionId
    });
  }

  return (
    <section className="visit-panel">
      <h2>Campus Visit: Next Move</h2>
      <p>
        You have completed <strong>{completedMissionIds.length}</strong> missions and earned{' '}
        <strong>{points} points</strong>. Bring that momentum to a campus visit and see the labs in
        person.
      </p>
      <a
        className="primary-cta"
        href={CAMPUS_VISIT_URL}
        target="_blank"
        rel="noreferrer"
        onClick={handleVisitClick}
      >
        RSVP for Campus Visit
      </a>
      <p className="fine-print">Opens alextech.edu in a new tab.</p>
    </section>
  );
}
