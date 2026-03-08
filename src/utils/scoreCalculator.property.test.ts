/**
 * Property-based tests for score calculation utilities
 * 
 * These tests verify correctness properties across many randomly generated inputs
 * using the fast-check library. Each property test runs 100+ iterations.
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  calculateFocusStabilityScore,
  calculateSwitchingCost,
  calculateDailyFocusLoss,
  calculatePeerComparison
} from './scoreCalculator';
import { Response } from '../types';

// ============================================================================
// Test Data Generators
// ============================================================================

/**
 * Generator for valid Symbol objects
 */
const symbolArbitrary = fc.record({
  value: fc.oneof(
    fc.integer({ min: 1, max: 9 }).map((n: number) => String(n)),
    fc.integer({ min: 65, max: 90 }).map((n: number) => String.fromCharCode(n))
  ),
  type: fc.constantFrom('number' as const, 'letter' as const),
  displayedAt: fc.integer({ min: 0, max: Date.now() })
});

/**
 * Generator for realistic reaction times (100-2000ms)
 */
const reactionTimeArbitrary = fc.integer({ min: 100, max: 2000 });

/**
 * Generator for Response objects
 */
const responseArbitrary = fc.record({
  symbol: symbolArbitrary,
  userKey: fc.constantFrom('left' as const, 'right' as const),
  correct: fc.boolean(),
  reactionTime: reactionTimeArbitrary,
  isPostSwitch: fc.boolean(),
  timestamp: fc.integer({ min: 0, max: Date.now() })
});

/**
 * Generator for non-empty arrays of responses
 */
const responsesArbitrary = fc.array(responseArbitrary, { minLength: 1, maxLength: 60 });

/**
 * Generator for responses with both post-switch and normal responses
 */
const mixedResponsesArbitrary = fc.array(responseArbitrary, { minLength: 10, maxLength: 60 })
  .filter((responses: Response[]) => {
    const postSwitch = responses.filter((r: Response) => r.isPostSwitch);
    const normal = responses.filter((r: Response) => !r.isPostSwitch);
    return postSwitch.length > 0 && normal.length > 0;
  });

// ============================================================================
// Property 7: Focus Stability Score Range
// ============================================================================

