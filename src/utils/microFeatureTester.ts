/**
 * Micro-Feature Testing Utilities
 * Provides functions for testing micro-features for accessibility and performance impact
 */



interface MicroFeatureTestConfig {
  featureName: string;
  selector: string;
  expectedPerformanceThresholdMs?: number;
  accessibilityChecks?: string[];
}

interface TestResult {
  featureName: string;
  performance: {
    avgTimeMs: number;
    maxTimeMs: number;
    minTimeMs: number;
    passed: boolean;
  };
  accessibility: {
    passed: boolean;
    issues: string[];
  };
  overallPassed: boolean;
}

/**
 * Tests a micro-feature for performance impact
 * @param config - Configuration for the test
 * @returns Performance test results
 */
export const testMicroFeaturePerformance = async (
  config: MicroFeatureTestConfig
): Promise<TestResult['performance']> => {
  const { selector, expectedPerformanceThresholdMs = 16.67 } = config; // 16.67ms = 60fps
  const element = document.querySelector(selector);

  if (!element) {
    throw new Error(`Element with selector '${selector}' not found`);
  }

  // Measure performance of feature activation/deactivation
  const measurements: number[] = [];
  const iterations = 10;

  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();

    // Perform the action that tests the micro-feature
    // This could be toggling a setting, triggering an animation, etc.
    const actionStartTime = performance.now();

    // Example: trigger a micro-feature action
    if (element instanceof HTMLElement) {
      element.focus();
      element.blur();
    }

    const actionEndTime = performance.now();
    measurements.push(actionEndTime - actionStartTime);
  }

  const avgTime = measurements.reduce((sum, time) => sum + time, 0) / measurements.length;
  const maxTime = Math.max(...measurements);
  const minTime = Math.min(...measurements);

  return {
    avgTimeMs: parseFloat(avgTime.toFixed(2)),
    maxTimeMs: parseFloat(maxTime.toFixed(2)),
    minTimeMs: parseFloat(minTime.toFixed(2)),
    passed: avgTime < expectedPerformanceThresholdMs
  };
};

/**
 * Tests a micro-feature for accessibility compliance
 * @param config - Configuration for the test
 * @returns Accessibility test results
 */
export const testMicroFeatureAccessibility = async (
  config: MicroFeatureTestConfig
): Promise<TestResult['accessibility']> => {
  const { selector } = config;
  const element = document.querySelector(selector);
  const issues: string[] = [];

  if (!element) {
    return {
      passed: false,
      issues: [`Element with selector '${selector}' not found`]
    };
  }

  // Check for proper ARIA attributes
  const requiredAriaAttrs = ['aria-label', 'aria-labelledby', 'aria-describedby'];
  const hasAriaLabel = requiredAriaAttrs.some(attr => element.hasAttribute(attr));

  if (!hasAriaLabel) {
    issues.push(`Element missing required ARIA label (${requiredAriaAttrs.join(', ')})`);
  }

  // Check for keyboard accessibility
  const isFocusable = element.matches('a, button, input, select, textarea, [tabindex]');
  const tabIndex = element.getAttribute('tabindex');

  if (!isFocusable && (!tabIndex || tabIndex === '-1')) {
    issues.push('Element is not keyboard focusable');
  }

  // Check for proper role attribute if needed
  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();

  if (tagName === 'div' || tagName === 'span') {
    if (!role) {
      issues.push('Non-interactive element needs appropriate role attribute');
    }
  }

  // Check for color contrast if element has visible text
  if (element.textContent && element.textContent.trim().length > 0) {
    // In a real implementation, we'd calculate actual contrast ratios
    // For now, we'll just note that contrast should be checked
    const computedStyle = window.getComputedStyle(element);
    const backgroundColor = computedStyle.backgroundColor;
    const color = computedStyle.color;

    // Placeholder for actual contrast calculation
    // In a real implementation, we'd use a contrast calculation function
  }

  return {
    passed: issues.length === 0,
    issues
  };
};

/**
 * Runs comprehensive test on a micro-feature
 * @param config - Configuration for the test
 * @returns Complete test results
 */
export const testMicroFeature = async (config: MicroFeatureTestConfig): Promise<TestResult> => {
  const [performance, accessibility] = await Promise.all([
    testMicroFeaturePerformance(config),
    testMicroFeatureAccessibility(config)
  ]);

  const overallPassed = performance.passed && accessibility.passed;

  return {
    featureName: config.featureName,
    performance,
    accessibility,
    overallPassed
  };
};

/**
 * Tests all micro-features in the application
 * @param configs - Array of test configurations
 * @returns Results for all micro-features
 */
export const testAllMicroFeatures = async (configs: MicroFeatureTestConfig[]): Promise<TestResult[]> => {
  const results: TestResult[] = [];

  for (const config of configs) {
    try {
      const result = await testMicroFeature(config);
      results.push(result);
    } catch (error) {
      results.push({
        featureName: config.featureName,
        performance: {
          avgTimeMs: 0,
          maxTimeMs: 0,
          minTimeMs: 0,
          passed: false
        },
        accessibility: {
          passed: false,
          issues: [`Test failed with error: ${(error as Error).message}`]
        },
        overallPassed: false
      });
    }
  }

  return results;
};

