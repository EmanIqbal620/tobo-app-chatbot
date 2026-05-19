import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Command {
  id: string;
  title: string;
  description: string;
  category: string;
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  commands: Command[];
  isOpen?: boolean;
  onClose?: () => void;
  placeholder?: string;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({
  commands,
  isOpen: externalIsOpen,
  onClose,
  placeholder = 'Search commands...'
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { theme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine if palette is open (controlled externally or internally)
  const isOpen = externalIsOpen ?? internalIsOpen;

  // Handle keyboard shortcuts to open palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K or Cmd/Ctrl + P to open command palette
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'p')) {
        e.preventDefault();
        setInternalIsOpen(true);
      }

      // Escape to close
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown as any);
    return () => window.removeEventListener('keydown', handleKeyDown as any);
  }, []);

  // Focus input when palette opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [isOpen]);

  const filteredCommands = commands.filter(cmd =>
    cmd.title.toLowerCase().includes(inputValue.toLowerCase()) ||
    cmd.description.toLowerCase().includes(inputValue.toLowerCase()) ||
    cmd.category.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleClose = () => {
    setInputValue('');
    setSelectedIndex(0);
    if (externalIsOpen !== undefined) {
      onClose?.();
    } else {
      setInternalIsOpen(false);
    }
  };

  const handleSelect = (command: Command) => {
    command.action();
    handleClose();
  };

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          handleSelect(filteredCommands[selectedIndex]);
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        // Cycle through options
        setSelectedIndex(prev =>
          e.shiftKey
            ? Math.max(prev - 1, 0)
            : Math.min(prev + 1, filteredCommands.length - 1)
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown as any);
    return () => window.removeEventListener('keydown', handleKeyDown as any);
  }, [isOpen, selectedIndex, filteredCommands]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) {
      acc[cmd.category] = [];
    }
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, Command[]>);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/30 backdrop-blur-sm"
          onClick={handleBackdropClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md mx-4 rounded-xl shadow-2xl overflow-hidden"
            style={{
              backgroundColor: theme.colors.surface,
              border: `1px solid ${theme.colors.border}`,
            }}
            initial={{ scale: 0.9, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: -20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input bar */}
            <div className="flex items-center p-3 border-b" style={{ borderColor: theme.colors.border }}>
              <MagnifyingGlassIcon className="h-5 w-5 mr-2" style={{ color: theme.colors.text.secondary }} />
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder={placeholder}
                className="flex-1 bg-transparent focus:outline-none"
                style={{ color: theme.colors.text.primary }}
              />
              <button
                onClick={handleClose}
                className="ml-2 p-1 rounded-full hover:bg-surface-200"
                style={{ color: theme.colors.text.secondary }}
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Commands list */}
            <div className="max-h-80 overflow-y-auto">
              {filteredCommands.length === 0 ? (
                <div className="p-4 text-center" style={{ color: theme.colors.text.secondary }}>
                  No commands found
                </div>
              ) : (
                Object.entries(groupedCommands).map(([category, cmds]) => (
                  <div key={category}>
                    <div
                      className="px-3 py-2 text-xs uppercase tracking-wider font-medium"
                      style={{
                        color: theme.colors.text.secondary,
                        backgroundColor: theme.colors.surface + '80' // semi-transparent
                      }}
                    >
                      {category}
                    </div>
                    {cmds.map((cmd, index) => (
                      <motion.button
                        key={cmd.id}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between ${
                          selectedIndex === index ? 'bg-accent/20' : ''
                        }`}
                        style={{
                          color: selectedIndex === index ? theme.colors.accent : theme.colors.text.primary,
                        }}
                        onClick={() => handleSelect(cmd)}
                        whileHover={{ backgroundColor: theme.colors.surface + '80' }}
                        onMouseEnter={() => setSelectedIndex(index)}
                      >
                        <div>
                          <div className="font-medium">{cmd.title}</div>
                          <div className="text-sm" style={{ color: theme.colors.text.secondary }}>
                            {cmd.description}
                          </div>
                        </div>
                        {cmd.shortcut && (
                          <kbd
                            className="px-2 py-1 text-xs rounded bg-surface-200"
                            style={{
                              color: theme.colors.text.secondary,
                              backgroundColor: theme.colors.surface + '40' // semi-transparent
                            }}
                          >
                            {cmd.shortcut}
                          </kbd>
                        )}
                      </motion.button>
                    ))}
                  </div>
                ))
              )}
            </div>

            {/* Footer with hints */}
            <div
              className="p-2 text-xs flex justify-between"
              style={{
                color: theme.colors.text.secondary,
                borderTop: `1px solid ${theme.colors.border}`
              }}
            >
              <span>Navigate: ↑ ↓</span>
              <span>Select: Enter</span>
              <span>Close: Esc</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;