import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [['/', 'Dashboard'], ['/calendar', 'Calendar'], ['/progress', 'Progress'], ['/profile', 'Profile'], ['/settings', 'Settings']];

export default function Layout() {
  const { logout } = useAuth();
  return (
    <div className="shell">
      <nav className="side" aria-label="Main">
        <b className="brand">Daybook</b>
        {links.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>)}
        <button className="link-btn" onClick={logout}>Log out</button>
      </nav>
      <main className="main"><Outlet /></main>
    </div>
  );
}
