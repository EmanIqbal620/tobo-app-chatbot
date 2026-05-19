/**
 * Animation Configuration for UI Polish & Theme Enhancement
 * Defines animation presets following the specified principles
 */

// Fade-up animation for section loads
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.5, ease: "easeOut" }
};

// Fade-up animation variants for motion component
export const fadeInUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  exit: { opacity: 0, y: -20 }
};

// Subtle translate/scale hover effects
export const hoverEffect = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -2,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

// Smooth modal open/close transitions
export const modalTransition = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 20
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

// Card lift effect on hover
export const cardHoverLift = {
  initial: { y: 0, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" },
  whileHover: {
    y: -4,
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  transition: {
    duration: 0.2,
    ease: "easeInOut"
  }
};

// Button subtle scale effect
export const buttonHoverScale = {
  whileHover: {
    scale: 1.03,
    transition: {
      duration: 0.15,
      ease: "easeInOut"
    }
  },
  whileTap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
      ease: "easeInOut"
    }
  }
};

// Loading animation for dashboard sections
export const loadingPulse = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Page transition
export const pageTransition = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: {
    duration: 0.3,
    ease: "easeInOut"
  }
};

// Reduced motion configuration for accessibility
export const reducedMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.01 } // Nearly instant for users who prefer reduced motion
};

// Utility function to check if reduced motion is preferred
export const prefersReducedMotion = (): boolean => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
};

// Animation helper that respects reduced motion preference
export const getAnimationProps = (normalAnimation: any) => {
  if (prefersReducedMotion()) {
    return reducedMotion;
  }
  return normalAnimation;
};

// Animation variants for different components
export const animationVariants = {
  fadeInUp,
  modalTransition,
  cardHoverLift,
  buttonHoverScale,
  loadingPulse,
  pageTransition,
  reducedMotion
};

// Animation durations
export const animationDurations = {
  fast: 0.15,    // 150ms for quick interactions
  normal: 0.3,   // 300ms for standard transitions
  slow: 0.5      // 500ms for emphasis or page transitions
};

// Animation easings
export const animationEasings = {
  easeIn: "ease-in",
  easeOut: "ease-out",
  easeInOut: "ease-in-out",
  sharp: "cubic-bezier(0.4, 0, 0.6, 1)",
  standard: "cubic-bezier(0.4, 0, 0.2, 1)"
};