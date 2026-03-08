import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useRuleSwitcher } from './useRuleSwitcher';

describe('useRuleSwitcher', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should not trigger rule switch when inactive', () => {
    const onRuleSwitch = vi.fn();

    renderHook(() =>
      useRuleSwitcher({
        isActive: false,
        onRuleSwitch,
      })
    );

    // Advance time by 10 seconds
    vi.advanceTimersByTime(10000);

    expect(onRuleSwitch).not.toHaveBeenCalled();
  });

  it('should trigger rule switch when active', () => {
    const onRuleSwitch = vi.fn();

    renderHook(() =>
      useRuleSwitcher({
        isActive: true,
        onRuleSwitch,
      })
    );

    // Advance time by 8 seconds (maximum interval)
    vi.advanceTimersByTime(8000);

    expect(onRuleSwitch).toHaveBeenCalledTimes(1);
  });

  it('should trigger multiple rule switches over time', () => {
    const onRuleSwitch = vi.fn();

    renderHook(() =>
      useRuleSwitcher({
        isActive: true,
        onRuleSwitch,
      })
    );

    // Advance time by 25 seconds (should trigger at least 3 switches, at most 5)
    // Min: 25000 / 8000 = 3.125 switches
    // Max: 25000 / 5000 = 5 switches
    vi.advanceTimersByTime(25000);

    expect(onRuleSwitch.mock.calls.length).toBeGreaterThanOrEqual(3);
    expect(onRuleSwitch.mock.calls.length).toBeLessThanOrEqual(5);
  });

  it('should stop triggering switches when deactivated', () => {
    const onRuleSwitch = vi.fn();

    const { rerender } = renderHook(
      ({ isActive }) =>
        useRuleSwitcher({
          isActive,
          onRuleSwitch,
        }),
      { initialProps: { isActive: true } }
    );

    // Advance time to trigger first switch
    vi.advanceTimersByTime(8000);

    expect(onRuleSwitch).toHaveBeenCalledTimes(1);

    // Deactivate
    rerender({ isActive: false });

    // Advance more time
    vi.advanceTimersByTime(10000);

    // Should not trigger additional switches
    expect(onRuleSwitch).toHaveBeenCalledTimes(1);
  });

  it('should use callback ref to avoid stale closures', () => {
    let callCount = 0;
    const onRuleSwitch1 = vi.fn(() => {
      callCount++;
    });
    const onRuleSwitch2 = vi.fn(() => {
      callCount++;
    });

    const { rerender } = renderHook(
      ({ callback }) =>
        useRuleSwitcher({
          isActive: true,
          onRuleSwitch: callback,
        }),
      { initialProps: { callback: onRuleSwitch1 } }
    );

    // Advance time to trigger first switch
    vi.advanceTimersByTime(8000);

    expect(callCount).toBe(1);

    // Change callback
    rerender({ callback: onRuleSwitch2 });

    // Advance time to trigger second switch
    vi.advanceTimersByTime(8000);

    expect(callCount).toBe(2);

    // The new callback should have been called
    expect(onRuleSwitch2).toHaveBeenCalled();
  });

  it('should schedule switches with random intervals between 5-8 seconds', () => {
    const onRuleSwitch = vi.fn();
    const mathRandomSpy = vi.spyOn(Math, 'random');

    // Mock Math.random to return 0 (minimum interval: 5000ms)
    mathRandomSpy.mockReturnValueOnce(0);

    renderHook(() =>
      useRuleSwitcher({
        isActive: true,
        onRuleSwitch,
      })
    );

    // Should not trigger before 5 seconds
    vi.advanceTimersByTime(4999);
    expect(onRuleSwitch).not.toHaveBeenCalled();

    // Should trigger at 5 seconds
    vi.advanceTimersByTime(1);
    expect(onRuleSwitch).toHaveBeenCalledTimes(1);

    mathRandomSpy.mockRestore();
  });
});
