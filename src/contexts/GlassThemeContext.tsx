import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface GlassThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const GlassThemeContext = createContext<GlassThemeContextType | undefined>(undefined);

interface GlassThemeProviderProps {
  children: ReactNode;
}

const GlassThemeProvider: React.FC<GlassThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check for saved theme preference in localStorage
    const savedTheme = localStorage.getItem('glass-theme');

    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);

    // Update class on body for CSS targeting
    if (theme === 'dark') {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }

    // Save preference to localStorage
    localStorage.setItem('glass-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      return newTheme;
    });
  };

  const value = {
    theme,
    toggleTheme,
    isDarkMode: theme === 'dark'
  };

  return (
    <GlassThemeContext.Provider value={value}>
      {children}
    </GlassThemeContext.Provider>
  );
};

const useGlassTheme = () => {
  const context = useContext(GlassThemeContext);
  if (context === undefined) {
    throw new Error('useGlassTheme must be used within a GlassThemeProvider');
  }
  return context;
};

export { GlassThemeProvider, useGlassTheme };