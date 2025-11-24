// Genie Effect - Adaptado do código original de Hakan Bilgin (c) 2013
// Convertido para TypeScript e React

interface Dimensions {
  w: number;
  h: number;
  t: number;
  l: number;
  obj: HTMLElement;
}

const getDimensions = (el: HTMLElement): Dimensions | null => {
  // Usar getBoundingClientRect para posições absolutas mais precisas
  const rect = el.getBoundingClientRect();
  const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollY = window.pageYOffset || document.documentElement.scrollTop;
  
  const dim: Dimensions = {
    w: rect.width || el.offsetWidth,
    h: rect.height || el.offsetHeight,
    t: rect.top + scrollY,
    l: rect.left + scrollX,
    obj: el
  };
  
  return dim;
};

// Função auxiliar para obter o centro de um elemento
const getElementCenter = (el: HTMLElement | null): { x: number; y: number } | null => {
  if (!el) return null;
  
  try {
    const rect = el.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft || 0;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    
    return {
      x: rect.left + scrollX + rect.width / 2,
      y: rect.top + scrollY + rect.height / 2
    };
  } catch (error) {
    console.error('Erro ao obter centro do elemento:', error);
    return null;
  }
};

const prefixedEvent = (el: HTMLElement, type: string, callback: (e: TransitionEvent) => void) => {
  const prefixes = ['webkit', 'moz', 'MS', 'o', ''];
  prefixes.forEach(prefix => {
    const eventType = prefix ? `${prefix}${type.charAt(0).toUpperCase() + type.slice(1)}` : type.toLowerCase();
    el.addEventListener(eventType, callback as EventListener, false);
  });
};

const STEP_HEIGHT = (window as any).chrome ? 3 : 5;

