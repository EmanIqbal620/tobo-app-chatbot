'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

const Footer: React.FC = () => {
  const { mode, theme } = useTheme();
  const isDark = mode === 'dark';

  return (
    <footer
      className="rounded-t-2xl mt-12 p-8"
      style={{
        // match HowItWorksSection background
        background: isDark ? '#020617' : '#f5f5f8',
        boxShadow: isDark
          ? '0 -8px 24px rgba(0,0,0,0.3), inset 0 -2px 4px rgba(255,255,255,0.05)'
          : '0 -8px 24px rgba(0,0,0,0.08), inset 0 -2px 4px rgba(255,255,255,0.3)',
        borderTop: isDark
          ? '1px solid rgba(255,255,255,0.05)'
          : '1px solid rgba(0,0,0,0.05)',
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-4 sm:px-6 lg:px-8">
        {/* Branding */}
        <div className="mb-6 md:mb-0 text-center md:text-left">
          <h3
            className="text-xl font-bold"
            style={{ color: isDark ? '#ffffff' : '#111827' }}
          >
            Todo App
          </h3>
          <p
            className="mt-1 text-sm"
            style={{ color: isDark ? '#d1d5db' : '#6b7280' }}
          >
            Organize your life, one task at a time.
          </p>
        </div>

        {/* Footer Links */}
        <div className="flex space-x-6 mb-6 md:mb-0">
          {['Terms', 'Privacy', 'Contact'].map((link, i) => (
            <a
              key={i}
              href="#"
              style={{ color: isDark ? '#d1d5db' : '#6b7280' }}
              className="hover:text-purple-500 transition-colors"
            >
              {link}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom copyright */}
      <div
        className="mt-8 pt-6 text-center text-sm"
        style={{ color: isDark ? '#9ca3af' : '#4b5563' }}
      >
        © {new Date().getFullYear()} Todo App. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
