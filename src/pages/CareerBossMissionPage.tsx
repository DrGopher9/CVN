import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { missions } from '../content/missions';
import { trackEvent } from '../lib/analytics';
import {
  calculateMissionScore,
  careerBossBadge,
  isMissionUnlocked
} from '../lib/mission-rules';
import { useProgress } from '../state/progress-context';

type CareerRole = 'Cybersecurity Analyst' | 'Network Engineer' | 'Cloud Administrator' | 'Penetration Tester';

interface CareerQuestion {
  id: string;
  prompt: string;
  expected: CareerRole;
}

const roles: CareerRole[] = [
  'Cybersecurity Analyst',
  'Network Engineer',
  'Cloud Administrator',
  'Penetration Tester'
];

const questions: CareerQuestion[] = [
  {
    id: 'q1',
    prompt: 'Investigate suspicious SIEM alerts and coordinate incident response.',
    expected: 'Cybersecurity Analyst'
  },
  {
    id: 'q2',
    prompt: 'Design low-latency routing between esports arena and campus data center.',
    expected: 'Network Engineer'
  },
  {
    id: 'q3',
    prompt: 'Automate VM lifecycle, backups, and identity policy in cloud infrastructure.',
    expected: 'Cloud Administrator'
  },
  {
    id: 'q4',
    prompt: 'Run authorized attacks against a web app to expose weaknesses before launch.',
    expected: 'Penetration Tester'
  },
  {
    id: 'q5',
    prompt: 'Harden endpoint policies and monitor for active credential abuse attempts.',
    expected: 'Cybersecurity Analyst'
  }
];

const roleDescriptions: Record<CareerRole, string> = {
  'Cybersecurity Analyst':
    'You like defense, monitoring, and threat response. CVNP + security labs + SOC workflows are a strong fit.',
  'Network Engineer':
    'You like infrastructure design and performance tuning. CVNP networking + Cisco path is likely your lane.',
  'Cloud Administrator':
    'You like systems, automation, and scalable environments. CVNP virtualization/cloud path fits this profile.',
  'Penetration Tester':
    'You like testing, breaking, and improving systems ethically. CVNP cyber + offensive labs align well.'
};

const hints = [
  'Think about each role’s day-to-day responsibilities, not job titles.',
  'Network Engineer = connectivity and performance. Pen Tester = authorized attack simulation.',
  'Cybersecurity Analyst monitors/defends; Cloud Administrator manages cloud platforms and ops.'
];

export function CareerBossMissionPage() {
  const mission = useMemo(() => missions.find((item) => item.id === 'career-boss'), []);
  const { progress, recordAttempt, recordHintUsed, completeMission } = useProgress();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [message, setMessage] = useState('Match each mission to the best-fit career role.');
  const [success, setSuccess] = useState(false);
  const [recommendedRole, setRecommendedRole] = useState<CareerRole | null>(null);

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

  function handleChange(event: ChangeEvent<HTMLSelectElement>, questionId: string): void {
    setAnswers((previous) => ({ ...previous, [questionId]: event.target.value }));
  }

  function useHint(): void {
    if (stats.hintsUsed >= hints.length) {
      return;
    }
    recordHintUsed(missionDef.id);
  }

  function submitBossRound(): void {
    const allSelected = questions.every((question) => answers[question.id]);
    if (!allSelected) {
      setMessage('Answer every scenario before submitting.');
      setSuccess(false);
      return;
    }

    const attemptsAfterSubmit = stats.attempts + 1;
    recordAttempt(missionDef.id);

    const correctCount = questions.reduce((count, question) => {
      return answers[question.id] === question.expected ? count + 1 : count;
    }, 0);

    const accuracyPercent = Math.round((correctCount / questions.length) * 100);

    const preferenceMap = roles.reduce((acc, role) => {
      acc[role] = 0;
      return acc;
    }, {} as Record<CareerRole, number>);

    for (const question of questions) {
      const picked = answers[question.id] as CareerRole;
      preferenceMap[picked] += 1;
    }

    const topRole = roles.reduce((best, role) => {
      return preferenceMap[role] > preferenceMap[best] ? role : best;
    }, roles[0]);

    setRecommendedRole(topRole);

    if (accuracyPercent >= 80) {
      const score = calculateMissionScore(missionDef.rewardPoints, attemptsAfterSubmit, stats.hintsUsed, 120);
      const badge = careerBossBadge(attemptsAfterSubmit, stats.hintsUsed, accuracyPercent);

      completeMission(missionDef.id, score, badge);
      setMessage(`Boss round clear: ${accuracyPercent}% accuracy. Score +${score}. Badge: ${badge}.`);
      setSuccess(true);
      return;
    }

    setMessage(`Accuracy is ${accuracyPercent}%. Need at least 80% to clear this round.`);
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
        Final challenge: map real tasks to careers and discover which role profile fits you best.
      </p>

      <div className="interactive-panel">
        <div className="timeline-grid">
          {questions.map((question) => (
            <article key={question.id} className="timeline-card">
              <p>{question.prompt}</p>
              <label htmlFor={question.id} className="legend-text">Best-fit role</label>
              <select
                id={question.id}
                className="action-select"
                value={answers[question.id] || ''}
                onChange={(event) => handleChange(event, question.id)}
              >
                <option value="">Select role...</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </article>
          ))}
        </div>
      </div>

      <div className="control-row">
        <button type="button" className="primary-cta" onClick={submitBossRound}>
          Submit Boss Round
        </button>
        <button type="button" className="secondary-cta" onClick={useHint} disabled={stats.hintsUsed >= hints.length}>
          {stats.hintsUsed >= hints.length ? 'No More Hints' : 'Use Hint'}
        </button>
      </div>

      {recommendedRole ? (
        <div className="role-result-card" aria-live="polite">
          <p className="mini-label">Recommended Path</p>
          <h3>{recommendedRole}</h3>
          <p>{roleDescriptions[recommendedRole]}</p>
        </div>
      ) : null}

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
