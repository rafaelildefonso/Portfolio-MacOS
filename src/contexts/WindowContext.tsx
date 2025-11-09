import { createContext, useContext, useState, useRef } from 'react';
import type { ReactNode } from 'react';

export interface WindowState {
  id: string;
  title: string;
  appIcon: string;
  content: ReactNode;
  isMinimized: boolean;
  isMaximized: boolean;
  isVisible?: boolean;
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
  const animationRefs = useRef<Record<string, { windowEl: HTMLElement | null; dockIcon: HTMLElement | null }>>({});

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
    // Limpar referência de animação se existir
    if (animationRefs.current[id]) {
      delete animationRefs.current[id];
    }
    
    setWindows((prev) => prev.filter((w) => w.id !== id));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const minimizeWindow = async (id: string) => {
    console.log('=== minimizeWindow chamada para a janela ID:', id);
    const window = windows.find(w => w.id === id);
    if (!window) {
      console.error('Janela não encontrada com o ID:', id);
      return;
    }
    console.log('Janela encontrada:', window.title);
    
    // Encontrar o elemento da janela e o ícone do dock correspondente
    console.log('Procurando elementos no DOM...');
    const windowElement = document.querySelector(`[data-window-id="${id}"]`) as HTMLElement;
    
    // Mapear títulos para IDs de aplicativo do dock
    const appIdMap: Record<string, string> = {
      'Sobre Mim': 'about_me',
      'Projetos': 'projects',
      'Contato': 'contact',
      'Habilidades': 'skills'
    };
    
    const appId = appIdMap[window.title] || window.title.toLowerCase();
    console.log('Procurando ícone do dock com data-dock-app:', appId);
    const dockIcon = document.querySelector(`[data-dock-app="${appId}"]`) as HTMLElement;
    
    console.log('Elemento da janela encontrado:', !!windowElement);
    console.log('Ícone do dock encontrado:', !!dockIcon);
    
    // Se não encontrou o elemento da janela ou o ícone do dock, minimiza normalmente
    if (!windowElement || !dockIcon) {
      console.warn('Elemento da janela ou ícone do dock não encontrado. Minimizando sem animação.');
      setWindows(prev =>
        prev.map(w => (w.id === id ? { ...w, isMinimized: true } : w))
      );
      return;
    }
    
    // Armazenar referências para a animação
    console.log('Armazenando referências para a animação...');
    animationRefs.current[id] = { windowEl: windowElement, dockIcon };
    
    // Mostrar estilos atuais do elemento
    console.log('Estilos iniciais da janela:', {
      display: windowElement.style.display,
      visibility: windowElement.style.visibility,
      opacity: windowElement.style.opacity,
      transform: windowElement.style.transform
    });
    
    // Tornar a janela invisível, mas mantê-la no DOM para a animação
    console.log('Preparando elemento para animação...');
    windowElement.style.visibility = 'hidden';
    windowElement.style.opacity = '0';
    
    // Forçar um repaint antes de começar a animação
    console.log('Forçando repaint...');
    await new Promise(resolve => requestAnimationFrame(resolve));
    
    // Tornar a janela visível novamente para a animação
    console.log('Iniciando animação...');
    windowElement.style.visibility = 'visible';
    windowElement.style.opacity = '1';
    
    // Iniciar animação de minimizar
    try {
      // Usar o módulo de animação Genie
      const { genieMinimize } = await import('../utils/genie');
      
      console.log('Iniciando animação Genie...');
      
      // Executar animação
      await genieMinimize(
        windowElement,
        dockIcon,
        () => {
          console.log('Animação Genie concluída');
          // Callback chamado quando a animação termina
          setWindows(prev =>
            prev.map(w => 
              w.id === id 
                ? { ...w, isMinimized: true, isVisible: false } 
                : w
            )
          );
          
          // Limpar referência após a animação
          if (animationRefs.current[id]) {
            animationRefs.current[id].windowEl = null;
          }
        }
      );
    } catch (error) {
      console.error('Erro ao carregar animação Genie:', error);
      // Fallback para minimização normal
      setWindows(prev =>
        prev.map(w => (w.id === id ? { ...w, isMinimized: true } : w))
      );
    }
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

  const setActiveWindow = async (id: string) => {
    const window = windows.find(w => w.id === id);
    if (!window) return;
    
    // Se a janela já está ativa, não faz nada
    if (activeWindowId === id && !window.isMinimized) return;
    
    // Se a janela está minimizada, restaurar com animação
    if (window.isMinimized) {
      const dockIcon = document.querySelector(`[data-dock-app="${window.title.toLowerCase()}"]`) as HTMLElement;
      const windowElement = document.querySelector(`[data-window-id="${id}"]`) as HTMLElement;
      
      if (windowElement && dockIcon) {
        try {
          // Usar o módulo de animação Genie
          const { genieRestore } = await import('../utils/genie');
          
          // Tornar a janela visível antes da animação (mas transparente)
          setWindows(prev =>
            prev.map(w => 
              w.id === id 
                ? { 
                    ...w, 
                    isMinimized: false, 
                    zIndex: nextZIndex,
                    isVisible: true
                  } 
                : { ...w, zIndex: w.zIndex }
            )
          );
          
          // Forçar atualização do DOM
          await new Promise(resolve => requestAnimationFrame(resolve));
          
          // Executar animação de restauração
          await genieRestore(
            windowElement,
            dockIcon,
            () => {
              // Callback chamado quando a animação termina
              setActiveWindowId(id);
              setNextZIndex(prev => prev + 1);
              
              // Limpar referência após a animação
              if (animationRefs.current[id]) {
                delete animationRefs.current[id];
              }
            }
          );
          
          return;
        } catch (error) {
          console.error('Erro ao carregar animação Genie:', error);
          // Fallback para restauração normal
        }
      }
    }
    
    // Se não houver animação ou em caso de erro, restaurar normalmente
    setActiveWindowId(id);
    setWindows(prev =>
      prev.map((w) =>
        w.id === id
          ? { ...w, isMinimized: false, zIndex: nextZIndex }
          : { ...w, zIndex: w.zIndex }
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
