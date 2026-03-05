import { NavLink } from 'react-router-dom';
import { useProgress } from '../state/progress-context';

function activeClassName({ isActive }: { isActive: boolean }): string {
  return isActive ? 'nav-link is-active' : 'nav-link';
}

export function AppHeader() {
  const {
    progress: { points, completedMissionIds, badges }
  } = useProgress();

  return (
    <header className="app-header">
      <div className="brand-lockup">
        <p className="brand-kicker">Alexandria Tech</p>
        <h1>CVN Mission Control</h1>
      </div>

      <nav className="nav-row" aria-label="Primary navigation">
        <NavLink to="/" className={activeClassName} end>
          Home
        </NavLink>
        <NavLink to="/missions" className={activeClassName}>
          Missions
        </NavLink>
        <NavLink to="/pathways" className={activeClassName}>
          Pathways
        </NavLink>
        <NavLink to="/visit" className={activeClassName}>
          Campus Visit
        </NavLink>
      </nav>

      <div className="score-panel" aria-live="polite">
        <span>{completedMissionIds.length} missions done</span>
        <strong>{points} pts</strong>
        <span>{badges.length} badges</span>
      </div>
    </header>
  );
}
