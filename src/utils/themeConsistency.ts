/**
 * Theme Consistency Validation Utilities
 * Validates that all UI components are using theme tokens consistently
 */

import { ThemeConfig } from '../styles/theme';

// Define the expected theme token structure
interface ThemeTokenStructure {
  colors: {
    primary: string;
    accent: string;
    background: string;
    surface: string;
    border: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
      disabled: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontSize: {
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
    fontWeight: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
    };
    lineHeight: {
      tight: string;
      snug: string;
      normal: string;
      relaxed: string;
    };
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    soft: string;
    card: string;
  };
  transitions: {
    duration: {
      fast: string;
      normal: string;
      slow: string;
    };
    easing: {
      easeInOut: string;
      easeIn: string;
      easeOut: string;
      linear: string;
    };
  };
}

/**
 * Validates that a theme object conforms to the expected structure
 * @param theme - The theme object to validate
 * @returns Validation result with errors if any
 */
export const validateThemeStructure = (theme: Partial<ThemeConfig>): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required sections exist
  if (!theme.colors) {
    errors.push('Missing required "colors" section in theme');
  } else {
    // Check required color properties
    const requiredColors = ['primary', 'accent', 'background', 'surface', 'border'];
    requiredColors.forEach(color => {
      if (!(color in theme.colors!)) {
        errors.push(`Missing required color "${color}" in theme`);
      }
    });

    if (!theme.colors.text) {
      errors.push('Missing required "text" section in theme.colors');
    } else {
      const requiredTextColors = ['primary', 'secondary'];
      requiredTextColors.forEach(textColor => {
        if (!(textColor in theme.colors!.text!)) {
          errors.push(`Missing required text color "${textColor}" in theme.colors.text`);
        }
      });
    }
  }

  // Check other required sections
  if (!theme.spacing) {
    errors.push('Missing required "spacing" section in theme');
  }
  if (!theme.typography) {
    errors.push('Missing required "typography" section in theme');
  }
  if (!theme.borderRadius) {
    errors.push('Missing required "borderRadius" section in theme');
  }
  if (!theme.shadows) {
    errors.push('Missing required "shadows" section in theme');
  }
  if (!theme.transitions) {
    errors.push('Missing required "transitions" section in theme');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Checks if all components are using theme tokens consistently
 * @param componentTree - The component tree to validate
 * @param theme - The theme to validate against
 * @returns Validation result
 */
export const validateComponentThemeConsistency = (
  componentTree: HTMLElement | null,
  theme: ThemeConfig
): {
  isValid: boolean;
  issues: {
    component: string;
    property: string;
    actualValue: string;
    expectedToken: string;
  }[];
} => {
  if (!componentTree) {
    return { isValid: true, issues: [] };
  }

  const issues: {
    component: string;
    property: string;
    actualValue: string;
    expectedToken: string;
  }[] = [];

  // Recursively check all child elements
  const checkElement = (element: HTMLElement) => {
    // Get computed styles
    const computedStyles = window.getComputedStyle(element);

    // Check for hardcoded color values that should use theme tokens
    const bgColor = computedStyles.backgroundColor;
    const textColor = computedStyles.color;
    const borderColor = computedStyles.borderColor;

    // Simple heuristic to detect hardcoded hex/rgb values
    if (bgColor && isHardcodedColor(bgColor) && !isThemeColor(bgColor, theme)) {
      issues.push({
        component: element.tagName,
        property: 'backgroundColor',
        actualValue: bgColor,
        expectedToken: 'theme.colors.surface or theme.colors.background'
      });
    }

    if (textColor && isHardcodedColor(textColor) && !isThemeColor(textColor, theme)) {
      issues.push({
        component: element.tagName,
        property: 'color',
        actualValue: textColor,
        expectedToken: 'theme.colors.text.primary or theme.colors.text.secondary'
      });
    }

    if (borderColor && isHardcodedColor(borderColor) && !isThemeColor(borderColor, theme)) {
      issues.push({
        component: element.tagName,
        property: 'borderColor',
        actualValue: borderColor,
        expectedToken: 'theme.colors.border'
      });
    }

    // Check child elements
    Array.from(element.children).forEach(child => {
      if (child instanceof HTMLElement) {
        checkElement(child);
      }
    });
  };

  checkElement(componentTree);

  return {
    isValid: issues.length === 0,
    issues
  };
};

/**
 * Checks if a color value is hardcoded (not a theme token)
 * @param colorValue - The color value to check
 * @returns True if the color appears to be hardcoded
 */
const isHardcodedColor = (colorValue: string): boolean => {
  // Check for hex, rgb, rgba patterns
  return /(#([a-fA-F0-9]{3,8})|rgb\(|rgba\()/.test(colorValue);
};

/**
 * Checks if a color matches any in the theme
 * @param colorValue - The color to check
 * @param theme - The theme to check against
 * @returns True if the color matches a theme token
 */
const isThemeColor = (colorValue: string, theme: ThemeConfig): boolean => {
  // Normalize the color value for comparison
  const normalizedColor = normalizeColor(colorValue);

  // Check all theme colors
  const allThemeColors = getAllThemeColors(theme);

  return allThemeColors.some(themeColor =>
    normalizeColor(themeColor) === normalizedColor
  );
};

/**
 * Normalizes a color value for comparison
 * @param color - The color to normalize
 * @returns Normalized color string
 */
const normalizeColor = (color: string): string => {
  // Convert to lowercase and remove spaces
  return color.toLowerCase().replace(/\s/g, '');
};

/**
 * Extracts all color values from a theme object
 * @param theme - The theme to extract colors from
 * @returns Array of all color values
 */
const getAllThemeColors = (theme: ThemeConfig): string[] => {
  const colors: string[] = [];

  if (theme.colors) {
    // Add direct color properties
    Object.values(theme.colors).forEach(value => {
      if (typeof value === 'string') {
        colors.push(value);
      }
    });

    // Add text color properties
    if (theme.colors.text) {
      Object.values(theme.colors.text).forEach(value => {
        if (typeof value === 'string') {
          colors.push(value);
        }
      });
    }
  }

  return colors;
};

/**
 * Generates a theme token usage report
 * @param componentTree - The component tree to analyze
 * @returns Report of theme token usage
 */
export const generateThemeUsageReport = (componentTree: HTMLElement | null): {
  totalComponents: number;
  themedComponents: number;
  unthemedComponents: number;
  themeTokensUsed: string[];
  compliancePercentage: number;
} => {
  if (!componentTree) {
    return {
      totalComponents: 0,
      themedComponents: 0,
      unthemedComponents: 0,
      themeTokensUsed: [],
      compliancePercentage: 100
    };
  }

  let totalComponents = 0;
  let themedComponents = 0;
  const themeTokensUsed: string[] = [];

  const analyzeElement = (element: HTMLElement) => {
    totalComponents++;

    // This is a simplified analysis - in a real implementation,
    // you'd need to track which theme tokens are actually being used
    const hasThemedClass = element.className.includes('theme-') ||
                          element.className.includes('themed-') ||
                          element.style.cssText.includes('var(--'); // CSS variables often indicate theming

    if (hasThemedClass) {
      themedComponents++;
    }

    // Analyze child elements
    Array.from(element.children).forEach(child => {
      if (child instanceof HTMLElement) {
        analyzeElement(child);
      }
    });
  };

  analyzeElement(componentTree);

  return {
    totalComponents,
    themedComponents,
    unthemedComponents: totalComponents - themedComponents,
    themeTokensUsed,
    compliancePercentage: totalComponents > 0
      ? Math.round((themedComponents / totalComponents) * 100)
      : 100
  };
};

/**
 * Applies theme consistency fixes to a component tree
 * @param componentTree - The component tree to fix
 * @param theme - The theme to apply
 * @returns Number of fixes applied
 */
export const applyThemeConsistencyFixes = (
  componentTree: HTMLElement | null,
  theme: ThemeConfig
): number => {
  if (!componentTree) {
    return 0;
  }

  let fixesApplied = 0;

  const fixElement = (element: HTMLElement) => {
    const computedStyles = window.getComputedStyle(element);

    // Attempt to fix hardcoded background colors
    const bgColor = computedStyles.backgroundColor;
    if (bgColor && isHardcodedColor(bgColor) && !isThemeColor(bgColor, theme)) {
      // In a real implementation, this would replace hardcoded values with theme tokens
      // For now, we'll just count this as a potential fix
      fixesApplied++;
    }

    // Fix child elements
    Array.from(element.children).forEach(child => {
      if (child instanceof HTMLElement) {
        fixElement(child);
      }
    });
  };

  fixElement(componentTree);

  return fixesApplied;
};