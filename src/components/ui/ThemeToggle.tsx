'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const ThemeToggle: React.FC = () => {
  const { theme, mode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
      className="relative inline-flex items-center h-8 w-14 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
      style={{
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border
      }}
      title={`Current theme: ${mode}`}
    >
      <motion.span
        className="inline-block w-6 h-6 rounded-full bg-accent-500 shadow-md transform transition-transform duration-300"
        animate={{ x: mode === 'dark' ? 1 : 24 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{ backgroundColor: theme.colors.accent }}
      >
        {mode === 'dark' ? (
          <MoonIcon className="h-4 w-4 m-1 text-text-primary" />
        ) : (
          <SunIcon className="h-4 w-4 m-1 text-text-primary" />
        )}
      </motion.span>
    </button>
  );
};

export default ThemeToggle;