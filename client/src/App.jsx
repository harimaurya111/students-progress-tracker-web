import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import CalendarPage from './pages/CalendarPage';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

export default function App() {
  const { user, loading } = useAuth();
  if (loading) return <p className="center">Loading…</p>;
  if (!user) return <Routes><Route path="*" element={<Auth />} /></Routes>;
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}
