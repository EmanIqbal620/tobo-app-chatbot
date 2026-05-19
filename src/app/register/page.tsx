'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { NotificationTypeEnum } from '@/types/ui';
import { User } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await register(name, email, password);
      showToast('Registration successful!', NotificationTypeEnum.SUCCESS);
      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      console.error('Registration error:', error);
      showToast(error.message || 'Registration failed', NotificationTypeEnum.ERROR);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ backgroundColor: theme.colors.background }}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 -z-0 pointer-events-none">
        <div
          className="absolute top-[-100px] left-[-100px] w-[280px] h-[280px] rounded-full blur-[120px] opacity-30"
          style={{ background: theme.colors.accent }}
        />
        <div
          className="absolute bottom-[-120px] right-[-120px] w-[320px] h-[320px] rounded-full blur-[140px] opacity-20"
          style={{ background: theme.colors.accent }}
        />
      </div>

      {/* Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[380px] relative z-10"
      >
        <div
          className="matte-card relative rounded-3xl p-10 border"
          style={{
            background: theme.mode === 'dark'
              ? 'rgba(255,255,255,0.06)'
              : 'rgba(255,255,255,0.3)',
            borderColor: theme.colors.border,
            boxShadow: theme.mode === 'dark'
              ? '0 14px 32px rgba(168,85,247,0.25), inset 0 1px 3px rgba(255,255,255,0.15)'
              : '0 14px 32px rgba(124,58,237,0.2), inset 0 1px 3px rgba(255,255,255,0.4)',
          }}
        >
          {/* Floating Icon */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-tr from-purple-500 to-pink-500 shadow-lg">
            <User size={28} color="#fff" />
          </div>

          {/* Header */}
          <div className="text-center mt-8 mb-6">
            <h1
              className="text-3xl font-bold"
              style={{ color: theme.colors.accent }}
            >
              Create Account
            </h1>
            <p
              className="mt-1"
              style={{ color: theme.colors.text.secondary }}
            >
              Join us to get started with task management
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="flex flex-col gap-5 mt-4">
            {/* Name */}
            <div className="relative w-full">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                className={`peer w-full bg-transparent border-b-2 py-2 px-1 focus:outline-none text-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{
                  borderColor: theme.colors.accent,
                  color: theme.colors.text.primary,
                  boxShadow: `0 0 8px ${theme.colors.accent}33`,
                }}
              />
              <label
                className="absolute left-1 top-0 text-gray-400 text-sm transition-all duration-200 peer-focus:-top-4 peer-focus:text-purple-500 peer-focus:text-sm"
                style={{ color: theme.colors.text.secondary }}
              >
                Full Name
              </label>
            </div>

            {/* Email */}
            <div className="relative w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className={`peer w-full bg-transparent border-b-2 py-2 px-1 focus:outline-none text-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{
                  borderColor: theme.colors.accent,
                  color: theme.colors.text.primary,
                  boxShadow: `0 0 8px ${theme.colors.accent}33`,
                }}
              />
              <label
                className="absolute left-1 top-0 text-gray-400 text-sm transition-all duration-200 peer-focus:-top-4 peer-focus:text-purple-500 peer-focus:text-sm"
                style={{ color: theme.colors.text.secondary }}
              >
                Email
              </label>
            </div>

            {/* Password */}
            <div className="relative w-full">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className={`peer w-full bg-transparent border-b-2 py-2 px-1 focus:outline-none text-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{
                  borderColor: theme.colors.accent,
                  color: theme.colors.text.primary,
                  boxShadow: `0 0 8px ${theme.colors.accent}33`,
                }}
              />
              <label
                className="absolute left-1 top-0 text-gray-400 text-sm transition-all duration-200 peer-focus:-top-4 peer-focus:text-purple-500 peer-focus:text-sm"
                style={{ color: theme.colors.text.secondary }}
              >
                Password
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`mt-4 py-3 rounded-xl text-white font-semibold bg-gradient-to-tr from-purple-500 to-pink-500 transition-all shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:from-purple-600 hover:to-pink-600'}`}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          {/* Sign in link */}
          <div className="mt-6 text-center">
            <p style={{ color: theme.colors.text.secondary }}>
              Already have an account?{' '}
              <Link
                href="/login"
                className="hover:underline"
                style={{ color: theme.colors.accent }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
