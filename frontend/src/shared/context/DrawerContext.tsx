import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

interface DrawerState {
  isOpen: boolean;
  content: ReactNode;
}

interface DrawerActions {
  openDrawer: (content: ReactNode) => void;
  closeDrawer: () => void;
}

const DrawerStateContext = createContext<DrawerState | null>(null);
const DrawerActionsContext = createContext<DrawerActions | null>(null);

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);

  const actions = useMemo<DrawerActions>(() => ({
    openDrawer: (newContent: ReactNode) => {
      setContent(newContent);
      setIsOpen(true);
    },
    closeDrawer: () => {
      setIsOpen(false);
    },
  }), []);

  const state = useMemo<DrawerState>(() => ({ isOpen, content }), [isOpen, content]);

  return (
    <DrawerActionsContext value={actions}>
      <DrawerStateContext value={state}>
        {children}
      </DrawerStateContext>
    </DrawerActionsContext>
  );
}

export function useDrawerState(): DrawerState {
  const ctx = useContext(DrawerStateContext);
  if (!ctx) throw new Error('useDrawerState must be used within DrawerProvider');
  return ctx;
}

export function useDrawerActions(): DrawerActions {
  const ctx = useContext(DrawerActionsContext);
  if (!ctx) throw new Error('useDrawerActions must be used within DrawerProvider');
  return ctx;
}
