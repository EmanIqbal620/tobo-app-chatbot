'use client';

import { useState, useEffect } from 'react';

interface HydrationWrapperProps {
  children: React.ReactNode;
}

/**
 * Wrapper component to handle hydration issues by preventing rendering until after hydration
 */
export const HydrationWrapper: React.FC<HydrationWrapperProps> = ({ children }) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated ? <>{children}</> : <div style={{ visibility: 'hidden' }}>{children}</div>;
};

export default HydrationWrapper;