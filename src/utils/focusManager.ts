/**
 * Focus Management Utilities
 * Provides functions for managing focus in an accessible way
 */

/**
 * Manages focus within a container, preventing focus from escaping
 * @param containerRef - The container element to manage focus within
 * @returns Focus management functions
 */
export const createFocusTrap = (containerRef: HTMLElement | null) => {
  if (!containerRef) {
    return { activate: () => {}, deactivate: () => {} };
  }

  let active = false;
  let previouslyFocusedElement: HTMLElement | null = null;

  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    'details summary:first-of-type',
    'audio[controls]',
    'video[controls]',
    '[contenteditable]:not([contenteditable="false"])'
  ].join(',');

  const getFocusableElements = (): HTMLElement[] => {
    return Array.from(
      containerRef.querySelectorAll<HTMLElement>(focusableSelectors)
    ).filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const isTabbingForward = !e.shiftKey;
    const isTabbingBackward = e.shiftKey;

    if (isTabbingForward && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    } else if (isTabbingBackward && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    }
  };

  const activate = () => {
    if (active) return;

    active = true;
    previouslyFocusedElement = document.activeElement as HTMLElement;
    const focusableElements = getFocusableElements();

    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    document.addEventListener('keydown', handleKeyDown);
  };

  const deactivate = () => {
    if (!active) return;

    active = false;
    document.removeEventListener('keydown', handleKeyDown);

    if (previouslyFocusedElement && previouslyFocusedElement.focus) {
      previouslyFocusedElement.focus();
    }
  };

  return { activate, deactivate };
};

/**
 * Moves focus to an element with smooth scrolling
 * @param element - Element to focus
 * @param options - Focus options
 */
export const focusElement = (
  element: HTMLElement | null,
  options: {
    preventScroll?: boolean;
    scrollIntoView?: boolean;
    smooth?: boolean
  } = {}
) => {
  if (!element) return;

  const { preventScroll = false, scrollIntoView = true, smooth = true } = options;

  element.focus({
    preventScroll
  });

  if (scrollIntoView) {
    element.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      block: 'nearest',
      inline: 'nearest'
    });
  }
};

/**
 * Returns the last focused element in the document
 * @returns The last focused element or null
 */
export const getLastFocusedElement = (): HTMLElement | null => {
  return document.activeElement as HTMLElement;
};

/**
 * Determines if an element is focusable
 * @param element - Element to check
 * @returns True if the element is focusable
 */
export const isFocusable = (element: HTMLElement): boolean => {
  if (element.tabIndex < 0 || (element as any).disabled || element.hidden) {
    return false;
  }

  if (element.tabIndex === 0) {
    // Check if element is naturally focusable
    const naturallyFocusableTags = ['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'A', 'AUDIO', 'VIDEO'];
    if (naturallyFocusableTags.includes(element.tagName)) {
      return true;
    }

    // Check if element has tabindex attribute set to 0
    if (element.hasAttribute('tabindex')) {
      return true;
    }

    // Check if element has contenteditable
    if (element.contentEditable === 'true') {
      return true;
    }

    return false;
  }

  // Element has explicit tabindex >= 0
  return true;
};

/**
 * Returns all focusable elements within a container
 * @param container - Container to search within
 * @returns Array of focusable elements
 */
export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    'details summary:first-of-type',
    'audio[controls]',
    'video[controls]',
    '[contenteditable]:not([contenteditable="false"])'
  ].join(',');

  return Array.from(
    container.querySelectorAll<HTMLElement>(focusableSelectors)
  ).filter(el =>
    !el.hasAttribute('disabled') &&
    !el.hasAttribute('aria-hidden') &&
    !el.hasAttribute('inert')
  );
};

/**
 * Manages focus restoration after content updates
 * @param containerRef - Container that will receive new content
 * @returns Focus management functions
 */
