import { useRef, useEffect, useState } from "react";
import { useWindows } from "../../contexts/WindowContext";
import "./Window.css";
import { FulScreenIcon, MinusIcon, XMarkIcon } from "../../assets/icons/Icons";

interface WindowProps {
  id: string;
  title: string;
  appIcon: string;
  children: React.ReactNode;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  isMaximized: boolean;
  isMinimized?: boolean;
  isVisible?: boolean;
}

export const Window = ({
  id,
  title,
  appIcon,
  children,
  position,
  size,
  zIndex,
  isMaximized,
  isMinimized = false,
  isVisible = true,
}: WindowProps) => {
  const {
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    setActiveWindow,
    updateWindowPosition,
    updateWindowSize,
  } = useWindows();
  const windowRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".window-controls") || isMaximized)
      return;

    setActiveWindow(id);
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleDoubleClick = () => {
    if (!isSmallScreen) {
      maximizeWindow(id);
    }
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMaximized) return;

    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isMaximized) {
        const newX = e.clientX - dragOffset.x;
        const newY = Math.max(30, e.clientY - dragOffset.y); // Enforce TopBar limit (30px)
        updateWindowPosition(id, { x: newX, y: newY });
      }

      if (isResizing && !isMaximized) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        const newWidth = Math.max(400, resizeStart.width + deltaX);
        const newHeight = Math.max(300, resizeStart.height + deltaY);
        updateWindowSize(id, { width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isDragging,
    isResizing,
    dragOffset,
    resizeStart,
    id,
    updateWindowPosition,
    updateWindowSize,
    isMaximized,
  ]);

  return (
    <div
      id={id}
      data-window-id={id}
      ref={windowRef}
className={`macos-window ${isMinimized ? 'minimized' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex,
        cursor: isDragging ? "grabbing" : "default",
        visibility: isVisible ? 'visible' : 'hidden',
        opacity: isVisible ? 1 : 0,
        // Add smooth transitions for maximize/restore, but disable during drag/resize for performance
        transition: (isDragging || isResizing) 
          ? 'none' 
          : 'width 0.3s cubic-bezier(0.2, 0, 0, 1), height 0.3s cubic-bezier(0.2, 0, 0, 1), top 0.3s cubic-bezier(0.2, 0, 0, 1), left 0.3s cubic-bezier(0.2, 0, 0, 1), opacity 0.2s ease-in-out',
        position: 'absolute',
        overflow: 'hidden',
        display: isVisible ? 'block' : 'none'
      }}
      onClick={() => !isMinimized && setActiveWindow(id)}
    >
      <div className="liquidGlass-effect"></div>
      
      <div className="window-container">
        <div
          className="window-titlebar"
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
          data-cursor={isDragging ? "grabbing" : "grab"}
        >
          <div className="window-controls">
            <button
              className="window-control close"
              onClick={() => closeWindow(id)}
              aria-label="Fechar"
            >
              <XMarkIcon size={12} color="#8B0000" />
            </button>
            <button
              className="window-control minimize"
              onClick={() => {
                console.log('=== Botão de minimizar clicado ===', { id, title });
                minimizeWindow(id);
              }}
              aria-label="Minimizar"
            >
              <MinusIcon size={12} color="#8B5A00" />
            </button>
            <button
              className={`window-control maximize ${isSmallScreen ? 'disabled' : ''}`}
              onClick={() => !isSmallScreen && maximizeWindow(id)}
              aria-label="Maximizar"
              disabled={isSmallScreen}
              style={{ 
                opacity: isSmallScreen ? 0.5 : 1, 
                cursor: isSmallScreen ? 'default' : 'pointer',
                backgroundColor: isSmallScreen ? '#ccc' : undefined,
                borderColor: isSmallScreen ? '#bbb' : undefined
              }}
            >
              <FulScreenIcon size={12} color={isSmallScreen ? "#666" : "#006400"}/>
            </button>
          </div>
          <div className="window-title">
            <img src={appIcon} alt={title} className="window-app-icon" />
            <span>{title}</span>
          </div>
          <div className="window-spacer"></div>
        </div>
        <div className="window-content">{children}</div>
        {!isMaximized && (
          <div
            className="window-resize-handle"
            onMouseDown={handleResizeMouseDown}
            data-cursor="nwse-resize"
          />
        )}
      </div>
      
    </div>
  );
};
