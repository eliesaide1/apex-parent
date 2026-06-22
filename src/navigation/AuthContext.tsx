import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  authStore,
  connect as connectRealtime,
  disconnect as disconnectRealtime,
  notificationStore,
  toast,
} from '@apex/shared';

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

/**
 * Open the authenticated /live socket so this parent receives staff -> parent
 * notifications. Each live 'notification' is pushed into the shared
 * notificationStore by the realtime service (bumps the bell badge); here we
 * additionally surface a toast of the title.
 */
function startRealtime(token: string): void {
  connectRealtime(token, {
    onNotification: (item) => toast(item.title),
  });
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    authStore.hydrate().then((t) => {
      setToken(t);
      setReady(true);
      // Returning user with a persisted JWT — connect realtime immediately.
      if (t) startRealtime(t);
    });
    // a 401 from the interceptor logs the user out everywhere
    authStore.setUnauthenticatedHandler(() => {
      disconnectRealtime();
      notificationStore.reset();
      setToken(null);
    });
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      token,
      ready,
      signIn: async (t: string) => {
        await authStore.setToken(t);
        setToken(t);
        // Connect the socket on login success so it carries the fresh JWT.
        startRealtime(t);
      },
      signOut: async () => {
        await authStore.setToken(null);
        disconnectRealtime();
        notificationStore.reset();
        setToken(null);
      },
    }),
    [token, ready],
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
};

export const useAuth = () => useContext(AuthCtx);
