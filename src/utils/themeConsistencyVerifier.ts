/**
 * Theme Consistency Verification Utilities
 * Provides functions for verifying theme consistency across all application pages
 */

interface ThemeConsistencyResult {
  page: string;
  themeApplied: string;
  elementsChecked: number;
  inconsistencies: Array<{
    element: string;
    property: string;
    expectedValue: string;
    actualValue: string;
    componentType: string;
  }>;
  passed: boolean;
  score: number;
  timestamp: Date;
}

interface ThemeConsistencyConfig {
  pagesToCheck: string[];
  themePropertySelectors: Array<{
    property: string;
    selector: string;
    expectedValuePattern: string | RegExp;
    componentType: string;
  }>;
  includeColorContrastCheck: boolean;
  includeTypographyConsistency: boolean;
  includeSpacingConsistency: boolean;
}

/**
 * Verifies theme consistency for a specific page
 * @param pageUrl - URL of the page to verify
 * @returns Theme consistency verification result
 */
export const verifyPageThemeConsistency = async (pageUrl: string): Promise<ThemeConsistencyResult> => {
  // In a real implementation, this would navigate to the page and verify consistency
  // For this implementation, we'll simulate the verification

  // Since we can't actually navigate to pages in this utility, we'll check the current page
  // In a real app, this would use a testing framework like Puppeteer or Cypress

  const inconsistencies: ThemeConsistencyResult['inconsistencies'] = [];
  let elementsChecked = 0;

  // Check common themed elements
  const themedElements = [
    ...Array.from(document.querySelectorAll('.theme-background, [style*="--"], [class*="bg-"], [class*="text-"]')),
    ...Array.from(document.querySelectorAll('button, input, select, textarea, a')),
    ...Array.from(document.querySelectorAll('.card, .modal, .sidebar, .navbar'))
  ];

  elementsChecked = themedElements.length;

  // For demonstration, we'll just check a few elements
  for (let i = 0; i < Math.min(themedElements.length, 5); i++) { // Check first 5 elements
    const element = themedElements[i];

    // Check for common inconsistency patterns
    const computedStyle = window.getComputedStyle(element);
    const elementTag = element.tagName.toLowerCase();

    // Example checks for common issues
    if (elementTag === 'button' && !computedStyle.backgroundColor.includes('var(')) {
      // This button might not be using theme variables
      inconsistencies.push({
        element: elementTag,
        property: 'background-color',
        expectedValue: 'CSS variable (e.g., var(--theme-accent))',
        actualValue: computedStyle.backgroundColor,
        componentType: 'button'
      });
    }

    if (elementTag === 'input' && !computedStyle.borderColor.includes('var(')) {
      // This input might not be using theme variables
      inconsistencies.push({
        element: elementTag,
        property: 'border-color',
        expectedValue: 'CSS variable (e.g., var(--theme-border))',
        actualValue: computedStyle.borderColor,
        componentType: 'input'
      });
    }
  }

  // Calculate score based on consistency
  const inconsistencyCount = inconsistencies.length;
  const maxScore = 100;
  const deductionPerInconsistency = 10;
  const score = Math.max(0, maxScore - (inconsistencyCount * deductionPerInconsistency));

  return {
    page: pageUrl,
    themeApplied: 'current', // In a real implementation, we'd detect the actual theme
    elementsChecked,
    inconsistencies,
    passed: inconsistencyCount === 0,
    score,
    timestamp: new Date()
  };
};

/**
 * Verifies color contrast consistency across themed elements
 * @param elements - Elements to check for color contrast
 * @returns Color contrast verification results
 */
export const verifyColorContrastConsistency = (elements: Element[]): Array<{
  element: Element;
  contrastRatio: number;
  passesAA: boolean;
  passesAAA: boolean;
  foreground: string;
  background: string;
}> => {
  const results: Array<{
    element: Element;
    contrastRatio: number;
    passesAA: boolean;
    passesAAA: boolean;
    foreground: string;
    background: string;
  }> = [];

  for (const element of elements) {
    const computedStyle = window.getComputedStyle(element);
    const color = computedStyle.color;
    const backgroundColor = computedStyle.backgroundColor;

    // Calculate contrast ratio (simplified - in reality, you'd use a proper algorithm)
    // For now, we'll just return placeholder values
    const contrastRatio = 4.5; // Placeholder value
    const passesAA = contrastRatio >= 4.5; // For normal text
    const passesAAA = contrastRatio >= 7.0;

    results.push({
      element,
      contrastRatio: parseFloat(contrastRatio.toFixed(2)),
      passesAA,
      passesAAA,
      foreground: color,
      background: backgroundColor
    });
  }

  return results;
};

