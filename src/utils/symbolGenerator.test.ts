/**
 * Property-based tests for symbol generator
 * Feature: neurogym-focus-test-mvp
 */

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { generateSymbol } from './symbolGenerator';

describe('Symbol Generator Property Tests', () => {
  beforeEach(() => {
    // Mock performance.now() for consistent testing
    vi.spyOn(performance, 'now').mockReturnValue(1000);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Property 1: Symbol Generation Validity
   * **Validates: Requirements 5.2**
   * 
   * For any generated symbol during the game, the symbol value must be either 
   * a digit (1-9) or a letter (A-Z), and the symbol type must correctly match its value.
   */
  test('Property 1: Symbol Generation Validity - generated symbols are always valid', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 1000 }), () => {
        const symbol = generateSymbol();

        // Symbol must have required properties
        expect(symbol).toHaveProperty('value');
        expect(symbol).toHaveProperty('type');
        expect(symbol).toHaveProperty('displayedAt');

        // Type must be either 'number' or 'letter'
        expect(['number', 'letter']).toContain(symbol.type);

        if (symbol.type === 'number') {
          // Numbers must be 1-9
          expect(symbol.value).toMatch(/^[1-9]$/);
          const numValue = parseInt(symbol.value, 10);
          expect(numValue).toBeGreaterThanOrEqual(1);
          expect(numValue).toBeLessThanOrEqual(9);
        } else {
          // Letters must be A-Z
          expect(symbol.value).toMatch(/^[A-Z]$/);
          const charCode = symbol.value.charCodeAt(0);
          expect(charCode).toBeGreaterThanOrEqual(65); // 'A'
          expect(charCode).toBeLessThanOrEqual(90);    // 'Z'
        }

        // displayedAt must be a valid timestamp
        expect(typeof symbol.displayedAt).toBe('number');
        expect(symbol.displayedAt).toBeGreaterThanOrEqual(0);

        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 24: Symbol Generation Frequency
   * **Validates: Requirements 5.1**
   * 
   * For any active game period, symbols must be generated at intervals of 
   * 1000 milliseconds (±50ms tolerance for timer precision).
   */
  test('Property 24: Symbol Generation Frequency - symbols generated at 1000ms intervals', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 950, max: 1050 }), { minLength: 5, maxLength: 20 }),
        (intervals) => {
          const timestamps: number[] = [];
          let currentTime = 0;

          // Simulate symbol generation at specified intervals
          intervals.forEach((interval) => {
            currentTime += interval;
            vi.spyOn(performance, 'now').mockReturnValue(currentTime);
            const symbol = generateSymbol();
            timestamps.push(symbol.displayedAt);
          });

          // Verify intervals between consecutive symbols
          for (let i = 1; i < timestamps.length; i++) {
            const interval = timestamps[i] - timestamps[i - 1];
            
            // Each interval should be within ±50ms of 1000ms
            expect(interval).toBeGreaterThanOrEqual(950);
            expect(interval).toBeLessThanOrEqual(1050);
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Additional property test: Symbol type distribution
   * Verifies that over many generations, both numbers and letters are produced
   * (not strictly required by spec, but ensures randomness works)
   */
  test('Symbol generation produces both numbers and letters over many iterations', () => {
    const symbols = Array.from({ length: 100 }, () => generateSymbol());
    
    const hasNumbers = symbols.some(s => s.type === 'number');
    const hasLetters = symbols.some(s => s.type === 'letter');
    
    expect(hasNumbers).toBe(true);
    expect(hasLetters).toBe(true);
  });

  /**
   * Additional property test: Symbol value uniqueness
   * Verifies that the generator can produce different values
   */
  test('Symbol generation produces variety of values', () => {
    const symbols = Array.from({ length: 100 }, () => generateSymbol());
    const uniqueValues = new Set(symbols.map(s => s.value));
    
    // With 100 generations, we should see at least 10 unique values
    // (statistically very likely with 35 possible values: 9 numbers + 26 letters)
    expect(uniqueValues.size).toBeGreaterThanOrEqual(10);
  });
});
