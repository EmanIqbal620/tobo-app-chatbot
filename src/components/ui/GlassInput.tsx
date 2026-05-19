import React, { InputHTMLAttributes } from 'react';

interface GlassInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled' | 'outlined';
  inputSize?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

const GlassInput: React.FC<GlassInputProps> = ({
  label,
  error,
  helperText,
  variant = 'default',
  inputSize = 'md',
  fullWidth = false,
  startAdornment,
  endAdornment,
  className = '',
  ...props
}) => {
  const baseClasses = "glass-input bg-glass-bg-secondary backdrop-blur-sm border border-glass-border-light rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-5 py-4 text-lg"
  };

  const widthClass = fullWidth ? "w-full" : "";

  const hasAdornments = startAdornment || endAdornment;

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}

      <div className={`relative ${hasAdornments ? 'flex items-center' : ''}`}>
        {startAdornment && (
          <div className="absolute left-3 flex items-center pointer-events-none">
            {startAdornment}
          </div>
        )}

        <input
          {...props}
          className={`${baseClasses} ${sizeClasses[inputSize]} ${widthClass} ${startAdornment ? 'pl-10' : ''} ${endAdornment ? 'pr-10' : ''} ${className} ${
            error ? 'border-red-500 focus:ring-red-500/50' : ''
          }`}
        />

        {endAdornment && (
          <div className="absolute right-3 flex items-center">
            {endAdornment}
          </div>
        )}
      </div>

      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default GlassInput;