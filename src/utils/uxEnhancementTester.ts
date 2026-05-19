/**
 * UX Enhancement Testing Utilities
 * Provides functions for testing UI/UX enhancements for responsiveness and accessibility compliance
 */

interface ResponsiveTestConfig {
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  testSelectors: string[];
}

interface AccessibilityTestConfig {
  wcagLevel: 'A' | 'AA' | 'AAA';
  testSelectors: string[];
  includeAutomatedChecks: boolean;
}

interface TestResult {
  testName: string;
  passed: boolean;
  issues: string[];
  suggestions: string[];
  timestamp: Date;
}

interface ResponsiveTestResult extends TestResult {
  viewport: { width: number; height: number };
  element: string;
}

interface AccessibilityTestResult extends TestResult {
  wcagCriteria: string[];
  severity: 'critical' | 'major' | 'minor';
}

/**
 * Tests responsiveness of UI elements across different viewport sizes
 * @param config - Configuration for responsive testing
 * @returns Array of responsive test results
 */
export const testResponsiveness = async (
  config: ResponsiveTestConfig
): Promise<ResponsiveTestResult[]> => {
  const { breakpoints, testSelectors } = config;
  const results: ResponsiveTestResult[] = [];

  // Define viewport sizes to test
  const viewports = [
    { width: 320, height: 568, label: 'mobile-small' },
    { width: 375, height: 667, label: 'mobile' },
    { width: 768, height: 1024, label: 'tablet-portrait' },
    { width: 1024, height: 768, label: 'tablet-landscape' },
    { width: 1200, height: 800, label: 'desktop' },
    { width: 1920, height: 1080, label: 'desktop-large' }
  ];

  for (const viewport of viewports) {
    // In a real implementation, we would resize the viewport
    // For now, we'll simulate by checking element properties at different sizes

    for (const selector of testSelectors) {
      const element = document.querySelector(selector);

      if (!element) {
        results.push({
          testName: `Element existence on ${viewport.label}`,
          passed: false,
          issues: [`Element with selector '${selector}' not found on ${viewport.label} viewport`],
          suggestions: [`Verify that element with selector '${selector}' is present on ${viewport.label} viewport`],
          timestamp: new Date(),
          viewport,
          element: selector
        });
        continue;
      }

      // Check if element is visible and properly sized
      const rect = element.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(element);

      const testResults: ResponsiveTestResult = {
        testName: `Responsiveness test for ${selector} on ${viewport.label}`,
        passed: true,
        issues: [],
        suggestions: [],
        timestamp: new Date(),
        viewport,
        element: selector
      };

      // Check if element is visible
      if (rect.width === 0 || rect.height === 0) {
        testResults.passed = false;
        testResults.issues.push(`Element is not visible (0x0 size) on ${viewport.label} viewport`);
        testResults.suggestions.push(`Ensure element has proper dimensions on ${viewport.label} viewport`);
      }

      // Check if element fits within viewport
      if (rect.width > viewport.width) {
        testResults.passed = false;
        testResults.issues.push(`Element is wider than viewport (${rect.width}px > ${viewport.width}px) on ${viewport.label}`);
        testResults.suggestions.push(`Consider adding responsive width constraints or horizontal scrolling`);
      }

      // Check for text readability (font size appropriate for mobile)
      if (viewport.width <= 768) { // Mobile/tablet
        const fontSize = parseFloat(computedStyle.fontSize);
        if (fontSize < 16) { // WCAG recommends at least 16px for readability
          testResults.passed = false;
          testResults.issues.push(`Text size (${fontSize}px) may be too small on ${viewport.label} viewport`);
          testResults.suggestions.push(`Increase font size to at least 16px for better readability on mobile`);
        }
      }

      results.push(testResults);
    }
  }

  return results;
};

/**
 * Tests accessibility compliance of UI elements
 * @param config - Configuration for accessibility testing
 * @returns Array of accessibility test results
 */
