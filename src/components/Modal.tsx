import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset'; // Restore scrolling
    };
  }, [isOpen, onClose]);

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4"
          initial={{
            opacity: 0,
            scale: 0.95,
            y: 20
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
              duration: 0.3,
              ease: "easeOut"
            }
          }}
          exit={{
            opacity: 0,
            scale: 0.95,
            y: 20,
            transition: {
              duration: 0.2,
              ease: "easeIn"
            }
          }}
        >
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal container */}
          <motion.div
            ref={modalRef}
            className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-card transform sm:align-middle sm:w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto matte-modal`}
            style={{
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border
            }}
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: {
                duration: 0.3,
                ease: "easeOut"
              }
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20,
              transition: {
                duration: 0.2,
                ease: "easeIn"
              }
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              {title && (
                <div className="flex justify-between items-center mb-4">
                  <h3
                    id="modal-headline"
                    className="text-lg leading-6 font-medium"
                    style={{ color: theme.colors.text.primary }}
                  >
                    {title}
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-text-secondary hover:text-text-primary focus:outline-none"
                    aria-label="Close"
                    style={{ color: theme.colors.text.secondary }}
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              <div className="mt-2" style={{ color: theme.colors.text.primary }}>
                {children}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;