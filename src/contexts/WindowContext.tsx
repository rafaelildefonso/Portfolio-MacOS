import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

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
  appId?: string;
  previousBounds?: {
    position: { x: number; y: number };
    size: { width: number; height: number };
  };
}

interface WindowContextType {
  windows: WindowState[];
  activeWindowId: string | null;
  openWindow: (
    window: Omit<WindowState, "id" | "isMinimized" | "isMaximized" | "zIndex">
  ) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  setActiveWindow: (id: string) => void;
  updateWindowPosition: (
    id: string,
    position: { x: number; y: number }
  ) => void;
  updateWindowSize: (
    id: string,
    size: { width: number; height: number }
  ) => void;
}

// Mapeamento de títulos legados para IDs de aplicativo do dock
const APP_ID_MAP: Record<string, string> = {
  "Sobre Mim": "about_me",
  "Projetos": "projects",
  "Contato": "contact",
  "Habilidades": "skills",
};

// Resolve o appId do dock a partir de uma janela (evita duplicação de mapeamento)
const resolveAppId = (window: {
  appId?: string;
  title: string;
}): string => {
  return (
    window.appId ||
    APP_ID_MAP[window.title] ||
    window.title.toLowerCase()
  );
};

const WindowContext = createContext<WindowContextType | undefined>(undefined);

