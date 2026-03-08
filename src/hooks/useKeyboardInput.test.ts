import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useKeyboardInput } from './useKeyboardInput';

describe('useKeyboardInput', () => {
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

  it('should add keydown event listener when active', () => {
    const onKeyPress = vi.fn();
    
    renderHook(() =>
      useKeyboardInput({ isActive: true, onKeyPress })
    );

    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('should not add event listener when inactive', () => {
    const onKeyPress = vi.fn();
    
    renderHook(() =>
      useKeyboardInput({ isActive: false, onKeyPress })
    );

    expect(addEventListenerSpy).not.toHaveBeenCalled();
  });

  it('should call onKeyPress with "left" when ArrowLeft is pressed', () => {
    const onKeyPress = vi.fn();
    
    renderHook(() =>
      useKeyboardInput({ isActive: true, onKeyPress })
    );

    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    window.dispatchEvent(event);

    expect(onKeyPress).toHaveBeenCalledWith('left');
    expect(onKeyPress).toHaveBeenCalledTimes(1);
  });

  it('should call onKeyPress with "right" when ArrowRight is pressed', () => {
    const onKeyPress = vi.fn();
    
    renderHook(() =>
      useKeyboardInput({ isActive: true, onKeyPress })
    );

    const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    window.dispatchEvent(event);

    expect(onKeyPress).toHaveBeenCalledWith('right');
    expect(onKeyPress).toHaveBeenCalledTimes(1);
  });

  it('should prevent default behavior for ArrowLeft', () => {
    const onKeyPress = vi.fn();
    
    renderHook(() =>
      useKeyboardInput({ isActive: true, onKeyPress })
    );

    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    
    window.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should prevent default behavior for ArrowRight', () => {
    const onKeyPress = vi.fn();
    
    renderHook(() =>
      useKeyboardInput({ isActive: true, onKeyPress })
    );

    const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    
    window.dispatchEvent(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should not call onKeyPress for other keys', () => {
    const onKeyPress = vi.fn();
    
    renderHook(() =>
      useKeyboardInput({ isActive: true, onKeyPress })
    );

    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    window.dispatchEvent(event);

    expect(onKeyPress).not.toHaveBeenCalled();
  });

  it('should not prevent default for other keys', () => {
    const onKeyPress = vi.fn();
    
    renderHook(() =>
      useKeyboardInput({ isActive: true, onKeyPress })
    );

    const event = new KeyboardEvent('keydown', { key: 'Space' });
    const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
    
    window.dispatchEvent(event);

    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });

  it('should remove event listener on cleanup', () => {
    const onKeyPress = vi.fn();
    
    const { unmount } = renderHook(() =>
      useKeyboardInput({ isActive: true, onKeyPress })
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('should not respond to key presses when inactive', () => {
    const onKeyPress = vi.fn();
    
    renderHook(() =>
      useKeyboardInput({ isActive: false, onKeyPress })
    );

    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    window.dispatchEvent(event);

    expect(onKeyPress).not.toHaveBeenCalled();
  });

  it('should handle multiple key presses', () => {
    const onKeyPress = vi.fn();
    
    renderHook(() =>
      useKeyboardInput({ isActive: true, onKeyPress })
    );

    const leftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    const rightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    
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
    
    const { rerender } = renderHook(
      ({ isActive }) => useKeyboardInput({ isActive, onKeyPress }),
      { initialProps: { isActive: false } }
    );

    // Initially inactive - no listener
    expect(addEventListenerSpy).not.toHaveBeenCalled();

    // Activate
    rerender({ isActive: true });
    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

    // Test that it works
    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    window.dispatchEvent(event);
    expect(onKeyPress).toHaveBeenCalledWith('left');
  });
});
