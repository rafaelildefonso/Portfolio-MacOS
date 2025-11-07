// src/components/Header.tsx
import { useEffect, useRef, useState } from 'react';
import './Header.css';

declare global {
  interface Window {
    liquidGlass?: {
      init: (options: any) => void;
      destroy: () => void;
    };
  }
}

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const headerRef = useRef<HTMLDivElement>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const menuItems = [
    {
      name: 'Apple',
      items: [
        'About This Mac',
        'divider',
        'System Preferences...',
        'App Store...',
        'divider',
        'Recent Items',
        'divider',
        'Force Quit...',
        'divider',
        'Sleep',
        'Restart...',
        'Shut Down...'
      ]
    },
    {
      name: 'File',
      items: [
        'New Finder Window',
        'New Folder',
        'New Smart Folder',
        'New tab',
        'divider',
        'Get Info',
        'divider',
        'Find'
      ]
    },
    {
      name: 'Edit',
      items: [
        'Undo',
        'Redo',
        'divider',
        'Cut',
        'Copy',
        'Paste',
        'divider',
        'Emoji & Symbols'
      ]
    },
    {
      name: 'View',
      items: [
        'As Icons',
        'As List',
        'As Columns',
        'As Gallery',
        'divider',
        'Use Stacks',
        'Sort By'
      ]
    },
    {
      name: 'Go',
      items: [
        'Back',
        'Forward',
        'Enclosing Folder',
        'divider',
        'Recents',
        'Documents',
        'Desktop',
        'Downloads',
        'Home'
      ]
    }
  ];

  // Initialize liquid glass effect
  useEffect(() => {
    const header = headerRef.current;
    if (!header || !window.liquidGlass) return;

    // Initialize liquid glass on the header
    window.liquidGlass.init({
      target: header,
      intensity: 0.5,
      size: 200,
      opacity: 0.3,
      color: '#ffffff',
      blendMode: 'overlay',
      interactive: true,
      followMouse: true,
      mouseMove: true,
      mouseDown: false,
      touchMove: true,
      touchStart: false,
      touchEnd: false,
      touchClick: false,
      touchClickRadius: 100,
      touchClickForce: 0.5,
      touchClickDuration: 1000,
      touchClickEasing: 'ease-out',
      touchClickColor: '#ffffff',
      touchClickOpacity: 0.3,
      touchClickBlur: 20,
      touchClickSpread: 0,
      touchClickSize: 100,
      touchClickX: 0.5,
      touchClickY: 0.5
    });

    // Clean up
    return () => {
      if (window.liquidGlass) {
        window.liquidGlass.destroy();
      }
    };
  }, []);

  return (
    <header 
      className="macos-header" 
      ref={headerRef}
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div className="macos-menu">
        {menuItems.map((menu, index) => (
          <div 
            key={index} 
            className={`menu-item ${activeMenu === menu.name ? 'active' : ''}`}
            onMouseEnter={() => setActiveMenu(menu.name)}
          >
            <button className="menu-button">
              {menu.name === 'Apple' ? (
                <svg viewBox="0 0 24 24" width="16" height="16" className="apple-icon">
                  <path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11"></path>
                </svg>
              ) : (
                menu.name
              )}
            </button>
            {activeMenu === menu.name && (
              <div className="menu-dropdown">
                <div className="menu-section">
                  {menu.items.map((item, i) =>
                    item === 'divider' ? (
                      <div key={i} className="divider"></div>
                    ) : (
                      <button key={i} className="menu-dropdown-item">
                        {item}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="macos-status">
        <div className="status-time">
          {currentTime.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit', 
            hour12: true 
          })}
        </div>
      </div>
    </header>
  );
};

export default Header;