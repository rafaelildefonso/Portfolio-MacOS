// Genie Effect - Adaptado do código original de Hakan Bilgin (c) 2013
// Convertido para TypeScript e React
// Otimizado: snapshot em cache por janela + transições mais rápidas,
// mantendo o efeito slice genuíno do macOS.

interface Dimensions {
  w: number;
  h: number;
  t: number;
  l: number;
  obj: HTMLElement;
}

// Cache de snapshot por janela (evita re-rasterizar em abrir/minimizar/restaurar)
const snapshotCache = new WeakMap<HTMLElement, string>();

export const clearGenieCache = (el: HTMLElement) => {
  snapshotCache.delete(el);
};

const getDimensions = (el: HTMLElement): Dimensions | null => {
  const rect = el.getBoundingClientRect();
  const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollY = window.pageYOffset || document.documentElement.scrollTop;

  return {
    w: rect.width || el.offsetWidth,
    h: rect.height || el.offsetHeight,
    t: rect.top + scrollY,
    l: rect.left + scrollX,
    obj: el,
  };
};

const prefixedEvent = (
  el: HTMLElement,
  type: string,
  callback: (e: TransitionEvent) => void
) => {
  const prefixes = ["webkit", "moz", "MS", "o", ""];
  prefixes.forEach((prefix) => {
    const eventType = prefix
      ? `${prefix}${type.charAt(0).toUpperCase() + type.slice(1)}`
      : type.toLowerCase();
    el.addEventListener(eventType, callback as EventListener, false);
  });
};

const STEP_HEIGHT = (window as any).chrome ? 3 : 5;

const nextFrame = () =>
  new Promise<void>((r) => requestAnimationFrame(() => r()));

// Capturar screenshot da janela usando html2canvas ou fallback (com cache)
const captureWindowContent = async (
  element: HTMLElement,
  cacheKey: HTMLElement | null = null
): Promise<string> => {
  const key = cacheKey || element;
  const cached = snapshotCache.get(key);
  if (cached !== undefined) return cached;

  const originalVisibility = element.style.visibility;
  const originalOpacity = element.style.opacity;
  const originalDisplay = element.style.display;

  try {
    let html2canvas: any;
    try {
      html2canvas = (await import("html2canvas")).default;
    } catch (e) {
      html2canvas = (window as any).html2canvas;
    }

    if (html2canvas && typeof html2canvas === "function") {
      element.style.display = originalDisplay || "block";
      element.style.visibility = "visible";
      element.style.opacity = "1";

      await nextFrame();

      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 1,
        useCORS: true,
        logging: false,
        allowTaint: true,
        windowHeight: element.offsetHeight,
        removeContainer: true,
      });

      element.style.display = originalDisplay;
      element.style.visibility = originalVisibility;
      element.style.opacity = originalOpacity;

      const dataUrl = canvas.toDataURL("image/png");
      snapshotCache.set(key, dataUrl);
      return dataUrl;
    }
  } catch (e) {
    console.log("html2canvas não disponível ou erro:", e);
  }

  // Fallback: preencher com a cor de fundo
  try {
    element.style.visibility = "hidden";
    element.style.opacity = "1";
    await nextFrame();

    const rect = element.getBoundingClientRect();
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(rect.width, 1);
    canvas.height = Math.max(rect.height, 1);
    const ctx = canvas.getContext("2d");

    if (ctx) {
      const styles = window.getComputedStyle(element);
      const bgColor = styles.backgroundColor;
      const fillColor =
        bgColor && bgColor !== "rgba(0, 0, 0, 0)" && bgColor !== "transparent"
          ? bgColor
          : "rgba(255, 255, 255, 0.9)";
      ctx.fillStyle = fillColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      element.style.visibility = originalVisibility;
      element.style.opacity = originalOpacity;
      snapshotCache.set(key, dataUrl);
      return dataUrl;
    }
  } catch (e) {
    console.log("Erro no fallback de captura:", e);
  }

  element.style.visibility = originalVisibility;
  element.style.opacity = originalOpacity;
  return "";
};

