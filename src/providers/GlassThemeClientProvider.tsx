'use client';

import React, { ReactNode } from 'react';
import { GlassThemeProvider as GlassThemeContextProvider } from '@/contexts/GlassThemeContext';

interface GlassThemeClientProviderProps {
  children: ReactNode;
}

const GlassThemeClientProvider: React.FC<GlassThemeClientProviderProps> = ({ children }) => {
  return (
    <GlassThemeContextProvider>
      {children}
    </GlassThemeContextProvider>
  );
};

export default GlassThemeClientProvider;