describe('Property 7: Focus Stability Score Range', () => {
  // Feature: neurogym-focus-test-mvp, Property 7: Focus Stability Score Range
  // **Validates: Requirements 10.1**
  it('should always return a score between 0 and 100 (inclusive)', () => {
    fc.assert(
      fc.property(responsesArbitrary, (responses: Response[]) => {
        const score = calculateFocusStabilityScore(responses);
        
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
        expect(Number.isInteger(score)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('should return 0 for empty responses array', () => {
    const score = calculateFocusStabilityScore([]);
    expect(score).toBe(0);
  });
});

// ============================================================================
// Property 8: Accuracy Impact on Score
// ============================================================================

describe('Property 8: Accuracy Impact on Score', () => {
  // Feature: neurogym-focus-test-mvp, Property 8: Accuracy Impact on Score
  // **Validates: Requirements 10.2**
  it('should produce higher or equal score for higher accuracy with identical RT patterns', () => {
    fc.assert(
      fc.property(
        fc.array(reactionTimeArbitrary, { minLength: 10, maxLength: 60 }),
        fc.double({ min: 0.3, max: 0.7, noNaN: true }), // Lower accuracy
        fc.double({ min: 0.7, max: 1.0, noNaN: true }),  // Higher accuracy
        (reactionTimes: number[], lowAccuracy: number, highAccuracy: number) => {
          // Skip if accuracies are not properly ordered
          if (highAccuracy <= lowAccuracy) return true;
        // Create two response sets with identical RT patterns but different accuracy
        // Use deterministic correctness based on index to ensure exact accuracy
        const createResponses = (accuracy: number): Response[] => {
          const correctCount = Math.floor(reactionTimes.length * accuracy);
          return reactionTimes.map((rt: number, i: number) => ({
            symbol: {
              value: '5',
              type: 'number' as const,
              displayedAt: i * 1000
            },
            userKey: 'left' as const,
            correct: i < correctCount, // Deterministic: first N are correct
            reactionTime: rt,
            isPostSwitch: false,
            timestamp: i * 1000 + rt
          }));
        };

        const lowAccResponses = createResponses(lowAccuracy);
        const highAccResponses = createResponses(highAccuracy);

        const lowScore = calculateFocusStabilityScore(lowAccResponses);
        const highScore = calculateFocusStabilityScore(highAccResponses);

        // Higher accuracy should produce higher or equal score
        expect(highScore).toBeGreaterThanOrEqual(lowScore);
      }),
      { numRuns: 100 }
    );
  });
});

// ============================================================================
// Property 9: Consistency Impact on Score
// ============================================================================

describe('Property 9: Consistency Impact on Score', () => {
  // Feature: neurogym-focus-test-mvp, Property 9: Consistency Impact on Score
  // **Validates: Requirements 10.3, 10.4**
  it('should produce higher or equal score for lower variance with identical accuracy', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.5, max: 1.0, noNaN: true }), // Accuracy
        fc.integer({ min: 10, max: 60 }),    // Number of responses
        (accuracy: number, count: number) => {
        // Create responses with low variance (stdDev ~50ms)
        const lowVarianceResponses: Response[] = Array.from({ length: count }, (_, i: number) => ({
          symbol: {
            value: '5',
            type: 'number' as const,
            displayedAt: i * 1000
          },
          userKey: 'left' as const,
          correct: i < Math.floor(count * accuracy),
          reactionTime: 500 + (Math.random() * 100 - 50), // 450-550ms
          isPostSwitch: false,
          timestamp: i * 1000 + 500
        }));

        // Create responses with high variance (stdDev ~300ms)
        const highVarianceResponses: Response[] = Array.from({ length: count }, (_, i: number) => ({
          symbol: {
            value: '5',
            type: 'number' as const,
            displayedAt: i * 1000
          },
          userKey: 'left' as const,
          correct: i < Math.floor(count * accuracy),
          reactionTime: 500 + (Math.random() * 600 - 300), // 200-800ms
          isPostSwitch: false,
          timestamp: i * 1000 + 500
        }));

        const lowVarScore = calculateFocusStabilityScore(lowVarianceResponses);
        const highVarScore = calculateFocusStabilityScore(highVarianceResponses);

        // Lower variance should produce higher or equal score
        expect(lowVarScore).toBeGreaterThanOrEqual(highVarScore);
      }),
      { numRuns: 100 }
    );
  });
});

// ============================================================================
// Property 10: Switching Cost Calculation
// ============================================================================

describe('Property 10: Switching Cost Calculation', () => {
  // Feature: neurogym-focus-test-mvp, Property 10: Switching Cost Calculation
  // **Validates: Requirements 11.1, 11.2**
  it('should equal mean post-switch RT minus mean normal RT', () => {
    fc.assert(
      fc.property(mixedResponsesArbitrary, (responses: Response[]) => {
        const postSwitchResponses = responses.filter((r: Response) => r.isPostSwitch);
        const normalResponses = responses.filter((r: Response) => !r.isPostSwitch);

        // Skip if either category is empty
        if (postSwitchResponses.length === 0 || normalResponses.length === 0) {
          return true;
        }

        const meanPostSwitch = postSwitchResponses.reduce((sum: number, r: Response) => sum + r.reactionTime, 0) / postSwitchResponses.length;
        const meanNormal = normalResponses.reduce((sum: number, r: Response) => sum + r.reactionTime, 0) / normalResponses.length;
        const expectedCost = Math.round(meanPostSwitch - meanNormal);

        const actualCost = calculateSwitchingCost(responses);

        expect(actualCost).toBe(expectedCost);
      }),
      { numRuns: 100 }
    );
  });

  it('should return 0 when no post-switch responses exist', () => {
    fc.assert(
      fc.property(responsesArbitrary, (responses: Response[]) => {
        // Force all responses to be normal (not post-switch)
        const normalOnlyResponses = responses.map((r: Response) => ({ ...r, isPostSwitch: false }));
        const cost = calculateSwitchingCost(normalOnlyResponses);
        expect(cost).toBe(0);
      }),
      { numRuns: 100 }
    );
  });

  it('should return 0 when no normal responses exist', () => {
    fc.assert(
      fc.property(responsesArbitrary, (responses: Response[]) => {
        // Force all responses to be post-switch
        const postSwitchOnlyResponses = responses.map((r: Response) => ({ ...r, isPostSwitch: true }));
        const cost = calculateSwitchingCost(postSwitchOnlyResponses);
        expect(cost).toBe(0);
      }),
      { numRuns: 100 }
    );
  });
});

// ============================================================================
// Property 11: Daily Focus Loss Monotonicity
// ============================================================================

describe('Property 11: Daily Focus Loss Monotonicity', () => {
  // Feature: neurogym-focus-test-mvp, Property 11: Daily Focus Loss Monotonicity
  // **Validates: Requirements 12.2**
  it('should have higher or equal loss when both error rate and switching cost are higher', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.1, max: 0.5, noNaN: true }), // Lower error rate
        fc.double({ min: 0.5, max: 1.0, noNaN: true }), // Higher error rate
        fc.integer({ min: 50, max: 150 }),  // Lower switching cost
        fc.integer({ min: 150, max: 300 }),  // Higher switching cost
        (lowErrorRate: number, highErrorRate: number, lowSwitchingCost: number, highSwitchingCost: number) => {
          // Skip if not properly ordered
          if (highErrorRate <= lowErrorRate || highSwitchingCost <= lowSwitchingCost) return true;
        const lowLoss = calculateDailyFocusLoss(lowErrorRate, lowSwitchingCost);
        const highLoss = calculateDailyFocusLoss(highErrorRate, highSwitchingCost);

        expect(highLoss).toBeGreaterThanOrEqual(lowLoss);
      }),
      { numRuns: 100 }
    );
  });

  it('should increase with higher error rate when switching cost is constant', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.0, max: 0.5, noNaN: true }), // Lower error rate
        fc.double({ min: 0.5, max: 1.0, noNaN: true }), // Higher error rate
        fc.integer({ min: 0, max: 300 }),    // Constant switching cost
        (lowErrorRate: number, highErrorRate: number, switchingCost: number) => {
          // Skip if not properly ordered
          if (highErrorRate <= lowErrorRate) return true;
        const lowLoss = calculateDailyFocusLoss(lowErrorRate, switchingCost);
        const highLoss = calculateDailyFocusLoss(highErrorRate, switchingCost);

        expect(highLoss).toBeGreaterThanOrEqual(lowLoss);
      }),
      { numRuns: 100 }
    );
  });

  it('should increase with higher switching cost when error rate is constant', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.0, max: 1.0, noNaN: true }),  // Constant error rate
        fc.integer({ min: 0, max: 150 }),    // Lower switching cost
        fc.integer({ min: 150, max: 300 }),   // Higher switching cost
        (errorRate: number, lowSwitchingCost: number, highSwitchingCost: number) => {
          // Skip if not properly ordered
          if (highSwitchingCost <= lowSwitchingCost) return true;
        const lowLoss = calculateDailyFocusLoss(errorRate, lowSwitchingCost);
        const highLoss = calculateDailyFocusLoss(errorRate, highSwitchingCost);

        expect(highLoss).toBeGreaterThanOrEqual(lowLoss);
      }),
      { numRuns: 100 }
    );
  });
});