export const genieExpand = (
  sourceElement: HTMLElement, // Ícone do dock
  targetElement: HTMLElement, // Janela
  onComplete?: () => void
): Promise<void> => {
  return new Promise(async (resolve) => {
    const sourceDim = getDimensions(sourceElement);
    if (!sourceDim) {
      onComplete?.();
      resolve();
      return;
    }

    const originalDisplay = "none";
    const originalVisibility = "hidden";

    targetElement.style.display = "block";
    targetElement.style.visibility = "hidden";

    const targetDim = getDimensions(targetElement);

    targetElement.style.display = originalDisplay;
    targetElement.style.visibility = originalVisibility;

    if (!targetDim) {
      onComplete?.();
      resolve();
      return;
    }

    // Clonar a janela para captura off-screen não causar flash
    const clone = targetElement.cloneNode(true) as HTMLElement;
    clone.style.display = "block";
    clone.style.visibility = "visible";
    clone.style.opacity = "1";
    clone.style.position = "absolute";
    clone.style.top = "-9999px";
    clone.style.left = "-9999px";
    clone.style.width = `${targetDim.w}px`;
    clone.style.height = `${targetDim.h}px`;

    const computedStyle = window.getComputedStyle(targetElement);
    clone.style.backgroundColor = computedStyle.backgroundColor;
    clone.style.backgroundImage = computedStyle.backgroundImage;

    document.body.appendChild(clone);

    await nextFrame();

    // Capturar conteúdo (com cache da janela real para replays)
    const windowBg = await captureWindowContent(clone, targetElement);

    document.body.removeChild(clone);

    const genieEl = document.createElement("div");
    genieEl.className = "genie";
    genieEl.style.position = "fixed";
    genieEl.style.display = "block";
    genieEl.style.backgroundRepeat = "no-repeat";
    genieEl.style.backgroundSize = "cover";
    genieEl.style.cursor = "pointer";
    genieEl.style.zIndex = "10000";
    genieEl.style.pointerEvents = "none";

    genieEl.style.width = `${targetDim.w}px`;
    genieEl.style.height = `${targetDim.h}px`;
    genieEl.style.top = `${targetDim.t}px`;
    genieEl.style.left = `${targetDim.l}px`;
    genieEl.style.backgroundPosition = "0px -9999px";

    if (windowBg) {
      if (windowBg.startsWith("data:") || windowBg.startsWith("http")) {
        genieEl.style.backgroundImage = `url(${windowBg})`;
      } else {
        genieEl.style.backgroundImage = windowBg;
      }
    } else {
      genieEl.style.backgroundColor =
        window.getComputedStyle(targetElement).backgroundColor ||
        "rgba(255, 255, 255, 0.9)";
    }

    document.body.appendChild(genieEl);

    await nextFrame();

    // Ocultar a janela agora que o genie já está visível
    targetElement.style.visibility = "hidden";
    targetElement.style.opacity = "0";

    const targetDimFinal = getDimensions(genieEl);
    if (!targetDimFinal) {
      genieEl.remove();
      onComplete?.();
      resolve();
      return;
    }

    // Âncora vertical: centro do ícone (o genie emerge de trás do ícone do dock)
    const sourceAnchorY = sourceDim.t + sourceDim.h / 2;

    const diffT = sourceAnchorY - targetDimFinal.t;

    const sourceCenter = sourceDim.l + sourceDim.w / 2;
    const startWidth = 4;
    const startLeft = sourceCenter - startWidth / 2;

    const radiansLeft = Math.floor((startLeft - targetDimFinal.l) / 2);
    const radiansWidth = Math.floor((startWidth - targetDimFinal.w) / 2);
    const rwOffset = radiansWidth - startWidth;
    const stepLength = Math.ceil(
      (sourceAnchorY - targetDimFinal.t) / STEP_HEIGHT
    );
    const increase = (Math.PI * 2) / (stepLength * 2);
    let counter = 4.75;

    const steps: HTMLDivElement[] = [];
    for (let i = 0; i < stepLength; i++) {
      const step = document.createElement("div");
      step.className = "genie-step";

      const bgy = diffT - i * STEP_HEIGHT;

      const left = Math.ceil(Math.sin(counter) * radiansLeft + radiansLeft);
      const width = Math.ceil(Math.sin(counter) * radiansWidth - rwOffset);

      step.style.position = "absolute";
      step.style.top = `${i * STEP_HEIGHT}px`;
      step.style.height = `${STEP_HEIGHT + 1}px`;
      step.style.backgroundPosition = `0px ${bgy}px`;
      step.style.left = `${left}px`;
      step.style.width = `${width}px`;
      step.style.backgroundRepeat = "no-repeat";
      step.style.backgroundImage = "inherit";
      step.style.backgroundSize = "100%";

      genieEl.appendChild(step);
      steps.push(step);
      counter += increase;
    }

    let transitionHandled = false;
    const handleTransitionEnd = (e: TransitionEvent) => {
      if (transitionHandled) return;

      if (
        e.propertyName === "background-position" ||
        e.propertyName === "background-position-x" ||
        e.propertyName === "background-position-y"
      ) {
        if (genieEl.classList.contains("expand")) {
          steps.forEach((step) => {
            step.style.left = "0px";
            step.style.width = `${targetDimFinal.w}px`;
          });
          genieEl.classList.add("fan");

          const handleWidthTransition = (e: TransitionEvent) => {
            if (e.propertyName === "width" && !transitionHandled) {
              transitionHandled = true;
              genieEl.style.backgroundPosition = "0px 0px";
              setTimeout(() => {
                genieEl.remove();
                onComplete?.();
                resolve();
              }, 0);
              steps[steps.length - 1].removeEventListener(
                "transitionend",
                handleWidthTransition
              );
            }
          };

          prefixedEvent(
            steps[steps.length - 1],
            "transitionend",
            handleWidthTransition
          );
        }
      }
    };

    prefixedEvent(
      steps[steps.length - 1],
      "transitionend",
      handleTransitionEnd
    );

    // Iniciar animação imediatamente (sem delay desnecessário)
    requestAnimationFrame(() => {
      const tDim = targetDimFinal;

      steps.forEach((step, i) => {
        const t = i * STEP_HEIGHT;
        const bgy = ((t - 2) / (tDim.h - STEP_HEIGHT)) * 100;
        step.style.backgroundPosition = `0% ${bgy}%`;
      });

      sourceElement.style.backgroundPosition = `0 -${sourceDim.h + 10}px`;
      genieEl.classList.add("expand");
    });
  });
};

