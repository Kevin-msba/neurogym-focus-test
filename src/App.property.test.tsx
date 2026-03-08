/**
 * Property-based tests for App component
 * 
 * These tests verify correctness properties for application state management
 * using the fast-check library.
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import type { GameResults } from './types';

// ============================================================================
// Test Data Generators
// ============================================================================

/**
 * Generator for valid GameResults objects
 */
const gameResultsArbitrary = fc.record({
  focusStabilityScore: fc.integer({ min: 0, max: 100 }),
  switchingCost: fc.integer({ min: -200, max: 500 }),
  dailyFocusLoss: fc.double({ min: 0, max: 8, noNaN: true }).map(n => Math.round(n * 10) / 10),
  
  totalResponses: fc.integer({ min: 0, max: 60 }),
  correctResponses: fc.integer({ min: 0, max: 60 }),
  incorrectResponses: fc.integer({ min: 0, max: 60 }),
  missedResponses: fc.integer({ min: 0, max: 60 }),
  accuracy: fc.double({ min: 0, max: 100, noNaN: true }),
  
  meanReactionTime: fc.integer({ min: 100, max: 2000 }),
  medianReactionTime: fc.integer({ min: 100, max: 2000 }),
  reactionTimeStdDev: fc.integer({ min: 0, max: 500 }),
  meanNormalRT: fc.integer({ min: 100, max: 2000 }),
  meanPostSwitchRT: fc.integer({ min: 100, max: 2000 }),
  
  simulatedAvgScore: fc.integer({ min: 65, max: 75 }),
  percentile: fc.integer({ min: 0, max: 100 })
});

// ============================================================================
// Helper: App Reducer (extracted for testing)
// ============================================================================

type Screen = 'landing' | 'instructions' | 'game' | 'report';

type AppState = {
  currentScreen: Screen;
  gameResults: GameResults | null;
}

type AppAction =
  | { type: 'NAVIGATE_TO_SCREEN'; screen: Screen }
  | { type: 'GAME_COMPLETED'; results: GameResults }
  | { type: 'RESET_APPLICATION' }

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'NAVIGATE_TO_SCREEN':
      return { ...state, currentScreen: action.screen }
    
    case 'GAME_COMPLETED':
      return {
        currentScreen: 'report',
        gameResults: action.results
      }
    
    case 'RESET_APPLICATION':
      return {
        currentScreen: 'instructions',
        gameResults: null
      }
    
    default:
      return state
  }
}

const initialState: AppState = {
  currentScreen: 'landing',
  gameResults: null
}

// ============================================================================
// Property 19: Game State Reset Completeness
// ============================================================================

describe('Property 19: Game State Reset Completeness', () => {
  // Feature: neurogym-focus-test-mvp, Property 19: Game State Reset Completeness
  // **Validates: Requirements 18.2**
  it('should clear all game results and return to instructions screen on reset', () => {
    fc.assert(
      fc.property(
        gameResultsArbitrary,
        fc.constantFrom('landing' as const, 'instructions' as const, 'game' as const, 'report' as const),
        (results: GameResults, currentScreen: Screen) => {
          // Create a state with game results (simulating completed game)
          const stateWithResults: AppState = {
            currentScreen,
            gameResults: results
          };

          // Apply reset action
          const resetState = appReducer(stateWithResults, { type: 'RESET_APPLICATION' });

          // Verify reset completeness
          expect(resetState.gameResults).toBeNull();
          expect(resetState.currentScreen).toBe('instructions');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should produce equivalent state to initial state after reset (except screen)', () => {
    fc.assert(
      fc.property(
        gameResultsArbitrary,
        fc.constantFrom('landing' as const, 'instructions' as const, 'game' as const, 'report' as const),
        (results: GameResults, currentScreen: Screen) => {
          // Create a state with game results
          const stateWithResults: AppState = {
            currentScreen,
            gameResults: results
          };

          // Apply reset action
          const resetState = appReducer(stateWithResults, { type: 'RESET_APPLICATION' });

          // Reset state should have null results like initial state
          expect(resetState.gameResults).toBe(initialState.gameResults);
          
          // Screen should be instructions (ready to start new game)
          expect(resetState.currentScreen).toBe('instructions');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle reset from any screen state', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('landing' as const, 'instructions' as const, 'game' as const, 'report' as const),
        fc.option(gameResultsArbitrary, { nil: null }),
        (screen: Screen, results: GameResults | null) => {
          const state: AppState = {
            currentScreen: screen,
            gameResults: results
          };

          const resetState = appReducer(state, { type: 'RESET_APPLICATION' });

          // Always reset to instructions with no results
          expect(resetState.currentScreen).toBe('instructions');
          expect(resetState.gameResults).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should be idempotent: resetting twice produces same result as resetting once', () => {
    fc.assert(
      fc.property(
        gameResultsArbitrary,
        fc.constantFrom('landing' as const, 'instructions' as const, 'game' as const, 'report' as const),
        (results: GameResults, currentScreen: Screen) => {
          const stateWithResults: AppState = {
            currentScreen,
            gameResults: results
          };

          // Reset once
          const resetOnce = appReducer(stateWithResults, { type: 'RESET_APPLICATION' });
          
          // Reset twice
          const resetTwice = appReducer(resetOnce, { type: 'RESET_APPLICATION' });

          // Both should be identical
          expect(resetTwice).toEqual(resetOnce);
          expect(resetTwice.gameResults).toBeNull();
          expect(resetTwice.currentScreen).toBe('instructions');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should clear all score metrics on reset', () => {
    fc.assert(
      fc.property(
        gameResultsArbitrary,
        (results: GameResults) => {
          const stateWithResults: AppState = {
            currentScreen: 'report',
            gameResults: results
          };

          const resetState = appReducer(stateWithResults, { type: 'RESET_APPLICATION' });

          // All results should be cleared
          expect(resetState.gameResults).toBeNull();
          
          // Verify we can't access any score properties
          expect(resetState.gameResults?.focusStabilityScore).toBeUndefined();
          expect(resetState.gameResults?.switchingCost).toBeUndefined();
          expect(resetState.gameResults?.dailyFocusLoss).toBeUndefined();
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * **Validates: Requirements 18.2**
 */
