import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '../lib/analytics';
import { DebriefContent, MissionId } from '../types';

interface MissionDebriefProps {
  missionId: MissionId;
  debrief: DebriefContent;
  score: number;
  badge: string;
  nextMissionRoute: string | null;
  sessionId: string;
  onClose: () => void;
}

export function MissionDebrief({
  missionId,
  debrief,
  score,
  badge,
  nextMissionRoute,
  sessionId,
  onClose
}: MissionDebriefProps) {
  const navigate = useNavigate();
  const primaryRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    trackEvent('mission_debrief_viewed', { missionId, sessionId, score, badge });
    primaryRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        handleDismiss();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleDismiss() {
    trackEvent('mission_debrief_dismissed', { missionId, sessionId, score, badge });
    onClose();
  }

  function handlePrimaryCta() {
    trackEvent('mission_debrief_cta_clicked', {
      missionId,
      sessionId,
      score,
      badge,
      ctaTarget: debrief.primaryCta.target
    });

    if (debrief.primaryCta.target === 'next-mission' && nextMissionRoute) {
      navigate(nextMissionRoute);
    } else if (debrief.primaryCta.target === 'pathways') {
      navigate('/pathways');
    } else if (debrief.primaryCta.target === 'visit') {
      window.open('https://www.alextech.edu/about-atcc/campus-visits', '_blank', 'noopener');
    } else {
      navigate('/missions');
    }
  }

  function handleSecondaryCta() {
    trackEvent('mission_debrief_cta_clicked', {
      missionId,
      sessionId,
      score,
      badge,
      ctaTarget: debrief.secondaryCta.target
    });

    if (debrief.secondaryCta.target === 'pathways') {
      navigate('/pathways');
    } else if (debrief.secondaryCta.target === 'visit') {
      window.open('https://www.alextech.edu/about-atcc/campus-visits', '_blank', 'noopener');
    } else if (debrief.secondaryCta.target === 'next-mission' && nextMissionRoute) {
      navigate(nextMissionRoute);
    } else {
      navigate('/missions');
    }
  }

  return (
    <div
      className="debrief-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleDismiss();
      }}
    >
      <div
        className="debrief-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="debrief-title"
      >
        <div className="debrief-classification">CLASSIFICATION: CLEARED</div>

        <div className="debrief-header">
          <p className="debrief-eyebrow">Debrief Report</p>
          <h2 id="debrief-title" className="debrief-title">Mission Complete</h2>
        </div>

        <div className="debrief-stats-bar">
          <div className="debrief-stat">
            <span className="debrief-stat-label">Score</span>
            <strong className="debrief-stat-value">+{score}</strong>
          </div>
          <div className="debrief-divider-v" />
          <div className="debrief-stat">
            <span className="debrief-stat-label">Badge Earned</span>
            <strong className="debrief-stat-badge">{badge}</strong>
          </div>
        </div>

        <div className="debrief-sections">
          <section className="debrief-section">
            <h3 className="debrief-section-label">What You Just Did</h3>
            <p className="debrief-section-body">{debrief.summary}</p>
          </section>

          <section className="debrief-section">
            <h3 className="debrief-section-label">How This Maps to Real IT Work</h3>
            <p className="debrief-section-body">{debrief.itFieldMapping}</p>
          </section>

          <section className="debrief-section">
            <h3 className="debrief-section-label">Career Roles Using This Skill</h3>
            <div className="debrief-roles">
              {debrief.roles.map((role) => (
                <span key={role} className="debrief-role-chip">{role}</span>
              ))}
            </div>
          </section>

          <section className="debrief-section">
            <h3 className="debrief-section-label">ATCC / CVNP Connection</h3>
            <p className="debrief-section-body">{debrief.cvnpConnection}</p>
          </section>
        </div>

        <div className="debrief-cta-row">
          <button
            ref={primaryRef}
            className="primary-cta debrief-primary-cta"
            onClick={handlePrimaryCta}
          >
            {debrief.primaryCta.label}
          </button>
          <button
            className="secondary-cta"
            onClick={handleSecondaryCta}
          >
            {debrief.secondaryCta.label}
          </button>
          <button
            className="debrief-dismiss"
            onClick={handleDismiss}
            aria-label="Close debrief"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
