/**
 * Theme Performance Testing Utilities
 * Provides functions for testing theme switching performance to ensure <200ms transitions
 */

interface ThemeSwitchTestResult {
  testName: string;
  themeFrom: string;
  themeTo: string;
  switchTimeMs: number;
  performanceRating: 'excellent' | 'good' | 'fair' | 'poor';
  passed: boolean;
  timestamp: Date;
  notes: string[];
}

interface ThemeTransitionTestConfig {
  themesToTest: string[];
  iterationsPerTransition: number;
  includeAnimationTests: boolean;
  targetTransitionTimeMs: number;
}

/**
 * Measures the time it takes to switch between themes
 * @param switchThemeFn - Function that switches the theme
 * @param iterations - Number of times to switch (default 10)
 * @returns Average, min, and max switch times
 */
export const measureThemeSwitchTime = async (
  switchThemeFn: (theme: string) => void,
  themesToTest: string[],
  iterations: number = 10
): Promise<{
  averageTimeMs: number;
  minTimeMs: number;
  maxTimeMs: number;
  allMeasurements: number[];
  passed: boolean;
}> => {
  const measurements: number[] = [];

  for (let i = 0; i < iterations; i++) {
    // Cycle through themes
    for (let j = 0; j < themesToTest.length - 1; j++) {
      const fromTheme = themesToTest[j];
      const toTheme = themesToTest[j + 1];

      const startTime = performance.now();

      // Perform theme switch
      switchThemeFn(toTheme);

      // Wait for the switch to complete
      await new Promise(resolve => setTimeout(resolve, 16)); // Wait one frame

      const endTime = performance.now();
      const switchTime = endTime - startTime;

      measurements.push(switchTime);
    }
  }

  const totalTime = measurements.reduce((sum, time) => sum + time, 0);
  const averageTime = totalTime / measurements.length;
  const minTime = Math.min(...measurements);
  const maxTime = Math.max(...measurements);

  return {
    averageTimeMs: parseFloat(averageTime.toFixed(2)),
    minTimeMs: parseFloat(minTime.toFixed(2)),
    maxTimeMs: parseFloat(maxTime.toFixed(2)),
    allMeasurements: measurements.map(m => parseFloat(m.toFixed(2))),
    passed: averageTime < 200 // Pass if under 200ms average
  };
};

/**
 * Tests theme switching performance between specific themes
 * @param themeFrom - Source theme
 * @param themeTo - Target theme
 * @param switchThemeFn - Function that performs the theme switch
 * @returns Theme switch test result
 */
export const testThemeSwitchPerformance = async (
  themeFrom: string,
  themeTo: string,
  switchThemeFn: (theme: string) => void
): Promise<ThemeSwitchTestResult> => {
  const startTime = performance.now();

  // Perform the theme switch
  switchThemeFn(themeTo);

  // Wait for the transition to complete
  await new Promise(resolve => setTimeout(resolve, 100)); // Allow for transition

  const endTime = performance.now();
  const switchTime = endTime - startTime;

  // Determine performance rating
  let performanceRating: 'excellent' | 'good' | 'fair' | 'poor';
  let passed = false;
  const notes: string[] = [];

  if (switchTime < 50) {
    performanceRating = 'excellent';
    passed = true;
    notes.push('Exceptionally fast theme switch');
  } else if (switchTime < 100) {
    performanceRating = 'good';
    passed = true;
    notes.push('Fast theme switch');
  } else if (switchTime < 200) {
    performanceRating = 'fair';
    passed = true;
    notes.push('Acceptable theme switch time');
  } else {
    performanceRating = 'poor';
    passed = false;
    notes.push('Theme switch exceeds 200ms target - needs optimization');
  }

  if (switchTime > 200) {
    notes.push('Consider optimizing CSS, reducing repaints, or simplifying theme variables');
  }

  return {
    testName: `Switch from ${themeFrom} to ${themeTo}`,
    themeFrom,
    themeTo,
    switchTimeMs: parseFloat(switchTime.toFixed(2)),
    performanceRating,
    passed,
    timestamp: new Date(),
    notes
  };
};

/**
 * Tests animation performance during theme transitions
 * @param animateElementFn - Function that performs theme-based animations
 * @returns Animation performance test results
 */
