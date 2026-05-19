/**
 * WCAG 2.1 AA Compliance Testing Utilities
 * Provides functions for checking and validating WCAG 2.1 AA compliance across components
 */

interface WCAG21AATestResult {
  component: string;
  wcagGuidelines: string[];
  issues: Array<{
    id: string;
    level: 'A' | 'AA' | 'AAA';
    severity: 'critical' | 'major' | 'minor';
    description: string;
    elementSelector: string;
    suggestedFix: string;
    conformanceLevel: 'A' | 'AA' | 'AAA';
  }>;
  passed: boolean;
  overallScore: number;
}

interface WCAG21AAConfig {
  componentsToTest: string[];
  includeAutomatedChecks: boolean;
  targetLevel: 'A' | 'AA' | 'AAA';
  customRules?: Array<{
    selector: string;
    check: (element: Element) => boolean;
    message: string;
    level: 'A' | 'AA' | 'AAA';
  }>;
}

/**
 * Tests a component for WCAG 2.1 AA compliance
 * @param componentSelector - CSS selector for the component to test
 * @returns WCAG 2.1 AA compliance test results
 */
export const testComponentWCAG21AA = async (componentSelector: string): Promise<WCAG21AATestResult> => {
  const element = document.querySelector(componentSelector);
  if (!element) {
    return {
      component: componentSelector,
      wcagGuidelines: [],
      issues: [{
        id: 'element-not-found',
        level: 'A',
        severity: 'critical',
        description: `Component with selector "${componentSelector}" not found`,
        elementSelector: componentSelector,
        suggestedFix: `Verify that the component with selector "${componentSelector}" exists in the DOM`,
        conformanceLevel: 'A'
      }],
      passed: false,
      overallScore: 0
    };
  }

  const issues: WCAG21AATestResult['issues'] = [];

  // Check for proper heading structure
  const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
  if (headings.length > 0) {
    const headingLevels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)));
    for (let i = 1; i < headingLevels.length; i++) {
      if (headingLevels[i] > headingLevels[i - 1] + 1) {
        issues.push({
          id: 'skipped-heading-level',
          level: 'AA',
          severity: 'major',
          description: `Skipped heading level from H${headingLevels[i - 1]} to H${headingLevels[i]}`,
          elementSelector: headings[i].tagName.toLowerCase(),
          suggestedFix: `Use proper heading hierarchy (H1 → H2 → H3, etc.) without skipping levels`,
          conformanceLevel: 'AA'
        });
      }
    }
  }

  // Check for color contrast
  const elementsToCheck = element.querySelectorAll('*');
  for (const el of Array.from(elementsToCheck)) {
    if (el.textContent && el.textContent.trim().length > 0) {
      const computedStyle = window.getComputedStyle(el);
      const color = computedStyle.color;
      const backgroundColor = computedStyle.backgroundColor;

      // Skip elements that are purely decorative
      if (el.getAttribute('aria-hidden') === 'true' ||
          computedStyle.display === 'none' ||
          computedStyle.visibility === 'hidden') {
        continue;
      }

      // For WCAG 2.1 AA, we need 4.5:1 contrast for normal text, 3:1 for large text
      // This is a simplified check - in a real implementation, we'd calculate actual contrast ratios
      const fontSize = parseFloat(computedStyle.fontSize);
      const isLargeText = fontSize >= 18 || (computedStyle.fontWeight === 'bold' && fontSize >= 14);

      // Placeholder for actual contrast calculation
      // In a real implementation, we would use a contrast calculation function
      // For now, we'll just add a note to manually check contrast
      if (isLargeText) {
        // WCAG AA requires 3:1 for large text
        issues.push({
          id: 'manual-contrast-check',
          level: 'AA',
          severity: 'major',
          description: `Large text element requires 3:1 contrast ratio - manual verification needed`,
          elementSelector: el.tagName.toLowerCase(),
          suggestedFix: `Verify that text and background colors meet 3:1 contrast ratio for large text`,
          conformanceLevel: 'AA'
        });
      } else {
        // WCAG AA requires 4.5:1 for normal text
        issues.push({
          id: 'manual-contrast-check',
          level: 'AA',
          severity: 'major',
          description: `Normal text element requires 4.5:1 contrast ratio - manual verification needed`,
          elementSelector: el.tagName.toLowerCase(),
          suggestedFix: `Verify that text and background colors meet 4.5:1 contrast ratio for normal text`,
          conformanceLevel: 'AA'
        });
      }
    }
  }

  // Check for proper ARIA labels and descriptions
  const elementsWithAria = element.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby], [role]');
  for (const el of Array.from(elementsWithAria)) {
    const role = el.getAttribute('role');

    // Check for abstract roles
    if (['command', 'composite', 'input', 'landmark', 'range', 'roletype', 'section', 'sectionhead', 'select', 'structure', 'widget', 'window'].includes(role || '')) {
      issues.push({
        id: 'abstract-role-used',
        level: 'A',
        severity: 'major',
        description: `Abstract ARIA role "${role}" should not be used directly`,
        elementSelector: el.tagName.toLowerCase(),
        suggestedFix: `Use concrete ARIA roles instead of abstract roles`,
        conformanceLevel: 'A'
      });
    }

    // Check for required owned elements
    if (role === 'list') {
      const listItems = el.querySelectorAll('li, [role="listitem"]');
      if (listItems.length === 0) {
        issues.push({
          id: 'missing-owned-elements',
          level: 'A',
          severity: 'major',
          description: `List role requires owned listitem elements`,
          elementSelector: el.tagName.toLowerCase(),
          suggestedFix: `Add li or elements with role="listitem" inside the element with role="list"`,
          conformanceLevel: 'A'
        });
      }
    }
  }

  // Check for keyboard accessibility
  const interactiveElements = element.querySelectorAll('a, button, input, select, textarea, [tabindex], [role="button"], [role="link"], [role="menuitem"]');
  for (const el of Array.from(interactiveElements)) {
    // Check if element has proper focus management
    const tabIndex = el.getAttribute('tabindex');
    if (tabIndex === '-1' && el.parentElement && !el.parentElement.querySelector('a, button, input, select, textarea')) {
      // If element has tabindex="-1" but parent doesn't have other focusable elements, it might be an issue
      issues.push({
        id: 'focus-management',
        level: 'A',
        severity: 'minor',
        description: `Element with tabindex="-1" might not be keyboard accessible`,
        elementSelector: el.tagName.toLowerCase(),
        suggestedFix: `Ensure element is part of natural tab order or programmatically focusable`,
        conformanceLevel: 'A'
      });
    }

    // Check for focus indicators
    // This is hard to check automatically, so we'll add a general recommendation
    if (['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName)) {
      // These elements typically have focus indicators by default
    } else {
      // Custom interactive elements should have visible focus indicators
      issues.push({
        id: 'focus-indicator',
        level: 'A',
        severity: 'major',
        description: `Custom interactive element should have visible focus indicator`,
        elementSelector: el.tagName.toLowerCase(),
        suggestedFix: `Add CSS to provide visible focus indicator for keyboard users`,
        conformanceLevel: 'A'
      });
    }
  }

  // Check for form labels
  const formElements = element.querySelectorAll('input, textarea, select');
  for (const el of Array.from(formElements)) {
    const inputEl = el as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const id = inputEl.id;
    let hasLabel = false;

    // Check for associated label
    if (id) {
      const associatedLabel = document.querySelector(`label[for="${id}"]`);
      if (associatedLabel) {
        hasLabel = true;
      }
    }

    // Check for aria-label or aria-labelledby
    if (inputEl.hasAttribute('aria-label') || inputEl.hasAttribute('aria-labelledby')) {
      hasLabel = true;
    }

    // Check for placeholder (not sufficient as primary label, but better than nothing)
    if (inputEl.hasAttribute('placeholder') && !hasLabel) {
      issues.push({
        id: 'placeholder-instead-of-label',
        level: 'A',
        severity: 'major',
        description: `Form field has placeholder but no proper label`,
        elementSelector: inputEl.tagName.toLowerCase(),
        suggestedFix: `Add a proper label element or use aria-label/aria-labelledby`,
        conformanceLevel: 'A'
      });
    } else if (!hasLabel) {
      // No label at all
      issues.push({
        id: 'missing-form-label',
        level: 'A',
        severity: 'critical',
        description: `Form field is missing a label`,
        elementSelector: inputEl.tagName.toLowerCase(),
        suggestedFix: `Add a label element associated with the form field`,
        conformanceLevel: 'A'
      });
    }
  }

  // Check for image alt text
  const images = element.querySelectorAll('img');
  for (const img of Array.from(images)) {
    const altText = img.getAttribute('alt');
    if (altText === null) {
      issues.push({
        id: 'missing-image-alt',
        level: 'A',
        severity: 'critical',
        description: `Image is missing alt attribute`,
        elementSelector: 'img',
        suggestedFix: `Add alt attribute with descriptive text: <img alt="description of image" ...>`,
        conformanceLevel: 'A'
      });
    } else if (altText === '') {
      // Empty alt is acceptable for decorative images, but we should verify
      // In a real implementation, we'd need more context to determine if it's decorative
      issues.push({
        id: 'empty-image-alt',
        level: 'A',
        severity: 'minor',
        description: `Image has empty alt attribute - verify it's decorative`,
        elementSelector: 'img',
        suggestedFix: `Confirm image is purely decorative; otherwise, add descriptive alt text`,
        conformanceLevel: 'A'
      });
    }
  }

  // Calculate WCAG guidelines covered
  const guidelines = Array.from(new Set(issues.map(i => i.conformanceLevel)));

  // Calculate score
  const maxIssues = 10; // Arbitrary maximum for scoring
  const score = Math.max(0, 100 - (Math.min(issues.length, maxIssues) * 10));

  return {
    component: componentSelector,
    wcagGuidelines: guidelines,
    issues,
    passed: issues.length === 0,
    overallScore: Math.round(score)
  };
};

