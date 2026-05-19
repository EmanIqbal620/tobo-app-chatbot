import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility functions for theme management and general use
 */

// Utility for merging class names with Tailwind CSS
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Check if reduced motion is preferred by user
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Get luminance of a color to determine if it's light or dark
export const getColorLuminance = (hexColor: string): number => {
  // Remove # if present
  const hex = hexColor.replace('#', '');

  // Convert hex to RGB
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;

  // Apply sRGB transformation
  const RsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const GsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const BsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  // Calculate relative luminance
  return 0.2126 * RsRGB + 0.7152 * GsRGB + 0.0722 * BsRGB;
};

// Determine if a color is light or dark based on luminance
export const isLightColor = (hexColor: string): boolean => {
  return getColorLuminance(hexColor) > 0.5;
};

// Calculate contrast ratio between two colors
export const getContrastRatio = (color1: string, color2: string): number => {
  const lum1 = getColorLuminance(color1);
  const lum2 = getColorLuminance(color2);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
};

// Check if contrast meets WCAG AA standards
export const meetsWcagAA = (foregroundColor: string, backgroundColor: string, largeText: boolean = false): boolean => {
  const ratio = getContrastRatio(foregroundColor, backgroundColor);

  // For normal text, we need 4.5:1 ratio
  // For large text (18pt+ or 14pt+ bold), we need 3:1 ratio
  const requiredRatio = largeText ? 3 : 4.5;

  return ratio >= requiredRatio;
};

// Validate all text elements meet WCAG AA standards
export const validateThemeContrast = (theme: any): { isValid: boolean; issues: Array<{ element: string; fgColor: string; bgColor: string; ratio: number }> } => {
  const issues: Array<{ element: string; fgColor: string; bgColor: string; ratio: number }> = [];

  // Check primary text on background
  if (!meetsWcagAA(theme.colors.text.primary, theme.colors.background)) {
    issues.push({
      element: 'primary text on background',
      fgColor: theme.colors.text.primary,
      bgColor: theme.colors.background,
      ratio: getContrastRatio(theme.colors.text.primary, theme.colors.background)
    });
  }

  // Check secondary text on background
  if (!meetsWcagAA(theme.colors.text.secondary, theme.colors.background)) {
    issues.push({
      element: 'secondary text on background',
      fgColor: theme.colors.text.secondary,
      bgColor: theme.colors.background,
      ratio: getContrastRatio(theme.colors.text.secondary, theme.colors.background)
    });
  }

  // Check primary text on surface
  if (!meetsWcagAA(theme.colors.text.primary, theme.colors.surface)) {
    issues.push({
      element: 'primary text on surface',
      fgColor: theme.colors.text.primary,
      bgColor: theme.colors.surface,
      ratio: getContrastRatio(theme.colors.text.primary, theme.colors.surface)
    });
  }

  // Check secondary text on surface
  if (!meetsWcagAA(theme.colors.text.secondary, theme.colors.surface)) {
    issues.push({
      element: 'secondary text on surface',
      fgColor: theme.colors.text.secondary,
      bgColor: theme.colors.surface,
      ratio: getContrastRatio(theme.colors.text.secondary, theme.colors.surface)
    });
  }

  return {
    isValid: issues.length === 0,
    issues
  };
};

// Generate a CSS variable string for theme colors
export const generateThemeCssVariables = (theme: any): string => {
  const cssVars: string[] = [];

  // Recursively traverse theme object to extract color values
  const extractColors = (obj: any, prefix: string = ''): void => {
    Object.entries(obj).forEach(([key, value]) => {
      const varName = prefix ? `${prefix}-${key}` : key;

      if (typeof value === 'string' && /^#[0-9A-F]{6}$/i.test(value)) {
        // It's a hex color
        cssVars.push(`--${varName}: ${value};`);
      } else if (typeof value === 'object' && value !== null) {
        // It's an object, recurse
        extractColors(value, varName);
      }
    });
  };

  extractColors(theme.colors);

  return cssVars.join('\n');
};

// Get theme-appropriate box-shadow based on current theme
export const getThemeShadow = (themeMode: 'light' | 'dark', shadowType: 'soft' | 'card' = 'soft'): string => {
  if (themeMode === 'dark') {
    switch (shadowType) {
      case 'card':
        return '0 4px 12px rgba(0, 0, 0, 0.2)';
      default:
        return '0 2px 8px rgba(0, 0, 0, 0.15)';
    }
  } else {
    switch (shadowType) {
      case 'card':
        return '0 4px 12px rgba(0, 0, 0, 0.1)';
      default:
        return '0 2px 8px rgba(0, 0, 0, 0.08)';
    }
  }
};

// Debounce function for performance optimization
export const debounce = <T extends (...args: any[]) => any>(func: T, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>): void {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for performance optimization
export const throttle = <T extends (...args: any[]) => any>(func: T, limit: number) => {
  let inThrottle: boolean;
  return function executedFunction(...args: Parameters<T>): void {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};