import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../contexts/ThemeContext";
import "./ControlCenter.css";
import {
  AudioMaxIcon,
  AudioMinIcon,
  BackwardIcon,
  BrightMaxIcon,
  BrightMinIcon,
  ForwardIcon,
  LanguageIcon,
  PauseIcon,
  PlayIcon,
  ThemeIcon,
  WifiIcon,
} from "../../assets/icons/Icons";

export const ControlCenter = () => {
  const { t, i18n } = useTranslation();
  const { toggleTheme, theme } = useTheme();
  const [volume, setVolume] = useState(50);
  const [brightness, setBrightness] = useState(75);
  const [wifi, setWifi] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <motion.div
      className="control-center "
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="control-center-content">
        {/* Network Controls */}
        <div className="control-grid">
          <ControlModule
            icon={<WifiIcon size={20} />}
            title={t("controlCenter.wifi.title")}
            subtitle={
              wifi
                ? t("controlCenter.wifi.connected")
                : t("controlCenter.wifi.disconnected")
            }
            active={wifi}
            onClick={() => setWifi(!wifi)}
          />
          {/* Music Player */}
          <div className="music-player">
            <div className="music-player-content">
              <div className="music-info">
                <div className="music-cover"></div>
              </div>
              <div className="music-title">
                {t("controlCenter.music.title")}
              </div>
              <div className="music-controls">
                <button
                  className="control-button backward-button"
                  aria-label="Previous"
                >
                  <span className="icon">
                    <BackwardIcon size={20} />{" "}
                  </span>
                </button>
                <button
                  className="control-button play-button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  <span className="icon">
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                  </span>
                </button>
                <button
                  className="control-button forward-button"
                  aria-label="Next"
                >
                  <span className="icon">
                    <ForwardIcon size={20} />{" "}
                  </span>
                </button>
              </div>
            </div>
            <div className="liquidGlass-effect"></div>
          </div>
          <ControlModule
            icon={<ThemeIcon size={20} />}
            title={t("controlCenter.theme.title")}
            subtitle={
              theme === "dark"
                ? t("controlCenter.theme.dark")
                : t("controlCenter.theme.light")
            }
            active={theme === "dark"}
            onClick={toggleTheme}
          />
        </div>
        <div className="languages-grid">
          <ControlModule
            icon={<LanguageIcon size={20} />}
            title={t("controlCenter.pt")}
            subtitle="PT-BR"
            active={i18n.language === "pt"}
            onClick={() => i18n.changeLanguage("pt")}
          />
          <ControlModule
            icon={<LanguageIcon size={20} />}
            title={t("controlCenter.en")}
            subtitle="EN-US"
            active={i18n.language === "en"}
            onClick={() => i18n.changeLanguage("en")}
          />
        </div>

        {/* Display Brightness */}
        <SliderModule
          icon={<BrightMinIcon />}
          SecondIcon={<BrightMaxIcon />}
          label={t("controlCenter.display")}
          value={brightness}
          onChange={setBrightness}
        />

        {/* Sound Volume */}
        <SliderModule
          icon={<AudioMinIcon />}
          SecondIcon={<AudioMaxIcon />}
          label={t("controlCenter.sound")}
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

const ControlModule = ({
  icon,
  title,
  subtitle,
  active,
  onClick,
}: ControlModuleProps) => (
  <button
    className={`control-module ${active ? "active" : ""}`}
    onClick={onClick}
  >
    <div className="module-icon">
      {typeof icon === "string" ? (
        <span className="emoji-icon">{icon}</span>
      ) : (
        icon
      )}
    </div>
    <div className="module-info">
      <div className="module-title">{title}</div>
      <div className="module-subtitle">{subtitle}</div>
    </div>
    <div className="liquidGlass-effect"></div>
  </button>
);

interface SliderModuleProps {
  icon: React.ReactNode | string;
  SecondIcon: React.ReactNode | string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const SliderModule = ({
  icon,
  SecondIcon,
  label,
  value,
  onChange,
}: SliderModuleProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    onChange(newValue);
  };

  return (
    <div className="slider-module">
      <div className="slider-header">
        <span className="slider-label">{label}</span>
      </div>
      <div className="slider-track-wrapper">
        <span className="slider-icon">{icon}</span>
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={handleChange}
          className="slider"
          style={
            {
              "--value": `${value}%`,
            } as React.CSSProperties
          }
        />
        <span className="slider-icon">{SecondIcon}</span>
      </div>
      <div className="liquidGlass-effect"></div>
    </div>
  );
};
