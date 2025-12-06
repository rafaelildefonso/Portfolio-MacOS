import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useWindows } from "../../contexts/WindowContext";
import { Safari } from "../../apps/Safari/Safari";
import { Finder } from "../../apps/Finder/Finder";
import { Mail } from "../../apps/Mail/Mail";
import { Numbers } from "../../apps/Numbers/Numbers";
import { AppStore } from "../../apps/AppStore/AppStore";
import "./Dock.css";

const Dock = () => {
  const { t } = useTranslation();
  const dockRef = useRef<HTMLDivElement>(null);
  const {
    openWindow,
    windows,
    setActiveWindow,
    activeWindowId,
    minimizeWindow,
  } = useWindows();
  const [mouseX, setMouseX] = useState<number | null>(null);
  const baseWidth = 57.6; // Base width in pixels
  const distanceLimit = baseWidth * 6;

  const calculateWidth = (distance: number) => {
    // Smooth curve for more natural scaling
    const maxScale = 2;

    // Calculate scale based on distance (closer to 0 means closer to cursor)
    const normalizedDistance =
      Math.min(Math.abs(distance), distanceLimit) / distanceLimit;
    const scale =
      1 + (maxScale - 1) * Math.cos(normalizedDistance * Math.PI * 0.5);

    // Apply easing for smoother transitions
    return baseWidth * scale;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dockRef.current) return;
    const rect = dockRef.current.getBoundingClientRect();
    setMouseX(e.clientX - rect.left);
  };

  const handleMouseLeave = () => {
    setMouseX(null);
  };

  const getIconStyle = (index: number) => {
    const baseStyle = {
      transition: "width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1.2)",
    };

    if (mouseX === null) {
      return {
        ...baseStyle,
        width: `${baseWidth}px`,
      };
    }

    const dockButtons =
      dockRef.current?.querySelectorAll<HTMLButtonElement>(".dock-item");
    const button = dockButtons?.[index];
    if (!button)
      return {
        ...baseStyle,
        width: `${baseWidth}px`,
      };

    const buttonRect = button.getBoundingClientRect();
    const dockRect = dockRef.current!.getBoundingClientRect();
    const buttonCenter = buttonRect.left + buttonRect.width / 2 - dockRect.left;
    const distance = mouseX - buttonCenter;

    const width = calculateWidth(distance);
    return {
      ...baseStyle,
      width: `${width}px`,
    };
  };

  // Verifica se app tem janela aberta (incluindo minimizada) - usando appId
  const hasOpenWindow = (appId: string) => {
    return windows.some((w) => w.appId === appId);
  };

  // Encontra janela minimizada para restaurar - usando appId
  const findMinimizedWindow = (appId: string) => {
    return windows.find((w) => w.isMinimized && w.appId === appId);
  };

  // Encontra janela aberta (não minimizada) - usando appId
  const findOpenWindow = (appId: string) => {
    return windows.find((w) => !w.isMinimized && w.appId === appId);
  };

  const handleAppClick = async (appId: string) => {
    // Links externos
    if (appId === "github") {
      window.open("https://github.com/rafaelildefonso", "_blank");
      return;
    }
    if (appId === "linkedin") {
      window.open("https://linkedin.com/in/rafael-ildefonso", "_blank");
      return;
    }

    // Verifica se existe uma janela minimizada para restaurar
    const minimizedWindow = findMinimizedWindow(appId);
    if (minimizedWindow) {
      setActiveWindow(minimizedWindow.id);
      return;
    }

    // Verifica se existe janela aberta (traz para frente)
    const existingWindow = findOpenWindow(appId);
    if (existingWindow) {
      if (activeWindowId !== existingWindow.id) {
        setActiveWindow(existingWindow.id);
      } else {
        minimizeWindow(existingWindow.id);
      }
      return;
    }

    // Se não tem nenhuma janela, abre uma nova

    const centerX = (window.innerWidth - 800) / 2;
    const centerY = (window.innerHeight - 600) / 2;

    switch (appId) {
      case "about_me":
        openWindow({
          title: t("apps.about_me"),
          appIcon: "/images/icons/about_me.png",
          content: <Safari />,
          position: { x: centerX, y: centerY },
          size: { width: 800, height: 600 },
          appId: "about_me",
        });
        break;
      case "projects":
        openWindow({
          title: t("apps.projects"),
          appIcon: "/images/icons/projects.png",
          content: <Finder />,
          position: { x: centerX, y: centerY - 100 },
          size: { width: 900, height: 650 },
          appId: "projects",
        });
        break;
      case "contact":
        openWindow({
          title: t("apps.contact"),
          appIcon: "/images/icons/contact.png",
          content: <Mail />,
          position: { x: centerX, y: centerY },
          size: { width: 750, height: 600 },
          appId: "contact",
        });
        break;
      case "skills":
        openWindow({
          title: t("apps.skills"),
          appIcon: "/images/icons/skills.png",
          content: <Numbers />,
          position: { x: centerX, y: centerY },
          size: { width: 850, height: 700 },
          appId: "skills",
        });
        break;
      case "app_store":
        openWindow({
          title: "App Store",
          appIcon: "/images/icons/app_store.png",
          content: <AppStore />,
          position: { x: centerX, y: centerY },
          size: { width: 1000, height: 700 },
          appId: "app_store",
        });
        break;
      default:
        console.log("App não implementado:", appId);
    }
  };

  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const [bouncingIcon, setBouncingIcon] = useState<string | null>(null);

  const buttons = [
    {
      icon: "projects",
      alt: t("apps.projects"),
      label: t("apps.projects"),
      appId: "projects",
    },
    {
      icon: "about_me",
      alt: t("apps.about_me"),
      label: t("apps.about_me"),
      appId: "about_me",
    },
    {
      icon: "skills",
      alt: t("apps.skills"),
      label: t("apps.skills"),
      appId: "skills",
    },
    {
      icon: "app_store",
      alt: "App Store",
      label: "App Store",
      appId: "app_store",
    },
    {
      icon: "github",
      alt: t("apps.github"),
      label: t("apps.github"),
      appId: "github",
    },
    {
      icon: "linkedin",
      alt: t("apps.linkedin"),
      label: t("apps.linkedin"),
      appId: "linkedin",
    },
    {
      icon: "contact",
      alt: t("apps.contact"),
      label: t("apps.contact"),
      appId: "contact",
    },
  ];

  const handleDockIconClick = async (appId: string) => {
    // Trigger bounce animation
    setBouncingIcon(appId);
    setTimeout(() => setBouncingIcon(null), 600);

    // Wait for bounce to finish before opening
    await new Promise((resolve) => setTimeout(resolve, 300));
    handleAppClick(appId);
  };

  return (
    <footer className="footer">
      <div
        ref={dockRef}
        className="footer-content"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="liquidGlass-effect"></div>
        {buttons.map((btn, index) => (
          <motion.button
            key={btn.icon}
            data-dock-app={btn.appId}
            style={getIconStyle(index)}
            className="dock-item"
            onClick={() => handleDockIconClick(btn.appId)}
            onMouseEnter={() => setHoveredButton(btn.icon)}
            onMouseLeave={() => setHoveredButton(null)}
            animate={{
              y: bouncingIcon === btn.appId ? [-20, 0, -10, 0] : 0,
            }}
            transition={{
              duration: 0.6,
              times: [0, 0.4, 0.6, 1],
              ease: "easeOut",
            }}
          >
            {hoveredButton === btn.icon && (
              <div className="dock-label">
                <div className="liquidGlass-effect"></div>
                <div>{btn.label}</div>
              </div>
            )}
            <motion.span className="dock-icon-wrapper">
              <img
                src={`/images/icons/${btn.icon}.png`}
                alt={btn.alt}
                className="dock-icon genie-thumb"
              />
            </motion.span>
            {hasOpenWindow(btn.appId) && <div className="dot active"></div>}
          </motion.button>
        ))}
      </div>
    </footer>
  );
};

export default Dock;