export const testThemeAnimationPerformance = async (
  animateElementFn: (theme: string) => void,
  themesToTest: string[]
): Promise<{
  averageFPS: number;
  droppedFrames: number;
  smoothnessRating: 'excellent' | 'good' | 'fair' | 'poor';
  passed: boolean;
}> => {
  // Set up performance monitoring for animations
  let frameCount = 0;
  let droppedFrames = 0;
  const frameTimes: number[] = [];

  // Start animation performance monitoring
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'measure') {
        frameTimes.push(entry.duration);
      }
    }
  });

  observer.observe({ entryTypes: ['measure'] });

  // Run animation tests
  const animationStart = performance.now();
  const duration = 1000; // Test for 1 second

  // Perform animations while measuring performance
  const animate = () => {
    frameCount++;

    // Cycle through themes during animation
    const currentTheme = themesToTest[frameCount % themesToTest.length];
    animateElementFn(currentTheme);

    if (performance.now() - animationStart < duration) {
      requestAnimationFrame(animate);
    }
  };

  animate();

  // Wait for animation to complete
  await new Promise(resolve => setTimeout(resolve, duration + 100));

  observer.disconnect();

  // Calculate FPS
  const actualDuration = performance.now() - animationStart;
  const averageFPS = (frameCount / (actualDuration / 1000)).toFixed(2);

  // Calculate dropped frames (frames that took longer than 16.67ms for 60fps)
  const expectedFrameTime = 16.67; // 1000ms / 60fps
  droppedFrames = frameTimes.filter(time => time > expectedFrameTime).length;

  // Determine smoothness rating
  const numericFPS = parseFloat(averageFPS);
  let smoothnessRating: 'excellent' | 'good' | 'fair' | 'poor';
  let passed = false;

  if (numericFPS >= 55) {
    smoothnessRating = 'excellent';
    passed = true;
  } else if (numericFPS >= 45) {
    smoothnessRating = 'good';
    passed = true;
  } else if (numericFPS >= 30) {
    smoothnessRating = 'fair';
    passed = true;
  } else {
    smoothnessRating = 'poor';
    passed = false;
  }

  return {
    averageFPS: parseFloat(averageFPS),
    droppedFrames,
    smoothnessRating,
    passed
  };
};

/**
 * Runs comprehensive theme performance tests
 * @param config - Configuration for theme performance tests
 * @param switchThemeFn - Function that switches the theme
 * @param animateElementFn - Function that animates elements based on theme
 * @returns Comprehensive theme performance test results
 */
export const runThemePerformanceTests = async (
  config: ThemeTransitionTestConfig,
  switchThemeFn: (theme: string) => void,
  animateElementFn?: (theme: string) => void
): Promise<{
  themeSwitchTests: ThemeSwitchTestResult[];
  performanceMetrics: {
    averageSwitchTime: number;
    maxSwitchTime: number;
    minSwitchTime: number;
    fpsTests?: {
      averageFPS: number;
      droppedFrames: number;
      smoothnessRating: 'excellent' | 'good' | 'fair' | 'poor';
      passed: boolean;
    };
  };
  overallPassed: boolean;
  recommendations: string[];
}> => {
  const themeSwitchTests: ThemeSwitchTestResult[] = [];
  const allSwitchTimes: number[] = [];

  // Test each transition
  for (let i = 0; i < config.themesToTest.length; i++) {
    for (let j = 0; j < config.themesToTest.length; j++) {
      if (i !== j) { // Don't test same theme to same theme
        const result = await testThemeSwitchPerformance(
          config.themesToTest[i],
          config.themesToTest[j],
          switchThemeFn
        );

        themeSwitchTests.push(result);
        allSwitchTimes.push(result.switchTimeMs);
      }
    }
  }

  // Calculate performance metrics
  const totalSwitchTime = allSwitchTimes.reduce((sum, time) => sum + time, 0);
  const averageSwitchTime = totalSwitchTime / allSwitchTimes.length || 0;
  const maxSwitchTime = Math.max(...allSwitchTimes) || 0;
  const minSwitchTime = Math.min(...allSwitchTimes) || 0;

  // Run animation tests if enabled
  let fpsTests;
  if (config.includeAnimationTests && animateElementFn) {
    fpsTests = await testThemeAnimationPerformance(animateElementFn, config.themesToTest);
  }

  // Calculate overall pass/fail
  const allSwitchesPassed = themeSwitchTests.every(test => test.passed);
  const averageWithinTarget = averageSwitchTime < config.targetTransitionTimeMs;
  const overallPassed = allSwitchesPassed && averageWithinTarget;

  // Generate recommendations
  const recommendations: string[] = [];

  if (!allSwitchesPassed) {
    const failedTests = themeSwitchTests.filter(t => !t.passed);
    recommendations.push(`Fix ${failedTests.length} theme transitions that exceed ${config.targetTransitionTimeMs}ms`);
  }

  if (fpsTests && !fpsTests.passed) {
    recommendations.push(`Improve animation smoothness - currently ${fpsTests.averageFPS} FPS`);
  }

  if (averageSwitchTime > 100) {
    recommendations.push('Consider optimizing theme switching for better performance');
  }

  if (recommendations.length === 0) {
    recommendations.push('Theme performance meets requirements');
  }

  return {
    themeSwitchTests,
    performanceMetrics: {
      averageSwitchTime: parseFloat(averageSwitchTime.toFixed(2)),
      maxSwitchTime: parseFloat(maxSwitchTime.toFixed(2)),
      minSwitchTime: parseFloat(minSwitchTime.toFixed(2)),
      fpsTests
    },
    overallPassed,
    recommendations
  };
};

