import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Analytics from '../components/Analytics';
import Avatar from '../components/Avatar';
import { today } from '../utils/date';

export default function Profile() {
  const { user } = useAuth();
  const [s, setS] = useState(null);
  useEffect(() => { api('/stats/summary?today=' + today()).then(setS); }, []);
  return (
    <>
      <header className="head who">
        <Avatar user={user} size={72} />
        <div><h1>{user.username}</h1><p className="muted">{user.email} · Joined {new Date(user.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
      </header>
      <div className="stats big">
        {[['Tasks created', s?.created], ['Tasks completed', s?.done], ['Current streak', s?.currentStreak], ['Longest streak', s?.longestStreak], ['Productivity', s ? s.percent + '%' : null]]
          .map(([l, v]) => <div key={l}><b>{v ?? '–'}</b><span>{l}</span></div>)}
      </div>
      <Analytics />
    </>
  );
}
