/**
 * Theme-Aware Button Component
 * A button component that adapts to the current theme with smooth hover animations
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const ThemeAwareButton: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  type = 'button'
}) => {
  const { theme } = useTheme();

  // Define size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  // Define variant styles based on theme
  const getVariantStyles = () => {
    const baseStyles = "rounded-lg font-medium transition-all duration-300 flex items-center justify-center";
    const disabledStyles = "opacity-50 cursor-not-allowed";

    if (disabled) {
      return `${baseStyles} ${disabledStyles}`;
    }

    switch (variant) {
      case 'primary':
        return `${baseStyles} text-white bg-accent hover:bg-accent-dark active:scale-95`;
      case 'secondary':
        return `${baseStyles} text-text-primary bg-surface-200 hover:bg-surface-300 border border-border active:scale-95`;
      case 'tertiary':
        return `${baseStyles} text-text-primary bg-transparent hover:bg-surface-100 border border-border active:scale-95`;
      case 'ghost':
        return `${baseStyles} text-text-primary bg-transparent hover:bg-surface-100 active:scale-95`;
      default:
        return `${baseStyles} text-white bg-accent hover:bg-accent-dark active:scale-95`;
    }
  };

  const buttonClasses = `
    ${getVariantStyles()}
    ${sizeClasses[size]}
    ${className}
  `;

  const buttonStyle = {
    backgroundColor: variant === 'primary' ? theme.colors.accent :
                     variant === 'secondary' ? theme.colors.surface : 'transparent',
    color: variant === 'primary' ? 'white' : theme.colors.text.primary,
    borderColor: theme.colors.border,
    ...(variant === 'primary' && {
      boxShadow: `0 4px 6px -1px ${theme.colors.accent}40, 0 2px 4px -1px ${theme.colors.accent}20`
    }),
    ...(variant !== 'primary' && {
      boxShadow: theme.shadows.soft
    })
  };

  if (onClick && !disabled) {
    return (
      <motion.button
        type={type}
        className={buttonClasses}
        style={buttonStyle}
        onClick={onClick}
        whileHover={{
          scale: 1.03,
          transition: { duration: 0.2 },
          boxShadow: variant === 'primary'
            ? `0 6px 12px ${theme.colors.accent}30`
            : `0 4px 8px ${theme.colors.border}20`
        }}
        whileTap={{ scale: 0.98 }}
        disabled={disabled}
      >
        {children}
      </motion.button>
    );
  } else {
    return (
      <motion.button
        type={type}
        className={buttonClasses}
        style={buttonStyle}
        onClick={onClick}
        whileHover={variant !== 'ghost' ? {
          opacity: 0.9,
          transition: { duration: 0.15 }
        } : {}}
        disabled={disabled}
      >
        {children}
      </motion.button>
    );
  }
};

export default ThemeAwareButton;