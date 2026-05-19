import { useState, useEffect } from 'react';

/**
 * Custom hook to detect user preference for reduced motion
 * Provides a boolean indicating if the user has requested reduced motion
 */
const useReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    // Check if the browser supports the reduced motion media query
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

      // Set initial value
      setPrefersReducedMotion(mediaQuery.matches);

      // Add listener for changes
      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };

      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        (mediaQuery as any).addListener(handleChange);
      }

      // Cleanup
      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', handleChange);
        } else {
          // Fallback for older browsers
          (mediaQuery as any).removeListener(handleChange);
        }
      };
    }
  }, []);

  return prefersReducedMotion;
};

export default useReducedMotion;

/**
 * Utility function to conditionally apply motion based on user preference
 * @param animationProps - The animation properties to conditionally apply
 * @param reducedMotionProps - The alternative properties when reduced motion is preferred
 * @returns The appropriate properties based on user preference
 */
export const conditionalMotion = <T extends object, U extends object>(
  animationProps: T,
  reducedMotionProps: U,
  prefersReducedMotion: boolean
): T | U => {
  return prefersReducedMotion ? reducedMotionProps : animationProps;
};

/**
 * Hook that returns animation-safe versions of common framer-motion props
 * @returns Animation props that respect reduced motion preferences
 */
export const useReducedMotionProps = () => {
  const prefersReducedMotion = useReducedMotion();

  return {
    // Transition props for reduced motion
    transition: prefersReducedMotion
      ? { duration: 0 } // Instant transitions
      : { duration: 0.3, ease: 'easeInOut' }, // Smooth transitions

    // While hover props for reduced motion
    whileHover: prefersReducedMotion ? {} : { scale: 1.03 },

    // While tap props for reduced motion
    whileTap: prefersReducedMotion ? {} : { scale: 0.98 },

    // Initial animation props for reduced motion
    initial: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },

    // Animate props for reduced motion
    animate: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 },

    // Exit animation props for reduced motion
    exit: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 },

    // Whether animations are enabled
    animationsEnabled: !prefersReducedMotion,
  };
};

/**
 * Component wrapper that respects reduced motion preferences
 * @param children - The component to wrap
 * @param fallback - The fallback component when reduced motion is preferred
 * @returns The appropriate component based on user preference
 */
interface ReducedMotionWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

export const ReducedMotionWrapper: React.FC<ReducedMotionWrapperProps> = ({
  children,
  fallback,
  className = ''
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion && fallback) {
    return <div className={className}>{fallback}</div>;
  }

  return <div className={className}>{children}</div>;
};