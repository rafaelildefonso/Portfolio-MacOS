import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ContextMenu.css';

interface MenuPosition {
  x: number;
  y: number;
}

export const ContextMenu = () => {
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      // Only show context menu on desktop area (not on windows or dock)
      const target = e.target as HTMLElement;
      if (target.closest('.macos-window') || target.closest('.footer') || target.closest('.macos-header')) {
        return;
      }

      e.preventDefault();
      setMenuPosition({ x: e.clientX, y: e.clientY });
    };

    const handleClick = () => setMenuPosition(null);
    const handleScroll = () => setMenuPosition(null);

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);
    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {menuPosition && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="context-menu"
          style={{ left: menuPosition.x, top: menuPosition.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="liquidGlass-effect"></div>
          <div className="context-menu-content">
            <MenuItem icon="📁" label="Nova Pasta" />
            <MenuItem icon="📄" label="Obter Informações" />
            <Divider />
            <MenuItem icon="🎨" label="Mudar Papel de Parede..." />
            <MenuItem icon="⚙️" label="Preferências do Sistema" />
            <Divider />
            <MenuItem icon="🔄" label="Atualizar" onClick={() => window.location.reload()} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface MenuItemProps {
  icon: string;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

const MenuItem = ({ icon, label, onClick, disabled }: MenuItemProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`context-menu-item ${disabled ? 'disabled' : ''}`}
  >
    <span className="menu-icon">{icon}</span>
    <span className="menu-label">{label}</span>
  </button>
);

const Divider = () => <div className="context-menu-divider" />;
