import React, { ReactNode } from 'react';
import GlassThemeClientProvider from './GlassThemeClientProvider';

interface GlassThemeProviderProps {
  children: ReactNode;
}

const GlassProviderWrapper: React.FC<GlassThemeProviderProps> = ({ children }) => {
  return (
    <GlassThemeClientProvider>
      {children}
    </GlassThemeClientProvider>
  );
};

export default GlassProviderWrapper;