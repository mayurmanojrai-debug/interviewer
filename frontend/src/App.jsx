import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import Layout from './components/Layout.jsx';
import Guard from './components/Guard.jsx';
import Landing from './pages/Landing.jsx';
import { Login, Register } from './pages/Auth.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Setup from './pages/Setup.jsx';
import Live from './pages/Live.jsx';
import Report from './pages/Report.jsx';
import History from './pages/History.jsx';
import Copilot from './pages/Copilot.jsx';
import { Practice, Skills, Roadmap, Resume, Analytics, Admin } from './pages/More.jsx';

function Shell({ el }) { return <Guard><Layout>{el}</Layout></Guard>; }

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/app" element={<Shell el={<Dashboard />} />} />
            <Route path="/app/setup" element={<Shell el={<Setup />} />} />
            <Route path="/app/live" element={<Shell el={<Live />} />} />
            <Route path="/app/report/:id" element={<Shell el={<Report />} />} />
            <Route path="/app/history" element={<Shell el={<History />} />} />
            <Route path="/app/practice" element={<Shell el={<Practice />} />} />
            <Route path="/app/copilot" element={<Shell el={<Copilot />} />} />
            <Route path="/app/skills" element={<Shell el={<Skills />} />} />
            <Route path="/app/roadmap" element={<Shell el={<Roadmap />} />} />
            <Route path="/app/resume" element={<Shell el={<Resume />} />} />
            <Route path="/app/analytics" element={<Shell el={<Analytics />} />} />
            <Route path="/app/admin" element={<Guard admin><Layout><Admin /></Layout></Guard>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
