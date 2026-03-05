import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { missions } from '../content/missions';
import { trackEvent } from '../lib/analytics';
import {
  calculateMissionScore,
  isMissionUnlocked,
  phishingBadge
} from '../lib/mission-rules';
import { useProgress } from '../state/progress-context';

type EmailAction = '' | 'allow' | 'quarantine' | 'report';

interface EmailScenario {
  id: string;
  sender: string;
  subject: string;
  snippet: string;
  expected: Exclude<EmailAction, ''>;
}

const scenarios: EmailScenario[] = [
  {
    id: 'mail-1',
    sender: 'security-alert@paypaI.com',
    subject: 'Account locked - verify now',
    snippet: 'Click here in 15 minutes or your account is disabled.',
    expected: 'report'
  },
  {
    id: 'mail-2',
    sender: 'coach.steven@alextech.edu',
    subject: 'Campus tour roster',
    snippet: 'Please review Friday schedule in our shared drive.',
    expected: 'allow'
  },
  {
    id: 'mail-3',
    sender: 'it-helpdesk@alexteech.com',
    subject: 'Mandatory VPN reset',
    snippet: 'Reply with your current password to avoid lockout.',
    expected: 'quarantine'
  },
  {
    id: 'mail-4',
    sender: 'scholarships@mn.gov',
    subject: 'Final notice: claim scholarship funds',
    snippet: 'Open attached .zip and run setup to receive payment.',
    expected: 'report'
  },
  {
    id: 'mail-5',
    sender: 'admissions@alextech.edu',
    subject: 'Campus visit confirmation',
    snippet: 'Thanks for registering. Your check-in details are inside.',
    expected: 'allow'
  },
  {
    id: 'mail-6',
    sender: 'district-login@secure-reset.io',
    subject: 'Student portal breach detected',
    snippet: 'Use this login form to restore your account immediately.',
    expected: 'quarantine'
  }
];

const hints = [
  'Urgency + fear language is a major red flag.',
  'Look closely for spoofed domains and misspelled brand names.',
  'Never trust requests asking for passwords or .zip executables.'
];

export function PhishingMissionPage() {
  const mission = useMemo(() => missions.find((item) => item.id === 'phishing-detective'), []);
  const { progress, recordAttempt, recordHintUsed, completeMission } = useProgress();

  const [actions, setActions] = useState<Record<string, EmailAction>>({});
  const [message, setMessage] = useState('Classify each email: allow, quarantine, or report.');
  const [success, setSuccess] = useState(false);

  const unlocked = mission
    ? isMissionUnlocked(mission, progress.completedMissionIds)
    : false;

  useEffect(() => {
    if (!mission || !unlocked) {
      return;
    }

    trackEvent('mission_start', {
      missionId: mission.id,
      sessionId: progress.sessionId
    });
  }, [mission, progress.sessionId, unlocked]);

  if (!mission) {
    return <Navigate to="/missions" replace />;
  }

  const missionDef = mission;
  const stats = progress.missionStats[missionDef.id];

  if (!unlocked) {
    return <Navigate to="/missions" replace />;
  }

  function handleChange(event: ChangeEvent<HTMLSelectElement>, scenarioId: string): void {
    const value = event.target.value as EmailAction;
    setActions((previous) => ({ ...previous, [scenarioId]: value }));
  }

  function useHint(): void {
    if (stats.hintsUsed >= hints.length) {
      return;
    }

    recordHintUsed(missionDef.id);
  }

  function submitReview(): void {
    const allSelected = scenarios.every((scenario) => actions[scenario.id]);
    if (!allSelected) {
      setMessage('Select an action for every email before submitting.');
      setSuccess(false);
      return;
    }

    const attemptsAfterSubmit = stats.attempts + 1;
    recordAttempt(missionDef.id);

    const correctCount = scenarios.reduce((count, scenario) => {
      return actions[scenario.id] === scenario.expected ? count + 1 : count;
    }, 0);

    if (correctCount >= 5) {
      const baseScore = calculateMissionScore(missionDef.rewardPoints, attemptsAfterSubmit, stats.hintsUsed, 90);
      const score = correctCount === scenarios.length ? baseScore + 10 : baseScore;
      const badge = phishingBadge(attemptsAfterSubmit, stats.hintsUsed, correctCount);

      completeMission(missionDef.id, score, badge);
      setMessage(`Great triage: ${correctCount}/6 correct. Score +${score}. Badge unlocked: ${badge}.`);
      setSuccess(true);
      return;
    }

    setMessage(`You got ${correctCount}/6 correct. Need at least 5 to pass. Review clues and retry.`);
    setSuccess(false);
  }

  const visibleHints = hints.slice(0, stats.hintsUsed);

  return (
    <section>
      <div className="section-head">
        <h2>{missionDef.title}</h2>
        <Link className="secondary-cta inline-control" to="/missions">
          Back to Hub
        </Link>
      </div>
      <p className="section-copy">
        Your SOC shift starts now. Stop phishing attempts without blocking legit messages.
      </p>

      <div className="interactive-panel">
        <div className="audit-grid">
          {scenarios.map((scenario) => (
            <article key={scenario.id} className="audit-card">
              <p className="mini-label">From</p>
              <p>{scenario.sender}</p>
              <p className="mini-label">Subject</p>
              <p>{scenario.subject}</p>
              <p className="mini-label">Preview</p>
              <p>{scenario.snippet}</p>

              <label htmlFor={scenario.id} className="legend-text">
                Action
              </label>
              <select
                id={scenario.id}
                className="action-select"
                value={actions[scenario.id] || ''}
                onChange={(event) => handleChange(event, scenario.id)}
              >
                <option value="">Select action...</option>
                <option value="allow">Allow</option>
                <option value="quarantine">Quarantine</option>
                <option value="report">Report</option>
              </select>
            </article>
          ))}
        </div>
      </div>

      <div className="control-row">
        <button type="button" className="primary-cta" onClick={submitReview}>
          Submit Triage
        </button>
        <button type="button" className="secondary-cta" onClick={useHint} disabled={stats.hintsUsed >= hints.length}>
          {stats.hintsUsed >= hints.length ? 'No More Hints' : 'Use Hint'}
        </button>
      </div>

      {visibleHints.length > 0 ? (
        <div className="hint-box" aria-live="polite">
          {visibleHints.map((hint, index) => (
            <p key={hint}>
              Hint {index + 1}: {hint}
            </p>
          ))}
        </div>
      ) : null}

      <p className={`result-box ${success ? 'is-success' : 'is-error'}`} aria-live="polite">
        {message}
      </p>

      <p className="fine-print">
        Attempts: {progress.missionStats[missionDef.id].attempts} | Hints used:{' '}
        {progress.missionStats[missionDef.id].hintsUsed}
      </p>
    </section>
  );
}
