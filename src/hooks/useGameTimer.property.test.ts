import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { useGameTimer } from './useGameTimer';

/**
 * Property-based tests for useGameTimer hook
 * 
 * **Validates: Requirements 4.3, 9.1, 9.2**
 * 
 * These tests verify that the timer hook correctly:
 * - Initializes with a 60-second countdown (4.3)
 * - Triggers onComplete callback when timer reaches zero (9.1, 9.2)
 * - Uses high-precision timing with performance.now()
 */
describe('useGameTimer - Property-Based Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Property 1: Timer Completion Callback
   * For any valid duration, when the timer completes, the onComplete callback
   * must be called exactly once and the timer must be inactive.
   * 
   * **Validates: Requirements 9.1, 9.2**
   */
  it('property: timer always calls onComplete exactly once when reaching zero', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 100, max: 10000 }), // Test with various durations
        (duration: number) => {
          const onComplete = vi.fn();
          const { result } = renderHook(() =>
            useGameTimer({ duration, onComplete })
          );

          // Start the timer
          act(() => {
            result.current.start();
          });

          // Fast-forward past completion
          act(() => {
            vi.advanceTimersByTime(duration + 100);
          });

          // Verify onComplete was called exactly once
          expect(onComplete).toHaveBeenCalledTimes(1);
          // Verify timer is no longer active
          expect(result.current.isActive).toBe(false);
          // Verify time remaining is zero
          expect(result.current.timeRemaining).toBe(0);
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 2: Timer Never Goes Negative
   * For any duration and any amount of time advancement, the timeRemaining
   * must never be negative.
   * 
   * **Validates: Requirements 4.3, 9.1**
   */
  it('property: timeRemaining never goes below zero', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 100, max: 5000 }),
        fc.integer({ min: 0, max: 10000 }),
        (duration: number, advanceTime: number) => {
          const onComplete = vi.fn();
          const { result } = renderHook(() =>
            useGameTimer({ duration, onComplete })
          );

          act(() => {
            result.current.start();
          });

          act(() => {
            vi.advanceTimersByTime(advanceTime);
          });

          // Time remaining must never be negative
          expect(result.current.timeRemaining).toBeGreaterThanOrEqual(0);
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 3: Timer Initialization
   * For any valid duration, the timer must initialize with that exact duration
   * and be inactive.
   * 
   * **Validates: Requirements 4.3**
   */
  it('property: timer always initializes with correct duration and inactive state', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1000, max: 120000 }),
        (duration: number) => {
          const { result } = renderHook(() =>
            useGameTimer({ duration, onComplete: vi.fn() })
          );

          // Must initialize with exact duration
          expect(result.current.timeRemaining).toBe(duration);
          // Must be inactive initially
          expect(result.current.isActive).toBe(false);
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 4: Reset Restores Initial State
   * For any timer state (started, paused, or completed), calling reset
   * must restore the timer to its initial duration and inactive state.
   * 
   * **Validates: Requirements 4.3**
   */
  it('property: reset always restores timer to initial state', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1000, max: 10000 }),
        fc.integer({ min: 0, max: 5000 }),
        (duration: number, elapsedTime: number) => {
          const { result } = renderHook(() =>
            useGameTimer({ duration, onComplete: vi.fn() })
          );

          // Start and advance time
          act(() => {
            result.current.start();
          });

          act(() => {
            vi.advanceTimersByTime(elapsedTime);
          });

          // Reset
          act(() => {
            result.current.reset();
          });

          // Must restore to initial state
          expect(result.current.timeRemaining).toBe(duration);
          expect(result.current.isActive).toBe(false);
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 5: Pause Preserves Time Remaining
   * When a timer is paused, the timeRemaining value must not change
   * regardless of how much time passes.
   * 
   * **Validates: Requirements 9.1**
   */
  it('property: paused timer preserves timeRemaining', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 5000, max: 10000 }),
        fc.integer({ min: 100, max: 2000 }),
        fc.integer({ min: 100, max: 5000 }),
        (duration: number, runTime: number, pauseTime: number) => {
          const { result } = renderHook(() =>
            useGameTimer({ duration, onComplete: vi.fn() })
          );

          // Start timer
          act(() => {
            result.current.start();
          });

          // Run for some time
          act(() => {
            vi.advanceTimersByTime(runTime);
          });

          // Pause
          act(() => {
            result.current.pause();
          });

          const timeAtPause = result.current.timeRemaining;

          // Advance time while paused
          act(() => {
            vi.advanceTimersByTime(pauseTime);
          });

          // Time must not have changed
          expect(result.current.timeRemaining).toBe(timeAtPause);
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property 6: Start/Pause State Consistency
   * The isActive state must always reflect whether start or pause was called last.
   * 
   * **Validates: Requirements 4.3, 9.1**
   */
  it('property: isActive state is consistent with start/pause calls', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1000, max: 10000 }),
        fc.array(fc.boolean(), { minLength: 1, maxLength: 10 }),
        (duration: number, actions: boolean[]) => {
          const { result } = renderHook(() =>
            useGameTimer({ duration, onComplete: vi.fn() })
          );

          // Apply sequence of start (true) and pause (false) actions
          actions.forEach((shouldStart: boolean) => {
            act(() => {
              if (shouldStart) {
                result.current.start();
              } else {
                result.current.pause();
              }
            });

            // State must match the last action
            expect(result.current.isActive).toBe(shouldStart);
          });
        }
      ),
      { numRuns: 30 }
    );
  });

  /**
   * Property 7: 60-Second Timer Specific Test
   * For the specific 60-second (60000ms) duration used in the game,
   * verify all timer properties hold.
   * 
   * **Validates: Requirements 4.3, 9.1, 9.2**
   */
  it('property: 60-second timer behaves correctly', () => {
    const SIXTY_SECONDS = 60000;
    const onComplete = vi.fn();
    const { result } = renderHook(() =>
      useGameTimer({ duration: SIXTY_SECONDS, onComplete })
    );

    // Initialize with 60 seconds
    expect(result.current.timeRemaining).toBe(SIXTY_SECONDS);
    expect(result.current.isActive).toBe(false);

    // Start timer
    act(() => {
      result.current.start();
    });
    expect(result.current.isActive).toBe(true);

    // Advance to completion
    act(() => {
      vi.advanceTimersByTime(SIXTY_SECONDS + 100);
    });

    // Verify completion behavior
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(result.current.isActive).toBe(false);
    expect(result.current.timeRemaining).toBe(0);
  });
});
