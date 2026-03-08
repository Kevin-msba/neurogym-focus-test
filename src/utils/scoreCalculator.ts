/**
 * Score calculation utilities for NeuroGym Focus Test MVP
 * 
 * This module implements the core scoring algorithms:
 * - Focus Stability Score: Combines accuracy (70%) and reaction time consistency (30%)
 * - Switching Cost: Difference between post-switch and normal reaction times
 * - Daily Focus Loss: Heuristic estimation based on error rate and switching cost
 * - Peer Comparison: Simulated average score and percentile ranking
 */

import { Response } from '../types';

/**
 * Calculate Focus Stability Score (0-100)
 * 
 * The score combines:
 * - Accuracy component (70% weight): Percentage of correct responses
 * - Consistency component (30% weight): Inverse of reaction time standard deviation
 * 
 * Lower variance in reaction times indicates better focus stability.
 * 
 * @param responses - Array of user responses during the game
 * @returns Focus Stability Score between 0 and 100
 * 
 * **Validates: Requirements 10.1, 10.2, 10.3, 10.4**
 */
export function calculateFocusStabilityScore(responses: Response[]): number {
  // Handle empty responses
  if (!responses || responses.length === 0) return 0;
  
  // Calculate accuracy component (70% weight)
  const correctCount = responses.filter(r => r.correct).length;
  const accuracy = correctCount / responses.length;
  
  // If accuracy is zero, return 0 immediately
  if (accuracy === 0) return 0;
  
  const accuracyScore = accuracy * 70;
  
  // Calculate consistency component (30% weight)
  const reactionTimes = responses.map(r => r.reactionTime);
  
  // Handle edge case: if any reaction time is NaN or invalid, return 0
  if (reactionTimes.some(rt => isNaN(rt) || rt < 0)) {
    return 0;
  }
  
  const sum = reactionTimes.reduce((a, b) => a + b, 0);
  const mean = sum / reactionTimes.length;
  
  // Handle NaN mean
  if (isNaN(mean)) {
    return 0;
  }
  
  const variance = reactionTimes.reduce((sum, rt) => {
    return sum + Math.pow(rt - mean, 2);
  }, 0) / reactionTimes.length;
  const stdDev = Math.sqrt(variance);
  
  // Handle NaN stdDev
  if (isNaN(stdDev)) {
    return Math.max(0, Math.min(100, Math.round(accuracyScore)));
  }
  
  // Normalize standard deviation (lower is better)
  // Assume 0ms stdDev = perfect (30 points), 500ms+ stdDev = poor (0 points)
  const consistencyScore = Math.max(0, 30 * (1 - stdDev / 500));
  
  // Combine scores
  const totalScore = accuracyScore + consistencyScore;
  
  // Clamp to 0-100 range
  return Math.max(0, Math.min(100, Math.round(totalScore)));
}

/**
 * Calculate Switching Cost in milliseconds
 * 
 * Switching cost is the difference between average reaction time during
 * post-switch periods (within 2s after rule change) and normal periods.
 * 
 * A positive value indicates slower responses after rule switches.
 * A negative value (rare) indicates faster responses after switches.
 * 
 * @param responses - Array of user responses during the game
 * @returns Switching cost in milliseconds (can be negative)
 * 
 * **Validates: Requirements 11.1, 11.2, 11.3**
 */
export function calculateSwitchingCost(responses: Response[]): number {
  // Handle empty or invalid responses
  if (!responses || responses.length === 0) return 0;
  
  const postSwitchResponses = responses.filter(r => r.isPostSwitch);
  const normalResponses = responses.filter(r => !r.isPostSwitch);
  
  // If no post-switch responses, return 0 as per requirements
  if (postSwitchResponses.length === 0) return 0;
  
  // Handle division by zero: if no normal responses, return 0
  if (normalResponses.length === 0) return 0;
  
  const postSwitchSum = postSwitchResponses.reduce((sum, r) => {
    return sum + r.reactionTime;
  }, 0);
  const meanPostSwitch = postSwitchSum / postSwitchResponses.length;
  
  const normalSum = normalResponses.reduce((sum, r) => {
    return sum + r.reactionTime;
  }, 0);
  const meanNormal = normalSum / normalResponses.length;
  
  // Handle NaN results
  if (isNaN(meanPostSwitch) || isNaN(meanNormal)) return 0;
  
  return Math.round(meanPostSwitch - meanNormal);
}