/**
 * Tests multiple components for WCAG 2.1 AA compliance
 * @param config - Configuration for the test
 * @returns Array of WCAG 2.1 AA compliance test results
 */
export const testComponentsWCAG21AA = async (config: WCAG21AAConfig): Promise<WCAG21AATestResult[]> => {
  const results: WCAG21AATestResult[] = [];

  for (const component of config.componentsToTest) {
    const result = await testComponentWCAG21AA(component);
    results.push(result);

    // Apply custom rules if provided
    if (config.customRules) {
      for (const customRule of config.customRules) {
        const elements = document.querySelectorAll(customRule.selector);
        for (const element of Array.from(elements)) {
          if (!customRule.check(element)) {
            // Add custom rule violation to the result
            result.issues.push({
              id: `custom-rule-${customRule.message}`,
              level: customRule.level,
              severity: 'major',
              description: customRule.message,
              elementSelector: customRule.selector,
              suggestedFix: `Review and fix the violation of custom rule: ${customRule.message}`,
              conformanceLevel: customRule.level
            });

            // Update the result as failed
            result.passed = false;
            result.overallScore = Math.max(0, result.overallScore - 10);
          }
        }
      }
    }
  }

  return results;
};

/**
 * Runs a comprehensive WCAG 2.1 AA audit on the entire application
 * @param config - Configuration for the audit
 * @returns Comprehensive WCAG 2.1 AA audit results
 */
