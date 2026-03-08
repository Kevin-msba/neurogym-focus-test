import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useTouchInput } from './useTouchInput';

describe('useTouchInput', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let addEventListenerSpy: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let removeEventListenerSpy: any;

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should add touchstart event listener when active', () => {
    const onKeyPress = vi.fn();
    
    renderHook(() =>
      useTouchInput({ isActive: true, onKeyPress })
    );

    expect(addEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function), { passive: false });
  });

  it('should not add event listener when inactive', () => {
    const onKeyPress = vi.fn();
    
    renderHook(() =>
      useTouchInput({ isActive: false, onKeyPress })
    );

    expect(addEventListenerSpy).not.toHaveBeenCalled();
  });

  it('should call onKeyPress with "left" when left half of screen is touched', () => {
    const onKeyPress = vi.fn();
    
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1000,
    });
    
    renderHook(() =>
      useTouchInput({ isActive: true, onKeyPress })
    );

    // Touch at x=200 (left half)
    const event = new TouchEvent('touchstart', {
      touches: [{ clientX: 200, clientY: 300 } as Touch],
    });
    window.dispatchEvent(event);

    expect(onKeyPress).toHaveBeenCalledWith('left');
    expect(onKeyPress).toHaveBeenCalledTimes(1);
  });

  it('should call onKeyPress with "right" when right half of screen is touched', () => {
    const onKeyPress = vi.fn();
    
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1000,
    });
    
    renderHook(() =>
      useTouchInput({ isActive: true, onKeyPress })
    );

    // Touch at x=700 (right half)
    const event = new TouchEvent('touchstart', {
      touches: [{ clientX: 700, clientY: 300 } as Touch],
    });
    window.dispatchEvent(event);

    expect(onKeyPress).toHaveBeenCalledWith('right');
    expect(onKeyPress).toHaveBeenCalledTimes(1);
  });

  it('should call onKeyPress with "left" when touching exactly at the midpoint', () => {
    const onKeyPress = vi.fn();
    
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1000,
    });
    
    renderHook(() =>
      useTouchInput({ isActive: true, onKeyPress })
    );

    // Touch at x=499 (just left of midpoint)
    const event = new TouchEvent('touchstart', {
      touches: [{ clientX: 499, clientY: 300 } as Touch],
    });
    window.dispatchEvent(event);

    expect(onKeyPress).toHaveBeenCalledWith('left');
  });

  it('should call onKeyPress with "right" when touching just right of midpoint', () => {
    const onKeyPress = vi.fn();
    
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1000,
    });
    
    renderHook(() =>
      useTouchInput({ isActive: true, onKeyPress })
    );

    // Touch at x=500 (exactly at midpoint)
    const event = new TouchEvent('touchstart', {
      touches: [{ clientX: 500, clientY: 300 } as Touch],
    });
    window.dispatchEvent(event);

    expect(onKeyPress).toHaveBeenCalledWith('right');
  });

  it('should remove event listener on cleanup', () => {
    const onKeyPress = vi.fn();
    
    const { unmount } = renderHook(() =>
      useTouchInput({ isActive: true, onKeyPress })
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
  });

  it('should not respond to touches when inactive', () => {
    const onKeyPress = vi.fn();
    
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1000,
    });
    
    renderHook(() =>
      useTouchInput({ isActive: false, onKeyPress })
    );

    const event = new TouchEvent('touchstart', {
      touches: [{ clientX: 200, clientY: 300 } as Touch],
    });
    window.dispatchEvent(event);

    expect(onKeyPress).not.toHaveBeenCalled();
  });

  it('should handle multiple touches', () => {
    const onKeyPress = vi.fn();
    
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1000,
    });
    
    renderHook(() =>
      useTouchInput({ isActive: true, onKeyPress })
    );

    const leftEvent = new TouchEvent('touchstart', {
      touches: [{ clientX: 200, clientY: 300 } as Touch],
    });
    const rightEvent = new TouchEvent('touchstart', {
      touches: [{ clientX: 700, clientY: 300 } as Touch],
    });
    
    window.dispatchEvent(leftEvent);
    window.dispatchEvent(rightEvent);
    window.dispatchEvent(leftEvent);

    expect(onKeyPress).toHaveBeenCalledTimes(3);
    expect(onKeyPress).toHaveBeenNthCalledWith(1, 'left');
    expect(onKeyPress).toHaveBeenNthCalledWith(2, 'right');
    expect(onKeyPress).toHaveBeenNthCalledWith(3, 'left');
  });

  it('should update listener when isActive changes', () => {
    const onKeyPress = vi.fn();
    
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1000,
    });
    
    const { rerender } = renderHook(
      ({ isActive }: { isActive: boolean }) => useTouchInput({ isActive, onKeyPress }),
      { initialProps: { isActive: false } }
    );

    // Initially inactive - no listener
    expect(addEventListenerSpy).not.toHaveBeenCalled();

    // Activate
    rerender({ isActive: true });
    expect(addEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function), { passive: false });

    // Test that it works
    const event = new TouchEvent('touchstart', {
      touches: [{ clientX: 200, clientY: 300 } as Touch],
    });
    window.dispatchEvent(event);
    expect(onKeyPress).toHaveBeenCalledWith('left');
  });

  it('should work with different screen widths', () => {
    const onKeyPress = vi.fn();
    
    // Mock a mobile screen width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    
    renderHook(() =>
      useTouchInput({ isActive: true, onKeyPress })
    );

    // Touch at x=100 (left half of 375px screen)
    const leftEvent = new TouchEvent('touchstart', {
      touches: [{ clientX: 100, clientY: 300 } as Touch],
    });
    window.dispatchEvent(leftEvent);
    expect(onKeyPress).toHaveBeenCalledWith('left');

    // Touch at x=300 (right half of 375px screen)
    const rightEvent = new TouchEvent('touchstart', {
      touches: [{ clientX: 300, clientY: 300 } as Touch],
    });
    window.dispatchEvent(rightEvent);
    expect(onKeyPress).toHaveBeenCalledWith('right');
  });
});
