/**
 * Accessibility Compliance Testing Utilities
 * Provides functions for testing accessibility compliance with both automated and manual testing approaches
 */

interface AutomatedTestResult {
  id: string;
  description: string;
  passed: boolean;
  elementsAffected: string[];
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  wcagLevel: 'A' | 'AA' | 'AAA';
  wcagCriteria: string[];
  automated: boolean;
  manualVerificationNeeded: boolean;
}

interface ManualTestResult {
  id: string;
  description: string;
  passed: boolean | null; // null means not yet tested
  testerNotes: string;
  verificationSteps: string[];
  evidence: string; // Screenshots, screen reader output, etc.
  wcagLevel: 'A' | 'AA' | 'AAA';
  wcagCriteria: string[];
  automated: false;
}

interface AccessibilityTestResult {
  componentName: string;
  automatedTests: AutomatedTestResult[];
  manualTests: ManualTestResult[];
  overallScore: number;
  complianceLevel: 'A' | 'AA' | 'AAA' | 'none';
  recommendations: string[];
  timestamp: string;
}

interface AccessibilityTestConfig {
  componentName: string;
  includeAutomatedTests: boolean;
  includeManualTests: boolean;
  targetLevel: 'A' | 'AA' | 'AAA';
  testScope: 'component' | 'page' | 'application';
  customTests?: Array<{
    id: string;
    description: string;
    testFunction: (element: Element) => boolean;
    wcagCriteria: string[];
    severity: 'critical' | 'serious' | 'moderate' | 'minor';
  }>;
}

/**
 * Runs automated accessibility tests on a component
 * @param element - The component element to test
 * @returns Automated accessibility test results
 */
