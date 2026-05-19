/**
 * Theme Testing Utilities
 * Provides functions for verifying theme consistency and performance
 */

import { ThemeConfig } from '../styles/theme';

/**
 * Measures the time it takes to switch themes
 * @param switchThemeFn - Function that switches the theme
 * @returns Time in milliseconds
 */
export const measureThemeSwitchTime = (switchThemeFn: () => void): number => {
  const startTime = performance.now();
  switchThemeFn();
  const endTime = performance.now();
  return endTime - startTime;
};

/**
 * Verifies that all theme tokens are properly defined
 * @param theme - Theme object to validate
 * @returns Validation results
 */
export const validateThemeTokens = (theme: ThemeConfig): {
  isValid: boolean;
  missingTokens: string[];
  invalidValues: string[];
} => {
  const missingTokens: string[] = [];
  const invalidValues: string[] = [];

  // Check required color properties
  if (!theme.colors) {
    missingTokens.push('colors');
  } else {
    const requiredColors = ['primary', 'accent', 'background', 'surface', 'border'];
    requiredColors.forEach(color => {
      if (!(color in theme.colors)) {
        missingTokens.push(`colors.${color}`);
      } else if (typeof (theme.colors as any)[color] !== 'string') {
        invalidValues.push(`colors.${color}`);
      }
    });

    if (!theme.colors.text) {
      missingTokens.push('colors.text');
    } else {
      const requiredTextColors = ['primary', 'secondary', 'muted', 'disabled'];
      requiredTextColors.forEach(textColor => {
        if (!(textColor in theme.colors.text)) {
          missingTokens.push(`colors.text.${textColor}`);
        } else if (typeof (theme.colors.text as any)[textColor] !== 'string') {
          invalidValues.push(`colors.text.${textColor}`);
        }
      });
    }
  }

  // Check other required sections
  if (!theme.spacing) {
    missingTokens.push('spacing');
  }
  if (!theme.typography) {
    missingTokens.push('typography');
  }
  if (!theme.borderRadius) {
    missingTokens.push('borderRadius');
  }
  if (!theme.shadows) {
    missingTokens.push('shadows');
  }
  if (!theme.transitions) {
    missingTokens.push('transitions');
  }

  return {
    isValid: missingTokens.length === 0 && invalidValues.length === 0,
    missingTokens,
    invalidValues
  };
};

/**
 * Checks if theme colors meet WCAG contrast requirements
 * @param theme - Theme object to validate
 * @returns Contrast validation results
 */
export const validateThemeContrast = (theme: ThemeConfig): {
  passes: Array<{ element: string; ratio: number; required: number }>;
  failures: Array<{ element: string; ratio: number; required: number; foreground: string; background: string }>;
} => {
  const passes: Array<{ element: string; ratio: number; required: number }> = [];
  const failures: Array<{ element: string; ratio: number; required: number; foreground: string; background: string }> = [];

  // Helper function to calculate contrast ratio
  const calculateContrastRatio = (fg: string, bg: string): number => {
    // Convert hex to RGB if needed
    const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };

    const fgRgb = hexToRgb(fg) || { r: 0, g: 0, b: 0 };
    const bgRgb = hexToRgb(bg) || { r: 255, g: 255, b: 255 };

    // Convert to sRGB
    const sRGB = (color: number) => {
      const c = color / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };

    const fgLuminance = 0.2126 * sRGB(fgRgb.r) + 0.7152 * sRGB(fgRgb.g) + 0.0722 * sRGB(fgRgb.b);
    const bgLuminance = 0.2126 * sRGB(bgRgb.r) + 0.7152 * sRGB(bgRgb.g) + 0.0722 * sRGB(bgRgb.b);

    const ratio = (Math.max(fgLuminance, bgLuminance) + 0.05) / (Math.min(fgLuminance, bgLuminance) + 0.05);
    return parseFloat(ratio.toFixed(2));
  };

  // Define color pairs to test
  const colorPairs = [
    { element: 'primary text on background', fg: theme.colors.text.primary, bg: theme.colors.background },
    { element: 'secondary text on background', fg: theme.colors.text.secondary, bg: theme.colors.background },
    { element: 'primary text on surface', fg: theme.colors.text.primary, bg: theme.colors.surface },
    { element: 'secondary text on surface', fg: theme.colors.text.secondary, bg: theme.colors.surface },
    { element: 'accent text on background', fg: theme.colors.accent, bg: theme.colors.background },
    { element: 'accent text on surface', fg: theme.colors.accent, bg: theme.colors.surface },
  ];

  colorPairs.forEach(pair => {
    const ratio = calculateContrastRatio(pair.fg, pair.bg);

    // For normal text, we need at least 4.5:1 for AA compliance
    const requiredRatio = 4.5;

    if (ratio >= requiredRatio) {
      passes.push({ element: pair.element, ratio, required: requiredRatio });
    } else {
      failures.push({
        element: pair.element,
        ratio,
        required: requiredRatio,
        foreground: pair.fg,
        background: pair.bg
      });
    }
  });

  return { passes, failures };
};

