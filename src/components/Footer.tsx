import { useRef, useState } from 'react';

const Footer = () => {
  const footerRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const baseWidth = 57.6; // Base width in pixels
  const distanceLimit = baseWidth * 6;

  const calculateWidth = (distance: number) => {
    // Smooth curve for more natural scaling
    const maxScale = 2;
    
    // Calculate scale based on distance (closer to 0 means closer to cursor)
    const normalizedDistance = Math.min(Math.abs(distance), distanceLimit) / distanceLimit;
    const scale = 1 + (maxScale - 1) * Math.cos(normalizedDistance * Math.PI * 0.5);
    
    // Apply easing for smoother transitions
    return baseWidth * scale;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!footerRef.current) return;
    const rect = footerRef.current.getBoundingClientRect();
    setMouseX(e.clientX - rect.left);
  };

  const handleMouseLeave = () => {
    setMouseX(null);
  };

  const getIconStyle = (index: number) => {
    const baseStyle = {
      transition: 'width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1.2)'
    };

    if (mouseX === null) {
      return { 
        ...baseStyle,
        width: `${baseWidth}px`
      };
    }
    
    const button = footerRef.current?.children[index] as HTMLElement;
    if (!button) return { 
      ...baseStyle,
      width: `${baseWidth}px`
    };
    
    const buttonRect = button.getBoundingClientRect();
    const buttonCenter = buttonRect.left + buttonRect.width / 2 - footerRef.current!.getBoundingClientRect().left;
    const distance = mouseX - buttonCenter;
    
    const width = calculateWidth(distance);
    return {
      ...baseStyle,
      width: `${width}px`
    };
  };

  const buttons = [
    { icon: 'about_me', alt: 'About Me' },
    { icon: 'skills', alt: 'Skills' },
    { icon: 'projects', alt: 'Projects' },
    { icon: 'github', alt: 'GitHub' },
    { icon: 'linkedin', alt: 'LinkedIn' },
    { icon: 'contact', alt: 'Contact' }
  ];

  return (
    <footer className="footer">
      <div 
        ref={footerRef}
        className="footer-content glass-effect"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {buttons.map((btn, index) => (
          <button 
            key={btn.icon} 
            style={getIconStyle(index)}
            className="dock-item"
          >
            <span>
              <img 
                src={`/images/icons/${btn.icon}.png`} 
                alt={btn.alt} 
                className="dock-icon"
              />
            </span>
            <div className="dot"></div>
          </button>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
