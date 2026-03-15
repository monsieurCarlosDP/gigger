import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { setApiTokenGetter, api } from '@/shared/api/client';
import type { AuthUser } from '@/shared/api/client';

interface AuthContextValue {
  user: AuthUser | null;
  jwt: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'gigger_jwt';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [jwt, setJwt] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY));
  const [isLoading, setIsLoading] = useState(true);
  const didValidate = useRef(false);

  // Keep the API client in sync with the current JWT
  useEffect(() => {
    setApiTokenGetter(() => jwt);
  }, [jwt]);

  // Validate stored JWT on mount (once)
  useEffect(() => {
    if (didValidate.current) return;
    didValidate.current = true;

    if (!jwt) {
      setIsLoading(false);
      return;
    }

    api.getMe()
      .then((data) => setUser(data))
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY);
        setJwt(null);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, [jwt]);

  const login = useCallback(async (identifier: string, password: string) => {
    const data = await api.login(identifier, password);
    localStorage.setItem(STORAGE_KEY, data.jwt);
    setJwt(data.jwt);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setJwt(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const data = await api.getMe();
    setUser(data);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      jwt,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      refreshUser,
    }),
    [user, jwt, isLoading, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
