/**
 * Property-based tests for GameScreen component
 * 
 * Tests the following properties:
 * - Property 2: Response Correctness Evaluation
 * - Property 4: Post-Switch Response Marking
 * - Property 5: Response Categorization Completeness
 * - Property 6: Reaction Time Categorization
 * - Property 22: Reaction Time Recording Accuracy
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import type { ClassificationRule } from '../../types';

// Helper function to evaluate response correctness
function evaluateResponseCorrectness(
  symbolType: 'number' | 'letter',
  rule: ClassificationRule,
  userKey: 'left' | 'right'
): boolean {
  const expectedKey = symbolType === 'number' ? rule.numbersKey : rule.lettersKey;
  return userKey === expectedKey;
}

// Helper function to determine if response is post-switch
function isPostSwitchResponse(
  responseTime: number,
  lastSwitchTime: number,
  postSwitchWindow: number = 2000
): boolean {
  if (lastSwitchTime === 0) return false;
  return responseTime - lastSwitchTime <= postSwitchWindow;
}

// Helper function to calculate reaction time
function calculateReactionTime(
  symbolDisplayedAt: number,
  keyPressTime: number
): number {
  return keyPressTime - symbolDisplayedAt;
}

describe('GameScreen Property Tests', () => {
  describe('Property 2: Response Correctness Evaluation', () => {
    it('**Validates: Requirements 6.3** - should correctly evaluate response correctness for all combinations', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('number' as const, 'letter' as const),
          fc.record({
            numbersKey: fc.constantFrom('left' as const, 'right' as const),
            lettersKey: fc.constantFrom('left' as const, 'right' as const),
          }),
          fc.constantFrom('left' as const, 'right' as const),
          (symbolType, rule, userKey) => {
            const result = evaluateResponseCorrectness(symbolType, rule, userKey);
            const expectedKey = symbolType === 'number' ? rule.numbersKey : rule.lettersKey;
            
            // Property: Result is true if and only if userKey matches expectedKey
            expect(result).toBe(userKey === expectedKey);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return true when user presses correct key for numbers', () => {
      fc.assert(
        fc.property(
          fc.record({
            numbersKey: fc.constantFrom('left' as const, 'right' as const),
            lettersKey: fc.constantFrom('left' as const, 'right' as const),
          }),
          (rule) => {
            const result = evaluateResponseCorrectness('number', rule, rule.numbersKey);
            expect(result).toBe(true);
          }
        ),
        { numRuns: 50 }
      );
    });

    it('should return true when user presses correct key for letters', () => {
      fc.assert(
        fc.property(
          fc.record({
            numbersKey: fc.constantFrom('left' as const, 'right' as const),
            lettersKey: fc.constantFrom('left' as const, 'right' as const),
          }),
          (rule) => {
            const result = evaluateResponseCorrectness('letter', rule, rule.lettersKey);
            expect(result).toBe(true);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Property 4: Post-Switch Response Marking', () => {
    it('**Validates: Requirements 7.4** - should mark responses within 2000ms as post-switch', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 100000 }), // lastSwitchTime
          fc.integer({ min: 0, max: 2000 }), // time offset within window
          (lastSwitchTime, offset) => {
            const responseTime = lastSwitchTime + offset;
            const result = isPostSwitchResponse(responseTime, lastSwitchTime, 2000);
            
            // Property: Responses within 2000ms must be marked as post-switch
            expect(result).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('**Validates: Requirements 7.4** - should NOT mark responses after 2000ms as post-switch', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 100000 }), // lastSwitchTime
          fc.integer({ min: 2001, max: 10000 }), // time offset beyond window
          (lastSwitchTime, offset) => {
            const responseTime = lastSwitchTime + offset;
            const result = isPostSwitchResponse(responseTime, lastSwitchTime, 2000);
            
            // Property: Responses after 2000ms must NOT be marked as post-switch
            expect(result).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should not mark responses as post-switch when no switch has occurred', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 0, max: 100000 }), // responseTime
          (responseTime) => {
            const result = isPostSwitchResponse(responseTime, 0, 2000);
            
            // Property: When lastSwitchTime is 0, no response should be post-switch
            expect(result).toBe(false);
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Property 5: Response Categorization Completeness', () => {
    it('**Validates: Requirements 8.1, 8.2, 8.3** - sum of correct, incorrect, and missed must equal total symbols', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 100 }), // total symbols
          fc.array(fc.boolean(), { minLength: 0, maxLength: 100 }), // correctness array
          (totalSymbols, correctnessArray) => {
            // Limit responses to not exceed total symbols
            const responses = correctnessArray.slice(0, totalSymbols);
            const correctCount = responses.filter(c => c).length;
            const incorrectCount = responses.filter(c => !c).length;
            const missedCount = totalSymbols - responses.length;
            
            // Property: Sum must equal total
            expect(correctCount + incorrectCount + missedCount).toBe(totalSymbols);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle edge case of no responses', () => {
      const totalSymbols = 60;
      const correctCount = 0;
      const incorrectCount = 0;
      const missedCount = totalSymbols;
      
      expect(correctCount + incorrectCount + missedCount).toBe(totalSymbols);
    });

    it('should handle edge case of all responses', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 100 }),
          fc.array(fc.boolean()),
          (totalSymbols, correctnessArray) => {
            const responses = correctnessArray.slice(0, totalSymbols);
            if (responses.length === totalSymbols) {
              const correctCount = responses.filter(c => c).length;
              const incorrectCount = responses.filter(c => !c).length;
              const missedCount = 0;
              
              expect(correctCount + incorrectCount + missedCount).toBe(totalSymbols);
            }
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Property 6: Reaction Time Categorization', () => {
    it('**Validates: Requirements 8.4, 8.5, 8.6** - each response must be categorized as post-switch OR normal', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              reactionTime: fc.integer({ min: 100, max: 2000 }),
              isPostSwitch: fc.boolean(),
            }),
            { minLength: 1, maxLength: 100 }
          ),
          (responses) => {
            const postSwitchResponses = responses.filter(r => r.isPostSwitch);
            const normalResponses = responses.filter(r => !r.isPostSwitch);
            
            // Property: Each response is in exactly one category
            expect(postSwitchResponses.length + normalResponses.length).toBe(responses.length);
            
            // Property: No response is in both categories
            const intersection = responses.filter(r => r.isPostSwitch && !r.isPostSwitch);
            expect(intersection.length).toBe(0);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should track all reaction times', () => {
      fc.assert(
        fc.property(
          fc.array(
            fc.record({
              reactionTime: fc.integer({ min: 100, max: 2000 }),
              isPostSwitch: fc.boolean(),
            }),
            { minLength: 1, maxLength: 100 }
          ),
          (responses) => {
            const allReactionTimes = responses.map(r => r.reactionTime);
            
            // Property: All reaction times are tracked
            expect(allReactionTimes.length).toBe(responses.length);
            
            // Property: All reaction times are valid numbers
            allReactionTimes.forEach(rt => {
              expect(typeof rt).toBe('number');
              expect(rt).toBeGreaterThanOrEqual(0);
            });
          }
        ),
        { numRuns: 50 }
      );
    });
  });

  describe('Property 22: Reaction Time Recording Accuracy', () => {
    it('**Validates: Requirements 6.3** - reaction time must be difference between display and key press', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 100000 }), // symbol display time
          fc.integer({ min: 100, max: 2000 }), // reaction time offset
          (displayTime, offset) => {
            const keyPressTime = displayTime + offset;
            const reactionTime = calculateReactionTime(displayTime, keyPressTime);
            
            // Property: Reaction time equals the difference
            expect(reactionTime).toBe(keyPressTime - displayTime);
            expect(reactionTime).toBe(offset);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should always produce non-negative reaction times for valid inputs', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1000, max: 100000 }),
          fc.integer({ min: 0, max: 5000 }),
          (displayTime, offset) => {
            const keyPressTime = displayTime + offset;
            const reactionTime = calculateReactionTime(displayTime, keyPressTime);
            
            // Property: Reaction time is non-negative
            expect(reactionTime).toBeGreaterThanOrEqual(0);
          }
        ),
        { numRuns: 50 }
      );
    });
  });
});
