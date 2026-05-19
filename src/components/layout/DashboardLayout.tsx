'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useTheme } from '@/contexts/ThemeContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  const [isHydrated, setIsHydrated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    // Return a minimal skeleton during hydration to prevent mismatches
    return (
      <div
        className="flex flex-col md:flex-row min-h-screen"
        style={{ backgroundColor: theme.colors.background }}
      >
        <div
          className="md:hidden w-full p-4 border-b"
          style={{
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          }}
        >
          <div className="flex justify-between items-center">
            <h2
              className="text-xl font-bold"
              style={{ color: theme.colors.text.primary }}
            >
              Todo App
            </h2>
          </div>
        </div>
        <div className="hidden md:block w-64" /> {/* Placeholder for sidebar */}
        <div className="flex-1 flex flex-col">
          <div className="h-16" /> {/* Placeholder for navbar */}
          <main
            className="flex-1 p-4 sm:p-6"
            style={{ backgroundColor: theme.colors.background }}
          >
            <div style={{ color: theme.colors.text.primary }}>Loading...</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col md:flex-row min-h-screen transition-colors duration-300`}
      style={{ backgroundColor: theme.colors.background }}
    >
      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          style={{ backgroundColor: `${theme.colors.background}80` }}
        />
      )}

      {/* Mobile Sidebar - Overlay style */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{ backgroundColor: theme.colors.surface, color: theme.colors.text.primary }}>
        <div className="h-full overflow-y-auto">
          <Sidebar className="" />
        </div>
      </div>

      {/* Mobile Header with Hamburger Menu */}
      <div className="md:hidden w-full p-4 border-b flex items-center justify-between" style={{
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
      }}>
        <h2
          className="text-xl font-bold"
          style={{ color: theme.colors.text.primary }}
        >
          Todo App
        </h2>
        <button
          className="p-2 rounded-lg flex items-center"
          style={{
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            color: theme.colors.text.primary
          }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="ml-1 text-sm">Menu</span>
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64">
        <Sidebar className="" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main
          className="flex-1 p-4 sm:p-6 transition-colors duration-300 relative overflow-hidden"
          style={{
            backgroundColor: theme.colors.background,
          }}
        >
          {/* Optional Floating Decorations */}
          <div
            className="absolute top-10 right-10 w-40 h-40 rounded-full opacity-20 bg-gradient-to-r from-purple-500 to-pink-500 filter blur-3xl pointer-events-none"
          />
          <div
            className="absolute bottom-10 left-10 w-60 h-60 rounded-full opacity-15 bg-gradient-to-r from-purple-400 to-indigo-500 filter blur-3xl pointer-events-none"
          />

          {/* Page Children */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;