export const genieCollapse = (
  sourceElement: HTMLElement, // Janela
  targetElement: HTMLElement, // Ícone do dock
  onComplete?: () => void
): Promise<void> => {
  return new Promise(async (resolve) => {
    const sourceDim = getDimensions(sourceElement);
    const targetDim = getDimensions(targetElement);

    if (!sourceDim || !targetDim) {
      onComplete?.();
      resolve();
      return;
    }

    // Capturar conteúdo (usa cache se já capturado nesta sessão)
    const windowBg = await captureWindowContent(sourceElement);

    const genieEl = document.createElement("div");
    genieEl.className = "genie";
    genieEl.style.position = "fixed";
    genieEl.style.display = "block";
    genieEl.style.backgroundRepeat = "no-repeat";
    genieEl.style.backgroundSize = "cover";
    genieEl.style.cursor = "pointer";
    genieEl.style.zIndex = "10000";
    genieEl.style.pointerEvents = "none";

    genieEl.style.width = `${sourceDim.w}px`;
    genieEl.style.height = `${sourceDim.h}px`;
    genieEl.style.top = `${sourceDim.t}px`;
    genieEl.style.left = `${sourceDim.l}px`;
    genieEl.style.backgroundPosition = "0 -9999px";

    if (windowBg) {
      if (windowBg.startsWith("data:") || windowBg.startsWith("http")) {
        genieEl.style.backgroundImage = `url(${windowBg})`;
      } else {
        genieEl.style.backgroundImage = windowBg;
      }
    } else {
      genieEl.style.backgroundColor =
        window.getComputedStyle(sourceElement).backgroundColor ||
        "rgba(255, 255, 255, 0.9)";
    }

    document.body.appendChild(genieEl);

    await nextFrame();

    sourceElement.style.visibility = "hidden";
    sourceElement.style.opacity = "0";

    // Âncora vertical: centro do ícone (o genie colapsa para trás do ícone)
    const targetAnchorY = targetDim.t + targetDim.h / 2;

    const stepLength = Math.ceil((targetAnchorY - sourceDim.t) / STEP_HEIGHT);
    const steps: HTMLDivElement[] = [];

    for (let i = 0; i < stepLength; i++) {
      const step = document.createElement("div");
      step.className = "genie-step";
      const top = i * STEP_HEIGHT;
      const bgPos = `0px ${((top + STEP_HEIGHT) / sourceDim.h) * 100}%`;

      step.style.position = "absolute";
      step.style.left = "0px";
      step.style.top = `${top}px`;
      step.style.width = `${sourceDim.w}px`;
      step.style.height = `${STEP_HEIGHT + 1}px`;
      step.style.backgroundPosition = bgPos;
      step.style.backgroundRepeat = "no-repeat";
      step.style.backgroundImage = "inherit";
      step.style.backgroundSize = "100%";

      genieEl.appendChild(step);
      steps.push(step);
    }

    genieEl.classList.add("collapse");

    targetElement.classList.remove("genie-thumb");
    targetElement.classList.add("paced-thumb");

    let transitionHandled = false;

    requestAnimationFrame(() => {
      const genieSteps = genieEl.childNodes as NodeListOf<HTMLElement>;

      const targetCenter = targetDim.l + targetDim.w / 2;
      const finalWidth = 4;
      const finalLeft = targetCenter - finalWidth / 2;

      const radiansLeft = Math.floor((finalLeft - sourceDim.l) / 2);
      const radiansWidth = Math.floor((finalWidth - sourceDim.w) / 2);
      const rwOffset = radiansWidth - finalWidth;
      const increase = (Math.PI * 2) / (stepLength * 2);
      let counter = 4.7;

      for (let i = 0; i < genieSteps.length; i++) {
        const step = genieSteps[i];
        step.style.left =
          Math.ceil(Math.sin(counter) * radiansLeft + radiansLeft) + "px";
        step.style.width =
          Math.ceil(Math.sin(counter) * radiansWidth - rwOffset) + "px";
        counter += increase;
      }

      const handleTransitionEnd = (e: TransitionEvent) => {
        if (transitionHandled) return;

        if (e.propertyName === "left") {
          if (genieEl.classList.contains("collapse")) {
            const diffT = targetAnchorY + sourceDim.t - 100;

            for (let i = 0; i < genieSteps.length; i++) {
              const step = genieSteps[i];
              const stepHeight = step.offsetHeight;
              step.style.backgroundPosition = `0px ${
                diffT + i - i * stepHeight
              }px`;
            }

            targetElement.style.backgroundPosition = "0px 0px";
            genieEl.classList.add("change-pace");
            genieEl.style.height = "0px";

            const handleBgTransition = (e: TransitionEvent) => {
              if (
                (e.propertyName === "background-position" ||
                  e.propertyName === "background-position-x" ||
                  e.propertyName === "background-position-y") &&
                !transitionHandled
              ) {
                transitionHandled = true;
                targetElement.classList.remove("paced-thumb");
                targetElement.classList.add("genie-thumb");
                genieEl.classList.remove("change-pace");
                genieEl.classList.remove("collapse");
                genieEl.innerHTML = "";
                genieEl.remove();
                onComplete?.();
                resolve();
                if (genieSteps.length > 0) {
                  genieSteps[genieSteps.length - 1].removeEventListener(
                    "transitionend",
                    handleBgTransition
                  );
                }
              }
            };

            if (genieSteps.length > 0) {
              prefixedEvent(
                genieSteps[genieSteps.length - 1],
                "transitionend",
                handleBgTransition
              );
            } else {
              onComplete?.();
              resolve();
            }
          }
        }
      };

      if (genieSteps.length > 0) {
        prefixedEvent(
          genieSteps[genieSteps.length - 1],
          "transitionend",
          handleTransitionEnd
        );
      } else {
        onComplete?.();
        resolve();
      }
    });
  });
};

