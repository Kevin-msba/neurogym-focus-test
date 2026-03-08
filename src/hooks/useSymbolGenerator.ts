import { useEffect, useRef } from 'react';
import { generateSymbol } from '../utils/symbolGenerator';
import type { Symbol } from '../types';

export interface UseSymbolGeneratorOptions {
  isActive: boolean;
  onNewSymbol: (symbol: Symbol) => void;
}

/**
 * Custom hook for generating new symbols at 1000ms intervals during active game.
 * Generates the first symbol immediately when activated, then continues every 1000ms.
 * 
 * @param isActive - Whether the symbol generator should be active
 * @param onNewSymbol - Callback function called with each generated symbol
 */
export function useSymbolGenerator({ isActive, onNewSymbol }: UseSymbolGeneratorOptions): void {
  const onNewSymbolRef = useRef(onNewSymbol);

  // Keep callback ref up to date
  useEffect(() => {
    onNewSymbolRef.current = onNewSymbol;
  }, [onNewSymbol]);

  useEffect(() => {
    if (!isActive) return;

    // Generate first symbol immediately
    onNewSymbolRef.current(generateSymbol());

    // Then generate every 1000ms
    const interval = setInterval(() => {
      onNewSymbolRef.current(generateSymbol());
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);
}
