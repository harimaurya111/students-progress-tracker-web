import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import TaskList from '../components/TaskList';
import { dayClass, daysIn, monthName, nice, range, summarize, today } from '../utils/date';

export default function CalendarPage() {
  const [sp, setSp] = useSearchParams();
  const t = today();
  const key = sp.get('month') || t.slice(0, 7);
  const [y, m] = key.split('-').map(Number); // m is 1-based
  const [sel, setSel] = useState(key === t.slice(0, 7) ? t : `${key}-01`);
  const [stats, setStats] = useState([]);
  const [sum, setSum] = useState(null);
  const [tick, setTick] = useState(0);
  const [from, to] = range(y, m - 1);

  useEffect(() => { setSel(key === t.slice(0, 7) ? t : `${key}-01`); }, [key]);
  useEffect(() => {
    api(`/stats/days?from=${from}&to=${to}`).then(setStats);
    api('/stats/summary?today=' + t).then(setSum);
  }, [key, tick]);

  const byDate = Object.fromEntries(stats.map(d => [d.date, d]));
  const s = summarize(stats, from, to);
  const go = n => { const d = new Date(y, m - 1 + n, 1); setSp({ month: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` }); };
  const cells = [...Array(new Date(y, m - 1, 1).getDay()).fill(null), ...Array.from({ length: daysIn(y, m - 1) }, (_, i) => i + 1)];

  return (
    <>
      <header className="head"><h1>Calendar</h1></header>
      <div className="cols">
        <section className="panel">
          <div className="row">
            <button className="btn ghost" onClick={() => go(-1)} aria-label="Previous month">‹</button>
            <h2>{monthName(y, m - 1)}</h2>
            <button className="btn ghost" onClick={() => go(1)} aria-label="Next month">›</button>
          </div>
          <div className="cal">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i} className="dow">{d}</span>)}
            {cells.map((d, i) => {
              if (!d) return <span key={i} />;
              const date = `${key}-${String(d).padStart(2, '0')}`;
              return <button key={i} className={`day ${dayClass(byDate[date])} ${date === sel ? 'sel' : ''} ${date === t ? 'today' : ''}`}
                onClick={() => setSel(date)} aria-label={nice(date)}>{d}</button>;
            })}
          </div>
          <p className="legend"><i className="day good" /> All done <i className="day part" /> Some done <i className="day bad" /> None done <i className="day none" /> No activity</p>
          <div className="stats">
            {[['Tasks', s.total], ['Completed', s.done], ['Incomplete', s.incomplete], ['Completion', s.percent + '%'], ['Active days', s.active], ['Inactive days', s.inactive], ['Current streak', sum?.currentStreak ?? 0], ['Longest streak', s.longest]]
              .map(([l, v]) => <div key={l}><b>{v}</b><span>{l}</span></div>)}
          </div>
        </section>
        <div>
          <h2 className="sel-title">{nice(sel)}</h2>
          <TaskList date={sel} onChange={() => setTick(x => x + 1)} />
        </div>
      </div>
    </>
  );
}
