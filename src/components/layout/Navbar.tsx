'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const Navbar: React.FC = () => {
  const { theme, toggleTheme, mode } = useTheme();
  const isDark = mode === 'dark';
  const navLinks = ['Features', 'How it works'];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    let targetId = '';
    if (sectionId === 'features') targetId = 'features-section';
    else if (sectionId === 'how-it-works') targetId = 'how-it-works-section';

    const element = document.getElementById(targetId);
    if (element) {
      // Calculate offset to account for sticky navbar
      const offsetTop = element.offsetTop - 80; // Adjust for navbar height
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false); // Close menu after clicking
  };

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        backgroundColor: isDark ? '#020617' : '#f5f5f8', // match HowItWorksSection
        boxShadow: isDark
          ? '0 4px 20px rgba(0,0,0,0.3)'
          : '0 4px 20px rgba(0,0,0,0.08)',
        borderBottom: 'none',
      }}
    >
      <div className="container mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div
            className="p-2 rounded-lg transition-transform group-hover:-translate-y-0.5"
            style={{
              backgroundColor: theme.colors.accent,
              boxShadow: `0 6px 18px ${theme.colors.accent}33`,
            }}
          >
            <CheckCircle2 size={18} color="#fff" />
          </div>
          <span
            className="text-lg font-semibold"
            style={{ color: isDark ? '#ffffff' : '#111827' }}
          >
            Todo<span style={{ color: theme.colors.accent }}>Flow</span>
          </span>
        </Link>

        {/* Desktop Navigation Links - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          {navLinks.map((link) => (
            <button
              key={link}
              onClick={() =>
                scrollToSection(link.toLowerCase().replace(/\s+/g, '-'))
              }
              className="relative group font-medium transition-colors duration-300 cursor-pointer"
              style={{ color: isDark ? '#d1d5db' : '#6b7280' }}
            >
              {link}
              <span
                className="absolute left-0 -bottom-1 h-[2px] w-0 group-hover:w-full transition-all duration-500 ease-out rounded-full"
                style={{
                  background: theme.colors.accent, // subtle accent line
                }}
              />
            </button>
          ))}
        </div>

        {/* Mobile Menu Button - Visible only on mobile */}
        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X size={20} style={{ color: isDark ? '#ffffff' : '#111827' }} />
              ) : (
                <Menu size={20} style={{ color: isDark ? '#ffffff' : '#111827' }} />
              )}
            </button>
          </div>

          {/* Desktop Actions - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-6">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2.5 rounded-xl transition-transform hover:-translate-y-0.5 active:translate-y-0"
              style={{
                backgroundColor: isDark ? '#1a1a2e' : '#fff',
                border: `1px solid ${theme.colors.accent}33`,
              }}
            >
              {isDark ? (
                <Moon size={18} style={{ color: theme.colors.accent }} />
              ) : (
                <Sun size={18} style={{ color: theme.colors.accent }} />
              )}
            </button>

            {/* Login Link */}
            <Link
              href="/login"
              className="text-sm font-medium transition-all hover:underline"
              style={{ color: isDark ? '#d1d5db' : '#6b7280' }}
            >
              Login
            </Link>

            {/* Start/Register Button */}
            <Link
              href="/register"
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0.5"
              style={{
                background: theme.colors.accent,
                color: '#FFFFFF',
                boxShadow: `0 8px 24px ${theme.colors.accent}33`,
              }}
            >
              Start
            </Link>
          </div>
        </div>

        {/* Mobile Menu - Shown when menu is open */}
        {isMenuOpen && (
          <div
            className="absolute top-full left-0 right-0 z-50"
            style={{
              backgroundColor: isDark ? '#020617' : '#f5f5f8',
              borderTop: `1px solid ${theme.colors.border}`
            }}
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {/* Mobile Navigation Links */}
              {navLinks.map((link) => (
                <button
                  key={link}
                  onClick={() =>
                    scrollToSection(link.toLowerCase().replace(/\s+/g, '-'))
                  }
                  className="text-left py-2 px-4 rounded-lg hover:bg-surface-600 transition-colors text-base font-medium"
                  style={{ color: isDark ? '#ffffff' : '#111827' }}
                >
                  {link}
                </button>
              ))}

              {/* Mobile Actions */}
              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-surface-600 transition-colors"
                  style={{ color: isDark ? '#ffffff' : '#111827' }}
                >
                  {isDark ? (
                    <Moon size={18} style={{ color: theme.colors.accent }} />
                  ) : (
                    <Sun size={18} style={{ color: theme.colors.accent }} />
                  )}
                  Toggle Theme
                </button>

                <Link
                  href="/login"
                  className="py-2 px-4 rounded-lg hover:bg-surface-600 transition-colors"
                  style={{ color: isDark ? '#ffffff' : '#111827' }}
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-center transition-all"
                  style={{
                    background: theme.colors.accent,
                    color: '#FFFFFF',
                  }}
                >
                  Start
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
