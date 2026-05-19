'use client';

import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import Sidebar from './GlassSidebar';
import Navbar from './GlassNavbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: theme.colors.background }}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main
          className="flex-1 p-6 backdrop-blur-sm"
          style={{ backgroundColor: `${theme.colors.surface}80` /* 50% transparency */ }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;