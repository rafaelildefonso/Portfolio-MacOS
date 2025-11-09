import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface WindowState {
  id: string;
  title: string;
  appIcon: string;
  content: ReactNode;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  previousBounds?: {
    position: { x: number; y: number };
    size: { width: number; height: number };
  };
}

interface WindowContextType {
  windows: WindowState[];
  activeWindowId: string | null;
  openWindow: (window: Omit<WindowState, 'id' | 'isMinimized' | 'isMaximized' | 'zIndex'>) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  setActiveWindow: (id: string) => void;
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

export const WindowProvider = ({ children }: { children: ReactNode }) => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState(100);

  const openWindow = (window: Omit<WindowState, 'id' | 'isMinimized' | 'isMaximized' | 'zIndex'>) => {
    const id = `window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newWindow: WindowState = {
      ...window,
      id,
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZIndex,
    };
    setWindows((prev) => [...prev, newWindow]);
    setActiveWindowId(id);
    setNextZIndex((prev) => prev + 1);
  };

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const minimizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
  };

  const maximizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        
        if (w.isMaximized) {
          // Restaurar tamanho anterior
          return {
            ...w,
            isMaximized: false,
            position: w.previousBounds?.position || w.position,
            size: w.previousBounds?.size || w.size,
            previousBounds: undefined,
          };
        } else {
          // Maximizar
          return {
            ...w,
            isMaximized: true,
            previousBounds: {
              position: w.position,
              size: w.size,
            },
            position: { x: 0, y: 30 },
            size: { width: window.innerWidth, height: window.innerHeight - 30 - 80 },
          };
        }
      })
    );
  };

  const setActiveWindow = (id: string) => {
    setActiveWindowId(id);
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, zIndex: nextZIndex, isMinimized: false } : w
      )
    );
    setNextZIndex((prev) => prev + 1);
  };

  const updateWindowPosition = (id: string, position: { x: number; y: number }) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, position } : w))
    );
  };

  const updateWindowSize = (id: string, size: { width: number; height: number }) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, size } : w))
    );
  };

  return (
    <WindowContext.Provider
      value={{
        windows,
        activeWindowId,
        openWindow,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        setActiveWindow,
        updateWindowPosition,
        updateWindowSize,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
};

export const useWindows = () => {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('useWindows must be used within WindowProvider');
  }
  return context;
};
