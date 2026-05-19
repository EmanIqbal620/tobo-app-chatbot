/**
 * Color Utilities and Contrast Ratio Validation
 * Functions for calculating color contrast ratios and validating WCAG compliance
 */

/**
 * Converts a hex color to RGB values
 * @param hex - Hex color string (#RRGGBB or #RGB)
 * @returns Object with r, g, b values or null if invalid
 */
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/**
 * Converts an RGB object to hex color string
 * @param rgb - Object with r, g, b values
 * @returns Hex color string
 */
export const rgbToHex = (rgb: { r: number; g: number; b: number }): string => {
  return '#' + [rgb.r, rgb.g, rgb.b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

/**
 * Calculates the relative luminance of a color
 * @param color - RGB color object
 * @returns Relative luminance value (0-1)
 */
export const relativeLuminance = (color: { r: number; g: number; b: number }): number => {
  // Convert RGB values to sRGB
  const RsRGB = color.r / 255;
  const GsRGB = color.g / 255;
  const BsRGB = color.b / 255;

  // Convert to linear RGB
  const R = RsRGB <= 0.03928 ? RsRGB / 12.92 : Math.pow((RsRGB + 0.055) / 1.055, 2.4);
  const G = GsRGB <= 0.03928 ? GsRGB / 12.92 : Math.pow((GsRGB + 0.055) / 1.055, 2.4);
  const B = BsRGB <= 0.03928 ? BsRGB / 12.92 : Math.pow((BsRGB + 0.055) / 1.055, 2.4);

  // Calculate relative luminance
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};

/**
 * Calculates the contrast ratio between two colors
 * @param color1 - First color (foreground)
 * @param color2 - Second color (background)
 * @returns Contrast ratio (1-21)
 */
export const contrastRatio = (
  color1: { r: number; g: number; b: number },
  color2: { r: number; g: number; b: number }
): number => {
  const lum1 = relativeLuminance(color1);
  const lum2 = relativeLuminance(color2);

  // Ensure the brighter color is in the numerator
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
};

/**
 * Validates if two colors meet WCAG contrast requirements
 * @param fgColor - Foreground color (hex or RGB)
 * @param bgColor - Background color (hex or RGB)
 * @param size - Text size in pixels ('small' < 18px, 'large' >= 18px or bold >= 14px)
 * @param weight - Font weight ('normal' or 'bold')
 * @returns Object with WCAG compliance information
 */
export const validateContrast = (
  fgColor: string | { r: number; g: number; b: number },
  bgColor: string | { r: number; g: number; b: number },
  size: 'small' | 'large' = 'small',
  weight: 'normal' | 'bold' = 'normal'
): {
  ratio: number;
  isAACompliant: boolean;
  isAAACompliant: boolean;
  minRequiredRatio: number;
  message: string;
} => {
  // Convert hex colors to RGB if needed
  const fgRgb = typeof fgColor === 'string' ? hexToRgb(fgColor) : fgColor;
  const bgRgb = typeof bgColor === 'string' ? hexToRgb(bgColor) : bgColor;

  if (!fgRgb || !bgRgb) {
    return {
      ratio: 0,
      isAACompliant: false,
      isAAACompliant: false,
      minRequiredRatio: 0,
      message: 'Invalid color format',
    };
  }

  const ratio = contrastRatio(fgRgb, bgRgb);

  // Determine minimum required ratio based on WCAG guidelines
  let aaRequired = 4.5; // Default AA requirement for small text
  let aaaRequired = 7.0; // Default AAA requirement for small text

  // Adjust for large text (>= 18px or bold >= 14px)
  if (size === 'large' || (weight === 'bold' && size === 'small')) {
    aaRequired = 3.0;
    aaaRequired = 4.5;
  }

  const isAACompliant = ratio >= aaRequired;
  const isAAACompliant = ratio >= aaaRequired;

  let message = '';
  if (isAAACompliant) {
    message = `Meets WCAG AAA standards (ratio: ${ratio.toFixed(2)}, required: ${aaaRequired}:1)`;
  } else if (isAACompliant) {
    message = `Meets WCAG AA standards (ratio: ${ratio.toFixed(2)}, required: ${aaRequired}:1)`;
  } else {
    message = `Does not meet WCAG AA standards (ratio: ${ratio.toFixed(2)}, required: ${aaRequired}:1)`;
  }

  return {
    ratio,
    isAACompliant,
    isAAACompliant,
    minRequiredRatio: aaRequired,
    message,
  };
};

/**
 * Finds a color that meets contrast requirements against a background
 * @param bgColor - Background color
 * @param targetRatio - Desired contrast ratio
 * @param isForegroundColor - Whether to return a foreground color (true) or background color (false)
 * @returns A color that meets the contrast requirement
 */
export const findContrastingColor = (
  bgColor: string | { r: number; g: number; b: number },
  targetRatio: number = 4.5,
  isForegroundColor: boolean = true
): string => {
  const bgRgb = typeof bgColor === 'string' ? hexToRgb(bgColor) : bgColor;

  if (!bgRgb) {
    return '#000000'; // Default to black if invalid color
  }

  // Start with the opposite extreme
  const candidateColor = isForegroundColor
    ? { r: 255, g: 255, b: 255 } // White for foreground
    : { r: 0, g: 0, b: 0 }; // Black for background

  let ratio = contrastRatio(candidateColor, bgRgb);
  if (isForegroundColor) {
    ratio = contrastRatio(candidateColor, bgRgb);
  } else {
    ratio = contrastRatio(bgRgb, candidateColor);
  }

  // If we already meet the requirement, return the color
  if (ratio >= targetRatio) {
    return rgbToHex(candidateColor);
  }

  // Binary search to find a suitable color
  let low = 0;
  let high = 255;
  let mid = 128;

  while (high - low > 1) {
    mid = Math.floor((low + high) / 2);

    // Adjust the color channel that's furthest from the extremes
    const testColor = { ...candidateColor };
    testColor.r = mid;
    testColor.g = mid;
    testColor.b = mid;

    const testRatio = isForegroundColor
      ? contrastRatio(testColor, bgRgb)
      : contrastRatio(bgRgb, testColor);

    if (testRatio >= targetRatio) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return rgbToHex({ r: high, g: high, b: high });
};

/**
 * Validates all color pairs in a theme object
 * @param theme - Theme object with color properties
 * @returns Array of contrast validation results
 */
export const validateThemeContrast = (theme: any): Array<{
  element: string;
  foreground: string;
  background: string;
  result: ReturnType<typeof validateContrast>;
}> => {
  const results: Array<{
    element: string;
    foreground: string;
    background: string;
    result: ReturnType<typeof validateContrast>;
  }> = [];

  if (!theme || !theme.colors) {
    return results;
  }

  const colors = theme.colors;

  // Define color pairs to validate
  const colorPairs = [
    { element: 'primary text on background', fg: colors.text?.primary, bg: colors.background },
    { element: 'secondary text on background', fg: colors.text?.secondary, bg: colors.background },
    { element: 'primary text on surface', fg: colors.text?.primary, bg: colors.surface },
    { element: 'secondary text on surface', fg: colors.text?.secondary, bg: colors.surface },
    { element: 'accent text on background', fg: colors.accent, bg: colors.background },
    { element: 'accent text on surface', fg: colors.accent, bg: colors.surface },
  ];

  colorPairs.forEach(pair => {
    if (pair.fg && pair.bg) {
      const result = validateContrast(pair.fg, pair.bg, 'small', 'normal');
      results.push({
        element: pair.element,
        foreground: pair.fg,
        background: pair.bg,
        result,
      });
    }
  });

  return results;
};

/**
 * Gets WCAG compliance level for a contrast ratio
 * @param ratio - Contrast ratio value
 * @param size - Text size ('small' or 'large')
 * @param weight - Font weight ('normal' or 'bold')
 * @returns WCAG compliance level ('AAA', 'AA', 'A', or 'fail')
 */
export const getWcagLevel = (
  ratio: number,
  size: 'small' | 'large' = 'small',
  weight: 'normal' | 'bold' = 'normal'
): 'AAA' | 'AA' | 'A' | 'fail' => {
  const isLarge = size === 'large' || (weight === 'bold' && size === 'small');

  if (isLarge) {
    if (ratio >= 4.5) return 'AAA';
    if (ratio >= 3.0) return 'AA';
  } else {
    if (ratio >= 7.0) return 'AAA';
    if (ratio >= 4.5) return 'AA';
  }

  return 'fail';
};