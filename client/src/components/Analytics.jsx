import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api } from '../services/api';
import { addDays, monthName, pct, range, summarize, today } from '../utils/date';

const GOOD = '#1f9d6b', BAD = '#e0a526';

export default function Analytics() {
  const now = new Date();
  const nav = useNavigate();
  const [view, setView] = useState('daily');
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [stats, setStats] = useState([]);

  let from, to;
  if (view === 'daily') { to = today(); from = addDays(to, -6); }
  else if (view === 'monthly') [from, to] = range(year, month);
  else { from = `${year}-01-01`; to = `${year}-12-31`; }

  useEffect(() => { api(`/stats/days?from=${from}&to=${to}`).then(setStats); }, [from, to]);

  const s = summarize(stats, from, to);
  let series;
  if (view === 'yearly') {
    series = Array.from({ length: 12 }, (_, i) => {
      const key = `${year}-${String(i + 1).padStart(2, '0')}`;
      const rows = stats.filter(d => d.date.startsWith(key));
      const r = rows.reduce((a, d) => ({ done: a.done + d.done, total: a.total + d.total }), { done: 0, total: 0 });
      return { key, label: new Date(year, i, 1).toLocaleDateString(undefined, { month: 'short' }), done: r.done, incomplete: r.total - r.done, percent: pct(r.done, r.total) };
    });
  } else {
    const byDate = Object.fromEntries(stats.map(d => [d.date, d]));
    const n = Math.round((new Date(to) - new Date(from)) / 864e5) + 1;
    series = Array.from({ length: n }, (_, i) => {
      const date = addDays(from, i), d = byDate[date] || { done: 0, total: 0 };
      return { key: date, label: view === 'daily' ? new Date(date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short' }) : String(i + 1), done: d.done, incomplete: d.total - d.done, percent: pct(d.done, d.total) };
    });
  }
  const shift = n => { const d = new Date(year, month + n, 1); setYear(d.getFullYear()); setMonth(d.getMonth()); };

  return (
    <section className="panel">
      <div className="row">
        <div className="tabs">{['daily', 'monthly', 'yearly'].map(v => <button key={v} className={view === v ? 'on' : ''} onClick={() => setView(v)}>{v[0].toUpperCase() + v.slice(1)}</button>)}</div>
        {view === 'monthly' && <div className="row"><button className="btn ghost" onClick={() => shift(-1)} aria-label="Previous month">‹</button><b>{monthName(year, month)}</b><button className="btn ghost" onClick={() => shift(1)} aria-label="Next month">›</button></div>}
        {view === 'yearly' && <div className="row"><button className="btn ghost" onClick={() => setYear(year - 1)} aria-label="Previous year">‹</button><b>{year} progress</b><button className="btn ghost" onClick={() => setYear(year + 1)} aria-label="Next year">›</button></div>}
        {view === 'daily' && <b>Last 7 days</b>}
      </div>

      <div className="stats">
        {[['Tasks created', s.total], ['Completed', s.done], ['Incomplete', s.incomplete], ['Completion', s.percent + '%'], ['Active days', s.active], ['Inactive days', s.inactive], ['Longest streak', s.longest]]
          .map(([l, v]) => <div key={l}><b>{v}</b><span>{l}</span></div>)}
      </div>

      <div className="charts">
        <div>
          <h3>Tasks per {view === 'yearly' ? 'month' : 'day'}</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={series}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="label" fontSize={12} /><YAxis allowDecimals={false} fontSize={12} width={28} />
              <Tooltip /><Legend />
              <Bar dataKey="done" name="Completed" stackId="a" fill={GOOD} onClick={d => view === 'yearly' && nav('/calendar?month=' + (d.payload?.key || d.key))} cursor={view === 'yearly' ? 'pointer' : 'default'} />
              <Bar dataKey="incomplete" name="Incomplete" stackId="a" fill={BAD} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3>Completed vs incomplete</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={[{ name: 'Completed', value: s.done }, { name: 'Incomplete', value: s.incomplete }]} dataKey="value" innerRadius={55} outerRadius={85}>
                <Cell fill={GOOD} /><Cell fill={BAD} />
              </Pie>
              <Tooltip /><Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {view === 'yearly' && (
        <div className="months">
          {series.map(m => <button key={m.key} className="month" onClick={() => nav('/calendar?month=' + m.key)}><b>{m.label}</b><span>{m.percent}%</span></button>)}
        </div>
      )}
    </section>
  );
}
