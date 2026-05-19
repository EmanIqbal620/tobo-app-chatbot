'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { ThemeConfig, getTheme } from '../styles/theme';

interface ThemeContextType {
  theme: ThemeConfig;
  mode: 'light' | 'dark';
  toggleTheme: () => void;
  setThemeMode: (mode: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Export the context for use in ThemeProvider
export { ThemeContext };

// Theme Provider component
interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    // For SSR, we initialize with 'dark' as default
    if (typeof window === 'undefined') {
      return 'dark';
    }

    // On the client, try to get from localStorage or system preference
    const savedTheme = localStorage.getItem('theme-mode');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }

    return 'dark'; // Default to dark theme
  });

  const [theme, setThemeState] = useState<ThemeConfig>(() => {
    // Initialize with the theme based on the mode determined above
    if (typeof window === 'undefined') {
      return getTheme('dark'); // Default for SSR
    }

    const savedTheme = localStorage.getItem('theme-mode');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return getTheme(savedTheme);
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return getTheme('light');
    }

    return getTheme('dark');
  });

  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize after mount to ensure we're on the client
  useEffect(() => {
    setIsHydrated(true);

    // Update document attributes after hydration
    document.documentElement.setAttribute('data-theme', mode);

    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      const currentTheme = getTheme(mode);
      themeColorMeta.setAttribute('content', mode === 'dark' ? currentTheme.colors.background : '#ffffff');
    }
  }, []);

  // Update theme when mode changes
  useEffect(() => {
    if (!isHydrated) return; // Only run after hydration

    const newTheme = getTheme(mode);
    setThemeState(newTheme);

    // Save theme preference to localStorage
    localStorage.setItem('theme-mode', mode);

    // Update document class for CSS custom properties
    document.documentElement.setAttribute('data-theme', mode);

    // Update meta theme-color for mobile browsers
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', mode === 'dark' ? newTheme.colors.background : '#ffffff');
    }
  }, [mode, isHydrated]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !isHydrated) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't explicitly set a theme
      if (!localStorage.getItem('theme-mode')) {
        setMode(e.matches ? 'light' : 'dark');
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      (mediaQuery as any).addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        (mediaQuery as any).removeListener(handleChange);
      }
    };
  }, [isHydrated]);

  const toggleTheme = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setThemeMode = (newMode: 'light' | 'dark') => {
    setMode(newMode);
  };

  const value = {
    theme,
    mode,
    toggleTheme,
    setThemeMode,
  };

  // If not hydrated, render a minimal structure with consistent styles to prevent mismatch
  if (!isHydrated) {
    return (
      <ThemeContext.Provider value={value}>
        <div className="min-h-screen bg-white dark:bg-gray-900">{children}</div>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};