'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  percentage: number;
  label?: string;
  showPercentage?: boolean;
  height?: 'sm' | 'md' | 'lg';
}

const heightMap = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  label = 'Progress',
  showPercentage = true,
  height = 'md',
}) => {
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="w-full space-y-2">
      {/* Label Row */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-300">
          {label}
        </span>

        {showPercentage && (
          <span className="text-sm font-semibold text-purple-400">
            {clampedPercentage}%
          </span>
        )}
      </div>

      {/* Track */}
      <div className="w-full rounded-full bg-[#1a1a2e] overflow-hidden border border-purple-500/20">
        {/* Fill */}
        <motion.div
          className={`
            ${heightMap[height]}
            rounded-full
            bg-gradient-to-r
            from-purple-500
            via-purple-600
            to-indigo-500
          `}
          initial={{ width: 0 }}
          animate={{ width: `${clampedPercentage}%` }}
          transition={{
            duration: 0.9,
            ease: 'easeOut',
          }}
          style={{
            boxShadow: '0 0 12px rgba(168, 85, 247, 0.6)',
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