/**
 * Tests theme switching performance across different components
 * @param theme - Theme object to test
 * @param testElements - Elements to test theme application on
 * @returns Performance test results
 */
export const testThemePerformance = (theme: ThemeConfig, testElements: HTMLElement[]): {
  averageApplyTime: number;
  maxApplyTime: number;
  minApplyTime: number;
  totalApplyTime: number;
  elementCount: number;
} => {
  const applyTimes: number[] = [];

  testElements.forEach(element => {
    const startTime = performance.now();

    // Apply theme styles to element
    element.style.color = theme.colors.text.primary;
    element.style.backgroundColor = theme.colors.background;
    element.style.borderColor = theme.colors.border;
    element.style.transition = theme.transitions.duration.normal;

    const endTime = performance.now();
    applyTimes.push(endTime - startTime);
  });

  const total = applyTimes.reduce((sum, time) => sum + time, 0);
  const average = total / applyTimes.length;

  return {
    averageApplyTime: parseFloat(average.toFixed(3)),
    maxApplyTime: Math.max(...applyTimes),
    minApplyTime: Math.min(...applyTimes),
    totalApplyTime: parseFloat(total.toFixed(3)),
    elementCount: testElements.length
  };
};

/**
 * Verifies that theme is applied consistently across components
 * @param theme - Theme object to verify
 * @param selector - CSS selector for components to check
 * @returns Consistency check results
 */
export const verifyThemeConsistency = (theme: ThemeConfig, selector: string): {
  consistentElements: HTMLElement[];
  inconsistentElements: Array<{ element: HTMLElement; property: string; expected: string; actual: string }>;
} => {
  const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
  const consistentElements: HTMLElement[] = [];
  const inconsistentElements: Array<{ element: HTMLElement; property: string; expected: string; actual: string }> = [];

  elements.forEach(element => {
    // Check if element styles match the theme
    const computedStyles = window.getComputedStyle(element);

    // Example checks - extend based on your components
    const checks = [
      { property: 'color', expected: theme.colors.text.primary, actual: computedStyles.color },
      { property: 'background-color', expected: theme.colors.background, actual: computedStyles.backgroundColor },
      { property: 'border-color', expected: theme.colors.border, actual: computedStyles.borderColor },
    ];

    let isConsistent = true;
    checks.forEach(check => {
      if (check.expected !== check.actual) {
        isConsistent = false;
        inconsistentElements.push({
          element,
          property: check.property,
          expected: check.expected,
          actual: check.actual
        });
      }
    });

    if (isConsistent) {
      consistentElements.push(element);
    }
  });

  return { consistentElements, inconsistentElements };
};

/**
 * Runs a complete theme verification suite
 * @param theme - Theme object to test
 * @param testElements - Elements to test on
 * @returns Complete test results
 */
export const runThemeVerification = (theme: ThemeConfig, testElements: HTMLElement[] = []): {
  tokenValidation: ReturnType<typeof validateThemeTokens>;
  contrastValidation: ReturnType<typeof validateThemeContrast>;
  performanceTests: ReturnType<typeof testThemePerformance>;
  consistencyTests: ReturnType<typeof verifyThemeConsistency>;
  overallScore: number; // 0-100 percentage
} => {
  const tokenValidation = validateThemeTokens(theme);
  const contrastValidation = validateThemeContrast(theme);
  const performanceTests = testThemePerformance(theme, testElements);
  const consistencyTests = verifyThemeConsistency(theme, '*[data-themed]');

  // Calculate overall score
  const maxPossibleIssues = 100; // Arbitrary max for scoring
  const tokenIssues = tokenValidation.missingTokens.length + tokenValidation.invalidValues.length;
  const contrastFailures = contrastValidation.failures.length;
  const performanceScore = performanceTests.averageApplyTime < 5 ? 10 : 0; // If avg apply time > 5ms, penalize
  const consistencyScore = consistencyTests.inconsistentElements.length;

  const totalIssues = tokenIssues + contrastFailures + performanceScore + consistencyScore;
  const rawScore = Math.max(0, 100 - totalIssues);
  const overallScore = Math.min(100, rawScore); // Cap at 100

  return {
    tokenValidation,
    contrastValidation,
    performanceTests,
    consistencyTests,
    overallScore
  };
};

