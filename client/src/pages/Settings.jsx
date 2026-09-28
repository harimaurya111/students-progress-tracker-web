import { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/Avatar';

// Shrinks the chosen image to a small square data-URL so it stays tiny in the database
function toAvatar(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas'), n = 128, side = Math.min(img.width, img.height);
      c.width = c.height = n;
      c.getContext('2d').drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, n, n);
      resolve(c.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = () => reject(new Error('That file is not a valid image.'));
    img.src = URL.createObjectURL(file);
  });
}

export default function Settings() {
  const { user, setUser, logout } = useAuth();
  const [name, setName] = useState(user.username);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const save = async body => {
    try { setErr(''); setMsg(''); setUser((await api('/auth/me', { method: 'PATCH', body })).user); setMsg('Saved.'); }
    catch (e) { setErr(e.message); }
  };
  const pick = async e => {
    const file = e.target.files[0];
    if (file) try { await save({ avatar: await toAvatar(file) }); } catch (x) { setErr(x.message); }
  };

  return (
    <>
      <header className="head"><h1>Settings</h1></header>
      <section className="panel narrow">
        <div className="who"><Avatar user={user} size={72} />
          <label className="btn ghost">Change picture<input type="file" accept="image/*" onChange={pick} hidden /></label>
          {user.avatar && <button className="link-btn" onClick={() => save({ avatar: '' })}>Remove</button>}
        </div>
        <label>Username<input value={name} onChange={e => setName(e.target.value)} minLength={3} maxLength={30} /></label>
        <button className="btn" onClick={() => save({ username: name })}>Save changes</button>
        {msg && <p className="ok" role="status">{msg}</p>}
        {err && <p className="error" role="alert">{err}</p>}
        <hr />
        <button className="btn ghost" onClick={logout}>Log out</button>
      </section>
    </>
  );
}
