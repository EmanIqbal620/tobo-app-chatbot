import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationTypeEnum } from '@/types/ui';

interface ToastNotificationProps {
  id: string;
  message: string;
  type: NotificationTypeEnum;
  duration?: number;
  onRemove: (id: string) => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({
  id,
  message,
  type,
  duration = 3000,
  onRemove
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [id, duration, onRemove]);

  const getBgColor = () => {
    switch (type) {
      case NotificationTypeEnum.SUCCESS:
        return 'bg-green-500';
      case NotificationTypeEnum.ERROR:
        return 'bg-red-500';
      case NotificationTypeEnum.WARNING:
        return 'bg-yellow-500';
      case NotificationTypeEnum.INFO:
        return 'bg-blue-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
        className={`${getBgColor()} text-white p-4 rounded-md shadow-lg max-w-sm w-full`}
      >
        <div className="flex justify-between items-start">
          <span>{message}</span>
          <button
            onClick={() => onRemove(id)}
            className="ml-4 text-white hover:text-gray-200 focus:outline-none"
          >
            ×
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ToastNotification;