/**
 * Generates a theme compliance report
 * @param theme - Theme object to report on
 * @param testElements - Elements to test on
 * @returns Theme compliance report
 */
export const generateThemeReport = (theme: ThemeConfig, testElements: HTMLElement[] = []): string => {
  const results = runThemeVerification(theme, testElements);

  const report = `
Theme Compliance Report
======================

Overall Score: ${results.overallScore}/100

Token Validation:
- Valid: ${results.tokenValidation.isValid ? '✅' : '❌'}
- Missing Tokens: ${results.tokenValidation.missingTokens.length}
- Invalid Values: ${results.tokenValidation.invalidValues.length}

Contrast Validation:
- Passes: ${results.contrastValidation.passes.length}
- Failures: ${results.contrastValidation.failures.length}
${results.contrastValidation.failures.map(f => `  - ${f.element}: ${f.ratio}:1 (need ${f.required}:1) ${f.foreground} on ${f.background}`).join('\n')}

Performance Tests:
- Average Apply Time: ${results.performanceTests.averageApplyTime}ms
- Max Apply Time: ${results.performanceTests.maxApplyTime}ms
- Total Elements Tested: ${results.performanceTests.elementCount}

Consistency Tests:
- Consistent Elements: ${results.consistencyTests.consistentElements.length}
- Inconsistent Elements: ${results.consistencyTests.inconsistentElements.length}

${results.overallScore >= 90 ? 'Status: ✅ Excellent' :
 results.overallScore >= 70 ? 'Status: ⚠️ Good, but needs attention' :
 'Status: ❌ Needs improvement'}
  `;

  return report.trim();
};

/**
 * Measures theme transition smoothness
 * @param switchThemeFn - Function that switches the theme
 * @param iterations - Number of times to switch theme
 * @returns Smoothness metrics
 */
export const measureThemeTransitionSmoothness = (
  switchThemeFn: () => void,
  iterations: number = 10
): {
  averageFrameTime: number;
  droppedFrames: number;
  smoothnessPercentage: number;
  frameTimes: number[];
} => {
  const frameTimes: number[] = [];
  let observer: PerformanceObserver | null = null;
  let resolvePromise: ((value: any) => void) | null = null;

  return new Promise(resolve => {
    resolvePromise = resolve;

    // Set up performance observer to track paint timing
    observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure') {
          frameTimes.push(entry.duration);
        }
      }
    });

    observer.observe({ entryTypes: ['measure'] });

    // Perform theme switches
    let switchesDone = 0;
    const switchThemes = () => {
      performance.mark('theme-switch-start');
      switchThemeFn();
      performance.measure('theme-switch-duration', 'theme-switch-start');
      performance.clearMarks('theme-switch-start');

      switchesDone++;
      if (switchesDone < iterations) {
        requestAnimationFrame(switchThemes);
      } else {
        // Calculate results
        const totalFrameTime = frameTimes.reduce((sum, time) => sum + time, 0);
        const avgFrameTime = totalFrameTime / frameTimes.length;

        // Count dropped frames (assuming 60fps = 16.67ms per frame)
        const droppedFrames = frameTimes.filter(time => time > 16.67).length;
        const smoothnessPercentage = ((frameTimes.length - droppedFrames) / frameTimes.length) * 100;

        // Clean up
        if (observer) {
          observer.disconnect();
        }

        resolve({
          averageFrameTime: parseFloat(avgFrameTime.toFixed(3)),
          droppedFrames,
          smoothnessPercentage: parseFloat(smoothnessPercentage.toFixed(2)),
          frameTimes
        });
      }
    };

    switchThemes();
  }) as any; // TypeScript workaround
};