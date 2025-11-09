/**
 * Efeito de animação Genie para minimizar janelas
 */
export const genieMinimize = (
  windowElement: HTMLElement,
  dockIcon: HTMLElement,
  onComplete: () => void
): Promise<void> => {
  console.log('=== genieMinimize chamado ===');
  
  if (!windowElement || !dockIcon) {
    console.error('❌ Elemento da janela ou ícone do dock não encontrado');
    onComplete();
    return Promise.resolve();
  }
  
  // Obter as dimensões iniciais
  const windowRect = windowElement.getBoundingClientRect();
  const dockRect = dockIcon.getBoundingClientRect();
  
  console.log('Posição da janela:', { 
    left: windowRect.left, 
    top: windowRect.top,
    width: windowRect.width,
    height: windowRect.height
  });
  
  console.log('Posição do ícone do dock:', { 
    left: dockRect.left, 
    top: dockRect.top,
    width: dockRect.width,
    height: dockRect.height
  });
  
  // Criar um contêiner para o efeito de genie
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = `${windowRect.left}px`;
  container.style.top = `${windowRect.top}px`;
  container.style.width = `${windowRect.width}px`;
  container.style.height = `${windowRect.height}px`;
  container.style.overflow = 'hidden';
  container.style.zIndex = '9999';
  container.style.pointerEvents = 'none';
  container.style.transformOrigin = 'top center';
  
  // Criar o clone da janela
  const clone = windowElement.cloneNode(true) as HTMLElement;
  clone.style.position = 'absolute';
  clone.style.left = '0';
  clone.style.top = '0';
  clone.style.width = '100%';
  clone.style.height = '100%';
  clone.style.margin = '0';
  clone.style.transform = 'none';
  clone.style.transition = 'none';
  
  // Adicionar o clone ao contêiner e o contêiner ao body
  container.appendChild(clone);
  document.body.appendChild(container);
  
  // Esconder o elemento original
  windowElement.style.opacity = '0';
  windowElement.style.pointerEvents = 'none';
  
  // Calcular as transformações necessárias
  const scaleX = dockRect.width / windowRect.width;
  const scaleY = dockRect.height / windowRect.height;
  // const translateX = dockRect.left - windowRect.left + (dockRect.width / 2) - (windowRect.width / 2);
  // const translateY = dockRect.top - windowRect.top + (dockRect.height / 2) - (windowRect.height / 2);
  
  // Forçar um repaint
  container.offsetHeight;
  
  // Configurar a animação com keyframes para o efeito de genie
  container.style.transition = 'all 500ms cubic-bezier(0.2, 0.7, 0.1, 1)';
  clone.style.transition = 'all 500ms cubic-bezier(0.2, 0.7, 0.1, 1)';
  
  // Adicionar uma borda arredondada para um visual mais suave
  container.style.borderRadius = '4px';
  clone.style.borderRadius = '4px';
  
  // Iniciar a animação
  requestAnimationFrame(() => {
    try {
      // Primeiro estágio: Comprimir a janela horizontalmente
      setTimeout(() => {
        container.style.width = `${windowRect.width * 0.7}px`;
        container.style.left = `${windowRect.left + (windowRect.width * 0.15)}px`;
        clone.style.transform = `scale(${1.4}, 0.8)`;
      }, 0);
      
      // Segundo estágio: Comprimir verticalmente e mover para o ícone
      setTimeout(() => {
        container.style.left = `${dockRect.left}px`;
        container.style.top = `${dockRect.top}px`;
        container.style.width = `${dockRect.width}px`;
        container.style.height = `${dockRect.height}px`;
        
        // Ajustar o clone para manter a proporção correta
        clone.style.transform = `scale(${1.1/scaleX}, ${0.9/scaleY})`;
      }, 150);
      
      // Terceiro estágio: Ajuste final para o tamanho do ícone
      setTimeout(() => {
        clone.style.transform = `scale(${1/scaleX}, ${1/scaleY})`;
      }, 300);
      
      // Quando a animação terminar
      setTimeout(() => {
        console.log('Animação de genie effect concluída');
        // Remover o clone e o contêiner
        if (document.body.contains(container)) {
          document.body.removeChild(container);
        }
        // Chamar o callback de conclusão
        onComplete();
      }, 500);
    } catch (error) {
      console.error('Erro na animação genieMinimize:', error);
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
      onComplete();
    }
  });
  
  return Promise.resolve();
};

/**
 * Efeito de animação Genie para restaurar janelas
 */
export const genieRestore = (
  windowElement: HTMLElement,
  dockIcon: HTMLElement,
  onComplete: () => void
): Promise<void> => {
  console.log('=== genieRestore chamado ===');
  
  if (!windowElement || !dockIcon) {
    console.error('❌ Elemento da janela ou ícone do dock não encontrado');
    onComplete();
    return Promise.resolve();
  }
  
  // Configurar a animação de fade in com escala
  windowElement.style.opacity = '0';
  windowElement.style.transform = 'scale(0.8)';
  windowElement.style.transition = 'opacity 300ms, transform 300ms';
  
  // Forçar um repaint
  windowElement.getBoundingClientRect();
  
  // Mostrar o elemento original com animação
  windowElement.style.opacity = '1';
  windowElement.style.transform = 'scale(1)';
  windowElement.style.pointerEvents = 'auto';
  
  // Chamar o callback de conclusão após a animação
  setTimeout(() => {
    windowElement.style.transition = '';
    onComplete();
  }, 300);
  
  return Promise.resolve();
};
