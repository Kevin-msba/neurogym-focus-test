/**
 * Unit tests for formatting utilities
 */

import { describe, it, expect } from 'vitest';
import {
  formatFocusScore,
  formatSwitchingCost,
  formatDailyFocusLoss
} from './formatters';

describe('formatFocusScore', () => {
  it('should format score with " / 100" suffix', () => {
    expect(formatFocusScore(75)).toBe('75 / 100');
  });

  it('should handle score of 0', () => {
    expect(formatFocusScore(0)).toBe('0 / 100');
  });

  it('should handle score of 100', () => {
    expect(formatFocusScore(100)).toBe('100 / 100');
  });

  it('should round decimal scores', () => {
    expect(formatFocusScore(75.6)).toBe('76 / 100');
    expect(formatFocusScore(75.4)).toBe('75 / 100');
  });

  it('should match the pattern "X / 100"', () => {
    const result = formatFocusScore(85);
    expect(result).toMatch(/^\d+ \/ 100$/);
  });
});

describe('formatSwitchingCost', () => {
  it('should format positive cost with "+" prefix and " ms" suffix', () => {
    expect(formatSwitchingCost(150)).toBe('+150 ms');
  });

  it('should format negative cost with "-" prefix and " ms" suffix', () => {
    expect(formatSwitchingCost(-50)).toBe('-50 ms');
  });

  it('should format zero cost with "+" prefix', () => {
    expect(formatSwitchingCost(0)).toBe('+0 ms');
  });

  it('should round decimal costs', () => {
    expect(formatSwitchingCost(123.7)).toBe('+124 ms');
    expect(formatSwitchingCost(-45.3)).toBe('-45 ms');
  });

  it('should match the pattern "+X ms" or "-X ms"', () => {
    expect(formatSwitchingCost(100)).toMatch(/^[+-]\d+ ms$/);
    expect(formatSwitchingCost(-100)).toMatch(/^[+-]\d+ ms$/);
  });
});

describe('formatDailyFocusLoss', () => {
  it('should format hours with " hours" suffix', () => {
    expect(formatDailyFocusLoss(2.5)).toBe('2.5 hours');
  });

  it('should format with exactly 1 decimal place', () => {
    expect(formatDailyFocusLoss(3)).toBe('3.0 hours');
    expect(formatDailyFocusLoss(1.234)).toBe('1.2 hours');
  });

  it('should handle zero hours', () => {
    expect(formatDailyFocusLoss(0)).toBe('0.0 hours');
  });

  it('should handle maximum hours', () => {
    expect(formatDailyFocusLoss(8)).toBe('8.0 hours');
  });

  it('should match the pattern "X.X hours"', () => {
    const result = formatDailyFocusLoss(4.7);
    expect(result).toMatch(/^\d+\.\d hours$/);
  });

  it('should preserve the decimal place even for whole numbers', () => {
    expect(formatDailyFocusLoss(5)).toBe('5.0 hours');
  });
});
