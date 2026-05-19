import React, { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface KeyboardNavigationProps {
  children: React.ReactNode;
  enableGlobalShortcuts?: boolean;
  onEscape?: () => void;
  onEnter?: () => void;
}

const KeyboardNavigation: React.FC<KeyboardNavigationProps> = ({
  children,
  enableGlobalShortcuts = true,
  onEscape,
  onEnter
}) => {
  const { theme } = useTheme();
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Escape key
      if (e.key === 'Escape') {
        onEscape?.();
        return;
      }

      // Handle Enter key
      if (e.key === 'Enter') {
        onEnter?.();
        return;
      }

      // Handle global shortcuts if enabled
      if (enableGlobalShortcuts) {
        // 'n' for new task
        if (e.key.toLowerCase() === 'n' && !e.ctrlKey && !e.metaKey) {
          // Find and trigger a "new task" button if it exists
          const newTaskBtn = document.querySelector('[data-shortcut="new-task"]') as HTMLElement;
          if (newTaskBtn) {
            e.preventDefault();
            newTaskBtn.click();
          }
        }

        // 's' for search
        if (e.key.toLowerCase() === 's' && !e.ctrlKey && !e.metaKey) {
          const searchBtn = document.querySelector('[data-shortcut="search"]') as HTMLElement;
          if (searchBtn) {
            e.preventDefault();
            searchBtn.click();
          }
        }

        // '/' for search (common pattern)
        if (e.key === '/') {
          const searchBtn = document.querySelector('[data-shortcut="search"]') as HTMLElement;
          if (searchBtn) {
            e.preventDefault();
            searchBtn.click();
          }
        }

        // '?' for help/command palette
        if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
          const helpBtn = document.querySelector('[data-shortcut="help"]') as HTMLElement;
          if (helpBtn) {
            e.preventDefault();
            helpBtn.click();
          }
        }
      }
    };

    // Add event listener to document
    document.addEventListener('keydown', handleKeyDown);

    // Focus management
    const handleFocus = (e: FocusEvent) => {
      setFocusedElement(e.target as HTMLElement);
    };

    document.addEventListener('focusin', handleFocus);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocus);
    };
  }, [enableGlobalShortcuts, onEscape, onEnter]);

  // Render children with keyboard navigation context
  return (
    <div
      tabIndex={-1}
      style={{
        outline: focusedElement ? `2px solid ${theme.colors.accent}` : 'none',
        outlineOffset: '2px',
      }}
      className="focus-outline-container"
    >
      {children}

      {/* Visual indicator for current focused element */}
      {focusedElement && (
        <div
          className="sr-only"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 9999,
            backgroundColor: theme.colors.accent,
            color: 'white',
            padding: '4px 8px',
            fontSize: '12px',
            fontFamily: 'monospace',
          }}
          aria-live="polite"
        >
          Focused: {focusedElement.tagName.toLowerCase()}
          {focusedElement.getAttribute('aria-label') || focusedElement.textContent?.substring(0, 20)}
        </div>
      )}
    </div>
  );
};

// Keyboard Shortcut Component for individual elements
interface KeyboardShortcutProps {
  children: React.ReactNode;
  keys: string[];
  description: string;
  onKeyDown?: (e: KeyboardEvent) => void;
  enabled?: boolean;
}

export const KeyboardShortcut: React.FC<KeyboardShortcutProps> = ({
  children,
  keys,
  description,
  onKeyDown,
  enabled = true
}) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Build a normalized key combination string
      let keyCombo = '';
      if (e.ctrlKey) keyCombo += 'Ctrl+';
      if (e.metaKey) keyCombo += 'Cmd+';
      if (e.shiftKey) keyCombo += 'Shift+';
      if (e.altKey) keyCombo += 'Alt+';
      keyCombo += e.key;

      // Check if this matches any of the expected key combinations
      const matches = keys.some(expected => {
        // Normalize expected key combo
        const normalizedExpected = expected.replace(/\s+/g, '').toLowerCase();
        const normalizedActual = keyCombo.toLowerCase();
        return normalizedActual.includes(normalizedExpected.replace('ctrl+', '').replace('cmd+', '').replace('shift+', '').replace('alt+', ''));
      });

      if (matches) {
        e.preventDefault();
        onKeyDown?.(e);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [keys, onKeyDown, enabled]);

  return (
    <div
      role="region"
      aria-label={description}
      data-keyboard-shortcut={keys.join(',')}
    >
      {children}
      <div className="sr-only">
        Keyboard shortcut: {keys.join(', ')} - {description}
      </div>
    </div>
  );
};

// Focus Trap Component for modals and dialogs
interface FocusTrapProps {
  children: React.ReactNode;
  isActive: boolean;
  returnFocus?: boolean;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({
  children,
  isActive,
  returnFocus = true
}) => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = React.useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isActive) {
      // Store the currently focused element
      previouslyFocusedElement.current = document.activeElement as HTMLElement;

      // Focus the first focusable element in the trap
      const focusableElements = getFocusableElements(wrapperRef.current);
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }

    return () => {
      // Return focus to the previously focused element when trap is deactivated
      if (returnFocus && previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [isActive, returnFocus]);

  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = getFocusableElements(wrapperRef.current);
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        // If Shift+Tab on first element, go to last
        lastElement.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        // If Tab on last element, go to first
        firstElement.focus();
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);

  return <div ref={wrapperRef}>{children}</div>;
};

// Helper function to get focusable elements
const getFocusableElements = (container: HTMLElement | null): HTMLElement[] => {
  if (!container) return [];

  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ).filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
};

export default KeyboardNavigation;