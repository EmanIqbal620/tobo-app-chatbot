import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface QuickAddProps {
  onAddTask: (title: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

const QuickAdd: React.FC<QuickAddProps> = ({
  onAddTask,
  placeholder = 'Quick add task...',
  autoFocus = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { theme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle keyboard shortcut for quick add (q or Q)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if 'q' was pressed and not in an input field
      if (
        (e.key.toLowerCase() === 'q' && (e.ctrlKey || e.metaKey)) ||
        (e.key.toLowerCase() === 'q' && !(e.target instanceof HTMLInputElement))
      ) {
        e.preventDefault();
        setIsOpen(true);
      }

      // Escape key to close
      if (e.key === 'Escape') {
        setIsOpen(false);
        setInputValue('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddTask(inputValue.trim());
      setInputValue('');
      setIsOpen(false);
    }
  };

  const handleAddClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setInputValue('');
  };

  return (
    <div className="relative">
      {!isOpen ? (
        <motion.button
          onClick={handleAddClick}
          className="flex items-center justify-center w-10 h-10 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
          style={{
            backgroundColor: theme.colors.accent,
            color: 'white',
          }}
          whileHover={{ scale: 1.1, boxShadow: '0 8px 16px rgba(0,0,0,0.2)' }}
          whileTap={{ scale: 0.95 }}
          aria-label="Quick add task"
          title="Quick add task (Press Q)"
        >
          <PlusIcon className="h-5 w-5" />
        </motion.button>
      ) : (
        <motion.form
          onSubmit={handleSubmit}
          className="relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <div className="flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={placeholder}
              className="px-4 py-2 rounded-l-lg border-t border-b border-l focus:outline-none focus:ring-2 focus:ring-accent-500"
              style={{
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                color: theme.colors.text.primary,
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  handleClose();
                } else if (e.key === 'Enter' && inputValue.trim()) {
                  handleSubmit(e);
                }
              }}
            />
            <div className="flex">
              <button
                type="button"
                onClick={handleClose}
                className="px-3 py-2 rounded-r-lg border border-l-0 focus:outline-none focus:ring-2 focus:ring-accent-500"
                style={{
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  color: theme.colors.text.primary,
                }}
                aria-label="Cancel"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="ml-1 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 disabled:opacity-50"
                style={{
                  backgroundColor: theme.colors.accent,
                  color: 'white',
                }}
                aria-label="Add task"
              >
                Add
              </button>
            </div>
          </div>
        </motion.form>
      )}

      {/* Help tooltip */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            Press Q to quick add
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuickAdd;