import axe, { AxeResults } from 'axe-core';

/**
 * Accessibility Audit Utility
 * Performs accessibility checks using axe-core and returns detailed results
 */

interface AccessibilityAuditOptions {
  include?: string[]; // CSS selectors to include in the audit
  exclude?: string[]; // CSS selectors to exclude from the audit
  runOnly?: {
    type: 'tag' | 'rule';
    values: string[];
  }; // Only run specific rules or tags
  resultTypes?: ('violations' | 'passes' | 'incomplete' | 'inapplicable')[];
}

interface AccessibilityAuditResult {
  violations: any[];
  passes: any[];
  incomplete: any[];
  inapplicable: any[];
  score: number; // Percentage of elements that passed
  html: string; // Snapshot of the audited HTML
}

/**
 * Runs an accessibility audit on the current page or a specific element
 * @param options - Configuration options for the audit
 * @returns Promise resolving to audit results
 */
export const runAccessibilityAudit = async (
  options: AccessibilityAuditOptions = {}
): Promise<AxeResults> => {
  // Configure axe if needed
  await axe.configure({
    rules: [
      {
        id: 'color-contrast',
        enabled: true,
      },
      {
        id: 'duplicate-id',
        enabled: true,
      },
      {
        id: 'image-alt',
        enabled: true,
      },
      {
        id: 'link-name',
        enabled: true,
      },
      {
        id: 'meta-viewport',
        enabled: true,
      },
      {
        id: 'region',
        enabled: true,
      },
    ],
  });

  // Run the audit
  const results = await axe.run(document, {
    runOnly: options.runOnly,
    resultTypes: options.resultTypes || ['violations', 'passes', 'incomplete'],
  });

  return results;
};

/**
 * Gets a summary of accessibility issues
 * @param results - Axe results from runAccessibilityAudit
 * @returns Object containing summary of issues
 */
export const getAccessibilitySummary = (results: AxeResults) => {
  const totalIssues = results.violations.reduce(
    (sum, violation) => sum + violation.nodes.length,
    0
  );

  const totalPassed = results.passes.reduce(
    (sum, pass) => sum + pass.nodes.length,
    0
  );

  const totalTested = totalIssues + totalPassed;

  const severityCounts = {
    critical: results.violations.filter(v => v.impact === 'critical').length,
    serious: results.violations.filter(v => v.impact === 'serious').length,
    moderate: results.violations.filter(v => v.impact === 'moderate').length,
    minor: results.violations.filter(v => v.impact === 'minor').length,
  };

  return {
    totalIssues,
    totalPassed,
    totalTested,
    passRate: totalTested > 0 ? Math.round((totalPassed / totalTested) * 100) : 100,
    severityCounts,
    violations: results.violations,
  };
};

/**
 * Checks color contrast ratios for WCAG compliance
 * @param foregroundColor - Hex or RGB color string
 * @param backgroundColor - Hex or RGB color string
 * @returns Object with contrast ratio and WCAG compliance status
 */
export const checkColorContrast = (foregroundColor: string, backgroundColor: string) => {
  // Convert colors to RGB values
  const fgRGB = hexToRgb(foregroundColor) || parseRgb(foregroundColor);
  const bgRGB = hexToRgb(backgroundColor) || parseRgb(backgroundColor);

  if (!fgRGB || !bgRGB) {
    return { error: 'Invalid color format' };
  }

  // Calculate luminance
  const fgLuminance = calculateLuminance(fgRGB);
  const bgLuminance = calculateLuminance(bgRGB);

  // Calculate contrast ratio
  const contrastRatio = (Math.max(fgLuminance, bgLuminance) + 0.05) /
                       (Math.min(fgLuminance, bgLuminance) + 0.05);

  // Check WCAG compliance
  const wcagAA = contrastRatio >= 4.5; // Normal text
  const wcagAALarge = contrastRatio >= 3.0; // Large text (18pt+ or 14pt+ bold)
  const wcagAAA = contrastRatio >= 7.0; // Enhanced contrast
  const wcagAAALarge = contrastRatio >= 4.5; // Large enhanced text

  return {
    ratio: parseFloat(contrastRatio.toFixed(2)),
    wcagAA,
    wcagAALarge,
    wcagAAA,
    wcagAAALarge,
    compliant: wcagAA, // Meeting minimum WCAG AA standard
  };
};

// Helper function to convert hex to RGB
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

// Helper function to parse RGB string
const parseRgb = (rgb: string) => {
  const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (match) {
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3]),
    };
  }
  return null;
};

// Helper function to calculate relative luminance
const calculateLuminance = (rgb: { r: number; g: number; b: number }) => {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
    val /= 255; // Normalize to 0-1
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/**
 * Adds accessibility attributes to an element dynamically
 * @param element - DOM element to enhance
 * @param attributes - Object containing accessibility attributes
 */
export const enhanceElementAccessibility = (
  element: HTMLElement,
  attributes: {
    role?: string;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
    'aria-hidden'?: boolean;
    tabindex?: number;
  }
) => {
  Object.entries(attributes).forEach(([key, value]) => {
    if (value !== undefined) {
      element.setAttribute(key, String(value));
    }
  });
};

/**
 * Creates an accessibility report from audit results
 * @param results - Axe results from runAccessibilityAudit
 * @returns Formatted accessibility report
 */
export const generateAccessibilityReport = (results: AxeResults) => {
  const summary = getAccessibilitySummary(results);

  return {
    timestamp: new Date().toISOString(),
    summary,
    details: {
      violations: results.violations.map(violation => ({
        id: violation.id,
        impact: violation.impact,
        description: violation.description,
        help: violation.help,
        helpUrl: violation.helpUrl,
        nodes: violation.nodes.map(node => ({
          html: node.html,
          target: node.target,
          failureSummary: node.failureSummary,
        })),
      })),
    },
  };
};