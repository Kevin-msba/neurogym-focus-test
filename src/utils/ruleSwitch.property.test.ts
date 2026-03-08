/**
 * Property-based tests for rule switching utilities
 * 
 * These tests verify correctness properties across many randomly generated inputs
 * using the fast-check library. Each property test runs 100+ iterations.
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { invertRule } from './ruleSwitch';
import { ClassificationRule } from '../types';

// ============================================================================
// Test Data Generators
// ============================================================================

/**
 * Generator for valid ClassificationRule objects
 * Generates all possible rule combinations
 */
const classificationRuleArbitrary = fc.record({
  numbersKey: fc.constantFrom('left' as const, 'right' as const),
  lettersKey: fc.constantFrom('left' as const, 'right' as const)
});

// ============================================================================
// Property 3: Rule Switch Inversion
// ============================================================================

describe('Property 3: Rule Switch Inversion', () => {
  // Feature: neurogym-focus-test-mvp, Property 3: Rule Switch Inversion
  // **Validates: Requirements 7.2**
  
  it('should return to original rule when inverted twice', () => {
    fc.assert(
      fc.property(classificationRuleArbitrary, (originalRule: ClassificationRule) => {
        const inverted = invertRule(originalRule);
        const restored = invertRule(inverted);
        
        // Applying invertRule twice should return to the original rule
        expect(restored).toEqual(originalRule);
        expect(restored.numbersKey).toBe(originalRule.numbersKey);
        expect(restored.lettersKey).toBe(originalRule.lettersKey);
      }),
      { numRuns: 100 }
    );
  });

  it('should swap key assignments when inverted once', () => {
    fc.assert(
      fc.property(classificationRuleArbitrary, (originalRule: ClassificationRule) => {
        const inverted = invertRule(originalRule);
        
        // The inverted rule should have swapped key assignments
        expect(inverted.numbersKey).toBe(originalRule.numbersKey === 'left' ? 'right' : 'left');
        expect(inverted.lettersKey).toBe(originalRule.lettersKey === 'left' ? 'right' : 'left');
      }),
      { numRuns: 100 }
    );
  });

  it('should work for all possible rule combinations', () => {
    // Test all 4 possible combinations explicitly
    const allCombinations: ClassificationRule[] = [
      { numbersKey: 'left', lettersKey: 'left' },
      { numbersKey: 'left', lettersKey: 'right' },
      { numbersKey: 'right', lettersKey: 'left' },
      { numbersKey: 'right', lettersKey: 'right' }
    ];

    allCombinations.forEach((rule: ClassificationRule) => {
      const inverted = invertRule(rule);
      
      // Check that keys are swapped
      expect(inverted.numbersKey).toBe(rule.numbersKey === 'left' ? 'right' : 'left');
      expect(inverted.lettersKey).toBe(rule.lettersKey === 'left' ? 'right' : 'left');
      
      // Check that double inversion returns to original
      const restored = invertRule(inverted);
      expect(restored).toEqual(rule);
    });
  });

  it('should not mutate the original rule object', () => {
    fc.assert(
      fc.property(classificationRuleArbitrary, (originalRule: ClassificationRule) => {
        const originalCopy = { ...originalRule };
        
        // Invert the rule
        invertRule(originalRule);
        
        // Original should remain unchanged
        expect(originalRule).toEqual(originalCopy);
        expect(originalRule.numbersKey).toBe(originalCopy.numbersKey);
        expect(originalRule.lettersKey).toBe(originalCopy.lettersKey);
      }),
      { numRuns: 100 }
    );
  });

  it('should always return a valid ClassificationRule', () => {
    fc.assert(
      fc.property(classificationRuleArbitrary, (rule: ClassificationRule) => {
        const inverted = invertRule(rule);
        
        // Check that the result is a valid ClassificationRule
        expect(inverted).toHaveProperty('numbersKey');
        expect(inverted).toHaveProperty('lettersKey');
        expect(['left', 'right']).toContain(inverted.numbersKey);
        expect(['left', 'right']).toContain(inverted.lettersKey);
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * **Validates: Requirements 7.2**
 */
