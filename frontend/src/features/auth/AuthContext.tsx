import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { api, setToken, TOKEN_KEY } from '../../api/client';
import { AuthResponse, User } from '../../types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get<User>('/users/me')
      .then((response) => setUser(response.data))
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async login(email, password) {
        const response = await api.post<AuthResponse>('/auth/login', { email, password });
        setToken(response.data.accessToken);
        setUser(response.data.user);
      },
      async signup(email, password, name) {
        const response = await api.post<AuthResponse>('/auth/signup', { email, password, name });
        setToken(response.data.accessToken);
        setUser(response.data.user);
      },
      logout() {
        setToken(null);
        setUser(null);
      },
    }),
    [loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
