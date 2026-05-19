'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { LoadingState } from '@/types/ui';

interface LoadingContextType {
  loadingStates: LoadingState[];
  showLoading: (id: string, type: LoadingState['type'], message?: string) => void;
  hideLoading: (id: string) => void;
  isLoading: (id: string) => boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState<LoadingState[]>([]);

  const showLoading = (id: string, type: LoadingState['type'], message?: string) => {
    const newLoadingState: LoadingState = {
      id,
      type,
      isActive: true,
      message,
      createdAt: new Date().toISOString(),
    };

    setLoadingStates((prev) => {
      // Check if loading state with this ID already exists
      const existingIndex = prev.findIndex((state) => state.id === id);
      if (existingIndex >= 0) {
        // Update existing state
        const updated = [...prev];
        updated[existingIndex] = newLoadingState;
        return updated;
      } else {
        // Add new state
        return [...prev, newLoadingState];
      }
    });
  };

  const hideLoading = (id: string) => {
    setLoadingStates((prev) => prev.filter((state) => state.id !== id));
  };

  const isLoading = (id: string): boolean => {
    const state = loadingStates.find((state) => state.id === id);
    return state ? state.isActive : false;
  };

  return (
    <LoadingContext.Provider value={{ loadingStates, showLoading, hideLoading, isLoading }}>
      {children}
      {/* Render loading overlay if any loading state is active */}
      {loadingStates.some((state) => state.isActive) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
            <p className="text-gray-700 dark:text-gray-200">
              {loadingStates.find((state) => state.isActive)?.message || 'Loading...'}
            </p>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};