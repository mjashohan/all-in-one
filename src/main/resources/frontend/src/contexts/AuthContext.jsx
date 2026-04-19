import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import storage from '../utils/storage';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from storage on boot.
  useEffect(() => {
    (async () => {
      try {
        const raw = await storage.getItem('user');
        if (raw) setUser(JSON.parse(raw));
      } catch {
        /* bad JSON — treat as logged out */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = useCallback(async (data) => {
    const u = {
      username: data.username,
      email: data.email,
      role: data.role,
    };
    await storage.setItem('token', data.token);
    await storage.setItem('user', JSON.stringify(u));
    setUser(u);
    return u;
  }, []);

  const login = useCallback(
    async (credentials) => persist(await authApi.login(credentials)),
    [persist]
  );

  const register = useCallback(
    async (payload) => persist(await authApi.register(payload)),
    [persist]
  );

  const logout = useCallback(async () => {
    await storage.removeItem('token');
    await storage.removeItem('user');
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