/**
 * Tests CSS variable performance during theme changes
 * @param themesWithVariables - Object mapping themes to their CSS variables
 * @returns CSS variable performance test results
 */
export const testCSSVariablePerformance = async (
  themesWithVariables: Record<string, Record<string, string>>
): Promise<{
  averageUpdateTimeMs: number;
  variableCount: number;
  performanceRating: 'excellent' | 'good' | 'fair' | 'poor';
  passed: boolean;
}> => {
  const updateTimes: number[] = [];
  const allVariables = Object.values(themesWithVariables).flatMap(theme => Object.keys(theme));
    const uniqueVariables = Array.from(new Set(allVariables));

  // Test updating CSS variables
  for (const [themeName, variables] of Object.entries(themesWithVariables)) {
    const startTime = performance.now();

    // Update all CSS variables for this theme
    const root = document.documentElement;
    for (const [prop, value] of Object.entries(variables)) {
      root.style.setProperty(prop, value);
    }

    const endTime = performance.now();
    updateTimes.push(endTime - startTime);
  }

  const averageUpdateTime = updateTimes.reduce((sum, time) => sum + time, 0) / updateTimes.length;

  // Determine performance rating
  let performanceRating: 'excellent' | 'good' | 'fair' | 'poor';
  let passed = false;

  if (averageUpdateTime < 10) {
    performanceRating = 'excellent';
    passed = true;
  } else if (averageUpdateTime < 25) {
    performanceRating = 'good';
    passed = true;
  } else if (averageUpdateTime < 50) {
    performanceRating = 'fair';
    passed = true;
  } else {
    performanceRating = 'poor';
    passed = false;
  }

  return {
    averageUpdateTimeMs: parseFloat(averageUpdateTime.toFixed(2)),
    variableCount: uniqueVariables.length,
    performanceRating,
    passed
  };
};

/**
 * Generates a theme performance report
 * @param testResults - Results from theme performance tests
 * @returns Formatted theme performance report
 */
