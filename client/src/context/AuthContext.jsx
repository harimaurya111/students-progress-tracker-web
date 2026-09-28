import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';
const Ctx = createContext();
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem('token'));
  useEffect(() => {
    if (!loading) return;
    api('/auth/me').then(r => setUser(r.user)).catch(() => localStorage.removeItem('token')).finally(() => setLoading(false));
  }, []);
  const enter = r => { localStorage.setItem('token', r.token); setUser(r.user); };
  const login = async body => enter(await api('/auth/login', { method: 'POST', body }));
  const register = async body => enter(await api('/auth/register', { method: 'POST', body }));
  const logout = () => { localStorage.removeItem('token'); setUser(null); };
  return <Ctx.Provider value={{ user, setUser, loading, login, register, logout }}>{children}</Ctx.Provider>;
}