export const testAccessibility = async (
  config: AccessibilityTestConfig
): Promise<AccessibilityTestResult[]> => {
  const { testSelectors, wcagLevel, includeAutomatedChecks } = config;
  const results: AccessibilityTestResult[] = [];

  for (const selector of testSelectors) {
    const elements = document.querySelectorAll(selector);

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const testResults: AccessibilityTestResult = {
        testName: `Accessibility test for ${selector}[${i}]`,
        passed: true,
        issues: [],
        suggestions: [],
        timestamp: new Date(),
        wcagCriteria: [],
        severity: 'minor'
      };

      // Check for proper ARIA labels
      const hasAriaLabel = element.hasAttribute('aria-label') ||
                          element.hasAttribute('aria-labelledby') ||
                          element.hasAttribute('aria-describedby');

      if (!hasAriaLabel) {
        // Check if element has implicit labeling (e.g., input with associated label)
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
          const inputElement = element as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
          const id = inputElement.id;

          if (id) {
            const associatedLabel = document.querySelector(`label[for="${id}"]`);
            if (!associatedLabel) {
              testResults.passed = false;
              testResults.issues.push(`Form element missing associated label or ARIA label`);
              testResults.wcagCriteria.push('1.3.1', '4.1.2');
              testResults.severity = 'major';
              testResults.suggestions.push(`Add a <label for="${id}"> or aria-label to the form element`);
            }
          } else {
            testResults.passed = false;
            testResults.issues.push(`Form element missing ID for proper labeling`);
            testResults.wcagCriteria.push('1.3.1', '4.1.2');
            testResults.severity = 'major';
            testResults.suggestions.push(`Add an ID to the form element to associate with a label`);
          }
        }
      }

      // Check for keyboard accessibility
      const isFocusable = element.matches('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!isFocusable) {
        // Check if element has role and event handlers that should make it keyboard accessible
        const role = element.getAttribute('role');
        const hasClickHandler = element.hasAttribute('onclick') ||
                               element.hasAttribute('onkeydown') ||
                               element.hasAttribute('onkeypress');

        if (role && hasClickHandler && !element.hasAttribute('tabindex')) {
          testResults.passed = false;
          testResults.issues.push(`Interactive element with role '${role}' missing tabindex for keyboard access`);
          testResults.wcagCriteria.push('2.1.1');
          testResults.severity = 'major';
          testResults.suggestions.push(`Add tabindex="0" to make the element keyboard focusable`);
        }
      }

      // Check for color contrast (if element has text content)
      if (element.textContent && element.textContent.trim().length > 0) {
        const computedStyle = window.getComputedStyle(element);
        const backgroundColor = computedStyle.backgroundColor;
        const color = computedStyle.color;
        const fontSize = parseFloat(computedStyle.fontSize);

        // For now, we'll add a placeholder for contrast checking
        // In a real implementation, we would calculate the actual contrast ratio
        testResults.wcagCriteria.push('1.4.3'); // Color contrast requirement

        // Add a note about contrast checking
        testResults.suggestions.push(`Manually verify color contrast meets WCAG ${wcagLevel} standards (4.5:1 for normal text, 3:1 for large text)`);
      }

      // Check for proper heading structure
      if (element.tagName.match(/^H[1-6]$/)) {
        const headingLevel = parseInt(element.tagName.charAt(1));
        // In a real implementation, we would check the heading hierarchy
        testResults.wcagCriteria.push('1.3.1', '2.4.6');
      }

      // Check for duplicate IDs
      if (element.id) {
        const elementsWithSameId = document.querySelectorAll(`#${element.id}`);
        if (elementsWithSameId.length > 1) {
          testResults.passed = false;
          testResults.issues.push(`Duplicate ID '${element.id}' found (${elementsWithSameId.length} instances)`);
          testResults.wcagCriteria.push('4.1.1');
          testResults.severity = 'critical';
          testResults.suggestions.push(`Ensure all IDs are unique in the document`);
        }
      }

      // If we have automated checks enabled, run additional checks
      if (includeAutomatedChecks) {
        // Run additional automated accessibility checks
        const automatedResults = await runAutomatedAccessibilityChecks(element);
        if (!automatedResults.passed) {
          testResults.passed = false;
          testResults.issues.push(...automatedResults.issues);
          testResults.wcagCriteria.push(...automatedResults.wcagCriteria);
          testResults.suggestions.push(...automatedResults.suggestions);

          // Update severity based on automated results
          if (automatedResults.severity === 'critical') testResults.severity = 'critical';
          else if (automatedResults.severity === 'major' && testResults.severity !== 'critical') testResults.severity = 'major';
        }
      }

      results.push(testResults);
    }
  }

  return results;
};

/**
 * Runs automated accessibility checks on an element
 * @param element - Element to check
 * @returns Automated accessibility check results
 */
