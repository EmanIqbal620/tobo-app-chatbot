/**
 * Theme-Aware Spacing System
 * Defines consistent spacing scales and utilities that adapt to the current theme
 */

export interface SpacingScale {
  none: string;      // 0
  xs: string;        // 0.25rem (4px)
  sm: string;        // 0.5rem (8px)
  md: string;        // 1rem (16px)
  lg: string;        // 1.5rem (24px)
  xl: string;        // 2rem (32px)
  '2xl': string;     // 3rem (48px)
  '3xl': string;     // 4rem (64px)
  '4xl': string;     // 6rem (96px)
  '5xl': string;     // 8rem (128px)
  '6xl': string;     // 10rem (160px)
  '7xl': string;     // 12rem (192px)
  '8xl': string;     // 14rem (224px)
  '9xl': string;     // 16rem (256px)
}

export interface ContainerSpacing {
  padding: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  margin: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export interface ComponentSpacing {
  button: {
    padding: {
      horizontal: string;
      vertical: string;
    };
    gap: string;
  };
  card: {
    padding: string;
    margin: string;
    gap: string;
  };
  input: {
    padding: {
      horizontal: string;
      vertical: string;
    };
    gap: string;
  };
  list: {
    itemGap: string;
    padding: string;
  };
  grid: {
    gap: string;
    columnGap: string;
    rowGap: string;
  };
}

// Spacing scale definitions
export const spacingScale: SpacingScale = {
  none: '0',
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
  '4xl': '6rem',    // 96px
  '5xl': '8rem',    // 128px
  '6xl': '10rem',   // 160px
  '7xl': '12rem',   // 192px
  '8xl': '14rem',   // 224px
  '9xl': '16rem',   // 256px
};

// Container spacing configurations
export const containerSpacing: ContainerSpacing = {
  padding: {
    xs: spacingScale.xs,
    sm: spacingScale.sm,
    md: spacingScale.md,
    lg: spacingScale.lg,
    xl: spacingScale.xl,
  },
  margin: {
    xs: spacingScale.xs,
    sm: spacingScale.sm,
    md: spacingScale.md,
    lg: spacingScale.lg,
    xl: spacingScale.xl,
  },
};

// Component-specific spacing configurations
export const componentSpacing: ComponentSpacing = {
  button: {
    padding: {
      horizontal: spacingScale.md,
      vertical: spacingScale.xs,
    },
    gap: spacingScale.xs,
  },
  card: {
    padding: spacingScale.lg,
    margin: spacingScale.md,
    gap: spacingScale.md,
  },
  input: {
    padding: {
      horizontal: spacingScale.md,
      vertical: spacingScale.sm,
    },
    gap: spacingScale.sm,
  },
  list: {
    itemGap: spacingScale.sm,
    padding: spacingScale.md,
  },
  grid: {
    gap: spacingScale.md,
    columnGap: spacingScale.md,
    rowGap: spacingScale.lg,
  },
};

// Responsive spacing utility
export interface ResponsiveSpacing {
  mobile: string;
  tablet: string;
  desktop: string;
}

export const getResponsiveSpacing = (
  mobile: keyof SpacingScale,
  tablet: keyof SpacingScale,
  desktop: keyof SpacingScale
): ResponsiveSpacing => {
  return {
    mobile: spacingScale[mobile],
    tablet: spacingScale[tablet],
    desktop: spacingScale[desktop],
  };
};

// Dynamic spacing based on theme context
export const getThemedSpacing = (
  baseSpacing: keyof SpacingScale,
  theme?: {
    highContrast?: boolean;
    compactMode?: boolean;
  }
): string => {
  if (!theme) return spacingScale[baseSpacing];

  // Adjust spacing based on theme properties
  if (theme.compactMode) {
    // In compact mode, reduce spacing slightly
    const spacingKeys = Object.keys(spacingScale) as (keyof SpacingScale)[];
    const currentIndex = spacingKeys.indexOf(baseSpacing);
    const adjustedIndex = Math.max(currentIndex - 1, 0);
    return spacingScale[spacingKeys[adjustedIndex]];
  }

  if (theme.highContrast) {
    // In high contrast mode, potentially increase spacing for clarity
    const spacingKeys = Object.keys(spacingScale) as (keyof SpacingScale)[];
    const currentIndex = spacingKeys.indexOf(baseSpacing);
    const adjustedIndex = Math.min(currentIndex + 1, spacingKeys.length - 1);
    return spacingScale[spacingKeys[adjustedIndex]];
  }

  return spacingScale[baseSpacing];
};

// Spacing utility functions
export const getSpacing = (size: keyof SpacingScale): string => {
  return spacingScale[size];
};

export const multiplySpacing = (size: keyof SpacingScale, factor: number): string => {
  const baseValue = parseFloat(spacingScale[size]);
  const unit = spacingScale[size].replace(/^[\d.]+/, '');
  return `${baseValue * factor}${unit}`;
};

export const addSpacing = (size1: keyof SpacingScale, size2: keyof SpacingScale): string => {
  const val1 = parseFloat(spacingScale[size1]);
  const val2 = parseFloat(spacingScale[size2]);
  const unit1 = spacingScale[size1].replace(/^[\d.]+/, '');
  const unit2 = spacingScale[size2].replace(/^[\d.]+/, '');

  // Assuming both use the same unit
  return `${val1 + val2}${unit1}`;
};

export const subtractSpacing = (size1: keyof SpacingScale, size2: keyof SpacingScale): string => {
  const val1 = parseFloat(spacingScale[size1]);
  const val2 = parseFloat(spacingScale[size2]);
  const unit1 = spacingScale[size1].replace(/^[\d.]+/, '');
  const unit2 = spacingScale[size2].replace(/^[\d.]+/, '');

  // Assuming both use the same unit
  const result = Math.max(0, val1 - val2); // Ensure non-negative
  return `${result}${unit1}`;
};

// Spacing presets for common UI patterns
export const spacingPresets = {
  // Card layouts
  card: {
    padding: spacingScale.lg,
    gap: spacingScale.md,
    margin: spacingScale.md,
  },

  // Form layouts
  form: {
    fieldGap: spacingScale.sm,
    sectionGap: spacingScale.lg,
    groupPadding: spacingScale.md,
  },

  // Button groups
  buttonGroup: {
    gap: spacingScale.sm,
    padding: spacingScale.xs,
  },

  // Navigation
  nav: {
    itemGap: spacingScale.md,
    padding: spacingScale.sm,
  },

  // Modal/dialog
  modal: {
    padding: spacingScale.xl,
    gap: spacingScale.lg,
    headerGap: spacingScale.md,
  },

  // List items
  list: {
    itemPadding: spacingScale.md,
    itemGap: spacingScale.sm,
    nestedIndent: spacingScale.lg,
  },

  // Grid layouts
  grid: {
    gap: spacingScale.md,
    smallGap: spacingScale.sm,
    largeGap: spacingScale.xl,
  },
};

// Accessibility-aware spacing adjustments
export const getAccessibleSpacing = (
  baseSpacing: keyof SpacingScale,
  highContrast: boolean = false,
  reducedMotion: boolean = false
): string => {
  if (highContrast) {
    // Increase spacing in high contrast mode for better visual separation
    const spacingKeys = Object.keys(spacingScale) as (keyof SpacingScale)[];
    const currentIndex = spacingKeys.indexOf(baseSpacing);
    const adjustedIndex = Math.min(currentIndex + 1, spacingKeys.length - 1);
    return spacingScale[spacingKeys[adjustedIndex]];
  }

  if (reducedMotion) {
    // Potentially adjust spacing for users who prefer reduced motion
    // (Currently no specific adjustments, but this allows for future expansion)
    return spacingScale[baseSpacing];
  }

  return spacingScale[baseSpacing];
};

// Spacing utility for CSS-in-JS
export const createSpacingStyles = (
  theme: {
    highContrast?: boolean;
    compactMode?: boolean;
  },
  padding?: keyof SpacingScale,
  margin?: keyof SpacingScale,
  gap?: keyof SpacingScale
) => {
  return {
    ...(padding && { padding: getThemedSpacing(padding, theme) }),
    ...(margin && { margin: getThemedSpacing(margin, theme) }),
    ...(gap && { gap: getThemedSpacing(gap, theme) }),
  };
};

// Utility to get spacing with fallback
export const getSafeSpacing = (
  size: keyof SpacingScale | undefined,
  fallback: keyof SpacingScale = 'md'
): string => {
  return size ? spacingScale[size] : spacingScale[fallback];
};

// Export the complete spacing system
export const spacingSystem = {
  scale: spacingScale,
  container: containerSpacing,
  component: componentSpacing,
  presets: spacingPresets,
  getSpacing,
  getResponsiveSpacing,
  getThemedSpacing,
  getAccessibleSpacing,
  multiplySpacing,
  addSpacing,
  subtractSpacing,
  createSpacingStyles,
  getSafeSpacing,
};

export default spacingSystem;