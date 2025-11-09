import "./App.css";
import Splash from "./components/Splash/Splash";
import Header from "./components/MenuBar/MenuBar";
import Footer from "./components/Dock/Dock";
import { WindowProvider } from "./contexts/WindowContext";
import { WindowManager } from "./components/WindowManager/WindowManager";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ContextMenu } from "./components/ContextMenu/ContextMenu";
import './styles/theme.css';

const App: React.FC = () => {

  return (
    <ThemeProvider>
      <WindowProvider>
        <div 
          className="desktop-screen"
        >
          <Splash/>
          <Header/>
          <section className="window-area">
            <WindowManager />
          </section>
          <Footer/>
          <ContextMenu />
        </div>
      </WindowProvider>
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