export const runWCAG21AAAudit = async (config: WCAG21AAConfig): Promise<{
  results: WCAG21AATestResult[];
  summary: {
    totalComponents: number;
    passedComponents: number;
    failedComponents: number;
    overallScore: number;
    criticalIssues: number;
    majorIssues: number;
    minorIssues: number;
  };
}> => {
  const results = await testComponentsWCAG21AA(config);

  // Calculate summary
  const totalComponents = results.length;
  const passedComponents = results.filter(r => r.passed).length;
  const failedComponents = totalComponents - passedComponents;

  // Count different severity issues
  let criticalIssues = 0;
  let majorIssues = 0;
  let minorIssues = 0;

  for (const result of results) {
    for (const issue of result.issues) {
      if (issue.severity === 'critical') criticalIssues++;
      else if (issue.severity === 'major') majorIssues++;
      else minorIssues++;
    }
  }

  // Calculate overall score
  const totalScore = results.reduce((sum, result) => sum + result.overallScore, 0);
  const overallScore = totalComponents > 0 ? Math.round(totalScore / totalComponents) : 0;

  return {
    results,
    summary: {
      totalComponents,
      passedComponents,
      failedComponents,
      overallScore,
      criticalIssues,
      majorIssues,
      minorIssues
    }
  };
};

/**
 * Generates a WCAG 2.1 AA compliance report
 * @param auditResults - Results from WCAG 2.1 AA audit
 * @returns Formatted WCAG 2.1 AA compliance report
 */
