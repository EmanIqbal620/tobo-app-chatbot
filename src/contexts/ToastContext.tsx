'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ToastNotification, NotificationTypeEnum } from '@/types/ui';

interface ToastContextType {
  toasts: ToastNotification[];
  showToast: (message: string, type: NotificationTypeEnum, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = (message: string, type: NotificationTypeEnum, duration: number = 3000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastNotification = {
      id,
      message,
      type,
      duration,
      createdAt: new Date().toISOString(),
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto-remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Render toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-md shadow-lg ${
              toast.type === NotificationTypeEnum.SUCCESS
                ? 'bg-green-500 text-white'
                : toast.type === NotificationTypeEnum.ERROR
                ? 'bg-red-500 text-white'
                : toast.type === NotificationTypeEnum.WARNING
                ? 'bg-yellow-500 text-black'
                : 'bg-blue-500 text-white'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};