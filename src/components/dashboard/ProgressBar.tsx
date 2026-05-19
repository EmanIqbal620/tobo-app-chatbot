import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

interface ProgressBarProps {
  percentage: number;
  label?: string;
  color?: string;
  height?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  label = 'Progress',
  color,
  height = 'h-3'
}) => {
  const { theme } = useTheme();

  // Use provided color or fall back to theme accent color
  const barColor = color || theme.colors.accent;

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span
          className="text-sm font-medium"
          style={{ color: theme.colors.text.primary }}
        >
          {label}
        </span>
        <span
          className="text-sm font-medium"
          style={{ color: theme.colors.text.primary }}
        >
          {percentage}%
        </span>
      </div>
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ backgroundColor: `${theme.colors.text.muted}20` }} // 20% opacity of muted text color
      >
        <motion.div
          className={`${height} rounded-full`}
          style={{ backgroundColor: barColor }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;