/**
 * Theme Configuration for UI Polish & Theme Enhancement
 * Implements the specified color palette and design tokens
 */

export interface ThemeColors {
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
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface ThemeTypography {
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
}

export interface ThemeBorderRadius {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface ThemeShadows {
  soft: string;
  card: string;
}

export interface ThemeTransitions {
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
}

export interface ThemeConfig {
  mode: 'light' | 'dark';
  highContrast: boolean;
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  borderRadius: ThemeBorderRadius;
  shadows: ThemeShadows;
  transitions: ThemeTransitions;
}

// Dark theme configuration
export const darkTheme: ThemeConfig = {
  mode: 'dark',
  highContrast: false,
  colors: {
    primary: '#0D0E0E', // Primary background
    accent: '#4B0076',  // Accent purple
    background: '#0D0E0E',
    surface: '#1A1B1B', // Slightly lighter than main background
    border: 'rgba(255, 255, 255, 0.1)', // Very subtle, low-opacity neutral border
    text: {
      primary: '#FFFFFF', // High-contrast text
      secondary: '#CCCCCC',
      muted: '#999999',
      disabled: '#666666',
    },
  },
  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
  },
  typography: {
    fontSize: {
      sm: '0.875rem',  // 14px
      base: '1rem',    // 16px
      lg: '1.125rem',  // 18px
      xl: '1.25rem',   // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
    },
  },
  borderRadius: {
    sm: '0.375rem',  // 6px - Soft rounded corners
    md: '0.5rem',    // 8px - Soft rounded corners
    lg: '0.75rem',   // 12px - Soft rounded corners
    xl: '1rem',      // 16px - Soft rounded corners
  },
  shadows: {
    soft: '0 2px 8px rgba(0, 0, 0, 0.15)',    // Subtle shadows for depth
    card: '0 4px 12px rgba(0, 0, 0, 0.2)',    // For cards and elevated surfaces
  },
  transitions: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      linear: 'linear',
    },
  },
};

// High contrast dark theme configuration
export const highContrastDarkTheme: ThemeConfig = {
  mode: 'dark',
  highContrast: true,
  colors: {
    primary: '#000000', // High contrast black
    accent: '#FFFF00',  // Bright yellow for high visibility
    background: '#000000',
    surface: '#111111',
    border: '#FFFFFF', // High contrast white border
    text: {
      primary: '#FFFFFF', // White text
      secondary: '#CCCCCC',
      muted: '#AAAAAA',
      disabled: '#666666',
    },
  },
  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
  },
  typography: {
    fontSize: {
      sm: '0.875rem',  // 14px
      base: '1rem',    // 16px
      lg: '1.125rem',  // 18px
      xl: '1.25rem',   // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
    },
  },
  borderRadius: {
    sm: '0.125rem',  // 2px - Minimal rounded corners for clarity
    md: '0.25rem',   // 4px - Minimal rounded corners for clarity
    lg: '0.5rem',    // 8px - Minimal rounded corners for clarity
    xl: '0.75rem',   // 12px - Minimal rounded corners for clarity
  },
  shadows: {
    soft: 'none',    // Remove shadows for clarity
    card: '0 0 0 2px #FFFFFF', // High contrast border instead of shadow
  },
  transitions: {
    duration: {
      fast: '0ms',    // No transitions for reduced motion
      normal: '0ms',  // No transitions for reduced motion
      slow: '0ms',    // No transitions for reduced motion
    },
    easing: {
      easeInOut: 'linear',
      easeIn: 'linear',
      easeOut: 'linear',
      linear: 'linear',
    },
  },
};

// Light theme configuration
export const lightTheme: ThemeConfig = {
  mode: 'light',
  highContrast: false,
  colors: {
    primary: '#FFFFFF', // Light primary background
    accent: '#4B0076',  // Same accent purple
    background: '#FFFFFF',
    surface: '#F8F9FA', // Slightly darker than white
    border: 'rgba(0, 0, 0, 0.1)', // Very subtle, low-opacity neutral border
    text: {
      primary: '#0D0E0E', // High-contrast text
      secondary: '#4A5568',
      muted: '#718096',
      disabled: '#A0AEC0',
    },
  },
  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
  },
  typography: {
    fontSize: {
      sm: '0.875rem',  // 14px
      base: '1rem',    // 16px
      lg: '1.125rem',  // 18px
      xl: '1.25rem',   // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
    },
  },
  borderRadius: {
    sm: '0.375rem',  // 6px - Soft rounded corners
    md: '0.5rem',    // 8px - Soft rounded corners
    lg: '0.75rem',   // 12px - Soft rounded corners
    xl: '1rem',      // 16px - Soft rounded corners
  },
  shadows: {
    soft: '0 2px 8px rgba(0, 0, 0, 0.08)',    // Subtle shadows for depth
    card: '0 4px 12px rgba(0, 0, 0, 0.1)',    // For cards and elevated surfaces
  },
  transitions: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      linear: 'linear',
    },
  },
};

// High contrast light theme configuration
export const highContrastLightTheme: ThemeConfig = {
  mode: 'light',
  highContrast: true,
  colors: {
    primary: '#FFFFFF', // High contrast white
    accent: '#FF0000',  // Bright red for high visibility
    background: '#FFFFFF',
    surface: '#EEEEEE',
    border: '#000000', // High contrast black border
    text: {
      primary: '#000000', // Black text
      secondary: '#333333',
      muted: '#666666',
      disabled: '#999999',
    },
  },
  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
  },
  typography: {
    fontSize: {
      sm: '0.875rem',  // 14px
      base: '1rem',    // 16px
      lg: '1.125rem',  // 18px
      xl: '1.25rem',   // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
    },
  },
  borderRadius: {
    sm: '0.125rem',  // 2px - Minimal rounded corners for clarity
    md: '0.25rem',   // 4px - Minimal rounded corners for clarity
    lg: '0.5rem',    // 8px - Minimal rounded corners for clarity
    xl: '0.75rem',   // 12px - Minimal rounded corners for clarity
  },
  shadows: {
    soft: 'none',    // Remove shadows for clarity
    card: '0 0 0 2px #000000', // High contrast border instead of shadow
  },
  transitions: {
    duration: {
      fast: '0ms',    // No transitions for reduced motion
      normal: '0ms',  // No transitions for reduced motion
      slow: '0ms',    // No transitions for reduced motion
    },
    easing: {
      easeInOut: 'linear',
      easeIn: 'linear',
      easeOut: 'linear',
      linear: 'linear',
    },
  },
};

// Export the default theme (dark theme)
export const themeConfig = darkTheme;

// Export the theme configuration with both light and dark themes
export interface ThemeConfig {
  mode: 'light' | 'dark';
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

// Helper function to get theme based on mode and high contrast preference
export const getTheme = (mode: 'light' | 'dark', highContrast: boolean = false): ThemeConfig => {
  if (highContrast) {
    return mode === 'light' ? highContrastLightTheme : highContrastDarkTheme;
  }
  return mode === 'light' ? lightTheme : darkTheme;
};