export const runAutomatedAccessibilityTests = async (element: Element): Promise<AutomatedTestResult[]> => {
  const results: AutomatedTestResult[] = [];

  // Test 1: Check for proper heading structure
  const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
  if (headings.length > 0) {
    const headingLevels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)));
    let lastLevel = 0;
    for (let i = 0; i < headingLevels.length; i++) {
      if (i > 0 && headingLevels[i] > lastLevel + 1) {
        results.push({
          id: 'heading-structure',
          description: `Skipped heading level from H${lastLevel} to H${headingLevels[i]}`,
          passed: false,
          elementsAffected: [headings[i].tagName.toLowerCase()],
          severity: 'moderate',
          wcagLevel: 'AA',
          wcagCriteria: ['1.3.1', '2.4.6'],
          automated: true,
          manualVerificationNeeded: false
        });
      }
      lastLevel = headingLevels[i];
    }

    // Ensure there's only one H1
    const h1Count = headingLevels.filter(level => level === 1).length;
    if (h1Count !== 1) {
      results.push({
        id: 'single-h1',
        description: `Page should have exactly one H1 (found ${h1Count})`,
        passed: false,
        elementsAffected: ['h1'],
        severity: 'moderate',
        wcagLevel: 'AA',
        wcagCriteria: ['1.3.1', '2.4.2'],
        automated: true,
        manualVerificationNeeded: false
      });
    }
  }

  // Test 2: Check for proper ARIA attributes
  const ariaElements = element.querySelectorAll('[role], [aria-*]');
  for (const el of Array.from(ariaElements)) {
    // Check for abstract roles
    const role = el.getAttribute('role');
    if (role && [
      'command', 'composite', 'input', 'landmark', 'range', 'roletype',
      'section', 'sectionhead', 'select', 'structure', 'widget', 'window'
    ].includes(role)) {
      results.push({
        id: 'abstract-role',
        description: `Abstract ARIA role "${role}" should not be used directly`,
        passed: false,
        elementsAffected: [el.tagName.toLowerCase()],
        severity: 'serious',
        wcagLevel: 'A',
        wcagCriteria: ['4.1.2'],
        automated: true,
        manualVerificationNeeded: false
      });
    }

    // Check for required ARIA attributes
    if (role === 'combobox') {
      if (!el.hasAttribute('aria-expanded') || !el.hasAttribute('aria-controls')) {
        results.push({
          id: 'missing-required-aria',
          description: `Combobox role requires aria-expanded and aria-controls attributes`,
          passed: false,
          elementsAffected: [el.tagName.toLowerCase()],
          severity: 'serious',
          wcagLevel: 'A',
          wcagCriteria: ['1.3.1', '4.1.2'],
          automated: true,
          manualVerificationNeeded: false
        });
      }
    }
  }

  // Test 3: Check for form labels
  const formControls = element.querySelectorAll('input, textarea, select');
  for (const control of Array.from(formControls)) {
    const controlId = (control as HTMLElement).id;
    let hasLabel = false;

    // Check for associated label
    if (controlId) {
      const associatedLabel = element.querySelector(`label[for="${controlId}"]`);
      if (associatedLabel) hasLabel = true;
    }

    // Check for aria-label
    if (control.hasAttribute('aria-label')) hasLabel = true;

    // Check for aria-labelledby
    if (control.hasAttribute('aria-labelledby')) hasLabel = true;

    // Check for title attribute (not ideal but acceptable)
    if (control.hasAttribute('title')) hasLabel = true;

    if (!hasLabel) {
      results.push({
        id: 'missing-label',
        description: `Form control missing associated label or ARIA label`,
        passed: false,
        elementsAffected: [control.tagName.toLowerCase()],
        severity: 'serious',
        wcagLevel: 'A',
        wcagCriteria: ['1.3.1', '3.3.2', '4.1.2'],
        automated: true,
        manualVerificationNeeded: false
      });
    }
  }

  // Test 4: Check for image alt text
  const images = element.querySelectorAll('img');
  for (const img of Array.from(images)) {
    const alt = img.getAttribute('alt');
    if (alt === null) {
      results.push({
        id: 'missing-alt',
        description: `Image missing alt attribute`,
        passed: false,
        elementsAffected: ['img'],
        severity: 'serious',
        wcagLevel: 'A',
        wcagCriteria: ['1.1.1'],
        automated: true,
        manualVerificationNeeded: false
      });
    } else if (alt === '') {
      // Check if the image is decorative by looking for ARIA attributes
      const isDecorative = img.hasAttribute('aria-hidden') || img.getAttribute('role') === 'presentation';
      if (!isDecorative) {
        results.push({
          id: 'decorative-image-without-aria',
          description: `Image with empty alt may need aria-hidden or role=presentation if truly decorative`,
          passed: false,
          elementsAffected: ['img'],
          severity: 'minor',
          wcagLevel: 'A',
          wcagCriteria: ['1.1.1'],
          automated: true,
          manualVerificationNeeded: true
        });
      }
    }
  }

  // Test 5: Check for keyboard accessibility
  const focusableElements = element.querySelectorAll('a, button, input, select, textarea, [tabindex], [role="button"], [role="link"]');
  for (const el of Array.from(focusableElements)) {
    // Check if element is focusable but not keyboard operable
    const hasClickHandler = el.hasAttribute('onclick') ||
                           el.hasAttribute('onkeydown') ||
                           el.hasAttribute('onkeypress') ||
                           el.hasAttribute('onkeyup');

    const role = el.getAttribute('role');
    if (hasClickHandler && !['button', 'link', 'checkbox', 'radio', 'menuitem'].includes(role || '') &&
        !el.hasAttribute('tabindex')) {
      results.push({
        id: 'keyboard-access',
        description: `Interactive element missing proper role or tabindex for keyboard access`,
        passed: false,
        elementsAffected: [el.tagName.toLowerCase()],
        severity: 'serious',
        wcagLevel: 'A',
        wcagCriteria: ['2.1.1', '2.1.3'],
        automated: true,
        manualVerificationNeeded: true
      });
    }
  }

  // Test 6: Check for duplicate IDs
  const allElements = element.querySelectorAll('*[id]');
  const idCounts: Record<string, number> = {};
  const duplicateIds: string[] = [];

  for (const el of Array.from(allElements)) {
    const id = el.getAttribute('id');
    if (id) {
      idCounts[id] = (idCounts[id] || 0) + 1;
      if (idCounts[id] === 2) { // First duplicate
        duplicateIds.push(id);
      }
    }
  }

  if (duplicateIds.length > 0) {
    results.push({
      id: 'duplicate-ids',
      description: `Found duplicate IDs: ${duplicateIds.join(', ')}`,
      passed: false,
      elementsAffected: duplicateIds,
      severity: 'critical',
      wcagLevel: 'A',
      wcagCriteria: ['4.1.1'],
      automated: true,
      manualVerificationNeeded: false
    });
  }

  // Test 7: Check for color contrast (this is limited in automated testing)
  // We can only detect if there are text elements and flag for manual verification
  const textElements = element.querySelectorAll('*');
  for (const el of Array.from(textElements)) {
    if (el.textContent && el.textContent.trim().length > 0) {
      // Check if element is visible
      const computedStyle = window.getComputedStyle(el);
      if (computedStyle.display !== 'none' &&
          computedStyle.visibility !== 'hidden' &&
          computedStyle.opacity !== '0') {
        // Flag for manual contrast checking
        results.push({
          id: 'color-contrast',
          description: `Text element needs color contrast verification`,
          passed: true, // Assume passed, but needs manual check
          elementsAffected: [el.tagName.toLowerCase()],
          severity: 'moderate',
          wcagLevel: 'AA',
          wcagCriteria: ['1.4.3', '1.4.6'],
          automated: true,
          manualVerificationNeeded: true
        });
      }
    }
  }

  return results;
};

