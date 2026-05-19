import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  fullWidth?: boolean
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const containerClasses = `flex flex-col ${fullWidth ? 'w-full' : ''} ${className}`
  const inputBaseClasses = 'block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm'

  const inputClasses = error
    ? `${inputBaseClasses} border-red-300 text-red-900 placeholder-red-300`
    : `${inputBaseClasses} border-gray-300`

  return (
    <div className={containerClasses}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={inputClasses}
        aria-invalid={!!error}
        aria-describedby={error ? 'input-error' : undefined}
        {...props}
      />
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
      {error && (
        <p id="input-error" className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export default Input