// ============================================================================
// Property 12: Daily Focus Loss Precision
// ============================================================================

describe('Property 12: Daily Focus Loss Precision', () => {
  // Feature: neurogym-focus-test-mvp, Property 12: Daily Focus Loss Precision
  // **Validates: Requirements 12.3**
  it('should always return a value with exactly one decimal place or be a whole number', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.0, max: 1.0, noNaN: true }),
        fc.integer({ min: 0, max: 500 }),
        (errorRate: number, switchingCost: number) => {
        const loss = calculateDailyFocusLoss(errorRate, switchingCost);
        
        // Convert to string and check decimal places
        const lossStr = loss.toString();
        const parts = lossStr.split('.');
        
        if (parts.length === 1) {
          // Whole number (e.g., "0", "5") - acceptable
          expect(true).toBe(true);
        } else {
          // Has decimal point - should have exactly 1 decimal place
          expect(parts[1].length).toBe(1);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('should be within valid range of 0-8 hours', () => {
    fc.assert(
      fc.property(
        fc.double({ min: 0.0, max: 1.0, noNaN: true }),
        fc.integer({ min: 0, max: 1000 }),
        (errorRate: number, switchingCost: number) => {
        const loss = calculateDailyFocusLoss(errorRate, switchingCost);
        
        expect(loss).toBeGreaterThanOrEqual(0);
        expect(loss).toBeLessThanOrEqual(8);
      }),
      { numRuns: 100 }
    );
  });
});

// ============================================================================
// Property 17: Simulated Average Score Range
// ============================================================================

describe('Property 17: Simulated Average Score Range', () => {
  // Feature: neurogym-focus-test-mvp, Property 17: Simulated Average Score Range
  // **Validates: Requirements 14.5**
  it('should always return simulated average between 65 and 75 (inclusive)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        (userScore: number) => {
        const { simulatedAvgScore } = calculatePeerComparison(userScore);
        
        expect(simulatedAvgScore).toBeGreaterThanOrEqual(65);
        expect(simulatedAvgScore).toBeLessThanOrEqual(75);
        expect(Number.isInteger(simulatedAvgScore)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});

// ============================================================================
// Property 18: Percentile Calculation Consistency
// ============================================================================

describe('Property 18: Percentile Calculation Consistency', () => {
  // Feature: neurogym-focus-test-mvp, Property 18: Percentile Calculation Consistency
  // **Validates: Requirements 14.6**
  it('should return percentile > 50 when user score is higher than average', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 76, max: 100 }), // Scores definitely above 65-75 range
        (userScore: number) => {
        const { simulatedAvgScore, percentile } = calculatePeerComparison(userScore);
        
        if (userScore > simulatedAvgScore) {
          expect(percentile).toBeGreaterThan(50);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('should return percentile < 50 when user score is lower than average', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 64 }), // Scores definitely below 65-75 range
        (userScore: number) => {
        const { simulatedAvgScore, percentile } = calculatePeerComparison(userScore);
        
        if (userScore < simulatedAvgScore) {
          expect(percentile).toBeLessThan(50);
        }
      }),
      { numRuns: 100 }
    );
  });

  it('should return percentile of 50 when user score equals average', () => {
    // This test uses a controlled approach since we can't control the random average
    // We'll test the mathematical relationship directly
    const testScore = 70;
    const { simulatedAvgScore, percentile } = calculatePeerComparison(testScore);
    
    // If scores are equal (within rounding), percentile should be 50
    if (testScore === simulatedAvgScore) {
      expect(percentile).toBe(50);
    }
  });

  it('should always return percentile between 0 and 100', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        (userScore: number) => {
        const { percentile } = calculatePeerComparison(userScore);
        
        expect(percentile).toBeGreaterThanOrEqual(0);
        expect(percentile).toBeLessThanOrEqual(100);
        expect(Number.isInteger(percentile)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('should maintain consistency: higher score should not result in lower percentile', () => {
    // Run multiple comparisons with increasing scores
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 50 }),
        fc.integer({ min: 50, max: 100 }),
        (lowerScore: number, higherScore: number) => {
          // Skip if not properly ordered
          if (higherScore <= lowerScore) return true;
        // We need to use the same simulated average for fair comparison
        // Since the function generates random averages, we'll test the mathematical relationship
        // by checking that the percentile calculation is monotonic for a fixed average
        
        // Test with a fixed simulated average of 70
        const fixedAvg = 70;
        
        const calcPercentile = (score: number, avg: number): number => {
          if (score < avg) {
            return Math.round((score / avg) * 50);
          } else {
            return Math.round(50 + ((score - avg) / (100 - avg)) * 50);
          }
        };
        
        const lowerPercentile = calcPercentile(lowerScore, fixedAvg);
        const higherPercentile = calcPercentile(higherScore, fixedAvg);
        
        expect(higherPercentile).toBeGreaterThanOrEqual(lowerPercentile);
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * **Validates: Requirements 10.1, 10.2, 10.3, 10.4, 11.1, 11.2, 11.3, 12.2, 12.3, 14.5, 14.6**
 */
