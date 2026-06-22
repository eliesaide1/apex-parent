import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authStore } from '@apex/shared';

interface AuthState {
  token: string | null;
  ready: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthCtx = createContext<AuthState>({
  token: null,
  ready: false,
  signIn: async () => undefined,
  signOut: async () => undefined,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    authStore.hydrate().then((t) => {
      setToken(t);
      setReady(true);
    });
    // a 401 from the interceptor logs the user out everywhere
    authStore.setUnauthenticatedHandler(() => setToken(null));
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      token,
      ready,
      signIn: async (t: string) => {
        await authStore.setToken(t);
        setToken(t);
      },
      signOut: async () => {
        await authStore.setToken(null);
        setToken(null);
      },
    }),
    [token, ready],
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
};

export const useAuth = () => useContext(AuthCtx);
