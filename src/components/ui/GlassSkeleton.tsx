import React from 'react';
import { motion } from 'framer-motion';

type SkeletonType = 'card' | 'text' | 'avatar' | 'image' | 'button' | 'input';

interface GlassSkeletonProps {
  type?: SkeletonType;
  width?: string | number;
  height?: string | number;
  className?: string;
  count?: number;
  animation?: boolean;
}

const GlassSkeleton: React.FC<GlassSkeletonProps> = ({
  type = 'card',
  width,
  height,
  className = '',
  count = 1,
  animation = true
}) => {
  const getDimensions = () => {
    switch (type) {
      case 'card':
        return { width: width || '100%', height: height || '120px' };
      case 'text':
        return { width: width || '100%', height: height || '16px' };
      case 'avatar':
        return { width: width || '40px', height: height || '40px' };
      case 'image':
        return { width: width || '100%', height: height || '200px' };
      case 'button':
        return { width: width || '120px', height: height || '40px' };
      case 'input':
        return { width: width || '100%', height: height || '40px' };
      default:
        return { width: width || '100%', height: height || '120px' };
    }
  };

  const { width: computedWidth, height: computedHeight } = getDimensions();

  const getClasses = () => {
    let baseClasses = 'rounded-xl bg-gradient-to-r from-white/10 via-white/15 to-white/10';

    if (animation) {
      baseClasses += ' animate-pulse';
    }

    return `${baseClasses} ${className}`;
  };

  return (
    <div className="space-y-3">
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          className={getClasses()}
          style={{
            width: typeof computedWidth === 'number' ? `${computedWidth}px` : computedWidth,
            height: typeof computedHeight === 'number' ? `${computedHeight}px` : computedHeight,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
        />
      ))}
    </div>
  );
};

export default GlassSkeleton;