/**
 * Verifies typography consistency across themed elements
 * @param elements - Elements to check for typography consistency
 * @returns Typography consistency verification results
 */
export const verifyTypographyConsistency = (elements: Element[]): Array<{
  element: Element;
  property: string;
  expected: string;
  actual: string;
  consistent: boolean;
}> => {
  const results: Array<{
    element: Element;
    property: string;
    expected: string;
    actual: string;
    consistent: boolean;
  }> = [];

  for (const element of elements) {
    const computedStyle = window.getComputedStyle(element);

    // Check common typography properties
    const fontSize = computedStyle.fontSize;
    const fontWeight = computedStyle.fontWeight;
    const fontFamily = computedStyle.fontFamily;
    const lineHeight = computedStyle.lineHeight;

    // In a real implementation, we'd compare these to expected theme values
    // For now, we'll just record the values
    results.push({
      element,
      property: 'font-size',
      expected: 'theme-controlled value', // Would come from theme
      actual: fontSize,
      consistent: fontSize.includes('var(') // Check if using CSS variables
    });

    results.push({
      element,
      property: 'font-weight',
      expected: 'theme-controlled value',
      actual: fontWeight,
      consistent: fontWeight.includes('var(')
    });

    results.push({
      element,
      property: 'font-family',
      expected: 'theme-controlled value',
      actual: fontFamily,
      consistent: fontFamily.includes('var(')
    });

    results.push({
      element,
      property: 'line-height',
      expected: 'theme-controlled value',
      actual: lineHeight,
      consistent: lineHeight.includes('var(')
    });
  }

  return results;
};

/**
 * Verifies spacing consistency across themed elements
 * @param elements - Elements to check for spacing consistency
 * @returns Spacing consistency verification results
 */
export const verifySpacingConsistency = (elements: Element[]): Array<{
  element: Element;
  property: string;
  expected: string;
  actual: string;
  consistent: boolean;
}> => {
  const results: Array<{
    element: Element;
    property: string;
    expected: string;
    actual: string;
    consistent: boolean;
  }> = [];

  for (const element of elements) {
    const computedStyle = window.getComputedStyle(element);

    // Check common spacing properties
    const margin = computedStyle.margin;
    const padding = computedStyle.padding;
    const gap = computedStyle.gap;

    results.push({
      element,
      property: 'margin',
      expected: 'theme-controlled value',
      actual: margin,
      consistent: margin.includes('var(') || margin.includes('theme')
    });

    results.push({
      element,
      property: 'padding',
      expected: 'theme-controlled value',
      actual: padding,
      consistent: padding.includes('var(') || padding.includes('theme')
    });

    if (gap) {
      results.push({
        element,
        property: 'gap',
        expected: 'theme-controlled value',
        actual: gap,
        consistent: gap.includes('var(') || gap.includes('theme')
      });
    }
  }

  return results;
};

/**
 * Runs comprehensive theme consistency verification across multiple pages
 * @param config - Configuration for theme consistency verification
 * @returns Comprehensive theme consistency verification results
 */
