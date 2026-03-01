import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, User } from '../api/client';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (phone: string, password: string, nickname?: string) => Promise<void>;
  quickLogin: (phone: string, code?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and user
    const storedToken = api.getToken();
    if (storedToken) {
      setToken(storedToken);
      api.auth.getMe()
        .then(userData => {
          setUser(userData);
        })
        .catch(() => {
          api.setToken(null);
          setToken(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (phone: string, password: string) => {
    const { token: newToken, user: userData } = await api.auth.login(phone, password);
    api.setToken(newToken);
    setToken(newToken);
    setUser(userData);
  };

  const register = async (phone: string, password: string, nickname?: string) => {
    const { token: newToken, user: userData } = await api.auth.register(phone, password, nickname);
    api.setToken(newToken);
    setToken(newToken);
    setUser(userData);
  };

  const quickLogin = async (phone: string, code?: string) => {
    const result = await api.auth.quickLogin(phone, code);
    if (result.token && result.user) {
      api.setToken(result.token);
      setToken(result.token);
      setUser(result.user);
    }
  };

  const logout = () => {
    api.setToken(null);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, quickLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
