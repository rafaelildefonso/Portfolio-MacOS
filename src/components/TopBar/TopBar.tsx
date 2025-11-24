import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ControlCenter } from "../ControlCenter/ControlCenter";
import "./TopBar.css";
import { SearchIcon, WifiIcon, ControlCenterIcon } from "../../assets/icons/Icons";

const TopBar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const headerRef = useRef<HTMLDivElement>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const controlCenterRef = useRef<HTMLDivElement>(null);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Fechar Control Center ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        controlCenterRef.current &&
        !controlCenterRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(".status-button")
      ) {
        setIsControlCenterOpen(false);
      }
    };

    if (isControlCenterOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isControlCenterOpen]);

  const { t } = useTranslation();

  const menuItems = [
    {
      id: 'apple',
      items: [
        { key: 'aboutThisMac', isDivider: false },
        { key: 'divider1', isDivider: true },
        { key: 'systemPreferences', isDivider: false },
        { key: 'appStore', isDivider: false },
        { key: 'divider2', isDivider: true },
        { key: 'recentItems', isDivider: false },
        { key: 'divider3', isDivider: true },
        { key: 'forceQuit', isDivider: false },
        { key: 'divider4', isDivider: true },
        { key: 'sleep', isDivider: false },
        { key: 'restart', isDivider: false },
        { key: 'shutDown', isDivider: false },
      ],
    },
    {
      id: 'file',
      items: [
        { key: 'newFinderWindow', isDivider: false },
        { key: 'newFolder', isDivider: false },
        { key: 'newSmartFolder', isDivider: false },
        { key: 'newTab', isDivider: false },
        { key: 'divider1', isDivider: true },
        { key: 'getInfo', isDivider: false },
        { key: 'divider2', isDivider: true },
        { key: 'search', isDivider: false },
      ],
    },
    {
      id: 'edit',
      items: [
        { key: 'undo', isDivider: false },
        { key: 'redo', isDivider: false },
        { key: 'divider1', isDivider: true },
        { key: 'cut', isDivider: false },
        { key: 'copy', isDivider: false },
        { key: 'paste', isDivider: false },
        { key: 'divider2', isDivider: true },
        { key: 'emojiAndSymbols', isDivider: false },
      ],
    },
    {
      id: 'view',
      items: [
        { key: 'asIcons', isDivider: false },
        { key: 'asList', isDivider: false },
        { key: 'asColumns', isDivider: false },
        { key: 'asGallery', isDivider: false },
        { key: 'divider1', isDivider: true },
        { key: 'useStacks', isDivider: false },
        { key: 'sortBy', isDivider: false },
      ],
    },
    {
      id: 'go',
      items: [
        { key: 'back', isDivider: false },
        { key: 'forward', isDivider: false },
        { key: 'enclosingFolder', isDivider: false },
        { key: 'divider1', isDivider: true },
        { key: 'recent', isDivider: false },
        { key: 'documents', isDivider: false },
        { key: 'desktop', isDivider: false },
        { key: 'downloads', isDivider: false },
        { key: 'home', isDivider: false },
      ],
    },
  ];

  // Helper function to get translation key for menu items
  const getMenuTitle = (menuId: string) => {
    return t(`topBar.menu.${menuId}._title`);
  };

  // Helper function to get translation key for menu items
  const getMenuItemKey = (menuId: string, itemKey: string) => {
    return `topBar.menu.${menuId}.${itemKey}`;
  };

  return (
    <header
      className="macos-header"
      ref={headerRef}
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div className="liquidGlass-effect"></div>
      <div className="macos-menu">
        {menuItems.map((menu, index) => (
          <div
            key={index}
            className={`menu-item ${activeMenu === menu.id ? "active" : ""}`}
            onMouseEnter={() => setActiveMenu(menu.id)}
          >
            {menu.id === "apple" ? (
              <button className="menu-button apple-button" aria-label={getMenuTitle('apple')}>
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  className="apple-icon"
                  aria-hidden="true"
                >
                  <path
                    fill="currentColor"
                    d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11"
                  ></path>
                </svg>
              </button>
            ) : (
              <button className="menu-button">{getMenuTitle(menu.id)}</button>
            )}
            {activeMenu === menu.id && (
              <div
                className="menu-dropdown"
                ref={(el) => {
                  if (el) {
                    dropdownRefs.current[menu.id] = el;
                  } else {
                    delete dropdownRefs.current[menu.id];
                  }
                }}
              >
                <div className="liquidGlass-effect"></div>
                <div
                  className="menu-section"
                  data-liquid-applied="false"
                >
                  {menu.items.map((item, i) =>
                    item.isDivider ? (
                      <div key={`${menu.id}-${item.key}-${i}`} className="divider"></div>
                    ) : (
                      <button 
                        key={`${menu.id}-${item.key}-${i}`} 
                        className="menu-dropdown-item"
                      >
                        {t(getMenuItemKey(menu.id, item.key))}
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
        <div className="status-icons">
          <button className="status-button" aria-label={t('topBar.status.wifi')}>
            <WifiIcon size={12} className="status-icon" aria-hidden="true" />
          </button>
          <button className="status-button" aria-label={t('topBar.status.search')}>
            <SearchIcon size={12} className="status-icon" aria-hidden="true" />
          </button>
          <button
            className="status-button"
            onClick={() => setIsControlCenterOpen(!isControlCenterOpen)}
            aria-label={t('topBar.status.controlCenter')}
            aria-expanded={isControlCenterOpen}
            role="button"
          >
            <ControlCenterIcon size={12} className="status-icon" aria-hidden="true" />
          </button>
        </div>
        <div className="status-time">
          {currentTime.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}
        </div>
      </div>

      {isControlCenterOpen && (
        <div className="control-center-overlay">
          <div ref={controlCenterRef} className="control-center-wrapper">
            <ControlCenter />
          </div>
        </div>
      )}
    </header>
  );
};

export default TopBar;
