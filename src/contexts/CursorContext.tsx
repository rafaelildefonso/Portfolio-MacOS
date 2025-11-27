import React, { createContext, useContext, useEffect, useState } from 'react';

type CursorType = 
  | 'default' 
  | 'pointer' 
  | 'text' 
  | 'wait' 
  | 'help' 
  | 'not-allowed' 
  | 'crosshair' 
  | 'zoom-in' 
  | 'zoom-out'
  | 'openhand'
  | 'dnd-move'
  | 'col-resize'
  | 'row-resize'
  | 'n-resize'
  | 'e-resize'
  | 's-resize'
  | 'w-resize'
  | 'ne-resize'
  | 'nw-resize'
  | 'se-resize'
  | 'sw-resize'
  | 'ew-resize'
  | 'ns-resize'
  | 'nesw-resize'
  | 'nwse-resize'
  | 'none'
  | 'alias'
  | 'all-scroll'
  | 'cell'
  | 'context-menu'
  | 'copy'
  | 'no-drop'
  | 'progress'
  | 'vertical-text';

interface CursorContextType {
  cursorType: CursorType;
  setCursorType: (type: CursorType) => void;
  position: { x: number; y: number };
  isVisible: boolean;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export const CursorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cursorType, setCursorType] = useState<CursorType>('default');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateCursor = (target: HTMLElement) => {
      // Check for data-cursor attribute first
      const dataCursor = target.getAttribute('data-cursor');
      if (dataCursor) {
        setCursorType(dataCursor as CursorType);
        return;
      }

      // Check for interactive elements
      const tagName = target.tagName.toLowerCase();
      const computedStyle = window.getComputedStyle(target);
      
      if (
        tagName === 'button' || 
        tagName === 'a' || 
        target.closest('button') || 
        target.closest('a') ||
        computedStyle.cursor === 'pointer'
      ) {
        setCursorType('pointer');
      } else if (
        tagName === 'input' || 
        tagName === 'textarea' || 
        target.isContentEditable ||
        computedStyle.cursor === 'text'
      ) {
        setCursorType('text');
      } else if (computedStyle.cursor === 'wait') {
        setCursorType('wait');
      } else if (computedStyle.cursor === 'help') {
        setCursorType('help');
      } else if (computedStyle.cursor === 'not-allowed') {
        setCursorType('not-allowed');
      } else if (computedStyle.cursor === 'crosshair') {
        setCursorType('crosshair');
      } else if (computedStyle.cursor === 'zoom-in') {
        setCursorType('zoom-in');
      } else if (computedStyle.cursor === 'zoom-out') {
        setCursorType('zoom-out');
      } else if (computedStyle.cursor === 'openhand') {
        setCursorType('openhand');
      } else if (computedStyle.cursor === 'dnd-move') {
        setCursorType('dnd-move');
      } else if (computedStyle.cursor === 'alias') {
        setCursorType('alias');
      } else if (computedStyle.cursor === 'all-scroll') {
        setCursorType('all-scroll');
      } else if (computedStyle.cursor === 'cell') {
        setCursorType('cell');
      } else if (computedStyle.cursor === 'context-menu') {
        setCursorType('context-menu');
      } else if (computedStyle.cursor === 'copy') {
        setCursorType('copy');
      } else if (computedStyle.cursor === 'no-drop') {
        setCursorType('no-drop');
      } else if (computedStyle.cursor === 'progress') {
        setCursorType('progress');
      } else if (computedStyle.cursor === 'vertical-text') {
        setCursorType('vertical-text');
      } else if (computedStyle.cursor === 'nwse-resize') {
        setCursorType('nwse-resize');
      } else {
        setCursorType('default');
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
      
      // Check data-cursor on move to handle dynamic updates (like dragging)
      const target = e.target as HTMLElement;
      if (target.hasAttribute('data-cursor')) {
        updateCursor(target);
      }
    };

    const onMouseEnter = () => setIsVisible(true);
    const onMouseLeave = () => setIsVisible(false);

    const onMouseInteraction = (e: MouseEvent) => {
      updateCursor(e.target as HTMLElement);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mouseover', onMouseInteraction);
    window.addEventListener('mousedown', onMouseInteraction);
    window.addEventListener('mouseup', onMouseInteraction);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mouseover', onMouseInteraction);
      window.removeEventListener('mousedown', onMouseInteraction);
      window.removeEventListener('mouseup', onMouseInteraction);
    };
  }, [isVisible]);

  return (
    <CursorContext.Provider value={{ cursorType, setCursorType, position, isVisible }}>
      {children}
    </CursorContext.Provider>
  );
};

export const useCursor = () => {
  const context = useContext(CursorContext);
  if (context === undefined) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  return context;
};
