import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'floating' | 'heavy' | 'light';
  hoverEffect?: boolean;
  onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  variant = 'default',
  hoverEffect = false,
  onClick
}) => {
  const baseClasses = "glass-card bg-glass-bg-primary backdrop-blur-md border border-glass-border-light rounded-xl shadow-lg";

  const variantClasses = {
    default: "p-6",
    elevated: "p-6 shadow-xl",
    floating: "p-6 shadow-xl glass-card-floating",
    heavy: "p-6 glass-card-heavy",
    light: "p-6 glass-card-light"
  };

  const hoverClasses = hoverEffect
    ? "glass-hover-lift cursor-pointer"
    : "";

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}
      onClick={handleClick}
      whileHover={hoverEffect ? { y: -5 } : {}}
      whileTap={hoverEffect ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;