import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useSymbolGenerator } from './useSymbolGenerator';
import type { Symbol } from '../types';

describe('useSymbolGenerator', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should not generate symbols when inactive', () => {
    const onNewSymbol = vi.fn();
    
    renderHook(() =>
      useSymbolGenerator({ isActive: false, onNewSymbol })
    );

    // Advance time
    vi.advanceTimersByTime(5000);

    expect(onNewSymbol).not.toHaveBeenCalled();
  });

  it('should generate first symbol immediately when activated', () => {
    const onNewSymbol = vi.fn();
    
    renderHook(() =>
      useSymbolGenerator({ isActive: true, onNewSymbol })
    );

    expect(onNewSymbol).toHaveBeenCalledTimes(1);
    expect(onNewSymbol).toHaveBeenCalledWith(
      expect.objectContaining({
        value: expect.any(String),
        type: expect.stringMatching(/^(number|letter)$/),
        displayedAt: expect.any(Number)
      })
    );
  });

  it('should generate new symbol every 1000ms', () => {
    const onNewSymbol = vi.fn();
    
    renderHook(() =>
      useSymbolGenerator({ isActive: true, onNewSymbol })
    );

    // First symbol is immediate
    expect(onNewSymbol).toHaveBeenCalledTimes(1);

    // Advance 1000ms
    vi.advanceTimersByTime(1000);
    expect(onNewSymbol).toHaveBeenCalledTimes(2);

    // Advance another 1000ms
    vi.advanceTimersByTime(1000);
    expect(onNewSymbol).toHaveBeenCalledTimes(3);

    // Advance another 1000ms
    vi.advanceTimersByTime(1000);
    expect(onNewSymbol).toHaveBeenCalledTimes(4);
  });

  it('should stop generating symbols when deactivated', () => {
    const onNewSymbol = vi.fn();
    
    const { rerender } = renderHook(
      ({ isActive }: { isActive: boolean }) => useSymbolGenerator({ isActive, onNewSymbol }),
      { initialProps: { isActive: true } }
    );

    // First symbol is immediate
    expect(onNewSymbol).toHaveBeenCalledTimes(1);

    // Advance 1000ms
    vi.advanceTimersByTime(1000);
    expect(onNewSymbol).toHaveBeenCalledTimes(2);

    // Deactivate
    rerender({ isActive: false });

    // Advance more time - should not generate new symbols
    vi.advanceTimersByTime(5000);
    expect(onNewSymbol).toHaveBeenCalledTimes(2);
  });

  it('should generate valid symbols with correct structure', () => {
    const onNewSymbol = vi.fn();
    
    renderHook(() =>
      useSymbolGenerator({ isActive: true, onNewSymbol })
    );

    const symbol: Symbol = onNewSymbol.mock.calls[0][0];

    // Check structure
    expect(symbol).toHaveProperty('value');
    expect(symbol).toHaveProperty('type');
    expect(symbol).toHaveProperty('displayedAt');

    // Check types
    expect(typeof symbol.value).toBe('string');
    expect(['number', 'letter']).toContain(symbol.type);
    expect(typeof symbol.displayedAt).toBe('number');

    // Check value matches type
    if (symbol.type === 'number') {
      expect(symbol.value).toMatch(/^[1-9]$/);
    } else {
      expect(symbol.value).toMatch(/^[A-Z]$/);
    }
  });

  it('should handle callback changes without restarting interval', () => {
    const onNewSymbol1 = vi.fn();
    const onNewSymbol2 = vi.fn();
    
    const { rerender } = renderHook(
      ({ callback }: { callback: (symbol: Symbol) => void }) => useSymbolGenerator({ isActive: true, onNewSymbol: callback }),
      { initialProps: { callback: onNewSymbol1 } }
    );

    // First symbol with callback1
    expect(onNewSymbol1).toHaveBeenCalledTimes(1);

    // Change callback
    rerender({ callback: onNewSymbol2 });

    // Advance time - should use new callback
    vi.advanceTimersByTime(1000);
    expect(onNewSymbol1).toHaveBeenCalledTimes(1); // No additional calls
    expect(onNewSymbol2).toHaveBeenCalledTimes(1); // New callback used
  });

  it('should clean up interval on unmount', () => {
    const onNewSymbol = vi.fn();
    
    const { unmount } = renderHook(() =>
      useSymbolGenerator({ isActive: true, onNewSymbol })
    );

    // First symbol is immediate
    expect(onNewSymbol).toHaveBeenCalledTimes(1);

    // Unmount
    unmount();

    // Advance time - should not generate new symbols
    vi.advanceTimersByTime(5000);
    expect(onNewSymbol).toHaveBeenCalledTimes(1);
  });

  it('should restart generation when reactivated', () => {
    const onNewSymbol = vi.fn();
    
    const { rerender } = renderHook(
      ({ isActive }: { isActive: boolean }) => useSymbolGenerator({ isActive, onNewSymbol }),
      { initialProps: { isActive: true } }
    );

    // First symbol is immediate
    expect(onNewSymbol).toHaveBeenCalledTimes(1);

    // Deactivate
    rerender({ isActive: false });

    // Advance time
    vi.advanceTimersByTime(2000);
    expect(onNewSymbol).toHaveBeenCalledTimes(1);

    // Reactivate - should generate immediately
    rerender({ isActive: true });
    expect(onNewSymbol).toHaveBeenCalledTimes(2);

    // Continue generating
    vi.advanceTimersByTime(1000);
    expect(onNewSymbol).toHaveBeenCalledTimes(3);
  });
});
