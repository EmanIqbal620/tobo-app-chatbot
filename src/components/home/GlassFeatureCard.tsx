import React from 'react';
import { motion } from 'framer-motion';

interface GlassFeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
}

const GlassFeatureCard: React.FC<GlassFeatureCardProps> = ({
  title,
  description,
  icon,
  delay = 0
}) => {
  return (
    <motion.div
      className="glass-card p-6 rounded-2xl"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -10, scale: 1.02 }}
    >
      <div className="w-12 h-12 glass-card rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </motion.div>
  );
};

export default GlassFeatureCard;