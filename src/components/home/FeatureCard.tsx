import React from 'react';
import { motion, easeInOut } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
   glassStyle?: {
    background: string;
    boxShadow: string;
  };
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
  delay = 0
}) => {
  const { theme } = useTheme();

  // Card hover animation with lift and subtle border brightening
  const cardHoverAnimation = {
    rest: {
      y: 0,
      boxShadow: `0 4px 6px -1px ${theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.08)'}, 0 2px 4px -1px ${theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.06)' : 'rgba(0, 0, 0, 0.04)'}`,
      borderColor: theme.colors.border
    },
    hover: {
      y: -4,
      boxShadow: `0 10px 15px -3px ${theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(0, 0, 0, 0.1)'}, 0 4px 6px -2px ${theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.08)'}`,
      borderColor: theme.colors.accent,
      transition: {
        duration: 0.2,
        ease: easeInOut
      }
    }
  };

  return (
    <motion.div
      className="matte-card p-6 rounded-xl border border-border-light"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      variants={cardHoverAnimation}
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      style={{
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border
      }}
    >
      <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
           style={{ backgroundColor: theme.colors.surface }}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold" style={{ color: theme.colors.text.primary }}>{title}</h3>
      <p style={{ color: theme.colors.text.secondary }}>{description}</p>
    </motion.div>
  );
};

export default FeatureCard;