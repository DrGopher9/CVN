import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { missions } from '../content/missions';
import { trackEvent } from '../lib/analytics';
import {
  calculateMissionScore,
  isMissionUnlocked,
  wifiBadge
} from '../lib/mission-rules';
import { useProgress } from '../state/progress-context';

type SettingValue = string;

const secureConfig: Record<string, SettingValue> = {
  encryption: 'wpa3',
  adminPassword: 'strong',
  wps: 'disabled',
  guest: 'isolated',
  firmware: 'current',
  adminAuth: 'radius'
};

const hints = [
  'Start with WPA3 and disable WPS.',
  'Guest traffic should be isolated from the main LAN.',
  'Strong admin passwords and updated firmware are non-negotiable.'
];

export function WifiMissionPage() {
  const mission = useMemo(() => missions.find((item) => item.id === 'wifi-defense'), []);
  const { progress, recordAttempt, recordHintUsed, completeMission } = useProgress();

  const [settings, setSettings] = useState<Record<string, SettingValue>>({
    encryption: 'open',
    adminPassword: 'default',
    wps: 'enabled',
    guest: 'same-lan',
    firmware: 'outdated',
    adminAuth: 'shared-password'
  });
  const [message, setMessage] = useState('Harden the access point to pass security review.');
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

  function updateSetting(event: ChangeEvent<HTMLSelectElement>, key: string): void {
    setSettings((previous) => ({ ...previous, [key]: event.target.value }));
  }

  function useHint(): void {
    if (stats.hintsUsed >= hints.length) {
      return;
    }
    recordHintUsed(missionDef.id);
  }

  function submitConfig(): void {
    const attemptsAfterSubmit = stats.attempts + 1;
    recordAttempt(missionDef.id);

    const correctCount = Object.keys(secureConfig).reduce((count, key) => {
      return settings[key] === secureConfig[key] ? count + 1 : count;
    }, 0);

    const hardeningScore = Math.round((correctCount / Object.keys(secureConfig).length) * 100);

    if (correctCount >= 5) {
      const score = calculateMissionScore(missionDef.rewardPoints, attemptsAfterSubmit, stats.hintsUsed, 95);
      const badge = wifiBadge(attemptsAfterSubmit, stats.hintsUsed, hardeningScore);
      completeMission(missionDef.id, score, badge);

      setMessage(`Access point secured at ${hardeningScore}% hardening. Score +${score}. Badge: ${badge}.`);
      setSuccess(true);
      return;
    }

    setMessage(`Hardening score is ${hardeningScore}%. Need at least 84% to pass. Tune your config and retry.`);
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
        Configure secure wireless settings for a high school esports + classroom network.
      </p>

      <div className="interactive-panel">
        <div className="setting-grid">
          <article className="setting-card">
            <label htmlFor="encryption" className="legend-text">Encryption</label>
            <select id="encryption" className="action-select" value={settings.encryption} onChange={(event) => updateSetting(event, 'encryption')}>
              <option value="open">Open</option>
              <option value="wpa2">WPA2</option>
              <option value="wpa3">WPA3</option>
            </select>
          </article>

          <article className="setting-card">
            <label htmlFor="adminPassword" className="legend-text">Admin Password</label>
            <select id="adminPassword" className="action-select" value={settings.adminPassword} onChange={(event) => updateSetting(event, 'adminPassword')}>
              <option value="default">Default</option>
              <option value="weak">Weak</option>
              <option value="strong">Strong Unique</option>
            </select>
          </article>

          <article className="setting-card">
            <label htmlFor="wps" className="legend-text">WPS</label>
            <select id="wps" className="action-select" value={settings.wps} onChange={(event) => updateSetting(event, 'wps')}>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </article>

          <article className="setting-card">
            <label htmlFor="guest" className="legend-text">Guest Network</label>
            <select id="guest" className="action-select" value={settings.guest} onChange={(event) => updateSetting(event, 'guest')}>
              <option value="same-lan">Same LAN</option>
              <option value="none">No Guest Network</option>
              <option value="isolated">Isolated VLAN</option>
            </select>
          </article>

          <article className="setting-card">
            <label htmlFor="firmware" className="legend-text">Firmware Status</label>
            <select id="firmware" className="action-select" value={settings.firmware} onChange={(event) => updateSetting(event, 'firmware')}>
              <option value="outdated">Outdated</option>
              <option value="current">Current</option>
            </select>
          </article>

          <article className="setting-card">
            <label htmlFor="adminAuth" className="legend-text">Admin Login Mode</label>
            <select id="adminAuth" className="action-select" value={settings.adminAuth} onChange={(event) => updateSetting(event, 'adminAuth')}>
              <option value="shared-password">Shared Password</option>
              <option value="radius">RADIUS / MFA-backed</option>
            </select>
          </article>
        </div>
      </div>

      <div className="control-row">
        <button type="button" className="primary-cta" onClick={submitConfig}>
          Validate Configuration
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