/**
 * Generates manual accessibility tests that require human verification
 * @param element - The component element to test
 * @returns Manual accessibility test results
 */
export const generateManualAccessibilityTests = (element: Element): ManualTestResult[] => {
  const results: ManualTestResult[] = [];

  // Manual test 1: Screen reader compatibility
  results.push({
    id: 'screen-reader-compatibility',
    description: 'Verify component is properly announced by screen readers',
    passed: null,
    testerNotes: 'Use NVDA, JAWS, or VoiceOver to test screen reader compatibility',
    verificationSteps: [
      'Navigate to the component using screen reader',
      'Verify all interactive elements are announced',
      'Check that ARIA labels are read correctly',
      'Ensure logical reading order'
    ],
    evidence: '',
    wcagLevel: 'A',
    wcagCriteria: ['1.3.1', '4.1.2'],
    automated: false
  });

  // Manual test 2: Focus order and visibility
  results.push({
    id: 'focus-order-visibility',
    description: 'Verify focus order is logical and focus indicators are visible',
    passed: null,
    testerNotes: 'Test keyboard navigation through the component',
    verificationSteps: [
      'Tab through all interactive elements',
      'Verify focus moves in logical order',
      'Check that focus indicators are visible',
      'Ensure no keyboard traps exist'
    ],
    evidence: '',
    wcagLevel: 'A',
    wcagCriteria: ['2.4.3', '2.1.1'],
    automated: false
  });

  // Manual test 3: Color independence
  results.push({
    id: 'color-independence',
    description: 'Verify component is usable without relying on color alone',
    passed: null,
    testerNotes: 'Test component functionality without color perception',
    verificationSteps: [
      'Use a color blindness simulator',
      'Ensure information is conveyed through other means than color',
      'Check that links are distinguishable without color'
    ],
    evidence: '',
    wcagLevel: 'A',
    wcagCriteria: ['1.4.1'],
    automated: false
  });

  // Manual test 4: Resize text capability
  results.push({
    id: 'text-resize-capability',
    description: 'Verify text can be resized up to 200% without loss of content or functionality',
    passed: null,
    testerNotes: 'Test component at different text sizes',
    verificationSteps: [
      'Increase browser text size to 200%',
      'Verify no horizontal scrolling is needed',
      'Ensure all content remains visible and functional',
      'Check that UI components don\'t overlap'
    ],
    evidence: '',
    wcagLevel: 'AA',
    wcagCriteria: ['1.4.4'],
    automated: false
  });

  // Manual test 5: Motion and animation considerations
  results.push({
    id: 'motion-animation-considerations',
    description: 'Verify component respects user preferences for reduced motion',
    passed: null,
    testerNotes: 'Test component with reduced motion enabled',
    verificationSteps: [
      'Enable reduced motion in operating system',
      'Verify animations are minimized or disabled',
      'Check that essential animations are still functional'
    ],
    evidence: '',
    wcagLevel: 'A',
    wcagCriteria: ['2.3.1'],
    automated: false
  });

  return results;
};

/**
 * Runs comprehensive accessibility testing (both automated and manual)
 * @param config - Configuration for the accessibility test
 * @returns Comprehensive accessibility test results
 */
