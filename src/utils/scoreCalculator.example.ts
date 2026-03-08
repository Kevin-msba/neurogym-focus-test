/**
 * Example usage of score calculation utilities
 * 
 * This file demonstrates how to use the score calculation functions
 * with sample game data.
 */

import { Response, Symbol } from '../types';
import {
  calculateFocusStabilityScore,
  calculateSwitchingCost,
  calculateDailyFocusLoss,
  calculatePeerComparison
} from './scoreCalculator';
import {
  formatFocusScore,
  formatSwitchingCost,
  formatDailyFocusLoss
} from './formatters';

// Example: Create sample game responses
function createSampleResponses(): Response[] {
  const responses: Response[] = [];
  
  // Simulate 60 responses (one per second for 60 seconds)
  for (let i = 0; i < 60; i++) {
    const symbol: Symbol = {
      value: i % 2 === 0 ? String(Math.floor(Math.random() * 9) + 1) : String.fromCharCode(65 + Math.floor(Math.random() * 26)),
      type: i % 2 === 0 ? 'number' : 'letter',
      displayedAt: i * 1000
    };
    
    // Simulate varying reaction times and accuracy
    const baseRT = 400 + Math.random() * 300; // 400-700ms
    const isPostSwitch = i % 10 < 2; // First 2 responses after every 10 are "post-switch"
    const reactionTime = isPostSwitch ? baseRT + 100 : baseRT; // Slower after switches
    
    // 85% accuracy
    const correct = Math.random() < 0.85;
    
    responses.push({
      symbol,
      userKey: correct ? 'left' : 'right',
      correct,
      reactionTime,
      isPostSwitch,
      timestamp: i * 1000 + reactionTime
    });
  }
  
  return responses;
}

// Example: Calculate all scores from game responses
export function calculateGameResults(responses: Response[]) {
  // Calculate core metrics
  const focusStabilityScore = calculateFocusStabilityScore(responses);
  const switchingCost = calculateSwitchingCost(responses);
  
  // Calculate error rate for daily focus loss
  const correctCount = responses.filter(r => r.correct).length;
  const errorRate = 1 - (correctCount / responses.length);
  const dailyFocusLoss = calculateDailyFocusLoss(errorRate, switchingCost);
  
  // Calculate peer comparison
  const { simulatedAvgScore, percentile } = calculatePeerComparison(focusStabilityScore);
  
  // Format for display
  const formattedScore = formatFocusScore(focusStabilityScore);
  const formattedCost = formatSwitchingCost(switchingCost);
  const formattedLoss = formatDailyFocusLoss(dailyFocusLoss);
  
  return {
    raw: {
      focusStabilityScore,
      switchingCost,
      dailyFocusLoss,
      simulatedAvgScore,
      percentile
    },
    formatted: {
      focusStabilityScore: formattedScore,
      switchingCost: formattedCost,
      dailyFocusLoss: formattedLoss
    }
  };
}

// Example usage (only in development)
// @ts-expect-error - import.meta.env is available in Vite
if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
  const sampleResponses = createSampleResponses();
  const results = calculateGameResults(sampleResponses);
  
  console.log('Sample Game Results:');
  console.log('-------------------');
  console.log('Focus Stability Score:', results.formatted.focusStabilityScore);
  console.log('Switching Cost:', results.formatted.switchingCost);
  console.log('Daily Focus Loss:', results.formatted.dailyFocusLoss);
  console.log('Percentile:', results.raw.percentile + 'th');
  console.log('vs Average:', results.raw.simulatedAvgScore);
}
