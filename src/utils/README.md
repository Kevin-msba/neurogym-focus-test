# Utility Functions

This directory contains utility functions for the NeuroGym Focus Test MVP.

## Score Calculator (`scoreCalculator.ts`)

Core scoring algorithms for cognitive assessment:

### `calculateFocusStabilityScore(responses: Response[]): number`

Calculates a Focus Stability Score (0-100) based on:
- **Accuracy (70% weight)**: Percentage of correct responses
- **Consistency (30% weight)**: Inverse of reaction time standard deviation

Lower variance in reaction times indicates better focus stability.

**Requirements**: 10.1, 10.2, 10.3, 10.4

### `calculateSwitchingCost(responses: Response[]): number`

Calculates the cognitive switching cost in milliseconds:
- Difference between average post-switch reaction time and normal reaction time
- Positive values indicate slower responses after rule switches
- Returns 0 if no post-switch or normal responses exist

**Requirements**: 11.1, 11.2, 11.3

### `calculateDailyFocusLoss(errorRate: number, switchingCost: number): number`

Estimates daily focus loss in hours using a heuristic formula:
- Base loss from errors: `errorRate * 4 hours`
- Additional loss from switching: `(switchingCost / 100) * 2 hours`
- Clamped to 0-8 hours range
- Returns value with 1 decimal place precision

**Requirements**: 12.1, 12.2, 12.3

### `calculatePeerComparison(userScore: number): { simulatedAvgScore: number; percentile: number }`

Generates peer comparison metrics:
- Simulated average score: Random value between 65-75
- Percentile ranking: User's position relative to simulated average
  - Score < average: 0-50th percentile
  - Score = average: 50th percentile
  - Score > average: 50-100th percentile

**Requirements**: 14.5, 14.6

## Formatters (`formatters.ts`)

Display formatting utilities for scores and metrics:

### `formatFocusScore(score: number): string`

Formats Focus Stability Score as `"X / 100"`

**Requirements**: 13.2

### `formatSwitchingCost(cost: number): string`

Formats switching cost as `"+X ms"` or `"-X ms"`

**Requirements**: 13.3

### `formatDailyFocusLoss(hours: number): string`

Formats daily focus loss as `"X.X hours"` (always 1 decimal place)

**Requirements**: 13.4

## Symbol Generator (`symbolGenerator.ts`)

Generates random symbols for the game:

### `generateSymbol(): Symbol`

Creates a random symbol:
- 50% chance of number (1-9)
- 50% chance of letter (A-Z)
- Includes timestamp using `performance.now()`

**Requirements**: 5.1, 5.2

## Index (`index.ts`)

Barrel export file for convenient imports:

```typescript
import {
  calculateFocusStabilityScore,
  calculateSwitchingCost,
  calculateDailyFocusLoss,
  calculatePeerComparison,
  formatFocusScore,
  formatSwitchingCost,
  formatDailyFocusLoss,
  generateSymbol
} from '../utils';
```

## Example Usage (`scoreCalculator.example.ts`)

Demonstrates how to use the score calculation utilities with sample game data. Run in development mode to see console output.

## Testing

All utilities have comprehensive unit tests:
- `scoreCalculator.test.ts`: Tests for all scoring algorithms
- `formatters.test.ts`: Tests for all formatting functions
- `symbolGenerator.test.ts`: Tests for symbol generation

Run tests with:
```bash
npm test
```

## Algorithm Details

### Focus Stability Score Formula

```
accuracyScore = (correctCount / totalResponses) * 70
consistencyScore = max(0, 30 * (1 - stdDev / 500))
focusStabilityScore = clamp(round(accuracyScore + consistencyScore), 0, 100)
```

### Switching Cost Formula

```
meanPostSwitch = average(postSwitchReactionTimes)
meanNormal = average(normalReactionTimes)
switchingCost = round(meanPostSwitch - meanNormal)
```

### Daily Focus Loss Formula

```
errorLoss = errorRate * 4
switchLoss = (switchingCost / 100) * 2
dailyFocusLoss = clamp(round((errorLoss + switchLoss) * 10) / 10, 0, 8)
```

### Percentile Calculation

```
if userScore < avgScore:
  percentile = (userScore / avgScore) * 50
else:
  percentile = 50 + ((userScore - avgScore) / (100 - avgScore)) * 50
```

## Notes

- All calculations are performed client-side
- No external API calls or dependencies
- Algorithms are optimized for performance
- Edge cases (empty arrays, division by zero) are handled gracefully
- All functions are pure (no side effects)