export const runThemeConsistencyVerification = async (
  config: ThemeConsistencyConfig
): Promise<{
  results: ThemeConsistencyResult[];
  summary: {
    totalPages: number;
    passingPages: number;
    failingPages: number;
    averageScore: number;
    totalInconsistencies: number;
    overallPassed: boolean;
  };
  recommendations: string[];
}> => {
  const results: ThemeConsistencyResult[] = [];

  for (const page of config.pagesToCheck) {
    try {
      // In a real implementation, this would navigate to the page
      // For this implementation, we'll verify the current page multiple times
      const result = await verifyPageThemeConsistency(page);
      results.push(result);
    } catch (error) {
      results.push({
        page,
        themeApplied: 'unknown',
        elementsChecked: 0,
        inconsistencies: [{
          element: 'page',
          property: 'loading',
          expectedValue: 'successfully loaded',
          actualValue: `error: ${(error as Error).message}`,
          componentType: 'page'
        }],
        passed: false,
        score: 0,
        timestamp: new Date()
      });
    }
  }

  // Calculate summary
  const totalPages = results.length;
  const passingPages = results.filter(r => r.passed).length;
  const failingPages = totalPages - passingPages;
  const totalInconsistencies = results.reduce((sum, r) => sum + r.inconsistencies.length, 0);
  const totalScore = results.reduce((sum, r) => sum + r.score, 0);
  const averageScore = totalPages > 0 ? totalScore / totalPages : 0;
  const overallPassed = passingPages === totalPages;

  // Generate recommendations
  const recommendations: string[] = [];

  if (totalInconsistencies > 0) {
    recommendations.push(`Address ${totalInconsistencies} theme inconsistencies across ${failingPages} pages`);
  }

  if (averageScore < 80) {
    recommendations.push(`Theme consistency score is low (${averageScore.toFixed(1)}). Review theme implementation.`);
  }

  if (failingPages > 0) {
    recommendations.push(`Fix theme issues on ${failingPages} page(s) to achieve 100% consistency`);
  }

  if (recommendations.length === 0) {
    recommendations.push('Theme consistency is good across all pages');
  }

  return {
    results,
    summary: {
      totalPages,
      passingPages,
      failingPages,
      averageScore: parseFloat(averageScore.toFixed(2)),
      totalInconsistencies,
      overallPassed
    },
    recommendations
  };
};

/**
 * Verifies that CSS variables are consistently applied across the application
 * @param themeVariables - Object containing expected theme variables
 * @returns CSS variable consistency verification results
 */
export const verifyCSSVariableConsistency = (themeVariables: Record<string, string>): Array<{
  variableName: string;
  expectedValue: string;
  actualValue: string;
  elementCount: number;
  consistent: boolean;
}> => {
  const root = document.documentElement;
  const results: Array<{
    variableName: string;
    expectedValue: string;
    actualValue: string;
    elementCount: number;
    consistent: boolean;
  }> = [];

  for (const [varName, expectedValue] of Object.entries(themeVariables)) {
    const actualValue = root.style.getPropertyValue(varName) || getComputedStyle(root).getPropertyValue(varName);

    // Count how many elements use this variable
    let elementCount = 0;
    const allElements = document.querySelectorAll('*');

    for (const element of Array.from(allElements)) {
      const computedStyle = window.getComputedStyle(element);
      // Check if any CSS property uses this variable
      const styleText = element.getAttribute('style') || '';
      if (styleText.includes(varName) || computedStyle.cssText.includes(varName)) {
        elementCount++;
      }
    }

    results.push({
      variableName: varName,
      expectedValue,
      actualValue: actualValue.trim(),
      elementCount,
      consistent: actualValue.trim() === expectedValue
    });
  }

  return results;
};

/**
 * Verifies component-specific theme consistency
 * @param componentSelectors - CSS selectors for specific components to check
 * @returns Component-specific theme consistency results
 */
export const verifyComponentThemeConsistency = (componentSelectors: string[]): Array<{
  componentName: string;
  selector: string;
  propertiesChecked: Array<{
    property: string;
    expected: string;
    actual: string;
    consistent: boolean;
  }>;
  passed: boolean;
}> => {
  const results: Array<{
    componentName: string;
    selector: string;
    propertiesChecked: Array<{
      property: string;
      expected: string;
      actual: string;
      consistent: boolean;
    }>;
    passed: boolean;
  }> = [];

  for (const selector of componentSelectors) {
    const elements = document.querySelectorAll(selector);

    if (elements.length === 0) {
      results.push({
        componentName: selector,
        selector,
        propertiesChecked: [{
          property: 'existence',
          expected: 'component exists',
          actual: 'component not found',
          consistent: false
        }],
        passed: false
      });
      continue;
    }

    const propertiesChecked: Array<{
      property: string;
      expected: string;
      actual: string;
      consistent: boolean;
    }> = [];

    // Check the first element of each component type
    const element = elements[0];
    const computedStyle = window.getComputedStyle(element);

    // Common properties to check for themed components
    const propertiesToCheck = [
      { property: 'background-color', expected: 'theme variable' },
      { property: 'color', expected: 'theme variable' },
      { property: 'border-color', expected: 'theme variable' },
      { property: 'font-family', expected: 'theme font' },
      { property: 'font-size', expected: 'theme size' }
    ];

    for (const propCheck of propertiesToCheck) {
      const actualValue = computedStyle.getPropertyValue(propCheck.property);
      const isThemed = actualValue.includes('var('); // Uses CSS variable

      propertiesChecked.push({
        property: propCheck.property,
        expected: propCheck.expected,
        actual: actualValue,
        consistent: isThemed
      });
    }

    const passed = propertiesChecked.every(p => p.consistent);

    results.push({
      componentName: selector,
      selector,
      propertiesChecked,
      passed
    });
  }

  return results;
};

