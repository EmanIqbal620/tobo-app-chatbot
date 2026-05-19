import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import GlassButton from '@/components/ui/GlassButton';
import GlassInput from '@/components/ui/GlassInput';
import GlassAuthLayout from './GlassAuthLayout';

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onNavigateToSignup?: () => void;
  loading?: boolean;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

const GlassLoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  onNavigateToSignup,
  loading = false,
  onSuccess,
  onError
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await onLogin(email, password);
        if (onSuccess) {
          onSuccess();
        }
      } catch (error: any) {
        if (onError) {
          onError(error);
        }
      }
    }
  };

  return (
    <GlassAuthLayout title="Welcome Back" subtitle="Sign in to your account">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <GlassInput
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            placeholder="you@example.com"
            fullWidth
          />
        </div>

        <div>
          <GlassInput
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            placeholder="••••••••"
            fullWidth
            endAdornment={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-300"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
              Forgot your password?
            </a>
          </div>
        </div>

        <div>
          <GlassButton
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
            className="py-3"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </GlassButton>
        </div>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onNavigateToSignup}
          className="font-medium text-primary-600 hover:text-primary-500"
        >
          Sign up
        </button>
      </div>
    </GlassAuthLayout>
  );
};

export default GlassLoginForm;