export const createFocusRestorer = (containerRef: HTMLElement | null) => {
  if (!containerRef) {
    return { saveFocus: () => {}, restoreFocus: () => {} };
  }

  let savedFocus: HTMLElement | null = null;

  const saveFocus = () => {
    const activeElement = document.activeElement as HTMLElement;
    if (containerRef.contains(activeElement)) {
      savedFocus = activeElement;
    }
  };

  const restoreFocus = () => {
    if (savedFocus && document.contains(savedFocus)) {
      savedFocus.focus();
      savedFocus = null;
    } else {
      // If saved element is gone, focus the container itself
      containerRef.focus();
    }
  };

  return { saveFocus, restoreFocus };
};

/**
 * Skips to main content for screen reader users
 * @param mainContentId - ID of the main content element
 */
export const skipToMainContent = (mainContentId: string) => {
  const mainContent = document.getElementById(mainContentId);
  if (mainContent) {
    mainContent.focus();
    mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

/**
 * Creates a skip link for accessibility
 * @param targetId - ID of the element to skip to
 * @param text - Text for the skip link
 * @returns Skip link element
 */
export const createSkipLink = (targetId: string, text: string = 'Skip to main content'): HTMLAnchorElement => {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.textContent = text;
  skipLink.className = 'skip-link sr-only focus-not-sr-only fixed top-4 left-4 z-[1000] bg-accent text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent';
  skipLink.style.cssText = `
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 1000;
    padding: 0.5rem 1rem;
    background-color: #4B0076; /* Purple accent */
    color: white;
    border-radius: 0.25rem;
    text-decoration: none;
  `;

  skipLink.addEventListener('focus', () => {
    skipLink.style.clip = 'auto';
    skipLink.style.width = 'auto';
    skipLink.style.height = 'auto';
    skipLink.style.overflow = 'visible';
    skipLink.style.position = 'fixed';
  });

  skipLink.addEventListener('blur', () => {
    skipLink.style.clip = 'rect(0 0 0 0)';
    skipLink.style.width = '1px';
    skipLink.style.height = '1px';
    skipLink.style.margin = '-1px';
    skipLink.style.overflow = 'hidden';
    skipLink.style.padding = '0';
    skipLink.style.position = 'absolute';
  });

  return skipLink;
};

/**
 * Sets up skip links for the application
 * @param skipLinks - Array of skip link configurations
 */
export const setupSkipLinks = (skipLinks: Array<{targetId: string, text: string}>) => {
  // Remove existing skip links
  const existingSkipLinks = document.querySelectorAll('.skip-link');
  existingSkipLinks.forEach(link => link.remove());

  // Add new skip links to the beginning of the body
  skipLinks.forEach(link => {
    const skipLink = createSkipLink(link.targetId, link.text);
    document.body.insertBefore(skipLink, document.body.firstChild);
  });
};

/**
 * Focuses the first error element in a form
 * @param formRef - Form element containing errors
 */
export const focusFirstError = (formRef: HTMLFormElement | null) => {
  if (!formRef) return;

  const errorElements = formRef.querySelectorAll<HTMLElement>(
    '[aria-invalid="true"], .error, [data-error]'
  );

  if (errorElements.length > 0) {
    const firstError = errorElements[0] as HTMLElement;
    focusElement(firstError, { scrollIntoView: true, smooth: false });
  }
};

/**
 * Manages focus for modal dialogs
 * @param modalRef - Modal element
 * @param triggerRef - Element that triggered the modal
 * @returns Modal focus management functions
 */
export const createModalFocusManager = (
  modalRef: HTMLElement | null,
  triggerRef: HTMLElement | null
) => {
  if (!modalRef) {
    return {
      trapFocus: () => {},
      releaseFocus: () => {},
      focusModal: () => {}
    };
  }

  const focusTrap = createFocusTrap(modalRef);
  let previouslyFocusedElement = triggerRef;

  const trapFocus = () => {
    focusTrap.activate();
  };

  const releaseFocus = () => {
    focusTrap.deactivate();
    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
  };

  const focusModal = () => {
    // Focus the modal itself or the first focusable element inside
    const focusableElements = getFocusableElements(modalRef);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    } else {
      modalRef.focus();
    }
  };

  return { trapFocus, releaseFocus, focusModal };
};