'use client';

import React from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

interface FloatingActionButtonProps {
  onClick: () => void;
  tooltip?: string;
  className?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  tooltip,
  className = ''
}) => {
  const { theme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.15, rotate: 5 }}
      whileTap={{ scale: 0.9, rotate: 0 }}
      onClick={onClick}
      className={`
        fixed bottom-8 right-8 w-16 h-16 rounded-full flex items-center justify-center z-50
        backdrop-blur-md border border-purple-400/30
        shadow-[0_0_20px_${theme.colors.accent}66]
        ${className}
      `}
      style={{
        background: theme.mode === 'dark'
          ? 'rgba(168,85,247,0.25)'
          : 'rgba(124,58,237,0.2)',
        boxShadow: `0 4px 20px ${theme.colors.accent}66, inset 0 0 10px ${theme.colors.accent}33`,
      }}
      aria-label={tooltip || 'Add new item'}
      title={tooltip}
    >
      <PlusIcon
        className="h-7 w-7 text-white"
        style={{
          filter: 'drop-shadow(0 0 4px #d8b4fe)', // soft neon glow
        }}
      />
    </motion.button>
  );
};

export default FloatingActionButton;
