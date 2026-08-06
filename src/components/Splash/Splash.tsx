import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./Splash.css";

const Splash = () => {
  const [isLoading, setIsLoading] = useState(true);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioPlayedRef = useRef(false);

  // Oculta o cursor customizado enquanto a splash está ativa
  useEffect(() => {
    document.documentElement.classList.add("splash-active");
  }, []);

  // Restaura o cursor quando a splash termina (mesmo permanecendo montada)
  useEffect(() => {
    if (!isLoading) {
      document.documentElement.classList.remove("splash-active");
      document.documentElement.style.overflow = "";
    }
  }, [isLoading]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.height = "100vh";
      containerRef.current.style.width = "100vw";
    }

    // Start the loading animation
    if (indicatorRef.current) {
      gsap.set(indicatorRef.current, { x: "-100%" });
      const tl = gsap.timeline();
      tl.to(indicatorRef.current, {
        x: "0%",
        duration: 2.5,
        ease: "power2.inOut",
      });
    }

    const startTime = Date.now();
    const MIN_DISPLAY_TIME = 3000; // 3 seconds minimum display time
    let finished = false;

    const finishSplash = () => {
      if (finished) return;
      finished = true;

      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_DISPLAY_TIME - elapsed);

      setTimeout(() => {
        const splashScreen = containerRef.current;
        if (splashScreen) {
          splashScreen.style.opacity = "0";
        }
      }, remainingTime);

      setTimeout(() => {
        setIsLoading(false);
      }, remainingTime + 1200);
    };

    // Tenta tocar o som; se o autoplay for bloqueado, tenta de novo no
    // primeiro gesto do usuário (clique/tecla).
    const tryPlay = () => {
      if (audioPlayedRef.current || !audioRef.current) return;
      audioPlayedRef.current = true;
      const promise = audioRef.current.play();
      if (promise !== undefined) {
        promise.catch(() => {
          audioPlayedRef.current = false; // permite nova tentativa
        });
      }
    };

    tryPlay();
    const retryPlay = () => tryPlay();
    window.addEventListener("pointerdown", retryPlay);
    window.addEventListener("keydown", retryPlay);

    const onAudioEnded = () => finishSplash();
    audioRef.current?.addEventListener("ended", onAudioEnded);

    // Finaliza quando os recursos carregarem
    const handleLoad = () => setTimeout(finishSplash, 300);
    if (document.readyState === "complete") {
      setTimeout(handleLoad, 300);
    } else {
      window.addEventListener("load", handleLoad);
    }

    // Desarme de segurança: garante que a splash sempre saia, mesmo sem áudio
    const safetyTimer = setTimeout(finishSplash, Math.max(MIN_DISPLAY_TIME, 6000));

    return () => {
      finished = true;
      clearTimeout(safetyTimer);
      window.removeEventListener("load", handleLoad);
      window.removeEventListener("pointerdown", retryPlay);
      window.removeEventListener("keydown", retryPlay);
      audioRef.current?.removeEventListener("ended", onAudioEnded);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div
      ref={containerRef}
      className="splash-screen"
      style={{ cursor: "none" }}
    >
      <audio
        ref={audioRef}
        src="/sounds/mac-startup-sound.mp3"
        preload="auto"
        style={{ display: "none" }}
      />
      <div id="loading-logo">
        <svg viewBox="0 0 24 24" role="img" fill="white">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11" />
        </svg>

        <div
          className="progress"
          role="progressbar"
          aria-valuetext="Loading up macOS Web"
        >
          <div
            id="indicator"
            ref={indicatorRef}
            style={{
              willChange: "transform",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Splash;