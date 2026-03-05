import { Outlet } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';

export function AppShell() {
  return (
    <div className="app-shell">
      <AppHeader />
      <main className="page-wrap">
        <Outlet />
      </main>
    </div>
  );
}