export const generateThemePerformanceReport = (
  testResults: Awaited<ReturnType<typeof runThemePerformanceTests>>
): string => {
  const { themeSwitchTests, performanceMetrics, overallPassed, recommendations } = testResults;

  const reportLines = [
    'THEME PERFORMANCE TEST REPORT',
    '='.repeat(60),
    `Overall Status: ${overallPassed ? '✅ PASSED' : '❌ FAILED'}`,
    `Average Switch Time: ${performanceMetrics.averageSwitchTime}ms`,
    `Max Switch Time: ${performanceMetrics.maxSwitchTime}ms`,
    `Min Switch Time: ${performanceMetrics.minSwitchTime}ms`,
    `Total Transitions Tested: ${themeSwitchTests.length}`,
    '',
    'THEME TRANSITION DETAILS:',
    '-'.repeat(30)
  ];

  for (const test of themeSwitchTests) {
    const status = test.passed ? '✅' : '❌';
    reportLines.push(`${status} ${test.themeFrom} → ${test.themeTo}: ${test.switchTimeMs}ms (${test.performanceRating})`);
  }

  if (performanceMetrics.fpsTests) {
    reportLines.push(
      '',
      'ANIMATION PERFORMANCE:',
      '-'.repeat(25),
      `Average FPS: ${performanceMetrics.fpsTests.averageFPS}`,
      `Dropped Frames: ${performanceMetrics.fpsTests.droppedFrames}`,
      `Smoothness: ${performanceMetrics.fpsTests.smoothnessRating} (${performanceMetrics.fpsTests.passed ? '✅' : '❌'})`
    );
  }

  reportLines.push(
    '',
    'RECOMMENDATIONS:',
    '-'.repeat(20)
  );

  for (const recommendation of recommendations) {
    reportLines.push(`• ${recommendation}`);
  }

  reportLines.push(
    '',
    'PERFORMANCE TARGETS:',
    '-'.repeat(25),
    '• Theme switch time: <200ms (preferably <100ms)',
    '• Animation smoothness: 60fps (or at least 30fps)',
    '• CSS variable updates: <50ms',
    `Current Status: ${overallPassed ? 'Meeting targets' : 'Not meeting targets'}`
  );

  return reportLines.join('\n');
};

/**
 * Performs a stress test on theme switching with multiple simultaneous changes
 * @param switchThemeFn - Function that switches the theme
 * @param themesToTest - Array of themes to cycle through
 * @param durationMs - Duration of the stress test in milliseconds
 * @returns Stress test results
 */
export const runThemeStressTest = async (
  switchThemeFn: (theme: string) => void,
  themesToTest: string[],
  durationMs: number = 5000
): Promise<{
  totalSwitches: number;
  averageTimeMs: number;
  finalPerformanceRating: 'excellent' | 'good' | 'fair' | 'poor';
  passed: boolean;
  memoryUsage?: {
    before: number;
    after: number;
    difference: number;
  };
}> => {
  const startTime = performance.now();
  const startMemory = (performance as any).memory?.usedJSHeapSize; // Optional memory tracking

  let switchCount = 0;
  const switchTimes: number[] = [];

  const stressTest = () => {
    if (performance.now() - startTime < durationMs) {
      const themeIndex = switchCount % themesToTest.length;
      const currentTheme = themesToTest[themeIndex];

      const switchStartTime = performance.now();
      switchThemeFn(currentTheme);
      const switchEndTime = performance.now();

      switchTimes.push(switchEndTime - switchStartTime);

      switchCount++;
      requestAnimationFrame(stressTest);
    }
  };

  stressTest();

  // Wait for stress test to complete
  await new Promise(resolve => setTimeout(resolve, durationMs + 100));

  // Calculate results
  const totalTime = switchTimes.reduce((sum, time) => sum + time, 0);
  const averageTime = totalTime / switchTimes.length;

  // Determine performance rating
  let finalPerformanceRating: 'excellent' | 'good' | 'fair' | 'poor';
  let passed = false;

  if (averageTime < 50) {
    finalPerformanceRating = 'excellent';
    passed = true;
  } else if (averageTime < 100) {
    finalPerformanceRating = 'good';
    passed = true;
  } else if (averageTime < 200) {
    finalPerformanceRating = 'fair';
    passed = true;
  } else {
    finalPerformanceRating = 'poor';
    passed = false;
  }

  // Get memory usage if available
  let memoryUsage;
  const endMemory = (performance as any).memory?.usedJSHeapSize;
  if (startMemory !== undefined && endMemory !== undefined) {
    memoryUsage = {
      before: startMemory,
      after: endMemory,
      difference: endMemory - startMemory
    };
  }

  return {
    totalSwitches: switchCount,
    averageTimeMs: parseFloat(averageTime.toFixed(2)),
    finalPerformanceRating,
    passed,
    memoryUsage
  };
};