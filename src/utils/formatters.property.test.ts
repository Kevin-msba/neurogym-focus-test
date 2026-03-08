/**
 * Property-based tests for formatting utilities
 * 
 * These tests verify correctness properties for display formatting functions
 * using the fast-check library. Each property test runs 100+ iterations.
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  formatFocusScore,
  formatSwitchingCost,
  formatDailyFocusLoss
} from './formatters';

// ============================================================================
// Property 13: Score Display Formatting
// ============================================================================

describe('Property 13: Score Display Formatting', () => {
  // Feature: neurogym-focus-test-mvp, Property 13: Score Display Formatting
  // **Validates: Requirements 13.2**
  it('should format any Focus Stability Score as "X / 100" pattern', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 100, noNaN: true }),
        (score: number) => {
        const formatted = formatFocusScore(score);
        
        // Should match pattern "X / 100"
        const pattern = /^-?\d+ \/ 100$/;
        expect(formatted).toMatch(pattern);
        
        // Extract the number part and verify it matches the rounded score
        const match = formatted.match(/^(-?\d+) \/ 100$/);
        expect(match).not.toBeNull();
        if (match) {
          const displayedScore = parseInt(match[1], 10);
          expect(displayedScore).toBe(Math.round(score));
        }
      }),
      { numRuns: 100 }
    );
  });

  it('should handle edge cases correctly', () => {
    expect(formatFocusScore(0)).toBe('0 / 100');
    expect(formatFocusScore(100)).toBe('100 / 100');
    expect(formatFocusScore(50.4)).toBe('50 / 100');
    expect(formatFocusScore(50.5)).toBe('51 / 100');
    expect(formatFocusScore(99.9)).toBe('100 / 100');
  });

  it('should always include " / 100" suffix', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 100, noNaN: true }),
        (score: number) => {
        const formatted = formatFocusScore(score);
        expect(formatted).toContain(' / 100');
        expect(formatted.endsWith(' / 100')).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});

// ============================================================================
// Property 14: Switching Cost Display Formatting
// ============================================================================

describe('Property 14: Switching Cost Display Formatting', () => {
  // Feature: neurogym-focus-test-mvp, Property 14: Switching Cost Display Formatting
  // **Validates: Requirements 13.3**
  it('should format any switching cost as "+X ms" or "-X ms" pattern', () => {
    fc.assert(
      fc.property(
        fc.double({ min: -500, max: 500, noNaN: true }),
        (cost: number) => {
        const formatted = formatSwitchingCost(cost);
        
        // Should match pattern "+X ms" or "-X ms"
        const pattern = /^[+-]\d+ ms$/;
        expect(formatted).toMatch(pattern);
        
        // Extract the number part and verify it matches the rounded cost
        const match = formatted.match(/^([+-]\d+) ms$/);
        expect(match).not.toBeNull();
        if (match) {
          const displayedCost = parseInt(match[1], 10);
          const roundedCost = Math.round(cost);
          // Handle -0 edge case: -0 should be normalized to +0
          const expectedCost = Object.is(roundedCost, -0) ? 0 : roundedCost;
          expect(displayedCost).toBe(expectedCost);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('should handle positive costs with + sign', () => {
    expect(formatSwitchingCost(150)).toBe('+150 ms');
    expect(formatSwitchingCost(0.6)).toBe('+1 ms');
    expect(formatSwitchingCost(250.4)).toBe('+250 ms');
  });

  it('should handle negative costs with - sign', () => {
    expect(formatSwitchingCost(-150)).toBe('-150 ms');
    expect(formatSwitchingCost(-0.6)).toBe('-1 ms');
    expect(formatSwitchingCost(-250.4)).toBe('-250 ms');
  });

  it('should handle zero with + sign', () => {
    expect(formatSwitchingCost(0)).toBe('+0 ms');
    expect(formatSwitchingCost(0.4)).toBe('+0 ms');
    expect(formatSwitchingCost(-0.4)).toBe('+0 ms');
  });

  it('should always include " ms" suffix', () => {
    fc.assert(
      fc.property(
        fc.double({ min: -500, max: 500, noNaN: true }),
        (cost: number) => {
        const formatted = formatSwitchingCost(cost);
        expect(formatted).toContain(' ms');
        expect(formatted.endsWith(' ms')).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('should always start with + or - sign', () => {
    fc.assert(
      fc.property(
        fc.double({ min: -500, max: 500, noNaN: true }),
        (cost: number) => {
        const formatted = formatSwitchingCost(cost);
        expect(formatted[0]).toMatch(/[+-]/);
      }),
      { numRuns: 100 }
    );
  });
});

// ============================================================================
// Property 15: Daily Focus Loss Display Formatting
// ============================================================================

describe('Property 15: Daily Focus Loss Display Formatting', () => {
  // Feature: neurogym-focus-test-mvp, Property 15: Daily Focus Loss Display Formatting
  // **Validates: Requirements 13.4**
  it('should format any daily focus loss as "X hours" or "X.X hours" pattern', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 10, noNaN: true }),
        (hours: number) => {
        const formatted = formatDailyFocusLoss(hours);
        
        // Should match pattern "X hours" or "X.X hours"
        const pattern = /^\d+\.\d+ hours$/;
        expect(formatted).toMatch(pattern);
        
        // Extract the number part and verify it has exactly one decimal place
        const match = formatted.match(/^(\d+\.\d+) hours$/);
        expect(match).not.toBeNull();
        if (match) {
          const numberPart = match[1];
          const decimalPart = numberPart.split('.')[1];
          expect(decimalPart.length).toBe(1);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('should always have exactly one decimal place', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 10, noNaN: true }),
        (hours: number) => {
        const formatted = formatDailyFocusLoss(hours);
        
        // Extract number part before " hours"
        const numberStr = formatted.replace(' hours', '');
        const parts = numberStr.split('.');
        
        expect(parts.length).toBe(2);
        expect(parts[1].length).toBe(1);
      }),
      { numRuns: 100 }
    );
  });

  it('should handle edge cases correctly', () => {
    expect(formatDailyFocusLoss(0)).toBe('0.0 hours');
    expect(formatDailyFocusLoss(1)).toBe('1.0 hours');
    expect(formatDailyFocusLoss(1.5)).toBe('1.5 hours');
    expect(formatDailyFocusLoss(8.0)).toBe('8.0 hours');
    expect(formatDailyFocusLoss(2.34)).toBe('2.3 hours');
    expect(formatDailyFocusLoss(2.35)).toBe('2.4 hours');
  });

  it('should always include " hours" suffix', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0, max: 10, noNaN: true }),
        (hours: number) => {
        const formatted = formatDailyFocusLoss(hours);
        expect(formatted).toContain(' hours');
        expect(formatted.endsWith(' hours')).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('should round to one decimal place correctly', () => {
    // Test rounding behavior
    expect(formatDailyFocusLoss(1.14)).toBe('1.1 hours');
    expect(formatDailyFocusLoss(1.15)).toBe('1.2 hours');
    expect(formatDailyFocusLoss(1.24)).toBe('1.2 hours');
    expect(formatDailyFocusLoss(1.25)).toBe('1.3 hours');
    expect(formatDailyFocusLoss(1.94)).toBe('1.9 hours');
    expect(formatDailyFocusLoss(1.95)).toBe('2.0 hours');
  });

  it('should preserve precision for values already at one decimal place', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        (tenths: number) => {
        const hours = tenths / 10; // Creates values like 0.0, 0.1, 0.2, ..., 10.0
        const formatted = formatDailyFocusLoss(hours);
        
        // Should match the input when already at one decimal place
        expect(formatted).toBe(`${hours.toFixed(1)} hours`);
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * **Validates: Requirements 13.2, 13.3, 13.4**
 */
