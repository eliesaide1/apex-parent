import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, Child } from '../api';

interface ChildState {
  children: Child[];
  activeChildId: string | null;
  setActiveChild: (id: string) => void;
}

const ChildCtx = createContext<ChildState>({
  children: [],
  activeChildId: null,
  setActiveChild: () => undefined,
});

/**
 * ChildContext — lifts the child-switcher state out of individual screens.
 *
 * Mounted once after login (inside the authenticated tree). Fetches
 * /parent/children a single time and exposes { children, activeChildId,
 * setActiveChild }. The custom Tab header renders the switcher chips from this
 * context, and the child-scoped screens (Home / Timeline / Records) read
 * activeChildId from it instead of each fetching their own list.
 */
export const ChildProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [list, setList] = useState<Child[]>([]);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api
      .listChildren()
      .then((kids) => {
        if (!active) return;
        setList(kids);
        if (kids.length) setActiveChildId((prev) => prev ?? kids[0].id);
      })
      .catch(() => {
        /* clientProxy already alerted */
      });
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<ChildState>(
    () => ({ children: list, activeChildId, setActiveChild: setActiveChildId }),
    [list, activeChildId],
  );

  return <ChildCtx.Provider value={value}>{children}</ChildCtx.Provider>;
};

export const useChildren = () => useContext(ChildCtx);
