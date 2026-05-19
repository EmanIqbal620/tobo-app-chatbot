import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeTransitionProps {
  children: React.ReactNode;
  mode?: 'fade' | 'slide' | 'scale' | 'slide-up' | 'slide-down';
  duration?: number;
  className?: string;
}

const ThemeTransition: React.FC<ThemeTransitionProps> = ({
  children,
  mode = 'fade',
  duration = 0.3,
  className = ''
}) => {
  const { theme } = useTheme();
  const [key, setKey] = useState(0);

  // Force re-render when theme changes to trigger transition
  useEffect(() => {
    setKey(prev => prev + 1);
  }, [theme.mode, theme.highContrast]);

  // Define transition variants based on mode
  const getVariants = () => {
    const baseTransition = {
      duration: duration,
      ease: 'easeInOut' as const
    };

    switch (mode) {
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: baseTransition
        };

      case 'slide':
        return {
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 20 },
          transition: baseTransition
        };

      case 'slide-up':
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 },
          transition: baseTransition
        };

      case 'slide-down':
        return {
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 20 },
          transition: baseTransition
        };

      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.95 },
          transition: baseTransition
        };

      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: baseTransition
        };
    }
  };

  const variants = getVariants();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        className={className}
        initial={variants.initial}
        animate={variants.animate}
        exit={variants.exit}
        transition={variants.transition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Theme-aware wrapper that applies transitions based on theme changes
interface ThemeAwareTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const ThemeAwareTransition: React.FC<ThemeAwareTransitionProps> = ({
  children,
  className = ''
}) => {
  const { theme } = useTheme();
  const [hasLoaded, setHasLoaded] = useState(false);

  // Track when the component has initially loaded
  useEffect(() => {
    setHasLoaded(true);
  }, []);

  // Use slide-up transition for initial load, fade for subsequent theme changes
  const transitionMode = hasLoaded ? 'fade' : 'slide-up';

  return (
    <ThemeTransition mode={transitionMode} className={className}>
      {children}
    </ThemeTransition>
  );
};

// Specialized transition for theme switching specifically
interface ThemeSwitchTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const ThemeSwitchTransition: React.FC<ThemeSwitchTransitionProps> = ({
  children,
  className = ''
}) => {
  const { theme, mode } = useTheme();
  const [previousTheme, setPreviousTheme] = useState(mode);

  // Track theme changes to trigger specific animations
  useEffect(() => {
    if (mode !== previousTheme) {
      setPreviousTheme(mode);
    }
  }, [mode, previousTheme]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={mode} // Change key when theme mode changes
        initial={{ opacity: 0, filter: 'brightness(0.9)' }}
        animate={{ 
          opacity: 1, 
          filter: 'brightness(1)',
          backgroundColor: theme.colors.background
        }}
        exit={{ opacity: 0, filter: 'brightness(0.9)' }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut' as const,
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default ThemeTransition;