/**
 * Symbol generation utility for NeuroGym Focus Test MVP
 * Generates random numbers (1-9) or letters (A-Z) with timestamp tracking
 */

import type { Symbol } from '../types';

/**
 * Generates a random symbol (number 1-9 or letter A-Z)
 * @returns Symbol object with value, type, and display timestamp
 */
export function generateSymbol(): Symbol {
  const isNumber = Math.random() < 0.5;
  
  if (isNumber) {
    // Generate random number from 1-9
    const value = String(Math.floor(Math.random() * 9) + 1);
    return {
      value,
      type: 'number',
      displayedAt: performance.now()
    };
  } else {
    // Generate random letter from A-Z
    const charCode = Math.floor(Math.random() * 26) + 65; // 65 = 'A'
    const value = String.fromCharCode(charCode);
    return {
      value,
      type: 'letter',
      displayedAt: performance.now()
    };
  }
}
