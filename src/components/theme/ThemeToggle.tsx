'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

interface ThemeToggleProps {
  currentTheme: 'light' | 'dark';
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ showLabel = true }) => {
  const { theme, mode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
    >
      {mode === 'light' ? (
        <>
          <MoonIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          {showLabel && <span className="ml-2 text-sm">Dark Mode</span>}
        </>
      ) : (
        <>
          <SunIcon className="h-5 w-5 text-gray-300" />
          {showLabel && <span className="ml-2 text-sm">Light Mode</span>}
        </>
      )}
    </button>
  );
};