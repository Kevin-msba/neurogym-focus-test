/**
 * Formatting utilities for displaying scores and metrics
 * 
 * These functions format calculated scores into user-friendly display strings
 * following the exact patterns specified in the requirements.
 */

/**
 * Format Focus Stability Score for display
 * 
 * @param score - Focus Stability Score (0-100)
 * @returns Formatted string in pattern "X / 100"
 * 
 * **Validates: Requirements 13.2**
 */
export function formatFocusScore(score: number): string {
  // Handle NaN edge case
  if (isNaN(score)) {
    return '0 / 100';
  }
  return `${Math.round(score)} / 100`;
}

/**
 * Format Switching Cost for display
 * 
 * @param cost - Switching cost in milliseconds (can be negative)
 * @returns Formatted string in pattern "+X ms" or "-X ms"
 * 
 * **Validates: Requirements 13.3**
 */
export function formatSwitchingCost(cost: number): string {
  const roundedCost = Math.round(cost);
  // Handle -0 edge case: convert -0 to +0
  const normalizedCost = Object.is(roundedCost, -0) ? 0 : roundedCost;
  const sign = normalizedCost >= 0 ? '+' : '';
  return `${sign}${normalizedCost} ms`;
}

/**
 * Format Daily Focus Loss for display
 * 
 * @param hours - Daily focus loss in hours (with 1 decimal place)
 * @returns Formatted string in pattern "X hours" or "X.X hours"
 * 
 * **Validates: Requirements 13.4**
 */
export function formatDailyFocusLoss(hours: number): string {
  // Handle NaN edge case
  if (isNaN(hours)) {
    return '0.0 hours';
  }
  // Use Math.round for consistent rounding behavior (0.5 rounds up)
  const rounded = Math.round(hours * 10) / 10;
  return `${rounded.toFixed(1)} hours`;
}