// Capturar screenshot da janela usando html2canvas ou fallback
const captureWindowContent = async (element: HTMLElement): Promise<string> => {
  // Garantir que o elemento esteja visível para captura
  const originalVisibility = element.style.visibility;
  const originalOpacity = element.style.opacity;
  const originalDisplay = element.style.display;
  
  try {
    // Tentar importar html2canvas dinamicamente
    let html2canvas: any;
    try {
      html2canvas = (await import('html2canvas')).default;
    } catch (e) {
      // Se não conseguir importar, tentar do window
      html2canvas = (window as any).html2canvas;
    }
    
    if (html2canvas && typeof html2canvas === 'function') {
      // Garantir visibilidade completa
      element.style.display = originalDisplay || 'block';
      element.style.visibility = 'visible';
      element.style.opacity = '1';
      
      // Aguardar renderização completa (múltiplos frames)
      await new Promise(r => requestAnimationFrame(() => 
        requestAnimationFrame(() => requestAnimationFrame(r))
      ));
      
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 1,
        useCORS: true,
        logging: false,
        allowTaint: true,
        windowWidth: element.offsetWidth,
        windowHeight: element.offsetHeight,
        removeContainer: false
      });
      
      // Restaurar visibilidade original
      element.style.display = originalDisplay;
      element.style.visibility = originalVisibility;
      element.style.opacity = originalOpacity;
      
      return canvas.toDataURL('image/png');
    }
  } catch (e) {
    console.log('html2canvas não disponível ou erro:', e);
  }
  
  // Fallback melhorado: criar clone visual da janela
  try {
    // Garantir visibilidade
    element.style.visibility = 'visible';
    element.style.opacity = '1';
    
    // Aguardar renderização
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    
    // Criar clone da janela para captura
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    clone.style.visibility = 'visible';
    clone.style.opacity = '1';
    clone.style.transform = 'none';
    clone.style.transition = 'none';
    clone.style.width = `${element.offsetWidth}px`;
    clone.style.height = `${element.offsetHeight}px`;
    
    document.body.appendChild(clone);
    
    // Aguardar renderização do clone
    await new Promise(r => requestAnimationFrame(r));
    
    // Tentar usar getImageData do canvas para capturar o clone
    const rect = clone.getBoundingClientRect();
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(rect.width, 1);
    canvas.height = Math.max(rect.height, 1);
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Preencher com cor de fundo
      const styles = window.getComputedStyle(element);
      const bgColor = styles.backgroundColor;
      const fillColor = bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent' 
        ? bgColor 
        : 'rgba(255, 255, 255, 0.9)';
      ctx.fillStyle = fillColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const dataUrl = canvas.toDataURL('image/png');
      
      // Remover clone
      document.body.removeChild(clone);
      
      // Restaurar visibilidade original
      element.style.visibility = originalVisibility;
      element.style.opacity = originalOpacity;
      
      return dataUrl;
    }
    
    // Remover clone se não usou
    if (document.body.contains(clone)) {
      document.body.removeChild(clone);
    }
  } catch (e) {
    console.log('Erro ao criar clone visual:', e);
  }
  
  // Último fallback: usar background color/image
  const styles = window.getComputedStyle(element);
  const bgImage = styles.backgroundImage;
  
  // Se tem background-image, usar
  if (bgImage && bgImage !== 'none' && bgImage !== 'initial' && bgImage !== 'inherit') {
    const match = bgImage.match(/url\((['"]?)(.*?)\1\)/i);
    if (match && match[2]) {
      // Restaurar visibilidade original
      element.style.visibility = originalVisibility;
      element.style.opacity = originalOpacity;
      return match[2];
    }
  }
  
  // Restaurar visibilidade original
  element.style.visibility = originalVisibility;
  element.style.opacity = originalOpacity;
  
  return '';
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

    // IMPORTANTE: Capturar conteúdo da janela ANTES de ocultá-la
    // Garantir que a janela esteja visível para captura
    const originalDisplay = targetElement.style.display;
    
    // Tornar janela visível para captura
    targetElement.style.display = originalDisplay || 'block';
    targetElement.style.visibility = 'visible';
    targetElement.style.opacity = '1';
    
    // Aguardar renderização completa (múltiplos frames)
    await new Promise(r => requestAnimationFrame(() => 
      requestAnimationFrame(() => requestAnimationFrame(r))
    ));
    
    // Usar dimensões reais da janela ANTES de capturar (enquanto visível)
    const targetDim = getDimensions(targetElement);
    if (!targetDim) {
      onComplete?.();
      resolve();
      return;
    }
    
    // Capturar conteúdo da janela enquanto visível
    const windowBg = await captureWindowContent(targetElement);
    
    // Criar elemento genie ANTES de ocultar a janela
    const genieEl = document.createElement('div');
    genieEl.className = 'genie';
    genieEl.style.position = 'fixed';
    genieEl.style.display = 'block';
    genieEl.style.backgroundRepeat = 'no-repeat';
    genieEl.style.backgroundSize = 'cover';
    genieEl.style.cursor = 'pointer';
    genieEl.style.zIndex = '10000';
    genieEl.style.pointerEvents = 'none';
    
    // Configurar dimensões e posição do target (janela)
    genieEl.style.width = `${targetDim.w}px`;
    genieEl.style.height = `${targetDim.h}px`;
    genieEl.style.top = `${targetDim.t}px`;
    genieEl.style.left = `${targetDim.l}px`;
    genieEl.style.backgroundPosition = '0px -9999px';
    
    if (windowBg) {
      if (windowBg.startsWith('data:') || windowBg.startsWith('http')) {
        genieEl.style.backgroundImage = `url(${windowBg})`;
      } else {
        genieEl.style.backgroundImage = windowBg;
      }
    } else {
      genieEl.style.backgroundColor = window.getComputedStyle(targetElement).backgroundColor || 'rgba(255, 255, 255, 0.9)';
    }
    
    // Adicionar genie ao DOM ANTES de ocultar a janela
    document.body.appendChild(genieEl);
    
    // Aguardar um frame para garantir que o genie está renderizado
    await new Promise(r => requestAnimationFrame(r));
    
    // AGORA ocultar a janela para a animação (genie já está visível)
    targetElement.style.visibility = 'hidden';
    targetElement.style.opacity = '0';
    
    const targetDimFinal = getDimensions(genieEl);
    if (!targetDimFinal) {
      genieEl.remove();
      onComplete?.();
      resolve();
      return;
    }
    
    // Diferença entre posições (do ícone para a janela) - baseado no código original
    const diffT = sourceDim.t - targetDimFinal.t; // Diferença vertical
    
    // Calcular radianos para curva suave (baseado no código original)
    const radiansLeft = Math.floor((sourceDim.l - targetDimFinal.l) / 2);
    const radiansWidth = Math.floor((sourceDim.w - targetDimFinal.w) / 2);
    const rwOffset = radiansWidth - sourceDim.w;
    const stepLength = Math.ceil((sourceDim.t - targetDimFinal.t) / STEP_HEIGHT);
    const increase = (Math.PI * 2) / (stepLength * 2);
    let counter = 4.75;
    
    // Criar steps (baseado no código original)
    const steps: HTMLDivElement[] = [];
    for (let i = 0; i < stepLength; i++) {
      const step = document.createElement('div');
      step.className = 'genie-step';
      
      // Calcular background position (do código original)
      const bgy = diffT - (i * STEP_HEIGHT);
      
      // Calcular posição e largura com curva seno (baseado no código original)
      // Os steps são posicionados relativos ao elemento genie (que está na posição da janela)
      // Mas começam visualmente do ícone através do background-position
      const left = Math.ceil((Math.sin(counter) * radiansLeft) + radiansLeft);
      const width = Math.ceil((Math.sin(counter) * radiansWidth) - rwOffset);
      
      step.style.position = 'absolute';
      step.style.top = `${i * STEP_HEIGHT}px`;
      step.style.height = `${STEP_HEIGHT + 1}px`;
      step.style.backgroundPosition = `0px ${bgy}px`;
      step.style.left = `${left}px`;
      step.style.width = `${width}px`;
      step.style.backgroundRepeat = 'no-repeat';
      step.style.backgroundImage = 'inherit';
      step.style.backgroundSize = '100%';
      
      genieEl.appendChild(step);
      steps.push(step);
      counter += increase;
    }
    
    // Adicionar listener para transição
    let transitionHandled = false;
    const handleTransitionEnd = (e: TransitionEvent) => {
      if (transitionHandled) return;
      
      if (e.propertyName === 'background-position' || 
          e.propertyName === 'background-position-x' || 
          e.propertyName === 'background-position-y') {
        if (genieEl.classList.contains('expand')) {
          // Alinhar steps
          steps.forEach(step => {
            step.style.left = '0px';
            step.style.width = `${targetDimFinal.w}px`;
          });
          genieEl.classList.add('fan');
          
          // Aguardar animação de width
          const handleWidthTransition = (e: TransitionEvent) => {
            if (e.propertyName === 'width' && !transitionHandled) {
              transitionHandled = true;
              genieEl.style.backgroundPosition = '0px 0px';
              setTimeout(() => {
                genieEl.remove();
                onComplete?.();
                resolve();
              }, 0);
              steps[steps.length - 1].removeEventListener('transitionend', handleWidthTransition);
            }
          };
          
          prefixedEvent(steps[steps.length - 1], 'transitionend', handleWidthTransition);
        }
      }
    };
    
    prefixedEvent(steps[steps.length - 1], 'transitionend', handleTransitionEnd);
    
    // Iniciar animação após delay
    setTimeout(() => {
      const sDim = sourceDim;
      const tDim = targetDimFinal;
      
      steps.forEach((step, i) => {
        const t = i * STEP_HEIGHT;
        const bgy = ((t - 2) / (tDim.h - STEP_HEIGHT)) * 100;
        step.style.backgroundPosition = `0% ${bgy}%`;
      });
      
      sourceElement.style.backgroundPosition = `0 -${sDim.h + 10}px`;
      genieEl.classList.add('expand');
    }, 100);
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
    
    // IMPORTANTE: Capturar conteúdo da janela ANTES de ocultá-la
    // Garantir que a janela esteja visível para captura
    const wasHidden = sourceElement.style.visibility === 'hidden' || 
                      window.getComputedStyle(sourceElement).visibility === 'hidden';
    if (wasHidden) {
      sourceElement.style.visibility = 'visible';
      sourceElement.style.opacity = '1';
      // Aguardar renderização
      await new Promise(r => requestAnimationFrame(r));
    }
    
    // Capturar conteúdo da janela enquanto visível
    const windowBg = await captureWindowContent(sourceElement);
    
    // Criar elemento genie ANTES de ocultar a janela
    const genieEl = document.createElement('div');
    genieEl.className = 'genie';
    genieEl.style.position = 'fixed';
    genieEl.style.display = 'block';
    genieEl.style.backgroundRepeat = 'no-repeat';
    genieEl.style.backgroundSize = 'cover';
    genieEl.style.cursor = 'pointer';
    genieEl.style.zIndex = '10000';
    genieEl.style.pointerEvents = 'none';
    
    // Copiar posição e tamanho da janela
    genieEl.style.width = `${sourceDim.w}px`;
    genieEl.style.height = `${sourceDim.h}px`;
    genieEl.style.top = `${sourceDim.t}px`;
    genieEl.style.left = `${sourceDim.l}px`;
    genieEl.style.backgroundPosition = '0 -9999px';
    
    if (windowBg) {
      if (windowBg.startsWith('data:') || windowBg.startsWith('http')) {
        genieEl.style.backgroundImage = `url(${windowBg})`;
      } else {
        genieEl.style.backgroundImage = windowBg;
      }
    } else {
      genieEl.style.backgroundColor = window.getComputedStyle(sourceElement).backgroundColor || 'rgba(255, 255, 255, 0.9)';
    }
    
    // Adicionar genie ao DOM ANTES de ocultar a janela
    document.body.appendChild(genieEl);
    
    // Aguardar um frame para garantir que o genie está renderizado
    await new Promise(r => requestAnimationFrame(r));
    
    // AGORA ocultar a janela para a animação (genie já está visível)
    sourceElement.style.visibility = 'hidden';
    sourceElement.style.opacity = '0';
    
    const stepLength = Math.ceil((targetDim.t - sourceDim.t) / STEP_HEIGHT);
    const steps: HTMLDivElement[] = [];
    
    // Criar steps iniciais
    for (let i = 0; i < stepLength; i++) {
      const step = document.createElement('div');
      step.className = 'genie-step';
      const top = i * STEP_HEIGHT;
      const bgPos = `0px ${(((top + STEP_HEIGHT) / sourceDim.h) * 100)}%`;
      
      step.style.position = 'absolute';
      step.style.left = '0px';
      step.style.top = `${top}px`;
      step.style.width = `${sourceDim.w}px`;
      step.style.height = `${STEP_HEIGHT + 1}px`;
      step.style.backgroundPosition = bgPos;
      step.style.backgroundRepeat = 'no-repeat';
      step.style.backgroundImage = 'inherit';
      step.style.backgroundSize = '100%';
      
      genieEl.appendChild(step);
      steps.push(step);
    }
    
    genieEl.classList.add('collapse');
    
    targetElement.classList.remove('genie-thumb');
    targetElement.classList.add('paced-thumb');
    
    let transitionHandled = false;
    
    // Animar colapso - calcular para ir ao centro do ícone do dock
    setTimeout(() => {
      const sourceCenter = {
        x: sourceDim.l + sourceDim.w / 2,
        y: sourceDim.t + sourceDim.h / 2
      };
      const targetCenter = getElementCenter(targetElement);
      
      if (!targetCenter) {
        genieEl.remove();
        onComplete?.();
        resolve();
        return;
      }
      
      const diffL = targetCenter.x - sourceCenter.x;
      const diffW = targetDim.w - sourceDim.w;
      
      const radiansLeft = Math.floor(Math.abs(diffL) / 2);
      const radiansWidth = Math.floor(Math.abs(diffW) / 2);
      const rwOffset = radiansWidth - targetDim.w;
      const increase = (Math.PI * 2) / (stepLength * 2);
      let counter = 4.7;
      
      // Calcular posição final: embaixo do ícone com largura máxima de 10px
      const targetCenterX = targetCenter.x;
      const finalWidth = 10; // Largura máxima final
      
      steps.forEach((step, i) => {
        const progress = i / stepLength;
        // Interpolar largura: começa com largura da janela e termina com 10px
        const startWidth = sourceDim.w;
        const currentWidth = startWidth - ((startWidth - finalWidth) * progress);
        
        // Aplicar curva seno para suavizar
        const sineOffset = Math.sin(counter) * radiansLeft;
        const widthOffset = Math.sin(counter) * radiansWidth;
        
        // Calcular posição final: centro do ícone menos metade da largura
        const finalLeft = targetCenterX - (finalWidth / 2);
        const currentLeftFinal = sourceCenter.x - (sourceDim.w / 2) + ((finalLeft - (sourceCenter.x - sourceDim.w / 2)) * progress);
        
        step.style.left = `${Math.ceil(currentLeftFinal + sineOffset)}px`;
        // Garantir que no final seja 10px
        const finalStepWidth = progress >= 0.95 ? finalWidth : Math.max(1, Math.ceil(currentWidth + widthOffset - rwOffset));
        step.style.width = `${finalStepWidth}px`;
        counter += increase;
      });
      
      const handleTransitionEnd = (e: TransitionEvent) => {
        if (transitionHandled) return;
        
        if (e.propertyName === 'left') {
          if (genieEl.classList.contains('collapse')) {
            // Ajustar para terminar exatamente embaixo do ícone
            const targetBottom = targetDim.t + targetDim.h;
            const diffT = targetBottom - sourceDim.t;
            steps.forEach((step, i) => {
              const stepHeight = step.offsetHeight;
              step.style.backgroundPosition = `0px ${diffT + i - (i * stepHeight)}px`;
            });
            targetElement.style.backgroundPosition = '0px 0px';
            genieEl.classList.add('change-pace');
            genieEl.style.height = '0px';
            
            // Garantir que o último step tenha exatamente 10px de largura
            if (steps.length > 0) {
              const lastStep = steps[steps.length - 1];
              lastStep.style.width = '10px';
              const targetCenterX = targetCenter.x;
              lastStep.style.left = `${targetCenterX - 5}px`; // Centralizar os 10px no centro do ícone
            }
            
            // Aguardar animação de background-position final
            const handleBgTransition = (e: TransitionEvent) => {
              if ((e.propertyName === 'background-position' || 
                   e.propertyName === 'background-position-x' || 
                   e.propertyName === 'background-position-y') && !transitionHandled) {
                transitionHandled = true;
                targetElement.classList.remove('paced-thumb');
                targetElement.classList.add('genie-thumb');
                genieEl.classList.remove('change-pace');
                genieEl.classList.remove('collapse');
                genieEl.innerHTML = '';
                genieEl.remove();
                onComplete?.();
                resolve();
                steps[steps.length - 1].removeEventListener('transitionend', handleBgTransition);
              }
            };
            
            prefixedEvent(steps[steps.length - 1], 'transitionend', handleBgTransition);
          }
        }
      };
      
      prefixedEvent(steps[steps.length - 1], 'transitionend', handleTransitionEnd);
    }, 100);
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
    
    // Capturar estilos originais
    const originalTransition = element.style.transition;
    const originalTransform = element.style.transform;
    const originalOpacity = element.style.opacity;
    
    // Aplicar animação pop
    element.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
    element.style.transform = 'scale(0.8)';
    element.style.opacity = '0';
    
    // Aguardar animação terminar
    const handleTransitionEnd = (e: TransitionEvent) => {
      if (e.target === element && (e.propertyName === 'transform' || e.propertyName === 'opacity')) {
        element.removeEventListener('transitionend', handleTransitionEnd);
        element.style.transition = originalTransition;
        element.style.transform = originalTransform;
        element.style.opacity = originalOpacity;
        onComplete?.();
        resolve();
      }
    };
    
    element.addEventListener('transitionend', handleTransitionEnd);
    
    // Fallback timeout
    setTimeout(() => {
      element.removeEventListener('transitionend', handleTransitionEnd);
      element.style.transition = originalTransition;
      element.style.transform = originalTransform;
      element.style.opacity = originalOpacity;
      onComplete?.();
      resolve();
    }, 300);
  });
};

// Aliases para compatibilidade
export const genieMinimize = genieCollapse;
export const genieRestore = genieExpand;
