/**
 * Unit tests for rule switching utilities
 */

import { describe, it, expect } from 'vitest';
import { invertRule } from './ruleSwitch';
import { ClassificationRule } from '../types';

describe('invertRule', () => {
  it('should invert a rule with numbers left and letters right', () => {
    const rule: ClassificationRule = {
      numbersKey: 'left',
      lettersKey: 'right'
    };
    
    const inverted = invertRule(rule);
    
    expect(inverted.numbersKey).toBe('right');
    expect(inverted.lettersKey).toBe('left');
  });

  it('should invert a rule with numbers right and letters left', () => {
    const rule: ClassificationRule = {
      numbersKey: 'right',
      lettersKey: 'left'
    };
    
    const inverted = invertRule(rule);
    
    expect(inverted.numbersKey).toBe('left');
    expect(inverted.lettersKey).toBe('right');
  });

  it('should return to original rule when inverted twice', () => {
    const original: ClassificationRule = {
      numbersKey: 'left',
      lettersKey: 'right'
    };
    
    const inverted = invertRule(original);
    const restored = invertRule(inverted);
    
    expect(restored).toEqual(original);
  });

  it('should not mutate the original rule object', () => {
    const original: ClassificationRule = {
      numbersKey: 'left',
      lettersKey: 'right'
    };
    
    const originalCopy = { ...original };
    invertRule(original);
    
    expect(original).toEqual(originalCopy);
  });
});
