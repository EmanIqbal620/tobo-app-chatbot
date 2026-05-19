import React from 'react';
import { motion } from 'framer-motion';
import { SkeletonLoaderProps } from '@/types/ui';
import { useTheme } from '@/contexts/ThemeContext';

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'card',
  width,
  height,
  count = 1
}) => {
  const { theme } = useTheme();

  const getTypeDimensions = () => {
    switch (type) {
      case 'card':
        return {
          width: width || '100%',
          height: height || '120px',
          classes: 'rounded-lg',
        };
      case 'text':
        return {
          width: width || '100%',
          height: height || '16px',
          classes: 'rounded',
        };
      case 'avatar':
        return {
          width: width || '40px',
          height: height || '40px',
          classes: 'rounded-full',
        };
      case 'image':
        return {
          width: width || '100%',
          height: height || '200px',
          classes: 'rounded',
        };
      case 'button':
        return {
          width: width || '120px',
          height: height || '40px',
          classes: 'rounded-md',
        };
      case 'input':
        return {
          width: width || '100%',
          height: height || '40px',
          classes: 'rounded-md',
        };
      case 'list-item':
        return {
          width: width || '100%',
          height: height || '60px',
          classes: 'rounded-lg',
        };
      default:
        return {
          width: width || '100%',
          height: height || '120px',
          classes: '',
        };
    }
  };

  const { width: compWidth, height: compHeight, classes } = getTypeDimensions();

  // Enhanced shimmer effect
  const shimmerEffect = {
    background: theme.mode === 'dark'
      ? `linear-gradient(90deg, ${theme.colors.surface} 25%, ${theme.colors.surface}50 50%, ${theme.colors.surface} 75%)`
      : `linear-gradient(90deg, ${theme.colors.background} 25%, ${theme.colors.background}50 50%, ${theme.colors.background} 75%)`,
    backgroundSize: '200% 100%',
    backgroundPosition: '200% 0',
  };

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className={`${classes}`}
          style={{
            width: typeof compWidth === 'number' ? `${compWidth}px` : compWidth,
            height: typeof compHeight === 'number' ? `${compHeight}px` : compHeight,
            ...shimmerEffect,
          }}
          initial={{ backgroundPosition: '200% 0' }}
          animate={{
            backgroundPosition: '0% 0',
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop",
          }}
        />
      ))}
    </div>
  );
};

export default SkeletonLoader;

// Loading state wrapper component
interface LoadingStateProps {
  isLoading: boolean;
  loaderType?: 'card' | 'text' | 'avatar' | 'image' | 'button' | 'input' | 'list-item';
  loaderWidth?: string | number;
  loaderHeight?: string | number;
  loaderCount?: number;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  isLoading,
  loaderType = 'card',
  loaderWidth,
  loaderHeight,
  loaderCount = 1,
  children,
  fallback
}) => {
  if (isLoading) {
    return fallback || (
      <div className="space-y-3">
        <SkeletonLoader
          type={loaderType}
          width={loaderWidth}
          height={loaderHeight}
          count={loaderCount}
        />
      </div>
    );
  }

  return <>{children}</>;
};

// Data loading wrapper with skeleton screens
interface DataLoaderProps<T> {
  data: T | null | undefined;
  loading: boolean;
  error: string | null;
  skeletonType?: 'card' | 'text' | 'avatar' | 'image' | 'button' | 'input' | 'list-item';
  skeletonCount?: number;
  renderData: (data: T) => React.ReactNode;
  renderError?: (error: string) => React.ReactNode;
  renderEmpty?: () => React.ReactNode;
}

export const DataLoader = <T extends {}>({
  data,
  loading,
  error,
  skeletonType = 'card',
  skeletonCount = 3,
  renderData,
  renderError,
  renderEmpty
}: DataLoaderProps<T>) => {
  if (error) {
    return renderError ? renderError(error) : (
      <div className="text-red-500 p-4 text-center">
        Error loading data: {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <SkeletonLoader key={index} type={skeletonType} />
        ))}
      </div>
    );
  }

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return renderEmpty ? renderEmpty() : (
      <div className="text-gray-500 p-4 text-center">
        No data available
      </div>
    );
  }

  return <>{renderData(data)}</>;
};

// Full page loading overlay
interface PageLoaderProps {
  isLoading: boolean;
  message?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({ isLoading, message = "Loading..." }) => {
  const { theme } = useTheme();

  if (!isLoading) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: theme.colors.background + '80' }}
    >
      <div className="flex flex-col items-center">
        <SkeletonLoader type="avatar" width="60px" height="60px" />
        <div className="mt-4 text-center">
          <p
            className="font-medium"
            style={{ color: theme.colors.text.primary }}
          >
            {message}
          </p>
          <div className="mt-2">
            <SkeletonLoader type="text" width="120px" height="12px" />
          </div>
        </div>
      </div>
    </div>
  );
};