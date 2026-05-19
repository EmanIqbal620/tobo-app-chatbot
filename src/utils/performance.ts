/**
 * Performance Utilities
 * This module provides utility functions for measuring and monitoring application performance.
 */

import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Performance measurement types
export interface PerformanceMetrics {
  cls: number; // Cumulative Layout Shift
  fid: number; // First Input Delay
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  ttfb: number; // Time to First Byte
}

export interface PerformanceCallback {
  (metric: PerformanceMetrics): void;
}

/**
 * Measures core web vitals for performance monitoring
 * @param callback Function to handle performance metrics
 */
export function measureCoreWebVitals(callback: PerformanceCallback): void {
  const metrics: Partial<PerformanceMetrics> = {};

  getCLS(metric => {
    metrics.cls = metric.value;
    checkAllMetricsReceived(metrics, callback);
  });

  getFID(metric => {
    metrics.fid = metric.value;
    checkAllMetricsReceived(metrics, callback);
  });

  getFCP(metric => {
    metrics.fcp = metric.value;
    checkAllMetricsReceived(metrics, callback);
  });

  getLCP(metric => {
    metrics.lcp = metric.value;
    checkAllMetricsReceived(metrics, callback);
  });

  getTTFB(metric => {
    metrics.ttfb = metric.value;
    checkAllMetricsReceived(metrics, callback);
  });
}

/**
 * Checks if all metrics have been received and calls the callback
 */
function checkAllMetricsReceived(
  metrics: Partial<PerformanceMetrics>,
  callback: PerformanceCallback
): void {
  if (
    metrics.cls !== undefined &&
    metrics.fid !== undefined &&
    metrics.fcp !== undefined &&
    metrics.lcp !== undefined &&
    metrics.ttfb !== undefined
  ) {
    callback(metrics as PerformanceMetrics);
  }
}

/**
 * Measures time for a specific operation
 * @param operation The operation to measure
 * @returns Promise with the result and measured time
 */
export async function measureOperation<T>(
  operation: () => Promise<T> | T,
  operationName: string = 'operation'
): Promise<{ result: T; timeMs: number }> {
  const startTime = performance.now();
  const result = await Promise.resolve(operation());
  const endTime = performance.now();
  const timeMs = endTime - startTime;

  console.debug(`Performance: ${operationName} took ${timeMs.toFixed(2)}ms`);

  return { result, timeMs };
}

/**
 * Measures paint timing for rendering performance
 * @returns Promise with paint timing metrics
 */
export async function measurePaintTiming(): Promise<{
  firstPaint?: number;
  firstContentfulPaint?: number;
}> {
  return new Promise((resolve) => {
    // Check if paint timing is available
    if ('performance' in window && 'getEntriesByName' in performance) {
      const firstPaint = performance.getEntriesByName('first-paint')[0] as PerformanceEntry;
      const firstContentfulPaint = performance.getEntriesByName('first-contentful-paint')[0] as PerformanceEntry;

      resolve({
        firstPaint: firstPaint?.startTime,
        firstContentfulPaint: firstContentfulPaint?.startTime
      });
    } else {
      // Fallback if paint timing is not available
      resolve({});
    }
  });
}

/**
 * Measures layout shift events for CLS tracking
 */
export function trackLayoutShifts(): void {
  let clsValue = 0;
  let clsEntries: LayoutShift[] = [];

  // Check if the browser supports the Layout Instability API
  if (!window.PerformanceObserver) {
    return;
  }

  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'layout-shift') {
        const layoutShiftEntry = entry as LayoutShift;

        // Only count layout shifts without recent user input
        if (!layoutShiftEntry.hadRecentInput) {
          clsValue += layoutShiftEntry.value;
          clsEntries.push(layoutShiftEntry);
        }
      }
    }
  });

  observer.observe({ entryTypes: ['layout-shift'] });

  // Log CLS value when page is hidden (e.g., user navigates away)
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      console.debug('Cumulative Layout Shift (CLS):', clsValue);
      observer.disconnect();
    }
  });
}

/**
 * Reports performance metrics to a monitoring service
 * @param metrics Performance metrics to report
 * @param additionalData Additional data to include in the report
 */
export function reportPerformanceMetrics(
  metrics: PerformanceMetrics,
  additionalData?: Record<string, any>
): void {
  // In a real implementation, this would send metrics to a monitoring service
  // For now, we'll just log them to the console
  console.info('Performance Metrics Report:', {
    timestamp: new Date().toISOString(),
    ...metrics,
    ...additionalData
  });
}

/**
 * Checks if the user has reduced motion preferences enabled
 * @returns Boolean indicating if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
}

/**
 * Gets performance timing information
 * @returns Object with performance timing metrics
 */
export function getPerformanceTiming(): {
  loadTime: number;
  domContentLoaded: number;
  firstByte: number;
} {
  if (!window.performance || !window.performance.timing) {
    return {
      loadTime: 0,
      domContentLoaded: 0,
      firstByte: 0
    };
  }

  const perfData = window.performance.timing;
  return {
    loadTime: perfData.loadEventEnd - perfData.navigationStart,
    domContentLoaded: perfData.domContentLoadedEventEnd - perfData.navigationStart,
    firstByte: perfData.responseStart - perfData.navigationStart
  };
}

/**
 * Measures frame rate (FPS) over a period of time
 * @param callback Function to handle FPS measurements
 * @param durationMs Duration in milliseconds to measure over (default: 5000)
 */
export function measureFrameRate(
  callback: (fps: number) => void,
  durationMs: number = 5000
): void {
  let frameCount = 0;
  const startTime = performance.now();
  const startFrameCount = 0;

  const measure = (timestamp: number) => {
    frameCount++;
    const elapsed = timestamp - startTime;

    if (elapsed < durationMs) {
      requestAnimationFrame(measure);
    } else {
      const fps = Math.round((frameCount - startFrameCount) / (elapsed / 1000));
      callback(fps);
    }
  };

  requestAnimationFrame(measure);
}