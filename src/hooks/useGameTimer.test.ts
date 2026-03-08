import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useGameTimer } from './useGameTimer';

describe('useGameTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with the correct duration', () => {
    const { result } = renderHook(() =>
      useGameTimer({ duration: 60000, onComplete: vi.fn() })
    );

    expect(result.current.timeRemaining).toBe(60000);
    expect(result.current.isActive).toBe(false);
  });

  it('should start the timer when start is called', () => {
    const { result } = renderHook(() =>
      useGameTimer({ duration: 60000, onComplete: vi.fn() })
    );

    act(() => {
      result.current.start();
    });

    expect(result.current.isActive).toBe(true);
  });

  it('should pause the timer when pause is called', () => {
    const { result } = renderHook(() =>
      useGameTimer({ duration: 60000, onComplete: vi.fn() })
    );

    act(() => {
      result.current.start();
    });

    expect(result.current.isActive).toBe(true);

    act(() => {
      result.current.pause();
    });

    expect(result.current.isActive).toBe(false);
  });

  it('should reset the timer to initial duration', () => {
    const { result } = renderHook(() =>
      useGameTimer({ duration: 60000, onComplete: vi.fn() })
    );

    act(() => {
      result.current.start();
    });

    // Simulate some time passing
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.timeRemaining).toBe(60000);
    expect(result.current.isActive).toBe(false);
  });

  it('should call onComplete when timer reaches zero', () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() =>
      useGameTimer({ duration: 1000, onComplete })
    );

    act(() => {
      result.current.start();
    });

    // Fast-forward time to completion
    act(() => {
      vi.advanceTimersByTime(1100);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(result.current.isActive).toBe(false);
  });

  it('should not go below zero milliseconds', () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() =>
      useGameTimer({ duration: 1000, onComplete })
    );

    act(() => {
      result.current.start();
    });

    // Fast-forward beyond completion
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.timeRemaining).toBe(0);
  });

  it('should handle multiple start/pause cycles', () => {
    const { result } = renderHook(() =>
      useGameTimer({ duration: 10000, onComplete: vi.fn() })
    );

    // Start
    act(() => {
      result.current.start();
    });
    expect(result.current.isActive).toBe(true);

    // Pause
    act(() => {
      result.current.pause();
    });
    expect(result.current.isActive).toBe(false);

    // Start again
    act(() => {
      result.current.start();
    });
    expect(result.current.isActive).toBe(true);
  });

  it('should maintain time remaining when paused', () => {
    const { result } = renderHook(() =>
      useGameTimer({ duration: 10000, onComplete: vi.fn() })
    );

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    const timeBeforePause = result.current.timeRemaining;

    act(() => {
      result.current.pause();
    });

    // Time should not change while paused
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.timeRemaining).toBe(timeBeforePause);
  });
});
