import React from 'react';
import { motion } from 'framer-motion';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useGlassTheme } from '@/contexts/GlassThemeContext';

const GlassThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useGlassTheme();

  return (
    <motion.button
      className="glass-button p-2 rounded-full border border-white/18 flex items-center justify-center"
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <MoonIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      ) : (
        <SunIcon className="h-5 w-5 text-gray-300" />
      )}
    </motion.button>
  );
};

export default GlassThemeToggle;