// Efeito "pop" para fechar janela (substitui genie no close)
export const popEffect = (
  element: HTMLElement,
  onComplete?: () => void
): Promise<void> => {
  return new Promise((resolve) => {
    if (!element) {
      onComplete?.();
      resolve();
      return;
    }

    const originalTransition = element.style.transition;
    const originalTransform = element.style.transform;
    const originalOpacity = element.style.opacity;

    element.style.transition = "transform 0.14s ease-out, opacity 0.14s ease-out";
    element.style.transform = "scale(0.8)";
    element.style.opacity = "0";

    const handleTransitionEnd = (e: TransitionEvent) => {
      if (
        e.target === element &&
        (e.propertyName === "transform" || e.propertyName === "opacity")
      ) {
        element.removeEventListener("transitionend", handleTransitionEnd);
        element.style.transition = originalTransition;
        element.style.transform = originalTransform;
        element.style.opacity = originalOpacity;
        clearGenieCache(element);
        onComplete?.();
        resolve();
      }
    };

    element.addEventListener("transitionend", handleTransitionEnd);

    setTimeout(() => {
      element.removeEventListener("transitionend", handleTransitionEnd);
      element.style.transition = originalTransition;
      element.style.transform = originalTransform;
      element.style.opacity = originalOpacity;
      clearGenieCache(element);
      onComplete?.();
      resolve();
    }, 220);
  });
};

// Aliases para compatibilidade
export const genieMinimize = genieCollapse;
export const genieRestore = genieExpand;