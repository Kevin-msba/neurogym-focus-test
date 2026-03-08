/**
 * Unit tests for score calculation utilities
 */

import { describe, it, expect } from 'vitest';
import {
  calculateFocusStabilityScore,
  calculateSwitchingCost,
  calculateDailyFocusLoss,
  calculatePeerComparison
} from './scoreCalculator';
import { Response, Symbol } from '../types';

// Helper function to create a mock response
function createResponse(
  correct: boolean,
  reactionTime: number,
  isPostSwitch: boolean = false
): Response {
  const symbol: Symbol = {
    value: '5',
    type: 'number',
    displayedAt: Date.now()
  };
  
  return {
    symbol,
    userKey: 'left',
    correct,
    reactionTime,
    isPostSwitch,
    timestamp: Date.now()
  };
}

describe('calculateFocusStabilityScore', () => {
  it('should return 0 for empty responses', () => {
    expect(calculateFocusStabilityScore([])).toBe(0);
  });

  it('should return 100 for perfect accuracy and zero variance', () => {
    const responses = [
      createResponse(true, 500),
      createResponse(true, 500),
      createResponse(true, 500),
      createResponse(true, 500),
      createResponse(true, 500)
    ];
    
    const score = calculateFocusStabilityScore(responses);
    expect(score).toBe(100);
  });

  it('should return 0 for zero accuracy', () => {
    const responses = [
      createResponse(false, 500),
      createResponse(false, 600),
      createResponse(false, 700)
    ];
    
    const score = calculateFocusStabilityScore(responses);
    expect(score).toBe(0);
  });

  it('should return a value between 0 and 100', () => {
    const responses = [
      createResponse(true, 400),
      createResponse(false, 600),
      createResponse(true, 500),
      createResponse(true, 800)
    ];
    
    const score = calculateFocusStabilityScore(responses);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('should give higher score for higher accuracy with same variance', () => {
    const highAccuracy = [
      createResponse(true, 500),
      createResponse(true, 600),
      createResponse(true, 700),
      createResponse(false, 500)
    ];
    
    const lowAccuracy = [
      createResponse(true, 500),
      createResponse(false, 600),
      createResponse(false, 700),
      createResponse(false, 500)
    ];
    
    const highScore = calculateFocusStabilityScore(highAccuracy);
    const lowScore = calculateFocusStabilityScore(lowAccuracy);
    
    expect(highScore).toBeGreaterThan(lowScore);
  });

  it('should give higher score for lower variance with same accuracy', () => {
    const lowVariance = [
      createResponse(true, 500),
      createResponse(true, 510),
      createResponse(false, 505),
      createResponse(false, 500)
    ];
    
    const highVariance = [
      createResponse(true, 200),
      createResponse(true, 1000),
      createResponse(false, 300),
      createResponse(false, 900)
    ];
    
    const lowVarScore = calculateFocusStabilityScore(lowVariance);
    const highVarScore = calculateFocusStabilityScore(highVariance);
    
    expect(lowVarScore).toBeGreaterThan(highVarScore);
  });

  // Error handling tests
  it('should handle null/undefined responses array', () => {
    expect(calculateFocusStabilityScore(null as any)).toBe(0);
    expect(calculateFocusStabilityScore(undefined as any)).toBe(0);
  });

  it('should handle responses with NaN reaction times', () => {
    const responses = [
      createResponse(true, NaN),
      createResponse(true, 500),
      createResponse(true, 600)
    ];
    
    expect(calculateFocusStabilityScore(responses)).toBe(0);
  });

  it('should handle responses with negative reaction times', () => {
    const responses = [
      createResponse(true, -100),
      createResponse(true, 500),
      createResponse(true, 600)
    ];
    
    expect(calculateFocusStabilityScore(responses)).toBe(0);
  });

  it('should handle single response', () => {
    const responses = [createResponse(true, 500)];
    const score = calculateFocusStabilityScore(responses);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });
});

describe('calculateSwitchingCost', () => {
  it('should return 0 when no post-switch responses', () => {
    const responses = [
      createResponse(true, 500, false),
      createResponse(true, 600, false),
      createResponse(true, 550, false)
    ];
    
    expect(calculateSwitchingCost(responses)).toBe(0);
  });

  it('should return 0 when no normal responses', () => {
    const responses = [
      createResponse(true, 500, true),
      createResponse(true, 600, true),
      createResponse(true, 550, true)
    ];
    
    expect(calculateSwitchingCost(responses)).toBe(0);
  });

  it('should return 0 when responses array is empty', () => {
    expect(calculateSwitchingCost([])).toBe(0);
  });

  it('should calculate positive switching cost when post-switch is slower', () => {
    const responses = [
      createResponse(true, 500, false),
      createResponse(true, 500, false),
      createResponse(true, 800, true),
      createResponse(true, 800, true)
    ];
    
    const cost = calculateSwitchingCost(responses);
    expect(cost).toBe(300); // 800 - 500 = 300
  });

  it('should calculate negative switching cost when post-switch is faster', () => {
    const responses = [
      createResponse(true, 800, false),
      createResponse(true, 800, false),
      createResponse(true, 500, true),
      createResponse(true, 500, true)
    ];
    
    const cost = calculateSwitchingCost(responses);
    expect(cost).toBe(-300); // 500 - 800 = -300
  });

  it('should round to nearest integer', () => {
    const responses = [
      createResponse(true, 500, false),
      createResponse(true, 500, false),
      createResponse(true, 500, false),
      createResponse(true, 650, true),
      createResponse(true, 650, true)
    ];
    
    const cost = calculateSwitchingCost(responses);
    expect(cost).toBe(150); // Should be rounded
    expect(Number.isInteger(cost)).toBe(true);
  });

  // Error handling tests
  it('should handle null/undefined responses array', () => {
    expect(calculateSwitchingCost(null as any)).toBe(0);
    expect(calculateSwitchingCost(undefined as any)).toBe(0);
  });

  it('should handle responses with NaN reaction times', () => {
    const responses = [
      createResponse(true, NaN, false),
      createResponse(true, NaN, true)
    ];
    
    expect(calculateSwitchingCost(responses)).toBe(0);
  });

  it('should handle all post-switch responses', () => {
    const responses = [
      createResponse(true, 500, true),
      createResponse(true, 600, true)
    ];
    
    expect(calculateSwitchingCost(responses)).toBe(0);
  });

  it('should handle all normal responses', () => {
    const responses = [
      createResponse(true, 500, false),
      createResponse(true, 600, false)
    ];
    
    expect(calculateSwitchingCost(responses)).toBe(0);
  });
});

describe('calculateDailyFocusLoss', () => {
  it('should return 0 for zero error rate and zero switching cost', () => {
    expect(calculateDailyFocusLoss(0, 0)).toBe(0);
  });

  it('should return value with exactly 1 decimal place', () => {
    const loss = calculateDailyFocusLoss(0.25, 100);
    const decimalPlaces = loss.toString().split('.')[1]?.length || 0;
    expect(decimalPlaces).toBeLessThanOrEqual(1);
  });

  it('should increase with higher error rate', () => {
    const lowError = calculateDailyFocusLoss(0.1, 100);
    const highError = calculateDailyFocusLoss(0.5, 100);
    
    expect(highError).toBeGreaterThan(lowError);
  });

  it('should increase with higher switching cost', () => {
    const lowSwitch = calculateDailyFocusLoss(0.2, 50);
    const highSwitch = calculateDailyFocusLoss(0.2, 200);
    
    expect(highSwitch).toBeGreaterThan(lowSwitch);
  });

  it('should clamp to maximum of 8 hours', () => {
    const loss = calculateDailyFocusLoss(1.0, 1000);
    expect(loss).toBeLessThanOrEqual(8);
  });

  it('should clamp to minimum of 0 hours', () => {
    const loss = calculateDailyFocusLoss(-1.0, -1000);
    expect(loss).toBeGreaterThanOrEqual(0);
  });

  it('should calculate expected value for typical inputs', () => {
    // 50% error rate, 200ms switching cost
    // errorLoss = 0.5 * 4 = 2
    // switchLoss = (200 / 100) * 2 = 4
    // total = 6.0
    const loss = calculateDailyFocusLoss(0.5, 200);
    expect(loss).toBe(6.0);
  });

  it('should handle edge case of perfect performance', () => {
    const loss = calculateDailyFocusLoss(0, 0);
    expect(loss).toBe(0);
  });

  // Error handling tests
  it('should handle NaN error rate', () => {
    expect(calculateDailyFocusLoss(NaN, 100)).toBe(0);
  });

  it('should handle NaN switching cost', () => {
    expect(calculateDailyFocusLoss(0.5, NaN)).toBe(0);
  });

  it('should handle both NaN inputs', () => {
    expect(calculateDailyFocusLoss(NaN, NaN)).toBe(0);
  });

  it('should clamp negative error rate to 0', () => {
    const loss = calculateDailyFocusLoss(-0.5, 100);
    expect(loss).toBeGreaterThanOrEqual(0);
  });

  it('should clamp error rate above 1', () => {
    const loss = calculateDailyFocusLoss(2.0, 100);
    expect(loss).toBeLessThanOrEqual(8);
  });

  it('should handle negative switching cost', () => {
    const loss = calculateDailyFocusLoss(0.5, -100);
    expect(loss).toBeGreaterThanOrEqual(0);
  });
});

describe('calculatePeerComparison', () => {
  it('should return simulated average between 65 and 75', () => {
    // Run multiple times due to randomness
    for (let i = 0; i < 20; i++) {
      const { simulatedAvgScore } = calculatePeerComparison(70);
      expect(simulatedAvgScore).toBeGreaterThanOrEqual(65);
      expect(simulatedAvgScore).toBeLessThanOrEqual(75);
    }
  });

  it('should return percentile of 50 when score equals average', () => {
    // Set a fixed average by running multiple times and checking
    for (let i = 0; i < 10; i++) {
      const { simulatedAvgScore, percentile } = calculatePeerComparison(70);
      // When user score is close to average, percentile should be close to 50
      if (Math.abs(70 - simulatedAvgScore) < 1) {
        expect(percentile).toBeGreaterThanOrEqual(48);
        expect(percentile).toBeLessThanOrEqual(52);
      }
    }
  });

  it('should return percentile > 50 when score is above average', () => {
    // Run multiple times
    for (let i = 0; i < 10; i++) {
      const { percentile } = calculatePeerComparison(90);
      // 90 is definitely above 65-75 range
      expect(percentile).toBeGreaterThan(50);
    }
  });

  it('should return percentile < 50 when score is below average', () => {
    // Run multiple times
    for (let i = 0; i < 10; i++) {
      const { percentile } = calculatePeerComparison(50);
      // 50 is definitely below 65-75 range
      expect(percentile).toBeLessThan(50);
    }
  });

  it('should return percentile between 0 and 100', () => {
    for (let score = 0; score <= 100; score += 10) {
      const { percentile } = calculatePeerComparison(score);
      expect(percentile).toBeGreaterThanOrEqual(0);
      expect(percentile).toBeLessThanOrEqual(100);
    }
  });

  it('should return integer values for both metrics', () => {
    const { simulatedAvgScore, percentile } = calculatePeerComparison(75);
    expect(Number.isInteger(simulatedAvgScore)).toBe(true);
    expect(Number.isInteger(percentile)).toBe(true);
  });

  it('should handle edge case of score 0', () => {
    const { percentile } = calculatePeerComparison(0);
    expect(percentile).toBe(0);
  });

  it('should handle edge case of score 100', () => {
    const { percentile } = calculatePeerComparison(100);
    expect(percentile).toBe(100);
  });

  // Error handling tests
  it('should handle NaN user score', () => {
    const { simulatedAvgScore, percentile } = calculatePeerComparison(NaN);
    expect(simulatedAvgScore).toBeGreaterThanOrEqual(65);
    expect(simulatedAvgScore).toBeLessThanOrEqual(75);
    expect(percentile).toBe(0);
  });

  it('should clamp negative user score', () => {
    const { percentile } = calculatePeerComparison(-50);
    expect(percentile).toBeGreaterThanOrEqual(0);
    expect(percentile).toBeLessThanOrEqual(100);
  });

  it('should clamp user score above 100', () => {
    const { percentile } = calculatePeerComparison(150);
    expect(percentile).toBeGreaterThanOrEqual(0);
    expect(percentile).toBeLessThanOrEqual(100);
  });
});
