import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface GlassToastProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const GlassToast: React.FC<GlassToastProps> = ({ toasts, onRemove }) => {
  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'error':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <InformationCircleIcon className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <XCircleIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getBgColor = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 backdrop-blur-sm border border-green-500/20';
      case 'error':
        return 'bg-red-500/10 backdrop-blur-sm border border-red-500/20';
      case 'warning':
        return 'bg-yellow-500/10 backdrop-blur-sm border border-yellow-500/20';
      case 'info':
        return 'bg-blue-500/10 backdrop-blur-sm border border-blue-500/20';
      default:
        return 'bg-gray-500/10 backdrop-blur-sm border border-gray-500/20';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`glass-card p-4 rounded-xl max-w-sm ${getBgColor(toast.type)} shadow-lg`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {getIcon(toast.type)}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {toast.message}
                </p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  onClick={() => onRemove(toast.id)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default GlassToast;