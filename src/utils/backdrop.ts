/**
 * Glassmorphism Backdrop Utilities
 * Helper functions for managing backdrop effects and blur layers
 */

// Backdrop blur effect generator
export const getBackdropBlur = (intensity: number = 10) => {
  return {
    backdropFilter: `blur(${intensity}px)`,
    WebkitBackdropFilter: `blur(${intensity}px)`,
  };
};

// Glassmorphism backdrop styles
export const getGlassBackdrop = (intensity: number = 10, opacity: number = 0.1) => {
  return {
    backgroundColor: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: `blur(${intensity}px)`,
    WebkitBackdropFilter: `blur(${intensity}px)`,
    border: '1px solid rgba(255, 255, 255, 0.18)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
  };
};

// Dark mode glass backdrop styles
export const getDarkGlassBackdrop = (intensity: number = 10, opacity: number = 0.2) => {
  return {
    backgroundColor: `rgba(30, 30, 46, ${opacity})`,
    backdropFilter: `blur(${intensity}px)`,
    WebkitBackdropFilter: `blur(${intensity}px)`,
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(2, 2, 6, 0.37)',
  };
};

// Apply backdrop effect to element
export const applyBackdropEffect = (element: HTMLElement, options: {
  blurIntensity?: number,
  opacity?: number,
  borderColor?: string,
  borderRadius?: string
} = {}) => {
  const {
    blurIntensity = 10,
    opacity = 0.15,
    borderColor = 'rgba(255, 255, 255, 0.18)',
    borderRadius = '16px'
  } = options;

  element.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
  element.style.backdropFilter = `blur(${blurIntensity}px)`;
  (element.style as any).webkitBackdropFilter = `blur(${blurIntensity}px)`;
  element.style.border = `1px solid ${borderColor}`;
  element.style.borderRadius = borderRadius;
  element.style.boxShadow = '0 8px 32px rgba(31, 38, 135, 0.37)';
};

// Remove backdrop effect from element
export const removeBackdropEffect = (element: HTMLElement) => {
  element.style.backgroundColor = '';
  element.style.backdropFilter = '';
  (element.style as any).webkitBackdropFilter = '';
  element.style.border = '';
  element.style.borderRadius = '';
  element.style.boxShadow = '';
};

// Check if browser supports backdrop-filter
export const supportsBackdropFilter = (): boolean => {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const testEl = document.createElement('div');
    testEl.style.backdropFilter = 'blur(1px)';
    return testEl.style.backdropFilter !== '';
  }
  return false;
};

// Fallback for browsers that don't support backdrop-filter
export const getBackdropFallback = (opacity: number = 0.8) => {
  return {
    backgroundColor: `rgba(255, 255, 255, ${opacity})`,
    border: '1px solid rgba(255, 255, 255, 0.18)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
  };
};

// Theme-aware backdrop effect
export const getThemeAwareBackdrop = (isDarkMode: boolean, intensity: number = 10, opacity: number = 0.15) => {
  return isDarkMode ?
    getDarkGlassBackdrop(intensity, opacity) :
    getGlassBackdrop(intensity, opacity);
};

// Backdrop animation utilities
export const backdropAnimations = {
  // Fade in with backdrop blur
  fadeIn: (intensity: number = 10) => ({
    opacity: 0,
    backdropFilter: `blur(0px)`,
    WebkitBackdropFilter: `blur(0px)`,
    transition: 'all 0.3s ease',
    animate: {
      opacity: 1,
      backdropFilter: `blur(${intensity}px)`,
      WebkitBackdropFilter: `blur(${intensity}px)`,
    }
  }),

  // Slide in with backdrop effect
  slideIn: (intensity: number = 10, direction: 'up' | 'down' | 'left' | 'right' = 'up') => {
    const transforms: Record<string, string> = {
      up: 'translateY(20px)',
      down: 'translateY(-20px)',
      left: 'translateX(20px)',
      right: 'translateX(-20px)'
    };

    return {
      opacity: 0,
      transform: transforms[direction],
      backdropFilter: `blur(0px)`,
      WebkitBackdropFilter: `blur(0px)`,
      transition: 'all 0.3s ease',
      animate: {
        opacity: 1,
        transform: 'translateY(0px)',
        backdropFilter: `blur(${intensity}px)`,
        WebkitBackdropFilter: `blur(${intensity}px)`,
      }
    };
  },

  // Scale in with backdrop effect
  scaleIn: (intensity: number = 10) => ({
    opacity: 0,
    scale: 0.8,
    backdropFilter: `blur(0px)`,
    WebkitBackdropFilter: `blur(0px)`,
    transition: 'all 0.3s ease',
    animate: {
      opacity: 1,
      scale: 1,
      backdropFilter: `blur(${intensity}px)`,
      WebkitBackdropFilter: `blur(${intensity}px)`,
    }
  })
};

// Backdrop overlay utilities
export const backdropOverlays = {
  // Modal backdrop
  modal: (intensity: number = 10) => ({
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: `blur(${intensity}px)`,
    WebkitBackdropFilter: `blur(${intensity}px)`,
  }),

  // Panel backdrop
  panel: (intensity: number = 8, opacity: number = 0.1) => ({
    backgroundColor: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: `blur(${intensity}px)`,
    WebkitBackdropFilter: `blur(${intensity}px)`,
    border: '1px solid rgba(255, 255, 255, 0.18)',
    borderRadius: '12px',
  }),

  // Menu backdrop
  menu: (intensity: number = 6, opacity: number = 0.08) => ({
    backgroundColor: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: `blur(${intensity}px)`,
    WebkitBackdropFilter: `blur(${intensity}px)`,
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '8px',
  })
};

// Apply backdrop to multiple elements
export const applyBackdropToElements = (selector: string, options: {
  blurIntensity?: number,
  opacity?: number,
  borderColor?: string,
  borderRadius?: string
} = {}) => {
  const elements = document.querySelectorAll(selector);

  elements.forEach(element => {
    if (element instanceof HTMLElement) {
      applyBackdropEffect(element, options);
    }
  });
};

// Remove backdrop from multiple elements
export const removeBackdropFromElements = (selector: string) => {
  const elements = document.querySelectorAll(selector);

  elements.forEach(element => {
    if (element instanceof HTMLElement) {
      removeBackdropEffect(element);
    }
  });
};

// Create backdrop element programmatically
export const createBackdropElement = (parent: HTMLElement, options: {
  blurIntensity?: number,
  opacity?: number,
  zIndex?: number,
  className?: string
} = {}) => {
  const {
    blurIntensity = 10,
    opacity = 0.5,
    zIndex = 10,
    className = ''
  } = options;

  const backdrop = document.createElement('div');
  backdrop.className = `glass-backdrop ${className}`;
  backdrop.style.position = 'fixed';
  backdrop.style.top = '0';
  backdrop.style.left = '0';
  backdrop.style.width = '100%';
  backdrop.style.height = '100%';
  backdrop.style.zIndex = zIndex.toString();
  backdrop.style.backdropFilter = `blur(${blurIntensity}px)`;
  (backdrop.style as any).webkitBackdropFilter = `blur(${blurIntensity}px)`;
  backdrop.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;
  backdrop.style.pointerEvents = 'none';

  parent.appendChild(backdrop);

  return backdrop;
};

// Remove backdrop element
export const removeBackdropElement = (backdrop: HTMLElement) => {
  backdrop.remove();
};