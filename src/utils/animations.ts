/**
 * Glassmorphism Animation Utilities
 * Helper functions for creating smooth animations and transitions
 */

// Common animation variants for Framer Motion
export const glassVariants = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  },
  slideUp: {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  },
  slideDown: {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  },
  scaleIn: {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  },
  float: {
    hidden: { y: 0, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        repeat: Infinity,
        repeatType: "reverse",
        y: [-5, 5, -5]
      }
    }
  },
  bounce: {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        bounce: 0.4
      }
    }
  },
  shimmer: {
    hidden: { backgroundPosition: "200% 0" },
    visible: {
      backgroundPosition: "-200% 0",
      transition: {
        duration: 1.5,
        ease: "linear",
        repeat: Infinity
      }
    }
  }
};

// Animation presets for different UI elements
export const glassPreset = {
  card: {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  },
  button: {
    initial: { scale: 1 },
    whileHover: {
      scale: 1.03,
      transition: { duration: 0.2, ease: "easeInOut" }
    },
    whileTap: {
      scale: 0.98,
      transition: { duration: 0.1, ease: "easeInOut" }
    }
  },
  input: {
    initial: { opacity: 0, x: -20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  },
  modal: {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  },
  backdrop: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  }
};

// Animation timing functions
export const glassTiming = {
  quick: 0.2,
  standard: 0.3,
  slow: 0.5,
  transition: {
    quick: { duration: 0.2, ease: "easeInOut" },
    standard: { duration: 0.3, ease: "easeInOut" },
    slow: { duration: 0.5, ease: "easeInOut" }
  }
};

// Create a spring animation with custom stiffness and damping
export const createSpring = (stiffness: number = 300, damping: number = 25) => {
  return {
    type: "spring",
    stiffness,
    damping
  };
};

// Create a tween animation with custom duration and easing
export const createTween = (duration: number = 0.3, ease: string = "easeInOut") => {
  return {
    duration,
    ease
  };
};

// Animation helpers for specific interactions
export const glassHoverAnimations = {
  lift: {
    y: -5,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  glow: {
    boxShadow: "0 0 20px rgba(100, 149, 237, 0.4)",
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  scale: {
    scale: 1.03,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

// Animation helpers for loading states
export const glassLoadingAnimations = {
  pulse: {
    opacity: 0.6,
    transition: {
      duration: 1,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse"
    }
  },
  shimmer: {
    background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite",
    transition: {
      duration: 0.3
    }
  }
};

// Utility function to apply glass animation classes
export const applyGlassAnimation = (element: HTMLElement, animationType: keyof typeof glassVariants) => {
  const variants = glassVariants[animationType];
  if (variants) {
    // Apply animation styles to the element
    element.style.opacity = '0';
    element.style.transition = `all ${glassTiming.standard}s ease`;

    // Trigger reflow to apply initial state
    void element.offsetWidth;

    // Apply final state
    element.style.opacity = '1';
  }
};

// Animation utilities for theme transitions
export const glassThemeTransitions = {
  smooth: {
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  }
};