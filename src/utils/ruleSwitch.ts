/**
 * Rule switching utilities for NeuroGym Focus Test MVP
 * 
 * Handles the inversion of classification rules during the game.
 */

import { ClassificationRule } from '../types';

/**
 * Inverts a classification rule by swapping the key assignments for numbers and letters.
 * 
 * When a rule switch occurs during the game, this function swaps which key (left/right)
 * should be pressed for numbers vs letters.
 * 
 * @param rule - The current classification rule
 * @returns A new classification rule with inverted key assignments
 * 
 * @example
 * const rule = { numbersKey: 'left', lettersKey: 'right' };
 * const inverted = invertRule(rule);
 * // Result: { numbersKey: 'right', lettersKey: 'left' }
 * 
 * @example
 * // Applying twice returns to original
 * const original = { numbersKey: 'left', lettersKey: 'right' };
 * const inverted = invertRule(original);
 * const restored = invertRule(inverted);
 * // restored equals original
 */
export function invertRule(rule: ClassificationRule): ClassificationRule {
  return {
    numbersKey: rule.numbersKey === 'left' ? 'right' : 'left',
    lettersKey: rule.lettersKey === 'left' ? 'right' : 'left'
  };
}
