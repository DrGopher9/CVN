import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './app/AppShell';
import { HomePage } from './pages/HomePage';
import { MissionsPage } from './pages/MissionsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PacketPathPage } from './pages/PacketPathPage';
import { PathwaysPage } from './pages/PathwaysPage';
import { SandboxComingSoonPage } from './pages/SandboxComingSoonPage';
import { SnifferPage } from './pages/SnifferPage';
import { VisitPage } from './pages/VisitPage';
import { ProgressProvider } from './state/progress-context';

export default function App() {
  return (
    <ProgressProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<AppShell />}>
            <Route index element={<HomePage />} />
            <Route path="missions" element={<MissionsPage />} />
            <Route path="missions/packet-path" element={<PacketPathPage />} />
            <Route path="missions/password-pulse" element={<SnifferPage />} />
            <Route path="missions/sandbox-reset" element={<SandboxComingSoonPage />} />
            <Route path="pathways" element={<PathwaysPage />} />
            <Route path="visit" element={<VisitPage />} />
            <Route path="home" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </ProgressProvider>
  );
}
