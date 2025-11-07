import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const Splash = () => {
  const [isLoading, setIsLoading] = useState(true);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.height = "100vh";
      containerRef.current.style.width = "100vw";
    }

    // Start the loading animation
    if (indicatorRef.current) {
      // Reset position to be off-screen to the left
      gsap.set(indicatorRef.current, { x: "-100%" });

      // Animate from left to right
      const tl = gsap.timeline();
      tl.to(indicatorRef.current, {
        x: "0%",
        duration: 2.5,
        ease: "power2.inOut",
      });
    }

    // Track when the component mounts
    const startTime = Date.now();
    const MIN_DISPLAY_TIME = 3000; // 3 seconds minimum display time

    // Handle page load and resources
    const handleLoad = () => {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_DISPLAY_TIME - elapsed);

      // Play the sound if audio element exists
      if (audioRef.current) {
        const playPromise = audioRef.current.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // When audio finishes playing
              audioRef.current?.addEventListener("ended", () => {
                // Wait for the minimum display time before hiding

                setTimeout(() => {
                  const splashScreen = containerRef.current;
                  if (splashScreen) {
                    splashScreen.style.opacity = "0";
                  }
                }, remainingTime);

                setTimeout(() => {
                  setIsLoading(false);
                }, remainingTime + 1000);
              });
            })
            .catch((error) => {
              console.log(
                "Audio playback failed, continuing without sound",
                error
              );
              // If audio fails, wait for the minimum display time
              setTimeout(() => {
                const splashScreen = containerRef.current;
                if (splashScreen) {
                  splashScreen.style.opacity = "0";
                }
              }, remainingTime);

              setTimeout(() => {
                setIsLoading(false);
              }, remainingTime + 1000);
            });
        }
      } else {
        // Fallback if audio element is not available
        setTimeout(() => {
          setIsLoading(false);
          document.documentElement.style.overflow = "";
        }, Math.max(remainingTime, 2000)); // Ensure at least 2 seconds for fallback
      }
    };

    // Check if page is already loaded
    if (document.readyState === "complete") {
      // Small delay to ensure everything is ready
      setTimeout(handleLoad, 300);
    } else {
      window.addEventListener("load", () => {
        // Small delay to ensure everything is ready
        setTimeout(handleLoad, 300);
      });
    }

    // Cleanup
    return () => {
      window.removeEventListener("load", handleLoad);
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div ref={containerRef} className="splash-screen">
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
