/**
 * Matte Card Component
 * A reusable card component with subtle animations and consistent styling
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
  animateOnHover?: boolean;
  onClick?: () => void;
}

const MatteCard: React.FC<CardProps> = ({
  children,
  className = '',
  elevated = false,
  animateOnHover = true,
  onClick
}) => {
  const { theme } = useTheme();

  const cardClasses = `
    matte-card
    rounded-xl
    p-6
    border
    transition-all
    duration-300
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `;

  const cardStyle = {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    ...(elevated ? { boxShadow: theme.shadows.card } : {})
  };

  if (animateOnHover && !onClick) {
    return (
      <motion.div
        className={cardClasses}
        style={cardStyle}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.div>
    );
  } else if (animateOnHover && onClick) {
    return (
      <motion.div
        className={cardClasses}
        style={cardStyle}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
      >
        {children}
      </motion.div>
    );
  } else {
    return (
      <div
        className={cardClasses}
        style={cardStyle}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }
};

export default MatteCard;