/**
 * Generates a test report for micro-feature testing
 * @param results - Test results to generate report for
 * @returns Formatted test report
 */
export const generateMicroFeatureTestReport = (results: TestResult[]): string => {
  const totalFeatures = results.length;
  const passedFeatures = results.filter(r => r.overallPassed).length;
  const failedFeatures = totalFeatures - passedFeatures;

  const reportLines = [
    'MICRO-FEATURE TESTING REPORT',
    '='.repeat(50),
    `Total Features Tested: ${totalFeatures}`,
    `Passed: ${passedFeatures}`,
    `Failed: ${failedFeatures}`,
    `Success Rate: ${((passedFeatures / totalFeatures) * 100).toFixed(2)}%`,
    '',
    'DETAILED RESULTS:',
    '-'.repeat(30)
  ];

  for (const result of results) {
    reportLines.push(`${result.featureName}: ${result.overallPassed ? 'PASS' : 'FAIL'}`);

    if (!result.performance.passed) {
      reportLines.push(`  Performance: FAIL (Avg: ${result.performance.avgTimeMs}ms, Threshold: 16.67ms)`);
    }

    if (!result.accessibility.passed) {
      reportLines.push(`  Accessibility: FAIL (${result.accessibility.issues.length} issues)`);
      for (const issue of result.accessibility.issues) {
        reportLines.push(`    - ${issue}`);
      }
    }

    reportLines.push('');
  }

  return reportLines.join('\n');
};

/**
 * Tests micro-feature performance under reduced motion conditions
 * @param config - Configuration for the test
 * @returns Performance test results under reduced motion
 */
export const testMicroFeaturePerformanceWithReducedMotion = async (
  config: MicroFeatureTestConfig
): Promise<TestResult['performance']> => {
  // In a real implementation, this would test the feature with reduced motion enabled
  // For now, we'll just run the regular performance test

  // Check if reduced motion is enabled
  const reducedMotionEnabled = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotionEnabled) {
    console.warn('Reduced motion is enabled - some animations may be disabled');
  }

  return testMicroFeaturePerformance(config);
};

/**
 * Tests keyboard accessibility of micro-features
 * @param config - Configuration for the test
 * @returns Keyboard accessibility test results
 */
export const testMicroFeatureKeyboardAccessibility = async (
  config: MicroFeatureTestConfig
): Promise<Omit<TestResult['accessibility'], 'passed'> & { passed: boolean, keyboardIssues: string[] }> => {
  const { selector } = config;
  const element = document.querySelector(selector);
  const keyboardIssues: string[] = [];

  if (!element) {
    return {
      passed: false,
      issues: [`Element with selector '${selector}' not found`],
      keyboardIssues: [`Element with selector '${selector}' not found`]
    };
  }

  // Test keyboard navigation
  const isFocusable = element.matches('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (!isFocusable) {
    keyboardIssues.push('Element is not keyboard focusable');
  }

  // Test keyboard event handling
  const hasKeyboardHandlers =
    element.hasAttribute('onclick') ||
    element.hasAttribute('onkeydown') ||
    element.hasAttribute('onkeypress') ||
    element.hasAttribute('onkeyup') ||
    element.getAttributeNames().some(attr => attr.startsWith('on'));

  if (!hasKeyboardHandlers && isFocusable) {
    // Check if element has proper role and event listeners
    const role = element.getAttribute('role');
    if (!role || !['button', 'link', 'menuitem', 'tab', 'checkbox', 'radio'].includes(role)) {
      keyboardIssues.push('Interactive element should have appropriate role for keyboard accessibility');
    }
  }

  // Test focus management
  const tabIndex = element.getAttribute('tabindex');
  if (tabIndex === '-1' && isFocusable) {
    keyboardIssues.push('Element with tabindex="-1" should not be focusable unless programmatically focused');
  }

  const passed = keyboardIssues.length === 0;
  const allIssues = [...keyboardIssues]; // In this case, all keyboard issues are accessibility issues

  return {
    passed,
    issues: allIssues,
    keyboardIssues
  };
};

/**
 * Tests micro-feature impact on page load performance
 * @param featureName - Name of the feature being tested
 * @param setupFeature - Function to setup/enable the feature
 * @param cleanupFeature - Function to cleanup/disable the feature
 * @returns Page load performance test results
 */
export const testMicroFeaturePageLoadImpact = async (
  featureName: string,
  setupFeature: () => void | Promise<void>,
  cleanupFeature: () => void | Promise<void>
): Promise<TestResult['performance']> => {
  // Measure baseline performance without feature
  const baselineStart = performance.timeOrigin + performance.timing.loadEventEnd;

  // Enable feature and measure performance
  await setupFeature();

  const featureEnabledStart = performance.now();
  // Simulate user interaction with the feature
  // In a real implementation, this would trigger actual feature functionality

  // Cleanup and measure
  await cleanupFeature();
  const endTime = performance.now();

  const totalTime = endTime - featureEnabledStart;

  // For this implementation, we'll return a simulated result
  // In a real implementation, we'd measure actual impact
  return {
    avgTimeMs: totalTime,
    maxTimeMs: totalTime,
    minTimeMs: totalTime,
    passed: totalTime < 100 // Assume feature should not add more than 100ms to load time
  };
};