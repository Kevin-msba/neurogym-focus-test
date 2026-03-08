import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import type { Symbol, ClassificationRule, Response, GameState, GameResults, Screen } from './index';

describe('Type Definitions', () => {
  it('Symbol type should be properly defined', () => {
    const symbol: Symbol = {
      value: 'A',
      type: 'letter',
      displayedAt: 1000,
    };
    
    expect(symbol.value).toBe('A');
    expect(symbol.type).toBe('letter');
    expect(symbol.displayedAt).toBe(1000);
  });

  it('ClassificationRule type should be properly defined', () => {
    const rule: ClassificationRule = {
      numbersKey: 'left',
      lettersKey: 'right',
    };
    
    expect(rule.numbersKey).toBe('left');
    expect(rule.lettersKey).toBe('right');
  });

  it('Response type should be properly defined', () => {
    const response: Response = {
      symbol: {
        value: '5',
        type: 'number',
        displayedAt: 1000,
      },
      userKey: 'left',
      correct: true,
      reactionTime: 500,
      isPostSwitch: false,
      timestamp: 1500,
    };
    
    expect(response.correct).toBe(true);
    expect(response.reactionTime).toBe(500);
  });

  it('GameState type should be properly defined', () => {
    const gameState: GameState = {
      isActive: true,
      startTime: 0,
      currentTime: 1000,
      timeRemaining: 59000,
      currentSymbol: null,
      currentRule: {
        numbersKey: 'left',
        lettersKey: 'right',
      },
      responses: [],
      lastSwitchTime: 0,
      nextSwitchTime: 5000,
      symbolCount: 0,
    };
    
    expect(gameState.isActive).toBe(true);
    expect(gameState.timeRemaining).toBe(59000);
  });

  it('GameResults type should be properly defined', () => {
    const results: GameResults = {
      focusStabilityScore: 85,
      switchingCost: 150,
      dailyFocusLoss: 1.5,
      totalResponses: 60,
      correctResponses: 55,
      incorrectResponses: 5,
      missedResponses: 0,
      accuracy: 91.67,
      meanReactionTime: 450,
      medianReactionTime: 440,
      reactionTimeStdDev: 80,
      meanNormalRT: 430,
      meanPostSwitchRT: 580,
      simulatedAvgScore: 70,
      percentile: 75,
    };
    
    expect(results.focusStabilityScore).toBe(85);
    expect(results.accuracy).toBeCloseTo(91.67, 2);
  });

  it('Screen type should accept valid screen names', () => {
    const screens: Screen[] = ['landing', 'instructions', 'game', 'report'];
    
    expect(screens).toHaveLength(4);
    expect(screens).toContain('landing');
    expect(screens).toContain('game');
  });
});

// Property-Based Tests
describe('Property-Based Tests', () => {
  // Feature: neurogym-focus-test-mvp, Property 1: Symbol Generation Validity
  // **Validates: Requirements 5.2**
  it('Property 1: Symbol Generation Validity - generated symbols must have valid values and matching types', () => {
    fc.assert(
      fc.property(
        // Generator for Symbol objects
        fc.oneof(
          // Generate number symbols (1-9)
          fc.record({
            value: fc.integer({ min: 1, max: 9 }).map(n => String(n)),
            type: fc.constant('number' as const),
            displayedAt: fc.nat(),
          }),
          // Generate letter symbols (A-Z)
          fc.record({
            value: fc.integer({ min: 65, max: 90 }).map(code => String.fromCharCode(code)),
            type: fc.constant('letter' as const),
            displayedAt: fc.nat(),
          })
        ),
        (symbol: Symbol) => {
          // Property: Symbol value must be either a digit (1-9) or a letter (A-Z)
          const isValidNumber = /^[1-9]$/.test(symbol.value);
          const isValidLetter = /^[A-Z]$/.test(symbol.value);
          const hasValidValue = isValidNumber || isValidLetter;
          
          // Property: Symbol type must correctly match its value
          const typeMatchesValue = 
            (isValidNumber && symbol.type === 'number') ||
            (isValidLetter && symbol.type === 'letter');
          
          // Both properties must hold
          return hasValidValue && typeMatchesValue;
        }
      ),
      { numRuns: 100 }
    );
  });
});
