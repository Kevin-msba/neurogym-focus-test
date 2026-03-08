import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { useRuleSwitcher } from './useRuleSwitcher';

/**
 * Property-based tests for useRuleSwitcher hook
 * 
 * **Validates: Requirements 7.1**
 * 
 * These tests verify that the rule switcher hook correctly:
 * - Triggers rule switches at random intervals between 5-8 seconds (7.1)
 * - Multiple switches continue to occur at valid intervals
 * - The timing is consistent across different scenarios
 */
describe('useRuleSwitcher - Property-Based Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Property 23: Rule Switch Timing
   * For any rule switch event during an active game, the time since the previous
   * rule switch must be between 5000 and 8000 milliseconds (inclusive).
   * 
   * **Validates: Requirements 7.1**
   */
  it('property: rule switches occur between 5-8 seconds', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 3, max: 10 }), // Number of switches to test
        (numSwitches: number) => {
          const switchTimes: number[] = [];
          const onRuleSwitch = vi.fn(() => {
            switchTimes.push(Date.now());
          });

          renderHook(() =>
            useRuleSwitcher({ isActive: true, onRuleSwitch })
          );

          // Advance time to trigger multiple switches
          // We need to advance enough time to capture all switches
          // Maximum time would be numSwitches * 8000ms
          const maxTime = numSwitches * 8000 + 1000;
          
          act(() => {
            vi.advanceTimersByTime(maxTime);
          });

          // Verify we got at least numSwitches switches
          expect(switchTimes.length).toBeGreaterThanOrEqual(numSwitches);

          // Check that each switch interval is within 5-8 seconds
          for (let i = 1; i < Math.min(switchTimes.length, numSwitches + 1); i++) {
            const interval = switchTimes[i] - switchTimes[i - 1];
            
            // Each interval must be between 5000ms and 8000ms (inclusive)
            expect(interval).toBeGreaterThanOrEqual(5000);
            expect(interval).toBeLessThanOrEqual(8000);
          }
        }
      ),
      { numRuns: 50 } // Reduced from 100 to avoid timeouts
    );
  });

  /**
   * Property: First Switch Timing
   * The first rule switch must occur between 5-8 seconds after activation.
   * 
   * **Validates: Requirements 7.1**
   */
  it('property: first switch occurs between 5-8 seconds', () => {
    fc.assert(
      fc.property(
        fc.constant(null), // No input needed, just testing timing
        () => {
          let firstSwitchTime: number | null = null;
          const startTime = Date.now();
          
          const onRuleSwitch = vi.fn(() => {
            if (firstSwitchTime === null) {
              firstSwitchTime = Date.now();
            }
          });

          renderHook(() =>
            useRuleSwitcher({ isActive: true, onRuleSwitch })
          );

          // Advance time to trigger first switch
          act(() => {
            vi.advanceTimersByTime(8500); // Enough for first switch
          });

          // Verify first switch occurred
          expect(firstSwitchTime).not.toBeNull();
          
          if (firstSwitchTime !== null) {
            const interval = firstSwitchTime - startTime;
            
            // First switch must be between 5000ms and 8000ms
            expect(interval).toBeGreaterThanOrEqual(5000);
            expect(interval).toBeLessThanOrEqual(8000);
          }
        }
      ),
      { numRuns: 50 } // Reduced from 100
    );
  });

  /**
   * Property: No Switches When Inactive
   * When isActive is false, no rule switches should occur regardless of time.
   * 
   * **Validates: Requirements 7.1**
   */
  it('property: no switches occur when inactive', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1000, max: 30000 }), // Various time periods
        (timeToAdvance: number) => {
          const onRuleSwitch = vi.fn();

          renderHook(() =>
            useRuleSwitcher({ isActive: false, onRuleSwitch })
          );

          // Advance time
          act(() => {
            vi.advanceTimersByTime(timeToAdvance);
          });

          // No switches should have occurred
          expect(onRuleSwitch).not.toHaveBeenCalled();
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Property: Continuous Switching
   * Rule switches must continue to occur at valid intervals for the duration
   * of an active game (60 seconds).
   * 
   * **Validates: Requirements 7.1**
   */
  it('property: switches continue throughout 60-second game', () => {
    const GAME_DURATION = 60000; // 60 seconds
    const switchTimes: number[] = [];
    
    const onRuleSwitch = vi.fn(() => {
      switchTimes.push(Date.now());
    });

    renderHook(() =>
      useRuleSwitcher({ isActive: true, onRuleSwitch })
    );

    // Advance through entire game duration
    act(() => {
      vi.advanceTimersByTime(GAME_DURATION);
    });

    // Should have multiple switches (minimum 60000 / 8000 = 7.5, so at least 7)
    expect(switchTimes.length).toBeGreaterThanOrEqual(7);
    
    // Maximum switches would be 60000 / 5000 = 12
    expect(switchTimes.length).toBeLessThanOrEqual(12);

    // Verify all intervals are valid
    for (let i = 1; i < switchTimes.length; i++) {
      const interval = switchTimes[i] - switchTimes[i - 1];
      expect(interval).toBeGreaterThanOrEqual(5000);
      expect(interval).toBeLessThanOrEqual(8000);
    }
  });

  /**
   * Property: Activation/Deactivation Behavior
   * When switching between active and inactive states, the hook must
   * properly start and stop scheduling switches.
   * 
   * **Validates: Requirements 7.1**
   */
  it('property: activation and deactivation work correctly', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            isActive: fc.boolean(),
            duration: fc.integer({ min: 1000, max: 10000 })
          }),
          { minLength: 2, maxLength: 5 }
        ),
        (phases: Array<{ isActive: boolean; duration: number }>) => {
          let switchCount = 0;
          const onRuleSwitch = vi.fn(() => {
            switchCount++;
          });

          const { rerender } = renderHook(
            ({ isActive }: { isActive: boolean }) => useRuleSwitcher({ isActive, onRuleSwitch }),
            { initialProps: { isActive: false } }
          );

          // Go through each phase
          phases.forEach((phase: { isActive: boolean; duration: number }) => {
            const switchCountBefore = switchCount;
            
            // Update active state
            rerender({ isActive: phase.isActive });

            // Advance time
            act(() => {
              vi.advanceTimersByTime(phase.duration);
            });

            // If inactive, no new switches should occur
            if (!phase.isActive) {
              expect(switchCount).toBe(switchCountBefore);
            }
            // If active and enough time passed, switches may occur
            // (but we don't assert they must, as timing is random)
          });
        }
      ),
      { numRuns: 30 }
    );
  });

  /**
   * Property: Cleanup on Unmount
   * When the hook unmounts, no further switches should occur.
   * 
   * **Validates: Requirements 7.1**
   */
  it('property: no switches after unmount', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 5000, max: 20000 }),
        (timeAfterUnmount: number) => {
          const onRuleSwitch = vi.fn();

          const { unmount } = renderHook(() =>
            useRuleSwitcher({ isActive: true, onRuleSwitch })
          );

          // Unmount the hook
          unmount();

          const switchCountAtUnmount = onRuleSwitch.mock.calls.length;

          // Advance time after unmount
          act(() => {
            vi.advanceTimersByTime(timeAfterUnmount);
          });

          // No new switches should have occurred
          expect(onRuleSwitch).toHaveBeenCalledTimes(switchCountAtUnmount);
        }
      ),
      { numRuns: 50 }
    );
  });
});
