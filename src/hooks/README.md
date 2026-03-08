# React Hooks

This directory contains custom React hooks used throughout the NeuroGym Focus Test application.

## useGameTimer

A high-precision countdown timer hook that uses `requestAnimationFrame` and `performance.now()` for accurate timing.

### Usage

```typescript
import { useGameTimer } from './hooks/useGameTimer';

function GameComponent() {
  const { timeRemaining, isActive, start, pause, reset } = useGameTimer({
    duration: 60000, // 60 seconds in milliseconds
    onComplete: () => {
      console.log('Timer completed!');
      // Handle game completion
    }
  });

  return (
    <div>
      <p>Time remaining: {Math.ceil(timeRemaining / 1000)}s</p>
      <button onClick={start} disabled={isActive}>Start</button>
      <button onClick={pause} disabled={!isActive}>Pause</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

### API

#### Parameters

- `duration` (number): Timer duration in milliseconds
- `onComplete` (function): Callback function triggered when timer reaches zero

#### Returns

- `timeRemaining` (number): Current time remaining in milliseconds
- `isActive` (boolean): Whether the timer is currently running
- `start` (function): Start or resume the timer
- `pause` (function): Pause the timer
- `reset` (function): Reset the timer to initial duration and stop it

### Features

- **High-precision timing**: Uses `performance.now()` for sub-millisecond accuracy
- **Smooth updates**: Uses `requestAnimationFrame` for optimal rendering performance
- **Guaranteed completion**: Timer will never go below zero and always triggers `onComplete` exactly once
- **Pause/resume support**: Can pause and resume the timer while maintaining accurate time tracking

### Requirements Validated

- **Requirement 4.3**: Set a 60-second countdown timer
- **Requirement 9.1**: Stop accepting user input when timer reaches zero
- **Requirement 9.2**: Stop generating new symbols when timer reaches zero

### Testing

The hook includes both unit tests and property-based tests:

- `useGameTimer.test.ts`: Unit tests for specific scenarios
- `useGameTimer.property.test.ts`: Property-based tests validating correctness properties

Run tests with:
```bash
npm test -- src/hooks/useGameTimer
```