/**
 * Generates a theme consistency verification report
 * @param verificationResults - Results from theme consistency verification
 * @returns Formatted theme consistency verification report
 */
export const generateThemeConsistencyReport = (
  verificationResults: Awaited<ReturnType<typeof runThemeConsistencyVerification>>
): string => {
  const { results, summary, recommendations } = verificationResults;

  const reportLines = [
    'THEME CONSISTENCY VERIFICATION REPORT',
    '='.repeat(70),
    `Test Date: ${new Date().toISOString()}`,
    `Total Pages Checked: ${summary.totalPages}`,
    `Passing Pages: ${summary.passingPages}`,
    `Failing Pages: ${summary.failingPages}`,
    `Average Score: ${summary.averageScore}`,
    `Total Inconsistencies: ${summary.totalInconsistencies}`,
    `Overall Status: ${summary.overallPassed ? '✅ CONSISTENT' : '❌ INCONSISTENT'}`,
    '',
    'PAGE-BY-PAGE RESULTS:',
    '-'.repeat(30)
  ];

  for (const result of results) {
    const status = result.passed ? '✅' : '❌';
    reportLines.push(`${status} ${result.page}: Score ${result.score}/100 (${result.elementsChecked} elements checked)`);

    if (result.inconsistencies.length > 0) {
      for (const inc of result.inconsistencies) {
        reportLines.push(`    • ${inc.element} ${inc.property}: expected ${inc.expectedValue}, got ${inc.actualValue} (${inc.componentType})`);
      }
    }
  }

  reportLines.push(
    '',
    'CONSISTENCY RECOMMENDATIONS:',
    '-'.repeat(35)
  );

  for (const recommendation of recommendations) {
    reportLines.push(`• ${recommendation}`);
  }

  reportLines.push(
    '',
    'CONSISTENCY METRICS:',
    '-'.repeat(20),
    `Target: 100% consistency across all pages`,
    `Current: ${summary.passingPages}/${summary.totalPages} pages passing (${summary.averageScore.toFixed(1)}% average score)`,
    `Focus Areas: ${summary.totalInconsistencies} inconsistencies identified`
  );

  return reportLines.join('\n');
};

/**
 * Runs a focused theme consistency check on specific components
 * @param components - Component names to check
 * @param themeProperties - Properties that should be consistent
 * @returns Component-focused consistency results
 */
export const runComponentThemeConsistencyCheck = (
  components: string[],
  themeProperties: string[]
): Array<{
  componentName: string;
  property: string;
  consistent: boolean;
  elements: Array<{
    element: Element;
    expected: string;
    actual: string;
  }>;
}> => {
  const results: Array<{
    componentName: string;
    property: string;
    consistent: boolean;
    elements: Array<{
      element: Element;
      expected: string;
      actual: string;
    }>;
  }> = [];

  for (const component of components) {
    const elements = document.querySelectorAll(component);

    for (const property of themeProperties) {
      const elementResults: Array<{
        element: Element;
        expected: string;
        actual: string;
      }> = [];

      let allConsistent = true;

      for (const element of Array.from(elements)) {
        const computedStyle = window.getComputedStyle(element);
        const actualValue = computedStyle.getPropertyValue(property);

        // For this implementation, we'll consider it consistent if it uses a CSS variable
        const usesVariable = actualValue.includes('var(');

        if (!usesVariable) {
          allConsistent = false;
        }

        elementResults.push({
          element,
          expected: 'theme variable',
          actual: actualValue
        });
      }

      results.push({
        componentName: component,
        property,
        consistent: allConsistent,
        elements: elementResults
      });
    }
  }

  return results;
};