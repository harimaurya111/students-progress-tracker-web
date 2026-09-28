import { useEffect, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import TaskList from '../components/TaskList';
import { addDays, nice, pct, today } from '../utils/date';

export default function Dashboard() {
  const { user } = useAuth();
  const [sum, setSum] = useState(null);
  const [week, setWeek] = useState([]);
  const [tick, setTick] = useState(0);
  const t = today(), h = new Date().getHours();
  const greet = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    api('/stats/summary?today=' + t).then(setSum);
    api(`/stats/days?from=${addDays(t, -6)}&to=${t}`).then(setWeek);
  }, [tick]);

  const byDate = Object.fromEntries(week.map(d => [d.date, d]));
  const chart = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(t, i - 6), d = byDate[date];
    return { date, day: new Date(date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short' }), percent: d ? pct(d.done, d.total) : 0 };
  });
  const recent = [...week].reverse().filter(d => d.total);

  return (
    <>
      <header className="head"><h1>{greet}, {user.username}</h1><p className="muted">{nice(t)}</p></header>
      <div className="streaks">
        <div className="streak"><b>{sum?.currentStreak ?? 0}</b><span>day current streak 🔥</span></div>
        <div className="streak alt"><b>{sum?.longestStreak ?? 0}</b><span>day longest streak 🏆</span></div>
      </div>
      <div className="cols">
        <TaskList date={t} onChange={() => setTick(x => x + 1)} />
        <div>
          <section className="panel">
            <h3>Last 7 days</h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chart}><XAxis dataKey="day" fontSize={12} /><YAxis domain={[0, 100]} hide /><Tooltip formatter={v => v + '%'} /><Bar dataKey="percent" name="Completion" fill="#3446c8" radius={[4, 4, 0, 0]} /></BarChart>
            </ResponsiveContainer>
          </section>
          <section className="panel">
            <h3>Recent activity</h3>
            {recent.length === 0 ? <p className="muted">Completed tasks will show up here.</p> :
              <ul className="recent">{recent.map(d => <li key={d.date}><span>{nice(d.date).replace(/, \d{4}$/, '')}</span><b>{d.done}/{d.total} · {pct(d.done, d.total)}%</b></li>)}</ul>}
          </section>
        </div>
      </div>
    </>
  );
}
