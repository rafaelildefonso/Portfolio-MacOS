import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "../../contexts/ThemeContext";
import "./ControlCenter.css";
import { WifiIcon } from "../../assets/icons/Icons";

export const ControlCenter = () => {
  const { toggleTheme, theme } = useTheme();
  const [volume, setVolume] = useState(50);
  const [brightness, setBrightness] = useState(75);
  const [wifi, setWifi] = useState(true);

  return (
    <motion.div 
      className="control-center"
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="liquidGlass-effect"></div>
      <div className="control-center-content">
        {/* Network Controls */}
        <div className="control-grid">
          <ControlModule
            icon={<WifiIcon size={18} />}
            title="Wi-Fi"
            subtitle="Rafael's Network"
            active={wifi}
            onClick={() => setWifi(!wifi)}
          />
          <ControlModule
            icon="🌙"
            title="Tema"
            subtitle={theme === "dark" ? "Escuro" : "Claro"}
            active={theme === "dark"}
            onClick={() => toggleTheme()}
          />
        </div>

        {/* Display Brightness */}
        <SliderModule
          icon="☀️"
          label="Display"
          value={brightness}
          onChange={setBrightness}
        />

        {/* Sound Volume */}
        <SliderModule
          icon="🔊"
          label="Som"
          value={volume}
          onChange={setVolume}
        />
      </div>
    </motion.div>
  );
};

interface ControlModuleProps {
  icon: React.ReactNode | string;
  title: string;
  subtitle: string;
  active: boolean;
  onClick: () => void;
}

const ControlModule = ({ icon, title, subtitle, active, onClick }: ControlModuleProps) => (
  <button
    className={`control-module ${active ? 'active' : ''}`}
    onClick={onClick}
  >
    <div className="module-icon">
      {typeof icon === 'string' ? <span className="emoji-icon">{icon}</span> : icon}
    </div>
    <div className="module-info">
      <div className="module-title">{title}</div>
      <div className="module-subtitle">{subtitle}</div>
    </div>
  </button>
);

interface SliderModuleProps {
  icon: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const SliderModule = ({ icon, label, value, onChange }: SliderModuleProps) => (
  <div className="slider-module">
    <div className="slider-header">
      <span className="slider-icon">{icon}</span>
      <span className="slider-label">{label}</span>
      <span className="slider-value">{value}%</span>
    </div>
    <div className="slider-track-wrapper">
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider"
      />
    </div>
  </div>
);