/**
 * Calculate estimated daily focus loss in hours
 * 
 * Uses a heuristic formula based on:
 * - Error rate: Higher errors indicate more focus loss
 * - Switching cost: Higher switching cost indicates cognitive fragmentation
 * 
 * Formula:
 * - Base loss from errors: errorRate * 4 hours
 * - Additional loss from switching: (switchingCost / 100) * 2 hours
 * 
 * Assumptions:
 * - 50% error rate ≈ 2 hours lost
 * - 200ms switching cost ≈ 4 hours lost
 * 
 * @param errorRate - Error rate as a decimal (0.0 to 1.0)
 * @param switchingCost - Switching cost in milliseconds
 * @returns Estimated daily focus loss in hours (0-8, with 1 decimal place)
 * 
 * **Validates: Requirements 12.1, 12.2, 12.3**
 */
export function calculateDailyFocusLoss(
  errorRate: number,
  switchingCost: number
): number {
  // Handle NaN or invalid inputs
  if (isNaN(errorRate) || isNaN(switchingCost)) {
    return 0;
  }
  
  // Clamp inputs to valid ranges
  const clampedErrorRate = Math.max(0, Math.min(1, errorRate));
  const clampedSwitchingCost = Math.max(0, switchingCost);
  
  // Heuristic formula
  const errorLoss = clampedErrorRate * 4;
  const switchLoss = (clampedSwitchingCost / 100) * 2;
  const totalLoss = errorLoss + switchLoss;
  
  // Clamp to reasonable range (0-8 hours)
  const clampedLoss = Math.max(0, Math.min(8, totalLoss));
  
  // Round to 1 decimal place
  return Math.round(clampedLoss * 10) / 10;
}

/**
 * Calculate peer comparison metrics
 * 
 * Generates a simulated average user score (65-75) and calculates
 * the user's percentile ranking relative to this average.
 * 
 * Percentile calculation:
 * - Score < average: Linear scale from 0-50th percentile
 * - Score = average: 50th percentile
 * - Score > average: Linear scale from 50-100th percentile
 * 
 * @param userScore - User's Focus Stability Score (0-100)
 * @returns Object with simulatedAvgScore and percentile
 * 
 * **Validates: Requirements 14.5, 14.6**
 */
export function calculatePeerComparison(userScore: number): {
  simulatedAvgScore: number;
  percentile: number;
} {
  // Handle invalid user score
  if (isNaN(userScore)) {
    return {
      simulatedAvgScore: 70,
      percentile: 0
    };
  }
  
  // Clamp user score to valid range
  const clampedUserScore = Math.max(0, Math.min(100, userScore));
  
  // Generate simulated average between 65-75
  const simulatedAvgScore = 65 + Math.random() * 10;
  
  // Calculate percentile
  // Simple linear interpolation:
  // Score 0 = 0th percentile
  // Score = avg = 50th percentile
  // Score 100 = 100th percentile
  
  let percentile: number;
  if (clampedUserScore < simulatedAvgScore) {
    // Below average: scale 0-50
    percentile = (clampedUserScore / simulatedAvgScore) * 50;
  } else {
    // Above average: scale 50-100
    const denominator = 100 - simulatedAvgScore;
    // Handle edge case where simulated average is 100
    if (denominator === 0) {
      percentile = 100;
    } else {
      percentile = 50 + ((clampedUserScore - simulatedAvgScore) / denominator) * 50;
    }
  }
  
  return {
    simulatedAvgScore: Math.round(simulatedAvgScore),
    percentile: Math.round(percentile)
  };
}
