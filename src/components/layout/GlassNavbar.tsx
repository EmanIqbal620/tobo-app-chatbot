import React from 'react';
import Link from 'next/link';
import { useGlassTheme } from '@/contexts/GlassThemeContext';
import GlassButton from '@/components/ui/GlassButton';
import GlassThemeToggle from '@/components/theme/GlassThemeToggle';

interface GlassNavbarProps {
  user?: {
    name: string;
    email: string;
  };
  onLogout?: () => void;
}

const GlassNavbar: React.FC<GlassNavbarProps> = ({ user, onLogout }) => {
  const { theme, toggleTheme } = useGlassTheme();

  return (
    <nav className="glass-card backdrop-blur-md border border-white/18 rounded-b-2xl shadow-lg w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Todo App
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Hello, {user.name}
                </span>
                <GlassButton
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                  className="text-sm"
                >
                  Logout
                </GlassButton>
              </>
            ) : (
              <>
                <Link href="/login">
                  <GlassButton variant="ghost" size="sm">
                    Login
                  </GlassButton>
                </Link>
                <Link href="/register">
                  <GlassButton variant="primary" size="sm">
                    Sign Up
                  </GlassButton>
                </Link>
              </>
            )}

            <GlassThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default GlassNavbar;