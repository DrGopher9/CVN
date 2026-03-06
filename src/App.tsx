import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './app/AppShell';
import { CareerBossMissionPage } from './pages/CareerBossMissionPage';
import { ForensicsMissionPage } from './pages/ForensicsMissionPage';
import { HomePage } from './pages/HomePage';
import { MissionsPage } from './pages/MissionsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PacketPathPage } from './pages/PacketPathPage';
import { PathwaysPage } from './pages/PathwaysPage';
import { PhishingMissionPage } from './pages/PhishingMissionPage';
import { PythonMissionPage } from './pages/PythonMissionPage';
import { PythonLogParserPage } from './pages/PythonLogParserPage';
import { SandboxMissionPage } from './pages/SandboxMissionPage';
import { SnifferPage } from './pages/SnifferPage';
import { VisitPage } from './pages/VisitPage';
import { WifiMissionPage } from './pages/WifiMissionPage';
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
            <Route path="missions/sandbox-reset" element={<SandboxMissionPage />} />
            <Route path="missions/python-fix" element={<PythonMissionPage />} />
            <Route path="missions/python-log-parser" element={<PythonLogParserPage />} />
            <Route path="missions/phishing-detective" element={<PhishingMissionPage />} />
            <Route path="missions/wifi-defense" element={<WifiMissionPage />} />
            <Route path="missions/forensics-timeline" element={<ForensicsMissionPage />} />
            <Route path="missions/career-boss" element={<CareerBossMissionPage />} />
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
