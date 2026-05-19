import { useState, useEffect, createContext, useContext } from 'react';
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