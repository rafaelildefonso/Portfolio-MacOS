// Liquid Glass Effect for elements with 'liquid-glass-effect' class
// Based on original work by Shu Ding (https://github.com/shuding/liquid-glass)

(function() {
  'use strict';
  
  // Global instance management
  window.liquidGlass = {
    shaders: [],
    destroy() {
      this.shaders.forEach(shader => shader.destroy());
      this.shaders = [];
    }
  };
  
  // Utility functions
  function smoothStep(a, b, t) {
    t = Math.max(0, Math.min(1, (t - a) / (b - a)));
    return t * t * (3 - 2 * t);
  }

  function length(x, y) {
    return Math.sqrt(x * x + y * y);
  }

  function roundedRectSDF(x, y, width, height, radius) {
    const qx = Math.abs(x) - width + radius;
    const qy = Math.abs(y) - height + radius;
    return Math.min(Math.max(qx, qy), 0) + length(Math.max(qx, 0), Math.max(qy, 0)) - radius;
  }

  function texture(x, y) {
    return { type: 't', x, y };
  }

  function generateId() {
    return 'lg-' + Math.random().toString(36).substr(2, 9);
  }

  // Shader class for each element
  class Shader {
    constructor(options = {}) {
      this.width = options.width || 100;
      this.height = options.height || 100;
      this.canvasDPI = 1;
      this.id = generateId();
      this.intensity = 0.5; // Reduz a intensidade do efeito
      
      this.createElement();
    }

    createElement() {
      // Create container
      this.container = document.createElement('div');
      this.container.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
        backdrop-filter: url(#${this.id}_filter) blur(0.5px) brightness(1.1) saturate(1.1);
        -webkit-backdrop-filter: url(#${this.id}_filter) blur(0.5px) brightness(1.1) saturate(1.1);
      `;

      // Create SVG filter
      this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      this.svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      this.svg.setAttribute('width', '0');
      this.svg.setAttribute('height', '0');
      this.svg.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 9998;
      `;

      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
      filter.setAttribute('id', `${this.id}_filter`);
      filter.setAttribute('filterUnits', 'userSpaceOnUse');
      filter.setAttribute('colorInterpolationFilters', 'sRGB');
      filter.setAttribute('x', '0');
      filter.setAttribute('y', '0');
      filter.setAttribute('width', this.width.toString());
      filter.setAttribute('height', this.height.toString());

      this.feImage = document.createElementNS('http://www.w3.org/2000/svg', 'feImage');
      this.feImage.setAttribute('id', `${this.id}_map`);
      this.feImage.setAttribute('width', this.width.toString());
      this.feImage.setAttribute('height', this.height.toString());

      this.feDisplacementMap = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
      this.feDisplacementMap.setAttribute('in', 'SourceGraphic');
      this.feDisplacementMap.setAttribute('in2', `${this.id}_map`);
      this.feDisplacementMap.setAttribute('xChannelSelector', 'R');
      this.feDisplacementMap.setAttribute('yChannelSelector', 'G');

      filter.appendChild(this.feImage);
      filter.appendChild(this.feDisplacementMap);
      defs.appendChild(filter);
      this.svg.appendChild(defs);

      // Create canvas for displacement map (hidden)
      this.canvas = document.createElement('canvas');
      this.canvas.width = this.width * this.canvasDPI;
      this.canvas.height = this.height * this.canvasDPI;
      this.canvas.style.display = 'none';

      this.context = this.canvas.getContext('2d');
    }

    constrainPosition(x, y) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Calculate boundaries with offset
      const minX = this.offset;
      const maxX = viewportWidth - this.width - this.offset;
      const minY = this.offset;
      const maxY = viewportHeight - this.height - this.offset;
      
      // Constrain position
      const constrainedX = Math.max(minX, Math.min(maxX, x));
      const constrainedY = Math.max(minY, Math.min(maxY, y));
      
      return { x: constrainedX, y: constrainedY };
    }


    updateShader() {

      const w = this.width * this.canvasDPI;
      const h = this.height * this.canvasDPI;
      const data = new Uint8ClampedArray(w * h * 4);

      let maxScale = 0;
      const rawValues = [];

      for (let i = 0; i < data.length; i += 4) {
        const x = (i / 4) % w;
        const y = Math.floor(i / 4 / w);
        
        // Create liquid effect
        const ix = x / w - 0.5;
        const iy = y / h - 0.5;
        const distanceToEdge = roundedRectSDF(ix, iy, 0.3, 0.2, 0.6);
        const displacement = smoothStep(0.8, 0, distanceToEdge - 0.15);
        const scaled = smoothStep(0, 1, displacement);
        const pos = texture(ix * scaled + 0.5, iy * scaled + 0.5);
        
        const dx = pos.x * w - x;
        const dy = pos.y * h - y;
        maxScale = Math.max(maxScale, Math.abs(dx), Math.abs(dy));
        rawValues.push(dx, dy);
      }

      maxScale *= 0.5;

      let index = 0;
      for (let i = 0; i < data.length; i += 4) {
        const r = rawValues[index++] / maxScale + 0.5;
        const g = rawValues[index++] / maxScale + 0.5;
        data[i] = r * 255;
        data[i + 1] = g * 255;
        data[i + 2] = 0;
        data[i + 3] = 255;
      }

      this.context.putImageData(new ImageData(data, w, h), 0, 0);
      this.feImage.setAttributeNS('http://www.w3.org/1999/xlink', 'href', this.canvas.toDataURL());
      this.feDisplacementMap.setAttribute('scale', (maxScale / this.canvasDPI).toString());
    }

    appendTo(parent) {
      parent.appendChild(this.svg);
      parent.appendChild(this.container);
    }

    destroy() {
      this.svg.remove();
      this.container.remove();
      this.canvas.remove();
    }
  }

  // Apply effect to all elements with the liquid-glass-effect class
  function initLiquidGlass() {
    const elements = document.querySelectorAll('.liquid-glass-effect');
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const shader = new Shader({
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      });

      // Configure shader element
      shader.container.style.position = 'absolute';
      shader.container.style.top = '0';
      shader.container.style.left = '0';
      shader.container.style.width = '100%';
      shader.container.style.height = '100%';
      
      // Ensure parent has position relative
      if (getComputedStyle(el).position === 'static') {
        el.style.position = 'relative';
      }
      
      // Add SVG filter to body
      shader.svg.id = shader.id + '_svg';
      document.body.appendChild(shader.svg);
      
      // Add shader to element
      el.appendChild(shader.container);
      
      // Update shader with liquid effect
      shader.updateShader = function() {
        const w = this.width * this.canvasDPI;
        const h = this.height * this.canvasDPI;
        const data = new Uint8ClampedArray(w * h * 4);
        
        for (let i = 0; i < data.length; i += 4) {
          const x = (i / 4) % w;
          const y = Math.floor(i / 4 / w);
          
          // Create subtle liquid effect
          const ix = (x / w - 0.5) * 0.8; // Reduz o deslocamento
          const iy = (y / h - 0.5) * 0.8; // Reduz o deslocamento
          const distanceToEdge = roundedRectSDF(ix, iy, 0.2, 0.1, 0.5);
          const displacement = smoothStep(0.6, 0, distanceToEdge - 0.1) * this.intensity;
          const scaled = smoothStep(0, 0.5, displacement); // Suaviza a transição
          const pos = texture(
            ix * scaled * 0.5 + 0.5, 
            iy * scaled * 0.5 + 0.5
          );
          
          // Convert to displacement map
          data[i] = pos.x * 255;
          data[i + 1] = pos.y * 255;
          data[i + 2] = 0;
          data[i + 3] = 255;
        }
        
        // Apply effect
        this.context.putImageData(new ImageData(data, w, h), 0, 0);
        this.feImage.setAttributeNS('http://www.w3.org/1999/xlink', 'href', this.canvas.toDataURL());
        this.feDisplacementMap.setAttribute('scale', '8');
      };
      
      // Initial update
      shader.updateShader();
      
      // Add to global instance
      window.liquidGlass.shaders.push(shader);
    });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLiquidGlass);
  } else {
    initLiquidGlass();
  }
})();
