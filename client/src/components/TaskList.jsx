import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { pct } from '../utils/date';

const FILTERS = [['all', 'All'], ['done', 'Completed'], ['open', 'Incomplete']];

export default function TaskList({ date, onChange }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [edit, setEdit] = useState(null);
  const [filter, setFilter] = useState('all');
  const [err, setErr] = useState('');

  const load = () => api('/tasks?date=' + date).then(setTasks).catch(e => setErr(e.message));
  useEffect(() => { load(); }, [date]);

  const run = async fn => {
    try { setErr(''); await fn(); await load(); onChange?.(); } catch (e) { setErr(e.message); }
  };
  const add = e => {
    e.preventDefault();
    run(async () => { await api('/tasks', { method: 'POST', body: { title, description: desc, date } }); setTitle(''); setDesc(''); });
  };
  // Clicking the active status again puts the task back to pending
  const setStatus = (t, s) => run(() => api('/tasks/' + t._id, { method: 'PATCH', body: { status: t.status === s ? 'pending' : s } }));
  const save = () => run(async () => { await api('/tasks/' + edit._id, { method: 'PATCH', body: { title: edit.title, description: edit.description } }); setEdit(null); });
  const del = t => window.confirm(`Delete "${t.title}"?`) && run(() => api('/tasks/' + t._id, { method: 'DELETE' }));

  const done = tasks.filter(t => t.status === 'done').length;
  const shown = tasks.filter(t => filter === 'all' || (filter === 'done' ? t.status === 'done' : t.status !== 'done'));

  return (
    <section className="panel">
      <p className="big-line"><b>{done}/{tasks.length}</b> tasks completed — {pct(done, tasks.length)}%</p>
      <div className="bar" role="progressbar" aria-valuenow={pct(done, tasks.length)}><i style={{ width: pct(done, tasks.length) + '%' }} /></div>

      <form className="add" onSubmit={add}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Add a task" aria-label="Task title" maxLength={120} required />
        <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Note (optional)" aria-label="Description" maxLength={500} />
        <button className="btn">Add task</button>
      </form>
      {err && <p className="error" role="alert">{err}</p>}

      <div className="tabs">{FILTERS.map(([k, l]) => <button key={k} className={filter === k ? 'on' : ''} onClick={() => setFilter(k)}>{l}</button>)}</div>

      {shown.length === 0 && <p className="muted">{tasks.length ? 'Nothing in this view.' : 'No tasks for this day yet. Add your first one above.'}</p>}
      <ul className="tasks">
        {shown.map(t => (
          <li key={t._id} className={t.status}>
            {edit?._id === t._id ? (
              <div className="edit">
                <input value={edit.title} onChange={e => setEdit({ ...edit, title: e.target.value })} aria-label="Edit title" />
                <input value={edit.description} onChange={e => setEdit({ ...edit, description: e.target.value })} aria-label="Edit description" />
                <button className="btn" onClick={save}>Save changes</button>
                <button className="btn ghost" onClick={() => setEdit(null)}>Cancel</button>
              </div>
            ) : (
              <>
                <button className={'chk ' + (t.status === 'done' ? 'on' : '')} onClick={() => setStatus(t, 'done')} aria-label="Mark completed" title="Completed">✓</button>
                <button className={'chk x ' + (t.status === 'failed' ? 'on' : '')} onClick={() => setStatus(t, 'failed')} aria-label="Mark not completed" title="Not completed">✗</button>
                <div className="t-text"><span>{t.title}</span>{t.description && <small>{t.description}</small>}</div>
                <button className="link-btn" onClick={() => setEdit(t)}>Edit</button>
                <button className="link-btn danger" onClick={() => del(t)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