export const runAccessibilityComplianceTest = async (config: AccessibilityTestConfig): Promise<AccessibilityTestResult> => {
  const element = document.querySelector(config.componentName);
  if (!element) {
    throw new Error(`Component with selector "${config.componentName}" not found`);
  }

  const automatedTests: AutomatedTestResult[] = [];
  const manualTests: ManualTestResult[] = [];

  // Run automated tests if enabled
  if (config.includeAutomatedTests) {
    const autoResults = await runAutomatedAccessibilityTests(element);
    automatedTests.push(...autoResults);

    // Apply custom tests if provided
    if (config.customTests) {
      for (const customTest of config.customTests) {
        const elements = element.querySelectorAll('*');
        let passed = true;
        const affectedElements: string[] = [];

        for (const el of Array.from(elements)) {
          if (!customTest.testFunction(el)) {
            passed = false;
            affectedElements.push(el.tagName.toLowerCase());
          }
        }

        automatedTests.push({
          id: customTest.id,
          description: customTest.description,
          passed,
          elementsAffected: affectedElements,
          severity: customTest.severity,
          wcagLevel: config.targetLevel,
          wcagCriteria: customTest.wcagCriteria,
          automated: true,
          manualVerificationNeeded: !passed
        });
      }
    }
  }

  // Generate manual tests if enabled
  if (config.includeManualTests) {
    const manualResults = generateManualAccessibilityTests(element);
    manualTests.push(...manualResults);
  }

  // Calculate overall score
  const totalTests = automatedTests.length + manualTests.length;
  if (totalTests === 0) {
    return {
      componentName: config.componentName,
      automatedTests: [],
      manualTests: [],
      overallScore: 100,
      complianceLevel: config.targetLevel,
      recommendations: ['No tests were run - verify configuration'],
      timestamp: new Date().toISOString()
    };
  }

  // Count passed automated tests (only those that don't need manual verification)
  const passedAutomated = automatedTests.filter(t => t.passed && !t.manualVerificationNeeded).length;
  const totalAutomated = automatedTests.length;

  // For manual tests, we count those marked as passed
  const passedManual = manualTests.filter(t => t.passed === true).length;
  const totalManual = manualTests.length;

  // Calculate score based on automated tests (since manual tests are pending)
  const automatedScore = totalAutomated > 0 ? (passedAutomated / totalAutomated) * 100 : 100;
  const overallScore = Math.round(automatedScore);

  // Determine compliance level based on results
  let complianceLevel: 'A' | 'AA' | 'AAA' | 'none' = 'none';
  if (overallScore >= 95) {
    complianceLevel = 'AAA';
  } else if (overallScore >= 90) {
    complianceLevel = 'AA';
  } else if (overallScore >= 80) {
    complianceLevel = 'A';
  }

  // Generate recommendations
  const recommendations: string[] = [];

  // Add recommendations based on automated test failures
  const criticalIssues = automatedTests.filter(t => t.severity === 'critical' && !t.passed);
  const seriousIssues = automatedTests.filter(t => t.severity === 'serious' && !t.passed);
  const moderateIssues = automatedTests.filter(t => t.severity === 'moderate' && !t.passed);

  if (criticalIssues.length > 0) {
    recommendations.push(`Address ${criticalIssues.length} critical accessibility issues immediately`);
  }

  if (seriousIssues.length > 0) {
    recommendations.push(`Fix ${seriousIssues.length} serious accessibility issues`);
  }

  if (moderateIssues.length > 0) {
    recommendations.push(`Resolve ${moderateIssues.length} moderate accessibility issues`);
  }

  // Add recommendations for manual tests that need to be completed
  const untestedManual = manualTests.filter(t => t.passed === null);
  if (untestedManual.length > 0) {
    recommendations.push(`Complete ${untestedManual.length} manual accessibility tests`);
  }

  if (recommendations.length === 0) {
    recommendations.push('Component appears to meet accessibility standards - continue with manual verification');
  }

  return {
    componentName: config.componentName,
    automatedTests,
    manualTests,
    overallScore,
    complianceLevel,
    recommendations,
    timestamp: new Date().toISOString()
  };
};

/**
 * Generates an accessibility compliance report
 * @param testResult - Results from accessibility compliance test
 * @returns Formatted accessibility compliance report
 */
