import React, { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsed?: number;
  timestamp: number;
}

const PerformanceMonitor: React.FC<{ enabled?: boolean }> = ({ enabled = false }) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let animationFrameId: number;
    let lastTime: number | null = null;
    let frameCount = 0;
    let lastFpsUpdate = performance.now();

    const measurePerformance = () => {
      const currentTime = performance.now();

      if (lastTime !== null) {
        const deltaTime = currentTime - lastTime;
        frameCount++;

        // Update FPS every 500ms
        if (currentTime - lastFpsUpdate >= 500) {
          const fps = Math.round((frameCount * 1000) / (currentTime - lastFpsUpdate));

          // Get memory usage if available
          let memoryUsed: number | undefined;
          if ((performance as any).memory) {
            memoryUsed = (performance as any).memory.usedJSHeapSize;
          }

          setMetrics({
            fps,
            frameTime: deltaTime,
            memoryUsed,
            timestamp: currentTime
          });

          frameCount = 0;
          lastFpsUpdate = currentTime;
        }
      }

      lastTime = currentTime;
      animationFrameId = requestAnimationFrame(measurePerformance);
    };

    animationFrameId = requestAnimationFrame(measurePerformance);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled]);

  if (!enabled || !metrics) return null;

  // Show performance overlay when FPS drops below threshold
  const isLowPerformance = metrics.fps < 50; // Below 50fps is considered low performance

  if (isLowPerformance && !isVisible) {
    setIsVisible(true);
    // Auto-hide after 5 seconds if performance recovers
    setTimeout(() => setIsVisible(false), 5000);
  }

  if (!isLowPerformance && isVisible) {
    setIsVisible(true); // Keep visible briefly after recovery
    setTimeout(() => setIsVisible(false), 2000);
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-3 rounded-lg text-xs font-mono transition-all ${
        metrics.fps >= 60 ? 'bg-green-900 text-green-200' :
        metrics.fps >= 30 ? 'bg-yellow-900 text-yellow-200' : 'bg-red-900 text-red-200'
      }`}
      style={{ display: isVisible ? 'block' : 'none' }}
    >
      <div>FPS: {metrics.fps}</div>
      <div>Frame: {Math.round(metrics.frameTime)}ms</div>
      {metrics.memoryUsed && (
        <div>Mem: {(metrics.memoryUsed / 1024 / 1024).toFixed(1)}MB</div>
      )}
    </div>
  );
};

export default PerformanceMonitor;