/**
 * Glassmorphism Utilities
 * Helper functions for glassmorphism effects and theming
 */

// Glassmorphism style generator
export const getGlassStyle = (opacity: number = 0.15, blur: number = 10) => {
  return {
    backgroundColor: `rgba(255, 255, 255, ${opacity})`,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    border: '1px solid rgba(255, 255, 255, 0.18)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
  };
};

// Dark theme glassmorphism style generator
export const getDarkGlassStyle = (opacity: number = 0.25, blur: number = 10) => {
  return {
    backgroundColor: `rgba(30, 30, 46, ${opacity})`,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px 0 rgba(2, 2, 6, 0.37)'
  };
};

// Glassmorphism transition utility
export const glassTransition = (duration: number = 0.3) => {
  return {
    transition: `all ${duration}s cubic-bezier(0.4, 0, 0.2, 1)`
  };
};

// Glassmorphism hover effect
export const glassHoverEffect = (liftAmount: number = 5) => {
  return {
    transform: `translateY(-${liftAmount}px)`,
    boxShadow: '0 12px 40px rgba(31, 38, 135, 0.45)'
  };
};

// Glassmorphism glow effect
export const glassGlowEffect = (color: string = 'rgb(100, 149, 237)', intensity: number = 0.4) => {
  return {
    boxShadow: `0 0 20px rgba(${hexToRgb(color)}, ${intensity})`
  };
};

// Convert hex color to RGB
export const hexToRgb = (hex: string): string => {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ?
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '100, 149, 237'; // Default to cornflower blue
};

// Generate gradient for glassmorphism
export const getGlassGradient = (startColor: string = '#8B5CF6', endColor: string = '#EC4899') => {
  return {
    background: `linear-gradient(135deg, ${startColor} 0%, ${endColor} 100%)`
  };
};

// Apply glassmorphism to element
export const applyGlassmorphism = (element: HTMLElement, options: {
  opacity?: number,
  blur?: number,
  borderColor?: string,
  borderRadius?: string
} = {}) => {
  const {
    opacity = 0.15,
    blur = 10,
    borderColor = 'rgba(255, 255, 255, 0.18)',
    borderRadius = '16px'
  } = options;

  element.style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
  element.style.backdropFilter = `blur(${blur}px)`;
  (element.style as any).webkitBackdropFilter = `blur(${blur}px)`;
  element.style.border = `1px solid ${borderColor}`;
  element.style.borderRadius = borderRadius;
  element.style.boxShadow = '0 8px 32px 0 rgba(31, 38, 135, 0.37)';
};

// Remove glassmorphism from element
export const removeGlassmorphism = (element: HTMLElement) => {
  element.style.backgroundColor = '';
  element.style.backdropFilter = '';
  (element.style as any).webkitBackdropFilter = '';
  element.style.border = '';
  element.style.borderRadius = '';
  element.style.boxShadow = '';
};

// Check if device supports backdrop-filter
export const supportsBackDropFilter = (): boolean => {
  if (typeof window !== 'undefined') {
    const element = document.createElement('div');
    element.style.backdropFilter = 'blur(1px)';
    return element.style.backdropFilter !== '';
  }
  return false;
};

// Fallback for browsers that don't support backdrop-filter
export const getGlassFallbackStyle = (opacity: number = 0.8) => {
  return {
    backgroundColor: `rgba(255, 255, 255, ${opacity})`,
    border: '1px solid rgba(255, 255, 255, 0.18)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
  };
};

// Theme-aware glass style
export const getThemeAwareGlassStyle = (isDarkMode: boolean, opacity: number = 0.15, blur: number = 10) => {
  return isDarkMode ? getDarkGlassStyle(opacity, blur) : getGlassStyle(opacity, blur);
};

// Glassmorphism animation utilities
export const glassAnimations = {
  // Glow animation
  glow: {
    animation: 'glass-glow 2s ease-in-out infinite alternate'
  },

  // Pulse animation
  pulse: {
    animation: 'glass-pulse 2s ease-in-out infinite'
  },

  // Float animation
  float: {
    animation: 'glass-float 3s ease-in-out infinite'
  }
};

// Animation keyframes (to be used in CSS)
export const glassAnimationStyles = `
  @keyframes glass-glow {
    from {
      box-shadow: 0 0 10px rgba(100, 149, 237, 0.2);
    }
    to {
      box-shadow: 0 0 20px rgba(100, 149, 237, 0.4);
    }
  }

  @keyframes glass-pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.02);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes glass-float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0px);
    }
  }
`;

// Glassmorphism accessibility utilities
export const getAccessibleGlassStyle = (isDarkMode: boolean) => {
  const baseStyle = getThemeAwareGlassStyle(isDarkMode, 0.2, 12);

  // Ensure sufficient contrast for accessibility
  if (isDarkMode) {
    return {
      ...baseStyle,
      border: '1px solid rgba(255, 255, 255, 0.15)' // Higher contrast border in dark mode
    };
  } else {
    return {
      ...baseStyle,
      border: '1px solid rgba(0, 0, 0, 0.1)' // Darker border in light mode for contrast
    };
  }
};