export const generateWCAG21AAReport = (auditResults: ReturnType<typeof runWCAG21AAAudit> extends Promise<infer T> ? T : never): string => {
  const { results, summary } = auditResults;

  const reportLines = [
    'WCAG 2.1 AA COMPLIANCE REPORT',
    '='.repeat(60),
    `Audit Date: ${new Date().toISOString()}`,
    `Total Components Tested: ${summary.totalComponents}`,
    `Passed Components: ${summary.passedComponents}`,
    `Failed Components: ${summary.failedComponents}`,
    `Overall Score: ${summary.overallScore}/100`,
    `Status: ${summary.overallScore >= 90 ? '✅ EXCELLENT' : summary.overallScore >= 70 ? '✅ GOOD' : summary.overallScore >= 50 ? '⚠️  FAIR' : '❌ POOR'}`,
    '',
    'ISSUE BREAKDOWN:',
    '-' .repeat(20),
    `Critical Issues: ${summary.criticalIssues}`,
    `Major Issues: ${summary.majorIssues}`,
    `Minor Issues: ${summary.minorIssues}`,
    '',
    'DETAILED RESULTS:',
    '-' .repeat(20)
  ];

  for (const result of results) {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    reportLines.push(`${result.component}: ${status} (${result.overallScore}/100)`);

    if (result.issues.length > 0) {
      for (const issue of result.issues) {
        const severitySymbol =
          issue.severity === 'critical' ? '🔴' :
          issue.severity === 'major' ? '🟡' : '🟢';

        reportLines.push(`  ${severitySymbol} [${issue.level}] ${issue.description}`);
        reportLines.push(`      Element: ${issue.elementSelector}`);
        reportLines.push(`      Fix: ${issue.suggestedFix}`);
      }
    }

    reportLines.push('');
  }

  reportLines.push(
    'RECOMMENDATIONS:',
    '-' .repeat(20)
  );

  if (summary.criticalIssues > 0) {
    reportLines.push(`• IMMEDIATELY address ${summary.criticalIssues} critical issues`);
  }

  if (summary.majorIssues > 0) {
    reportLines.push(`• Prioritize fixing ${summary.majorIssues} major issues`);
  }

  if (summary.minorIssues > 0) {
    reportLines.push(`• Consider addressing ${summary.minorIssues} minor issues`);
  }

  if (summary.overallScore >= 90) {
    reportLines.push('• Overall WCAG 2.1 AA compliance is excellent');
  } else if (summary.overallScore >= 70) {
    reportLines.push('• Overall WCAG 2.1 AA compliance is good but needs improvement');
  } else {
    reportLines.push('• Significant improvements needed for WCAG 2.1 AA compliance');
  }

  return reportLines.join('\n');
};

/**
 * Applies WCAG 2.1 AA compliance fixes to a component
 * @param componentSelector - CSS selector for the component to fix
 * @returns Promise resolving to success status
 */
export const applyWCAG21AAFixin = async (componentSelector: string): Promise<{
  success: boolean;
  appliedFixes: string[];
  remainingIssues: string[];
}> => {
  const element = document.querySelector(componentSelector);
  if (!element) {
    return {
      success: false,
      appliedFixes: [],
      remainingIssues: [`Component with selector "${componentSelector}" not found`]
    };
  }

  const appliedFixes: string[] = [];
  const remainingIssues: string[] = [];

  // Apply automatic fixes where possible
  // Add focus indicators to interactive elements without them
  const interactiveElements = element.querySelectorAll('div[role="button"], span[role="button"], div[role="link"]');
  for (const el of Array.from(interactiveElements)) {
    // Add focus indicator CSS
    if (!el.getAttribute('style')?.includes('outline')) {
      (el as HTMLElement).style.outline = '2px solid #4A90E2'; // Blue outline for focus
      appliedFixes.push(`Added focus indicator to ${el.tagName} with role="${el.getAttribute('role')}"`);
    }
  }

  // Check for missing labels on form elements
  const formElements = element.querySelectorAll('input, textarea, select');
  for (const el of Array.from(formElements)) {
    const inputEl = el as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const id = inputEl.id || `auto-generated-id-${Date.now()}-${Math.random()}`;

    if (!inputEl.id) {
      inputEl.id = id;
      appliedFixes.push(`Added auto-generated ID to form element`);
    }

    // Check if there's already a label
    if (!document.querySelector(`label[for="${id}"]`)) {
      // Create a label based on placeholder or type
      const placeholder = inputEl.getAttribute('placeholder');
      const type = inputEl.type;
      const labelText = placeholder || `Enter ${type} for ${id}`;

      const label = document.createElement('label');
      label.setAttribute('for', id);
      label.textContent = labelText;
      label.style.display = 'none'; // Hide for now, needs proper styling
      inputEl.parentNode?.insertBefore(label, inputEl);

      appliedFixes.push(`Added auto-generated label for form element`);
    }
  }

  // Check for images without alt text
  const images = element.querySelectorAll('img');
  for (const img of Array.from(images)) {
    if (!img.hasAttribute('alt')) {
      // For now, we'll add an empty alt - in a real implementation,
      // we'd need to determine if the image is decorative or informative
      img.setAttribute('alt', '');
      appliedFixes.push(`Added empty alt attribute to image (verify if decorative)`);
    }
  }

  // Re-run the test to see what issues remain
  const testResult = await testComponentWCAG21AA(componentSelector);
  if (testResult.issues.length > 0) {
    remainingIssues.push(...testResult.issues.map(i => `${i.description} (${i.elementSelector})`));
  }

  return {
    success: testResult.issues.length === 0,
    appliedFixes,
    remainingIssues
  };
};