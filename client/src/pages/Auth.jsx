import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [f, setF] = useState({ username: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = k => e => setF({ ...f, [k]: e.target.value });

  const submit = async e => {
    e.preventDefault(); setErr(''); setBusy(true);
    try { await (mode === 'login' ? login({ email: f.email, password: f.password }) : register(f)); }
    catch (x) { setErr(x.message); } finally { setBusy(false); }
  };

  return (
    <div className="auth">
      <form className="panel" onSubmit={submit}>
        <h1>Daybook</h1>
        <p className="muted">{mode === 'login' ? 'Log in to pick up where you left off.' : 'Create an account to start tracking your days.'}</p>
        {mode === 'register' && <label>Username<input value={f.username} onChange={set('username')} minLength={3} maxLength={30} required /></label>}
        <label>Email<input type="email" value={f.email} onChange={set('email')} required /></label>
        <label>Password<input type="password" value={f.password} onChange={set('password')} minLength={mode === 'register' ? 8 : undefined} required /></label>
        {err && <p className="error" role="alert">{err}</p>}
        <button className="btn" disabled={busy}>{mode === 'login' ? 'Log in' : 'Create account'}</button>
        <button type="button" className="link-btn" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErr(''); }}>
          {mode === 'login' ? 'New here? Create an account' : 'Already have an account? Log in'}
        </button>
      </form>
    </div>
  );
}
