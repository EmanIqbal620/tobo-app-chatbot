import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedWrapperProps {
  children: React.ReactNode;
  animationType?: 'fadeIn' | 'slideIn' | 'scaleIn' | 'stagger' | 'bounce';
  delay?: number;
  duration?: number;
  staggerChildren?: boolean;
  staggerDelay?: number;
  className?: string;
  animateOnView?: boolean;
}

const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({
  children,
  animationType = 'fadeIn',
  delay = 0,
  duration = 0.5,
  staggerChildren = false,
  staggerDelay = 0.1,
  className = '',
  animateOnView = true
}) => {
  const getAnimations = () => {
    const baseTransition = {
      duration: duration,
      delay: delay,
      ease: 'easeOut' as const
    };

    switch (animationType) {
      case 'fadeIn':
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: baseTransition
          }
        };

      case 'slideIn':
        return {
          hidden: { x: -20, opacity: 0 },
          visible: {
            x: 0,
            opacity: 1,
            transition: baseTransition
          }
        };

      case 'scaleIn':
        return {
          hidden: { scale: 0.8, opacity: 0 },
          visible: {
            scale: 1,
            opacity: 1,
            transition: baseTransition
          }
        };

      case 'bounce':
        return {
          hidden: { y: 20, opacity: 0 },
          visible: {
            y: 0,
            opacity: 1,
            transition: {
              ...baseTransition,
              type: 'spring' as const,
              stiffness: 100,
              damping: 10
            }
          }
        };

      case 'stagger':
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: staggerDelay,
              delayChildren: delay
            }
          }
        };

      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: baseTransition }
        };
    }
  };

  const animations = getAnimations();

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={staggerChildren ? animations : undefined}
      whileInView={animateOnView ? 'visible' : undefined}
      viewport={{ once: true, margin: '-100px' }}
    >
      {staggerChildren && Array.isArray(children) ? (
        <>
          {children.map((child, index) => (
            <motion.div
              key={index}
              variants={
                animationType === 'stagger'
                  ? {
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { delay: index * staggerDelay }
                      }
                    }
                  : undefined
              }
            >
              {child}
            </motion.div>
          ))}
        </>
      ) : (
        children
      )}
    </motion.div>
  );
};

export default AnimatedWrapper;