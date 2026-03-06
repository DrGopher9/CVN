import { useCallback, useEffect, useRef } from 'react';
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
  const panelRef = useRef<HTMLDivElement>(null);

  const handleDismiss = useCallback(() => {
    trackEvent('mission_debrief_dismissed', { missionId, sessionId, score, badge });
    onClose();
  }, [missionId, sessionId, score, badge, onClose]);

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
  }, [handleDismiss, missionId, sessionId, score, badge]);

  // Focus trap
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    function handleTab(event: KeyboardEvent) {
      if (event.key !== 'Tab') return;

      const focusable = panel!.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const focusableList = Array.from(focusable);
      if (focusableList.length === 0) return;

      const first = focusableList[0];
      const last = focusableList[focusableList.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    panel.addEventListener('keydown', handleTab);
    return () => panel.removeEventListener('keydown', handleTab);
  }, []);

  function handlePrimaryCta() {
    trackEvent('mission_debrief_cta_clicked', {
      missionId,
      sessionId,
      score,
      badge,
      ctaTarget: debrief.primaryCta.target
    });

    if (debrief.primaryCta.target === 'next-mission') {
      navigate(nextMissionRoute ?? '/missions');
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
    } else if (debrief.secondaryCta.target === 'next-mission') {
      navigate(nextMissionRoute ?? '/missions');
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
        ref={panelRef}
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
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
