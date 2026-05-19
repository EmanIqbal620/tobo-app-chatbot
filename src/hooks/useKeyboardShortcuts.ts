import { useEffect, useRef } from 'react';

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  callback: () => void;
  description?: string;
  enabled?: boolean;
}

interface KeyboardShortcutsHook {
  registerShortcut: (config: ShortcutConfig) => void;
  unregisterShortcut: (key: string, modifiers?: { ctrl?: boolean; shift?: boolean; alt?: boolean }) => void;
  clearAllShortcuts: () => void;
}

/**
 * Custom hook for managing keyboard shortcuts
 * Provides functionality to register, unregister, and manage keyboard shortcuts
 */
const useKeyboardShortcuts = (): KeyboardShortcutsHook => {
  const shortcutsRef = useRef<Map<string, ShortcutConfig>>(new Map());

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent shortcuts from triggering when typing in input fields
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      // Create a unique key for the pressed combination
      const keyCombination = `${event.key.toLowerCase()}-${event.ctrlKey}-${event.shiftKey}-${event.altKey}`;

      // Look for a registered shortcut that matches the pressed keys
      const shortcut = shortcutsRef.current.get(keyCombination);

      if (shortcut && shortcut.enabled !== false) {
        event.preventDefault();
        shortcut.callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const registerShortcut = (config: ShortcutConfig) => {
    const key = config.key.toLowerCase();
    const keyCombination = `${key}-${!!config.ctrl}-${!!config.shift}-${!!config.alt}`;

    shortcutsRef.current.set(keyCombination, {
      ...config,
      enabled: config.enabled ?? true
    });
  };

  const unregisterShortcut = (key: string, modifiers?: { ctrl?: boolean; shift?: boolean; alt?: boolean }) => {
    const keyCombination = `${key.toLowerCase()}-${!!modifiers?.ctrl}-${!!modifiers?.shift}-${!!modifiers?.alt}`;
    shortcutsRef.current.delete(keyCombination);
  };

  const clearAllShortcuts = () => {
    shortcutsRef.current.clear();
  };

  return {
    registerShortcut,
    unregisterShortcut,
    clearAllShortcuts
  };
};

export default useKeyboardShortcuts;

// Additional utility for common shortcuts
export const useCommonShortcuts = () => {
  const { registerShortcut, unregisterShortcut } = useKeyboardShortcuts();

  // Register common application shortcuts
  useEffect(() => {
    // New task: 'n' or 'N'
    registerShortcut({
      key: 'n',
      callback: () => {
        // Trigger new task creation - this would be handled by context or props
        console.log('Creating new task shortcut triggered');
      },
      description: 'Create new task',
      enabled: true
    });

    // Search: 's' or 'S'
    registerShortcut({
      key: 's',
      callback: () => {
        // Trigger search functionality
        console.log('Search shortcut triggered');
      },
      description: 'Open search',
      enabled: true
    });

    // Quick add: 'q' or 'Q'
    registerShortcut({
      key: 'q',
      callback: () => {
        // Trigger quick add functionality
        console.log('Quick add shortcut triggered');
      },
      description: 'Quick add task',
      enabled: true
    });

    // Toggle theme: 't' or 'T'
    registerShortcut({
      key: 't',
      callback: () => {
        // Toggle theme - would interact with theme context
        console.log('Theme toggle shortcut triggered');
      },
      description: 'Toggle theme',
      enabled: true
    });

    // Close modal/escape: 'Escape'
    registerShortcut({
      key: 'escape',
      callback: () => {
        // Close modals or clear selections
        console.log('Escape shortcut triggered');
      },
      description: 'Close modal or cancel action',
      enabled: true
    });

    // Save: Ctrl+S
    registerShortcut({
      key: 's',
      ctrl: true,
      callback: () => {
        // Save current state
        console.log('Save shortcut triggered');
      },
      description: 'Save current changes',
      enabled: true
    });

    return () => {
      // Clean up shortcuts when component unmounts
      unregisterShortcut('n');
      unregisterShortcut('s');
      unregisterShortcut('q');
      unregisterShortcut('t');
      unregisterShortcut('escape');
      unregisterShortcut('s', { ctrl: true });
    };
  }, [registerShortcut, unregisterShortcut]);

  return { registerShortcut, unregisterShortcut };
};