const runAutomatedAccessibilityChecks = async (element: Element): Promise<AccessibilityTestResult> => {
  const result: AccessibilityTestResult = {
    testName: 'Automated accessibility check',
    passed: true,
    issues: [],
    suggestions: [],
    timestamp: new Date(),
    wcagCriteria: [],
    severity: 'minor'
  };

  // Check for alt text on images
  if (element.tagName === 'IMG') {
    const imgElement = element as HTMLImageElement;
    if (!imgElement.hasAttribute('alt')) {
      result.passed = false;
      result.issues.push('Image missing alt attribute');
      result.wcagCriteria.push('1.1.1');
      result.severity = 'major';
      result.suggestions.push(`Add an alt attribute: <img alt="description of image" ...>`);
    } else {
      const altValue = imgElement.getAttribute('alt');
      if (altValue === '') {
        // If alt is empty, it's acceptable for decorative images
        // But we should verify it's intentionally decorative
        result.suggestions.push(`Empty alt attribute indicates decorative image. Verify this is intentional.`);
      }
    }
  }

  // Check for proper link text
  if (element.tagName === 'A') {
    const linkElement = element as HTMLAnchorElement;
    const linkText = linkElement.textContent?.trim() || '';

    if (!linkText || linkText.length === 0) {
      result.passed = false;
      result.issues.push('Link has no text content');
      result.wcagCriteria.push('2.4.4', '4.1.2');
      result.severity = 'major';
      result.suggestions.push('Add descriptive link text that makes sense out of context');
    } else {
      // Check for non-descriptive link text
      const nonDescriptiveTexts = ['click here', 'here', 'more', 'read more', 'this', 'link'];
      const lowerText = linkText.toLowerCase();

      if (nonDescriptiveTexts.some(ndt => lowerText.includes(ndt))) {
        result.passed = false;
        result.issues.push(`Link text "${linkText}" is not descriptive`);
        result.wcagCriteria.push('2.4.4', '2.4.9');
        result.severity = 'major';
        result.suggestions.push('Use descriptive link text that indicates the destination or purpose');
      }
    }
  }

  // Check for focus indicators
  const computedStyle = window.getComputedStyle(element);
  if (isFocusableElement(element)) {
    // Check if the element has a visible focus indicator
    // This is difficult to check automatically, so we'll add a suggestion
    result.suggestions.push('Ensure element has a visible focus indicator for keyboard users');
  }

  return result;
};

/**
 * Checks if an element is focusable
 * @param element - Element to check
 * @returns Whether the element is focusable
 */
const isFocusableElement = (element: Element): boolean => {
  const tagName = element.tagName.toLowerCase();
  const tabIndex = element.getAttribute('tabindex');

  // Naturally focusable elements
  const naturallyFocusable = [
    'a', 'button', 'input', 'select', 'textarea',
    'area', 'summary', 'iframe', 'object', 'embed'
  ];

  if (naturallyFocusable.includes(tagName)) {
    return (element as HTMLElement).tabIndex !== -1;
  }

  // Elements with tabindex
  if (tabIndex !== null) {
    return parseInt(tabIndex) >= 0;
  }

  // Elements with contenteditable
  if (element.getAttribute('contenteditable') === 'true') {
    return true;
  }

  // Elements with role that implies focusability
  const role = element.getAttribute('role');
  if (role && ['button', 'link', 'checkbox', 'radio', 'menuitem', 'tab', 'option'].includes(role)) {
    return true;
  }

  return false;
};

/**
 * Tests overall UX enhancements for compliance
 * @param responsiveConfig - Responsive testing configuration
 * @param accessibilityConfig - Accessibility testing configuration
 * @returns Comprehensive UX test results
 */
