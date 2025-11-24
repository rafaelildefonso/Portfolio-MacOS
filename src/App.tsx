import "./App.css";
import Splash from "./components/Splash/Splash";
import TopBar from "./components/TopBar/TopBar";
import Dock from "./components/Dock/Dock";
import { WindowProvider } from "./contexts/WindowContext";
import { WindowManager } from "./components/WindowManager/WindowManager";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ContextMenu } from "./components/ContextMenu/ContextMenu";
import './styles/theme.css';
import './styles/genie.css';
import { CursorProvider } from "./contexts/CursorContext";
import { CustomCursor } from "./components/CustomCursor/CustomCursor";

const App: React.FC = () => {

  return (
    <ThemeProvider>
      <CursorProvider>
        <WindowProvider>
          <div 
            className="desktop-screen"
          >
            <Splash/>
            <TopBar/>
            <section className="window-area">
              <WindowManager />
            </section>
            <Dock/>
            <ContextMenu />
          </div>
          <CustomCursor />
        </WindowProvider>
      </CursorProvider>
      <svg>
        <filter id="glass-distortion">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.01 0.01"
            numOctaves="1"
            seed="5"
            result="turbulence"
          />
          <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
          <feDisplacementMap in="SourceGraphic" in2="softMap" scale="150" />
        </filter>
      </svg>
    </ThemeProvider>
  );
};

export default App;
