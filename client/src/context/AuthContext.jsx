import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('matrucare_user') || 'null'); } catch { return null; } });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('matrucare_token')));
  useEffect(() => {
    const onUnauthorized = () => setUser(null);
    window.addEventListener('matrucare:unauthorized', onUnauthorized);
    return () => window.removeEventListener('matrucare:unauthorized', onUnauthorized);
  }, []);
  useEffect(() => {
    if (!localStorage.getItem('matrucare_token')) { setLoading(false); return; }
    api.get('/api/user/me').then(({ data }) => { setUser(data.user); localStorage.setItem('matrucare_user', JSON.stringify(data.user)); })
      .catch(() => { localStorage.removeItem('matrucare_token'); localStorage.removeItem('matrucare_user'); setUser(null); })
      .finally(() => setLoading(false));
  }, []);
  const login = (data) => { localStorage.setItem('matrucare_token', data.token); localStorage.setItem('matrucare_user', JSON.stringify(data.user)); setUser(data.user); };
  const logout = () => { localStorage.removeItem('matrucare_token'); localStorage.removeItem('matrucare_user'); setUser(null); };
  return <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
