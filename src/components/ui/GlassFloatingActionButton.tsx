import React from 'react';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';

interface GlassFloatingActionButtonProps {
  onClick: () => void;
  tooltip?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const GlassFloatingActionButton: React.FC<GlassFloatingActionButtonProps> = ({
  onClick,
  tooltip = 'Add new task',
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-10 h-10 p-2',
    md: 'w-12 h-12 p-3',
    lg: 'w-14 h-14 p-4'
  };

  return (
    <motion.div className="fixed bottom-8 right-8 z-50">
      <motion.button
        className={`glass-button ${sizeClasses[size]} rounded-full shadow-xl flex items-center justify-center ${className}`}
        onClick={onClick}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop"
        }}
        aria-label={tooltip}
      >
        <PlusIcon className="h-6 w-6 text-white" />
      </motion.button>

      {tooltip && (
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          {tooltip}
        </div>
      )}
    </motion.div>
  );
};

export default GlassFloatingActionButton;