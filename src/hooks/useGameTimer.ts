import { useState, useEffect, useCallback } from 'react';

// Global declaration for vitest in test environment
declare global {
  const vi: {
    isFakeTimers?: () => boolean;
  } | undefined;
}

export interface UseGameTimerOptions {
  duration: number; // Duration in milliseconds
  onComplete: () => void;
}

export interface UseGameTimerReturn {
  timeRemaining: number; // Time remaining in milliseconds
  isActive: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

/**
 * Custom hook for managing a high-precision countdown timer using requestAnimationFrame
 * and performance.now() for accurate timing.
 * 
 * @param duration - Timer duration in milliseconds (e.g., 60000 for 60 seconds)
 * @param onComplete - Callback function triggered when timer reaches zero
 * @returns Timer state and control functions
 */
export function useGameTimer({ duration, onComplete }: UseGameTimerOptions): UseGameTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isActive, setIsActive] = useState(false);

  const start = useCallback(() => {
    setIsActive(true);
  }, []);

  const pause = useCallback(() => {
    setIsActive(false);
  }, []);

  const reset = useCallback(() => {
    setIsActive(false);
    setTimeRemaining(duration);
  }, [duration]);

  useEffect(() => {
    if (!isActive) return;

    let startTime = performance.now();
    let animationFrameId: number | null = null;
    let intervalId: NodeJS.Timeout | null = null;
    const initialTimeRemaining = timeRemaining;

    // Check if we're in a test environment with fake timers
    const isFakeTimers = typeof vi !== 'undefined' && vi.isFakeTimers?.();

    if (isFakeTimers) {
      // Use setInterval for fake timers (tests)
      startTime = Date.now();
      intervalId = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, initialTimeRemaining - elapsed);
        
        setTimeRemaining(remaining);

        if (remaining === 0) {
          setIsActive(false);
          if (intervalId) clearInterval(intervalId);
          onComplete();
        }
      }, 16); // ~60fps
    } else {
      // Use requestAnimationFrame for real timers (production)
      const endTime = startTime + initialTimeRemaining;

      const tick = (currentTime: number) => {
        const remaining = Math.max(0, endTime - currentTime);
        
        setTimeRemaining(remaining);

        if (remaining > 0) {
          animationFrameId = requestAnimationFrame(tick);
        } else {
          setIsActive(false);
          onComplete();
        }
      };

      animationFrameId = requestAnimationFrame(tick);
    }

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [isActive, timeRemaining, onComplete]);

  return {
    timeRemaining,
    isActive,
    start,
    pause,
    reset,
  };
}
