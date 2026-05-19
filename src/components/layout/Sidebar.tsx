'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '../ui/ThemeToggle';

// Add a props interface to accept className
interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const { theme } = useTheme();

  return (
    <aside
      className={`w-64 min-h-screen p-4 border-r sticky top-0 ${className}`}
      style={{
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        color: theme.colors.text.primary
      }}
    >
      <div className="mb-8">
        <h2
          className="text-xl font-bold"
          style={{ color: theme.colors.accent }}
        >
          Todo App
        </h2>
      </div>

      <nav>
        <ul className="space-y-2">
          <li>
            <Link
              href="/dashboard"
              className="flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-surface-600 group"
              style={{
                color: theme.colors.text.primary,
                backgroundColor: 'transparent'
              }}
            >
              <div
                className="w-1 h-6 rounded-r mr-3"
                style={{ backgroundColor: theme.colors.accent }}
              />
              <span className="ml-2">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="/tasks"
              className="flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-surface-600 group"
              style={{
                color: theme.colors.text.primary,
                backgroundColor: 'transparent'
              }}
            >
              <div
                className="w-1 h-6 rounded-r mr-3"
                style={{ backgroundColor: theme.colors.accent }}
              />
              <span className="ml-2">All Tasks</span>
            </Link>
          </li>
          <li>
            <Link
              href="/completed"
              className="flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-surface-600 group"
              style={{
                color: theme.colors.text.primary,
                backgroundColor: 'transparent'
              }}
            >
              <div
                className="w-1 h-6 rounded-r mr-3"
                style={{ backgroundColor: theme.colors.accent }}
              />
              <span className="ml-2">Completed Tasks</span>
            </Link>
          </li>
          <li>
            <Link
              href="/analytics"
              className="flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-surface-600 group"
              style={{
                color: theme.colors.text.primary,
                backgroundColor: 'transparent'
              }}
            >
              <div
                className="w-1 h-6 rounded-r mr-3"
                style={{ backgroundColor: theme.colors.accent }}
              />
              <span className="ml-2">Analytics Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="/chat"
              className="flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-surface-600 group"
              style={{
                color: theme.colors.text.primary,
                backgroundColor: 'transparent'
              }}
            >
              <div
                className="w-1 h-6 rounded-r mr-3"
                style={{ backgroundColor: theme.colors.accent }}
              />
              <span className="ml-2">AI Assistant</span>
            </Link>
          </li>
          <li>
            <Link
              href="/settings"
              className="flex items-center p-3 rounded-lg transition-all duration-200 hover:bg-surface-600 group"
              style={{
                color: theme.colors.text.primary,
                backgroundColor: 'transparent'
              }}
            >
              <div
                className="w-1 h-6 rounded-r mr-3"
                style={{ backgroundColor: theme.colors.accent }}
              />
              <span className="ml-2">Settings</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <ThemeToggle />
      </div>
    </aside>
  );
};

export default Sidebar;
