/**
 * Theme-Aware Typography System
 * Defines consistent typography scales and styles that adapt to the current theme
 */

export interface TypographyScale {
  xs: string;      // Extra small text (captions, labels)
  sm: string;      // Small text (helper text, secondary info)
  base: string;    // Base text (paragraphs, content)
  lg: string;      // Large text (subheadings, emphasized content)
  xl: string;      // Extra large text (headings, important info)
  '2xl': string;   // 2x extra large (section headings)
  '3xl': string;   // 3x extra large (major headings)
  '4xl': string;   // 4x extra large (hero headings)
}

export interface FontWeight {
  thin: string;
  extralight: string;
  light: string;
  normal: string;
  medium: string;
  semibold: string;
  bold: string;
  extrabold: string;
  black: string;
}

export interface LineHeight {
  none: string;
  tight: string;
  snug: string;
  normal: string;
  relaxed: string;
  loose: string;
}

export interface LetterSpacing {
  tighter: string;
  tight: string;
  normal: string;
  wide: string;
  wider: string;
  widest: string;
}

// Typography scale definitions
export const typographyScale: TypographyScale = {
  xs: '0.75rem',      // 12px
  sm: '0.875rem',     // 14px
  base: '1rem',       // 16px
  lg: '1.125rem',     // 18px
  xl: '1.25rem',      // 20px
  '2xl': '1.5rem',    // 24px
  '3xl': '1.875rem',  // 30px
  '4xl': '2.25rem',   // 36px
};

// Font weights
export const fontWeight: FontWeight = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
};

// Line heights
export const lineHeight: LineHeight = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
};

// Letter spacing
export const letterSpacing: LetterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
};

// Typography hierarchy presets
export const typographyPresets = {
  heading: {
    fontSize: typographyScale['2xl'],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
  },
  subheading: {
    fontSize: typographyScale.lg,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.snug,
  },
  body: {
    fontSize: typographyScale.base,
    fontWeight: fontWeight.normal,
    lineHeight: lineHeight.normal,
  },
  caption: {
    fontSize: typographyScale.xs,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.none,
    textTransform: 'uppercase' as const,
    letterSpacing: letterSpacing.wide,
  },
  label: {
    fontSize: typographyScale.sm,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.tight,
  },
};

// Theme-aware typography utility functions
export const getFontSize = (size: keyof TypographyScale): string => {
  return typographyScale[size];
};

export const getFontWeight = (weight: keyof FontWeight): string => {
  return fontWeight[weight];
};

export const getLineHeight = (height: keyof LineHeight): string => {
  return lineHeight[height];
};

export const getLetterSpacing = (spacing: keyof LetterSpacing): string => {
  return letterSpacing[spacing];
};

// Responsive typography helper
export const getResponsiveTypography = (
  mobile: keyof TypographyScale,
  tablet: keyof TypographyScale,
  desktop: keyof TypographyScale
): { [key: string]: string | { fontSize: string } } => {
  return {
    fontSize: typographyScale[mobile],
    [`@media (min-width: 640px)`]: {
      fontSize: typographyScale[tablet],
    },
    [`@media (min-width: 1024px)`]: {
      fontSize: typographyScale[desktop],
    },
  };
};

// Accessibility-focused typography adjustments
export const getAccessibleTypography = (
  baseSize: keyof TypographyScale,
  highContrast: boolean = false
): { fontSize: string; fontWeight: string } => {
  // Increase font size slightly in high contrast mode for better readability
  if (highContrast) {
    const sizeKeys = Object.keys(typographyScale) as (keyof TypographyScale)[];
    const currentIndex = sizeKeys.indexOf(baseSize);
    const adjustedIndex = Math.min(currentIndex + 1, sizeKeys.length - 1);
    return {
      fontSize: typographyScale[sizeKeys[adjustedIndex]],
      fontWeight: fontWeight.semibold,
    };
  }

  return {
    fontSize: typographyScale[baseSize],
    fontWeight: fontWeight.normal,
  };
};

// Typography utility class generator
export const generateTypographyClasses = (
  preset: keyof typeof typographyPresets,
  additionalClasses: string = ''
): string => {
  const presetStyles = typographyPresets[preset];
  return `${additionalClasses} ${Object.entries(presetStyles)
    .map(([key, value]) => `typography-${preset}-${key}-${value}`)
    .join(' ')}`;
};

// CSS-in-JS styles for theme-aware typography
export const themeAwareTypography = (theme: {
  colors: {
    text: {
      primary: string;
      secondary: string;
      muted: string;
      disabled: string;
    };
  };
  highContrast?: boolean;
}) => {
  return {
    // Heading styles
    heading: {
      color: theme.colors.text.primary,
      fontSize: theme.highContrast
        ? typographyScale['3xl']
        : typographyScale['2xl'],
      fontWeight: fontWeight.bold,
      lineHeight: lineHeight.tight,
      marginBottom: '0.5rem',
    },

    // Body text styles
    body: {
      color: theme.colors.text.primary,
      fontSize: typographyScale.base,
      fontWeight: fontWeight.normal,
      lineHeight: lineHeight.relaxed,
    },

    // Secondary text styles
    secondary: {
      color: theme.colors.text.secondary,
      fontSize: typographyScale.sm,
      fontWeight: fontWeight.normal,
      lineHeight: lineHeight.snug,
    },

    // Muted text styles
    muted: {
      color: theme.colors.text.muted,
      fontSize: typographyScale.xs,
      fontWeight: fontWeight.medium,
      lineHeight: lineHeight.tight,
    },

    // Emphasized text styles
    emphasized: {
      color: theme.colors.text.primary,
      fontWeight: fontWeight.semibold,
      textDecoration: 'underline',
    },

    // Monospace text styles
    monospace: {
      fontFamily: 'Monaco, Menlo, Consolas, "Courier New", monospace',
      fontSize: typographyScale.sm,
      color: theme.colors.text.secondary,
    },
  };
};

// Export everything as a unified typography system
export const typographySystem = {
  scale: typographyScale,
  weight: fontWeight,
  height: lineHeight,
  spacing: letterSpacing,
  presets: typographyPresets,
  getFontSize,
  getFontWeight,
  getLineHeight,
  getLetterSpacing,
  getResponsiveTypography,
  getAccessibleTypography,
  generateTypographyClasses,
  themeAwareTypography,
};

export default typographySystem;