export const generateAccessibilityReport = (testResult: AccessibilityTestResult): string => {
  const { automatedTests, manualTests, overallScore, complianceLevel, recommendations } = testResult;

  const reportLines = [
    'ACCESSIBILITY COMPLIANCE REPORT',
    '='.repeat(60),
    `Component: ${testResult.componentName}`,
    `Test Date: ${testResult.timestamp}`,
    `Overall Score: ${overallScore}/100`,
    `Compliance Level: ${complianceLevel}`,
    `Status: ${overallScore >= 90 ? '✅ PASS' : overallScore >= 70 ? '⚠️ PARTIAL' : '❌ FAIL'}`,
    '',
    'AUTOMATED TESTS:',
    '-'.repeat(20),
    `Total: ${automatedTests.length}`,
    `Passed: ${automatedTests.filter(t => t.passed).length}`,
    `Failed: ${automatedTests.filter(t => !t.passed).length}`,
    `Need Manual Verification: ${automatedTests.filter(t => t.manualVerificationNeeded).length}`,
    ''
  ];

  // Detail automated test results
  for (const test of automatedTests) {
    const status = test.passed ? '✅' : '❌';
    const manualNote = test.manualVerificationNeeded ? ' (manual verification needed)' : '';
    reportLines.push(`${status} ${test.description}${manualNote}`);

    if (!test.passed) {
      reportLines.push(`    Severity: ${test.severity}`);
      reportLines.push(`    WCAG: ${test.wcagLevel} - ${test.wcagCriteria.join(', ')}`);
      reportLines.push(`    Affected: ${test.elementsAffected.join(', ')}`);
    }
  }

  reportLines.push('', 'MANUAL TESTS:', '-'.repeat(20));
  reportLines.push(`Total: ${manualTests.length}`);
  reportLines.push(`Completed: ${manualTests.filter(t => t.passed !== null).length}`);
  reportLines.push(`Pending: ${manualTests.filter(t => t.passed === null).length}`, '');

  for (const test of manualTests) {
    const status = test.passed === null ? '?' : test.passed ? '✅' : '❌';
    reportLines.push(`${status} ${test.description}`);
    reportLines.push(`    WCAG: ${test.wcagLevel} - ${test.wcagCriteria.join(', ')}`);
  }

  reportLines.push('', 'RECOMMENDATIONS:', '-'.repeat(20));
  for (const rec of recommendations) {
    reportLines.push(`• ${rec}`);
  }

  reportLines.push('', 'NEXT STEPS:', '-'.repeat(15));
  reportLines.push('1. Address all critical and serious issues immediately');
  reportLines.push('2. Complete pending manual tests');
  reportLines.push('3. Re-run accessibility tests after fixes');
  reportLines.push('4. Consider user testing with people with disabilities');

  return reportLines.join('\n');
};

/**
 * Runs accessibility tests across multiple components
 * @param configs - Array of configurations for accessibility tests
 * @returns Array of accessibility test results
 */
export const runAccessibilityAudit = async (configs: AccessibilityTestConfig[]): Promise<AccessibilityTestResult[]> => {
  const results: AccessibilityTestResult[] = [];

  for (const config of configs) {
    try {
      const result = await runAccessibilityComplianceTest(config);
      results.push(result);
    } catch (error) {
      console.error(`Error testing component ${config.componentName}:`, error);

      // Add error result
      results.push({
        componentName: config.componentName,
        automatedTests: [{
          id: 'test-error',
          description: `Error running accessibility test: ${(error as Error).message}`,
          passed: false,
          elementsAffected: [],
          severity: 'critical',
          wcagLevel: 'A',
          wcagCriteria: [],
          automated: true,
          manualVerificationNeeded: false
        }],
        manualTests: [],
        overallScore: 0,
        complianceLevel: 'none',
        recommendations: [`Fix the component so accessibility tests can run: ${(error as Error).message}`],
        timestamp: new Date().toISOString()
      });
    }
  }

  return results;
};

/**
 * Validates WCAG 2.1 AA compliance for a set of components
 * @param componentSelectors - Array of CSS selectors for components to test
 * @returns WCAG 2.1 AA compliance validation results
 */
export const validateWCAG21AACompliance = async (componentSelectors: string[]): Promise<{
  summary: {
    totalComponents: number;
    compliantComponents: number;
    nonCompliantComponents: number;
    overallComplianceRate: number;
  };
  detailedResults: AccessibilityTestResult[];
}> => {
  const configs: AccessibilityTestConfig[] = componentSelectors.map(selector => ({
    componentName: selector,
    includeAutomatedTests: true,
    includeManualTests: true,
    targetLevel: 'AA',
    testScope: 'component'
  }));

  const results = await runAccessibilityAudit(configs);

  const compliantComponents = results.filter(r =>
    r.overallScore >= 90 && r.complianceLevel !== 'none'
  ).length;

  const summary = {
    totalComponents: results.length,
    compliantComponents,
    nonCompliantComponents: results.length - compliantComponents,
    overallComplianceRate: results.length > 0 ? Math.round((compliantComponents / results.length) * 100) : 0
  };

  return {
    summary,
    detailedResults: results
  };
};