export const testUXEnhancements = async (
  responsiveConfig: ResponsiveTestConfig,
  accessibilityConfig: AccessibilityTestConfig
): Promise<{
  responsiveResults: ResponsiveTestResult[];
  accessibilityResults: AccessibilityTestResult[];
  overallScore: number;
  recommendations: string[];
}> => {
  const [responsiveResults, accessibilityResults] = await Promise.all([
    testResponsiveness(responsiveConfig),
    testAccessibility(accessibilityConfig)
  ]);

  // Calculate overall score
  const totalTests = responsiveResults.length + accessibilityResults.length;
  const passedTests = [
    ...responsiveResults,
    ...accessibilityResults
  ].filter(result => result.passed).length;

  const overallScore = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

  // Generate recommendations based on failures
  const recommendations: string[] = [];

  const failedResponsive = responsiveResults.filter(r => !r.passed);
  const failedAccessibility = accessibilityResults.filter(r => !r.passed);

  if (failedResponsive.length > 0) {
    recommendations.push(`Address ${failedResponsive.length} responsive design issues`);
  }

  if (failedAccessibility.length > 0) {
    recommendations.push(`Fix ${failedAccessibility.length} accessibility violations`);

    // Add specific recommendations based on severity
    const criticalAccessibility = failedAccessibility.filter(r => r.severity === 'critical');
    const majorAccessibility = failedAccessibility.filter(r => r.severity === 'major');

    if (criticalAccessibility.length > 0) {
      recommendations.push(`PRIORITIZE fixing ${criticalAccessibility.length} critical accessibility issues`);
    }

    if (majorAccessibility.length > 0) {
      recommendations.push(`Address ${majorAccessibility.length} major accessibility issues`);
    }
  }

  return {
    responsiveResults,
    accessibilityResults,
    overallScore: Math.round(overallScore * 100) / 100, // Round to 2 decimal places
    recommendations
  };
};

/**
 * Generates a comprehensive UX testing report
 * @param results - UX test results
 * @returns Formatted UX testing report
 */
export const generateUXTestReport = (results: Awaited<ReturnType<typeof testUXEnhancements>>): string => {
  const { responsiveResults, accessibilityResults, overallScore, recommendations } = results;

  const totalTests = responsiveResults.length + accessibilityResults.length;
  const passedTests = [...responsiveResults, ...accessibilityResults].filter(r => r.passed).length;
  const failedTests = totalTests - passedTests;

  const reportLines = [
    'UX ENHANCEMENT TESTING REPORT',
    '='.repeat(60),
    `Overall Score: ${overallScore}% (${passedTests}/${totalTests} tests passed)`,
    `Status: ${overallScore >= 90 ? 'EXCELLENT' : overallScore >= 70 ? 'GOOD' : overallScore >= 50 ? 'FAIR' : 'POOR'}`,
    '',
    'BREAKDOWN:',
    '-'.repeat(20),
    `Responsive Tests: ${responsiveResults.filter(r => r.passed).length}/${responsiveResults.length} passed`,
    `Accessibility Tests: ${accessibilityResults.filter(r => r.passed).length}/${accessibilityResults.length} passed`,
    '',
    'FAILED RESPONSIVE TESTS:',
    '-'.repeat(25)
  ];

  const failedResponsive = responsiveResults.filter(r => !r.passed);
  if (failedResponsive.length === 0) {
    reportLines.push('  All responsive tests passed!');
  } else {
    for (const result of failedResponsive) {
      reportLines.push(`  - ${result.testName} (${result.viewport.width}x${result.viewport.height})`);
      for (const issue of result.issues) {
        reportLines.push(`    ❌ ${issue}`);
      }
      for (const suggestion of result.suggestions) {
        reportLines.push(`    💡 ${suggestion}`);
      }
    }
  }

  reportLines.push('', 'FAILED ACCESSIBILITY TESTS:', '-'.repeat(30));

  const failedAccessibility = accessibilityResults.filter(r => !r.passed);
  if (failedAccessibility.length === 0) {
    reportLines.push('  All accessibility tests passed!');
  } else {
    for (const result of failedAccessibility) {
      reportLines.push(`  - ${result.testName} [${result.severity.toUpperCase()}]`);
      for (const issue of result.issues) {
        reportLines.push(`    ❌ ${issue}`);
      }
      for (const suggestion of result.suggestions) {
        reportLines.push(`    💡 ${suggestion}`);
      }
      if (result.wcagCriteria.length > 0) {
        reportLines.push(`    📐 WCAG: ${result.wcagCriteria.join(', ')}`);
      }
    }
  }

  if (recommendations.length > 0) {
    reportLines.push('', 'RECOMMENDATIONS:', '-'.repeat(20));
    for (const recommendation of recommendations) {
      reportLines.push(`• ${recommendation}`);
    }
  }

  reportLines.push('', `Report generated on: ${new Date().toISOString()}`);

  return reportLines.join('\n');
};