export const WindowProvider = ({ children }: { children: ReactNode }) => {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState(100);

  const openWindow = async (
    windowProps: Omit<
      WindowState,
      "id" | "isMinimized" | "isMaximized" | "zIndex"
    >
  ) => {
    // Check if app is already open
    if (windowProps.appId) {
      const existingWindow = windows.find((w) => w.appId === windowProps.appId);
      if (existingWindow) {
        setActiveWindow(existingWindow.id);
        return;
      }
    }

    const id = `window-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const isSmallScreen = window.innerWidth < 768;

    // Calculate centered position
    const windowWidth = windowProps.size?.width || 800;
    const windowHeight = windowProps.size?.height || 600;

    const centerX = Math.max(0, (window.innerWidth - windowWidth) / 2);
    const centerY = Math.max(30, (window.innerHeight - windowHeight) / 2); // Ensure it doesn't go under TopBar

    const newWindow: WindowState = {
      ...windowProps,
      id,
      isMinimized: false,
      isMaximized: isSmallScreen, // Auto-maximize on small screens
      zIndex: nextZIndex,
      isVisible: false, // Inicialmente invisível para animação
      position: isSmallScreen ? { x: 0, y: 30 } : { x: centerX, y: centerY },
      size: isSmallScreen
        ? { width: window.innerWidth, height: window.innerHeight - 30 - 80 } // Adjust for dock/topbar if needed
        : windowProps.size || { width: 800, height: 600 },
    };

    // Adicionar janela ao estado (invisível)
    setWindows((prev) => [...prev, newWindow]);
    setActiveWindowId(id);
    setNextZIndex((prev) => prev + 1);

    // Aguardar o DOM atualizar
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve))
    );

    // Encontrar elementos
    const windowElement = document.querySelector(
      `[data-window-id="${id}"]`
    ) as HTMLElement;

    // Mapear títulos para IDs de aplicativo do dock
    const appId = resolveAppId(windowProps);
    const dockIcon = document.querySelector(
      `[data-dock-app="${appId}"]`
    ) as HTMLElement;

    // Se encontrou os elementos, executar animação genie
    if (windowElement && dockIcon) {
      try {
        const { genieExpand } = await import("../utils/genie");

        // IMPORTANTE: Não ocultar a janela ANTES de criar o genie element
        // O genieExpand precisa da janela visível para capturar o conteúdo
        // Mas vamos garantir que ela não apareça na tela ainda
        // const originalDisplay = windowElement.style.display;

        // REMOVIDO: Código que causava flash (tornar visível antes da animação)
        // A função genieExpand foi atualizada para lidar com janelas ocultas/invisíveis
        // usando clonagem off-screen e visibility: hidden temporário

        // Executar animação genie (ela vai capturar o conteúdo e depois ocultar)
        await genieExpand(dockIcon, windowElement, () => {
          // Callback quando animação termina - mostrar janela
          windowElement.style.display = "block";
          windowElement.style.visibility = "visible";
          windowElement.style.opacity = "1";
          // Atualizar estado para garantir visibilidade
          setWindows((prev) =>
            prev.map((w) => (w.id === id ? { ...w, isVisible: true } : w))
          );
          console.log("Animação Genie de abertura concluída");
        });
      } catch (error) {
        console.error("Erro ao executar animação Genie:", error);
        // Fallback: tornar janela visível normalmente
        setWindows((prev) =>
          prev.map((w) => (w.id === id ? { ...w, isVisible: true } : w))
        );
      }
    } else {
      // Se não encontrou elementos, tornar visível normalmente
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, isVisible: true } : w))
      );
    }
  };

  const closeWindow = async (id: string) => {
    const window = windows.find((w) => w.id === id);
    if (!window) return;

    // Encontrar elemento da janela
    const windowElement = document.querySelector(
      `[data-window-id="${id}"]`
    ) as HTMLElement;

    // Usar efeito "pop" ao invés de genie para fechar
    if (windowElement) {
      try {
        const { popEffect } = await import("../utils/genie");

        // Aguardar atualização do DOM
        await new Promise((resolve) => requestAnimationFrame(resolve));

        // Executar animação pop
        await popEffect(windowElement, () => {
          // Callback quando animação termina - remover janela
          setWindows((prev) => prev.filter((w) => w.id !== id));
          if (activeWindowId === id) {
            setActiveWindowId(null);
          }
        });
        return; // Não remover janela ainda, a animação vai fazer isso
      } catch (error) {
        console.error("Erro ao executar animação Pop:", error);
        // Fallback: fechar normalmente
      }
    }

    // Se não encontrou elementos ou erro, fechar normalmente
    setWindows((prev) => prev.filter((w) => w.id !== id));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const minimizeWindow = async (id: string) => {
    const window = windows.find((w) => w.id === id);
    if (!window) return;

    // Encontrar elementos
    const windowElement = document.querySelector(
      `[data-window-id="${id}"]`
    ) as HTMLElement;

    const appId = resolveAppId(window);
    const dockIcon = document.querySelector(
      `[data-dock-app="${appId}"]`
    ) as HTMLElement;

    // Se encontrou os elementos, executar animação genie
    if (windowElement && dockIcon) {
      try {
        const { genieMinimize } = await import("../utils/genie");

        // A função genieMinimize vai capturar o conteúdo antes de ocultar
        // Não precisamos ocultar aqui, a função faz isso internamente

        // Aguardar atualização do DOM
        await new Promise((resolve) => requestAnimationFrame(resolve));

        // Executar animação genie
        await genieMinimize(windowElement, dockIcon, () => {
          // Callback quando animação termina
          setWindows((prev) =>
            prev.map((w) =>
              w.id === id ? { ...w, isMinimized: true, isVisible: false } : w
            )
          );
        });
        return;
      } catch (error) {
        console.error("Erro ao executar animação Genie:", error);
        // Fallback para minimização normal
      }
    }

    // Se não encontrou elementos ou erro, minimizar normalmente
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
            size: {
              width: window.innerWidth,
              height: window.innerHeight - 30 - 80,
            },
          };
        }
      })
    );
  };

  const setActiveWindow = async (id: string) => {
    const window = windows.find((w) => w.id === id);
    if (!window) return;

    // Se a janela já está ativa, não faz nada
    if (activeWindowId === id && !window.isMinimized) return;

    // Se a janela está minimizada, restaurar com animação
    if (window.isMinimized) {
      const windowElement = document.querySelector(
        `[data-window-id="${id}"]`
      ) as HTMLElement;

      const appId = resolveAppId(window);
      const dockIcon = document.querySelector(
        `[data-dock-app="${appId}"]`
      ) as HTMLElement;

      if (windowElement && dockIcon) {
        try {
          const { genieRestore } = await import("../utils/genie");

          // Tornar a janela visível no estado mas ocultar visualmente durante animação
          setWindows((prev) =>
            prev.map((w) =>
              w.id === id
                ? {
                    ...w,
                    isMinimized: false,
                    zIndex: nextZIndex,
                    isVisible: true,
                  }
                : { ...w, zIndex: w.zIndex }
            )
          );

          // Forçar atualização do DOM
          await new Promise((resolve) =>
            requestAnimationFrame(() =>
              requestAnimationFrame(() => requestAnimationFrame(resolve))
            )
          );

          // Garantir que janela está completamente invisível
          const originalDisplay = windowElement.style.display;
          windowElement.style.display = "none";
          windowElement.style.visibility = "hidden";
          windowElement.style.opacity = "0";

          // Executar animação de restauração
          await genieRestore(dockIcon, windowElement, () => {
            // Callback chamado quando a animação termina - mostrar janela
            windowElement.style.display = originalDisplay || "block";
            windowElement.style.visibility = "visible";
            windowElement.style.opacity = "1";
            setActiveWindowId(id);
            setNextZIndex((prev) => prev + 1);
          });

          return;
        } catch (error) {
          console.error("Erro ao carregar animação Genie:", error);
          // Fallback para restauração normal
        }
      }
    }

    // Se não houver animação ou em caso de erro, restaurar normalmente
    setActiveWindowId(id);
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, isMinimized: false, zIndex: nextZIndex }
          : { ...w, zIndex: w.zIndex }
      )
    );
    setNextZIndex((prev) => prev + 1);
  };

  const updateWindowPosition = (
    id: string,
    position: { x: number; y: number }
  ) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, position } : w))
    );
  };

  const updateWindowSize = (
    id: string,
    size: { width: number; height: number }
  ) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, size } : w)));
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
    throw new Error("useWindows must be used within WindowProvider");
  }
  return context;
};
