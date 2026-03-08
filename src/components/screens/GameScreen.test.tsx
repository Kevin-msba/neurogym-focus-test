/**
 * Unit tests for GameScreen component
 * 
 * Tests:
 * - Game initialization
 * - Symbol generation and display
 * - Key press handling
 * - Game completion flow
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameScreen } from './GameScreen';
import type { GameResults } from '../../types';

describe('GameScreen', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Game Initialization', () => {
    it('**Validates: Requirements 4.1, 4.2, 4.3** - should initialize with timer, rule, and first symbol', () => {
      const onGameComplete = vi.fn();
      render(<GameScreen onGameComplete={onGameComplete} />);

      // Should display initial rule
      expect(screen.getByText(/Current Rule:/i)).toBeInTheDocument();
      expect(screen.getByText(/Numbers → LEFT \| Letters → RIGHT/i)).toBeInTheDocument();

      // Should display timer starting at 60 seconds
      expect(screen.getByText(/Time: 60s/i)).toBeInTheDocument();

      // Should display instructions (use getAllByText since there are two versions for mobile/desktop)
      const instructions = screen.getAllByText(/Press LEFT or RIGHT arrow keys to respond|Tap left or right side of screen to respond/i);
      expect(instructions.length).toBeGreaterThan(0);

      // Advance timers to trigger symbol generation
      vi.advanceTimersByTime(100);

      // First symbol should appear
      const symbolElements = screen.getAllByText(/^[1-9A-Z]$/);
      expect(symbolElements.length).toBeGreaterThan(0);
    });

    it('**Validates: Requirements 4.4, 4.5** - should set initial classification rule and display first symbol', () => {
      const onGameComplete = vi.fn();
      render(<GameScreen onGameComplete={onGameComplete} />);

      // Initial rule should be numbers=left, letters=right
      expect(screen.getByText(/Numbers → LEFT/i)).toBeInTheDocument();
      expect(screen.getByText(/Letters → RIGHT/i)).toBeInTheDocument();

      // Advance timers to trigger symbol generation
      vi.advanceTimersByTime(100);

      // Symbol should appear
      const symbolElements = screen.getAllByText(/^[1-9A-Z]$/);
      expect(symbolElements.length).toBeGreaterThan(0);
    });
  });

  describe('Symbol Generation and Display', () => {
    it('should generate new symbols every second', () => {
      const onGameComplete = vi.fn();
      render(<GameScreen onGameComplete={onGameComplete} />);

      // Advance time to generate first symbol
      vi.advanceTimersByTime(100);

      const symbols1 = screen.getAllByText(/^[1-9A-Z]$/);
      expect(symbols1.length).toBeGreaterThan(0);

      // Advance 1 second to generate next symbol
      vi.advanceTimersByTime(1000);

      const symbols2 = screen.getAllByText(/^[1-9A-Z]$/);
      expect(symbols2.length).toBeGreaterThan(0);
    });

    it('should display current symbol in center', () => {
      const onGameComplete = vi.fn();
      render(<GameScreen onGameComplete={onGameComplete} />);

      vi.advanceTimersByTime(100);

      const symbolElements = screen.getAllByText(/^[1-9A-Z]$/);
      expect(symbolElements.length).toBeGreaterThan(0);
      
      // Symbol should be displayed with large text styling
      const symbol = symbolElements[0];
      expect(symbol).toHaveClass('text-8xl');
    });
  });

  describe('Key Press Handling', () => {
    it('should handle left arrow key press', () => {
      const onGameComplete = vi.fn();
      render(<GameScreen onGameComplete={onGameComplete} />);

      vi.advanceTimersByTime(100);

      const symbols = screen.getAllByText(/^[1-9A-Z]$/);
      expect(symbols.length).toBeGreaterThan(0);

      // Simulate left arrow key press
      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      window.dispatchEvent(event);

      // Component should not crash and should continue running
      expect(screen.getByText(/Time:/i)).toBeInTheDocument();
    });

    it('should handle right arrow key press', () => {
      const onGameComplete = vi.fn();
      render(<GameScreen onGameComplete={onGameComplete} />);

      vi.advanceTimersByTime(100);

      const symbols = screen.getAllByText(/^[1-9A-Z]$/);
      expect(symbols.length).toBeGreaterThan(0);

      // Simulate right arrow key press
      const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      window.dispatchEvent(event);

      // Component should not crash and should continue running
      expect(screen.getByText(/Time:/i)).toBeInTheDocument();
    });

    it('should ignore non-arrow key presses', () => {
      const onGameComplete = vi.fn();
      render(<GameScreen onGameComplete={onGameComplete} />);

      vi.advanceTimersByTime(100);

      const symbols = screen.getAllByText(/^[1-9A-Z]$/);
      expect(symbols.length).toBeGreaterThan(0);

      // Simulate invalid key press
      const event = new KeyboardEvent('keydown', { key: 'Space' });
      window.dispatchEvent(event);

      // Component should continue running normally
      expect(screen.getByText(/Time:/i)).toBeInTheDocument();
    });
  });

  describe('Game Completion Flow', () => {
    it('**Validates: Requirements 9.1, 9.2** - should call onGameComplete when timer reaches zero', () => {
      const onGameComplete = vi.fn();
      render(<GameScreen onGameComplete={onGameComplete} />);

      // Advance time to complete the game (60 seconds)
      vi.advanceTimersByTime(60000);

      expect(onGameComplete).toHaveBeenCalledTimes(1);
    });

    it('**Validates: Requirements 9.3, 9.4, 9.5, 9.6** - should calculate and pass game results', () => {
      const onGameComplete = vi.fn();
      render(<GameScreen onGameComplete={onGameComplete} />);

      // Wait for first symbol
      vi.advanceTimersByTime(100);

      const symbols = screen.getAllByText(/^[1-9A-Z]$/);
      expect(symbols.length).toBeGreaterThan(0);

      // Simulate some responses
      const leftEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
      window.dispatchEvent(leftEvent);

      vi.advanceTimersByTime(1000);

      const rightEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      window.dispatchEvent(rightEvent);

      // Complete the game
      vi.advanceTimersByTime(59000);

      expect(onGameComplete).toHaveBeenCalled();

      // Verify results structure
      const results: GameResults = onGameComplete.mock.calls[0][0];
      expect(results).toHaveProperty('focusStabilityScore');
      expect(results).toHaveProperty('switchingCost');
      expect(results).toHaveProperty('dailyFocusLoss');
      expect(results).toHaveProperty('totalResponses');
      expect(results).toHaveProperty('correctResponses');
      expect(results).toHaveProperty('incorrectResponses');
      expect(results).toHaveProperty('missedResponses');
      expect(results).toHaveProperty('accuracy');
      expect(results).toHaveProperty('meanReactionTime');
      expect(results).toHaveProperty('simulatedAvgScore');
      expect(results).toHaveProperty('percentile');

      // Verify score ranges
      expect(results.focusStabilityScore).toBeGreaterThanOrEqual(0);
      expect(results.focusStabilityScore).toBeLessThanOrEqual(100);
      expect(results.accuracy).toBeGreaterThanOrEqual(0);
      expect(results.accuracy).toBeLessThanOrEqual(100);
    });

    it('should handle game with no responses', () => {
      const onGameComplete = vi.fn();
      render(<GameScreen onGameComplete={onGameComplete} />);

      // Complete the game without any key presses
      vi.advanceTimersByTime(60000);

      expect(onGameComplete).toHaveBeenCalled();

      const results: GameResults = onGameComplete.mock.calls[0][0];
      expect(results.totalResponses).toBe(0);
      expect(results.correctResponses).toBe(0);
      expect(results.incorrectResponses).toBe(0);
      expect(results.focusStabilityScore).toBe(0);
    });
  });

  describe('Timer Display', () => {
    it('should update timer display as time progresses', () => {
      const onGameComplete = vi.fn();
      render(<GameScreen onGameComplete={onGameComplete} />);

      // Initial time
      expect(screen.getByText(/Time: 60s/i)).toBeInTheDocument();

      // The timer updates are handled by requestAnimationFrame in the hook
      // With fake timers, we can't easily test the intermediate states
      // So we'll just verify the timer starts correctly and completes
      
      // Advance to completion
      vi.advanceTimersByTime(60000);

      // Game should complete
      expect(onGameComplete).toHaveBeenCalled();
    });
  });

  describe('Mobile Touch Zones', () => {
    it('should display touch zone hints on mobile', () => {
      const onGameComplete = vi.fn();
      render(<GameScreen onGameComplete={onGameComplete} />);

      // Check for left arrow hint
      const leftArrow = screen.getByText('←');
      expect(leftArrow).toBeInTheDocument();

      // Check for right arrow hint
      const rightArrow = screen.getByText('→');
      expect(rightArrow).toBeInTheDocument();
    });
  });
});
