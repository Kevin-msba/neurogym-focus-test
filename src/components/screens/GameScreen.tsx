import { useReducer, useCallback, useState } from 'react';
import { useGameTimer } from '../../hooks/useGameTimer';
import { useSymbolGenerator } from '../../hooks/useSymbolGenerator';
import { useRuleSwitcher } from '../../hooks/useRuleSwitcher';
import { useKeyboardInput } from '../../hooks/useKeyboardInput';
import { useTouchInput } from '../../hooks/useTouchInput';
import { invertRule } from '../../utils/ruleSwitch';
import {
  calculateFocusStabilityScore,
  calculateSwitchingCost,
  calculateDailyFocusLoss,
  calculatePeerComparison,
} from '../../utils/scoreCalculator';
import type { Symbol, ClassificationRule, Response, GameResults } from '../../types';

interface GameScreenProps {
  onGameComplete: (results: GameResults) => void;
}

interface GameState {
  currentSymbol: Symbol | null;
  currentRule: ClassificationRule;
  responses: Response[];
  lastSwitchTime: number;
  symbolCount: number;
}

type GameAction =
  | { type: 'NEW_SYMBOL'; symbol: Symbol }
  | { type: 'RULE_SWITCH' }
  | { type: 'USER_RESPONSE'; key: 'left' | 'right' };

const INITIAL_RULE: ClassificationRule = {
  numbersKey: 'left',
  lettersKey: 'right',
};

const POST_SWITCH_WINDOW = 2000; // 2 seconds in milliseconds

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'NEW_SYMBOL':
      return {
        ...state,
        currentSymbol: action.symbol,
        symbolCount: state.symbolCount + 1,
      };

    case 'RULE_SWITCH': {
      const newRule = invertRule(state.currentRule);
      return {
        ...state,
        currentRule: newRule,
        lastSwitchTime: performance.now(),
      };
    }

    case 'USER_RESPONSE': {
      if (!state.currentSymbol) return state;

      const now = performance.now();
      const reactionTime = now - state.currentSymbol.displayedAt;
      
      // Determine if response is correct based on current rule
      const expectedKey =
        state.currentSymbol.type === 'number'
          ? state.currentRule.numbersKey
          : state.currentRule.lettersKey;
      const correct = action.key === expectedKey;

      // Determine if this is a post-switch response (within 2s after rule switch)
      const isPostSwitch = state.lastSwitchTime > 0 && (now - state.lastSwitchTime) <= POST_SWITCH_WINDOW;

      const response: Response = {
        symbol: state.currentSymbol,
        userKey: action.key,
        correct,
        reactionTime,
        isPostSwitch,
        timestamp: now,
      };

      return {
        ...state,
        responses: [...state.responses, response],
      };
    }

    default:
      return state;
  }
}

export function GameScreen({ onGameComplete }: GameScreenProps) {
  const [gameState, dispatch] = useReducer(gameReducer, {
    currentSymbol: null,
    currentRule: INITIAL_RULE,
    responses: [],
    lastSwitchTime: 0,
    symbolCount: 0,
  });

  // State for showing ready modal, countdown, and feedback
  const [showReadyModal, setShowReadyModal] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ correct: boolean; id: number } | null>(null);

  // Handle game completion
  const handleGameComplete = useCallback(() => {
    // Calculate all metrics
    const responses = gameState.responses;
    const totalSymbols = gameState.symbolCount;

    const correctResponses = responses.filter(r => r.correct).length;
    const incorrectResponses = responses.filter(r => !r.correct).length;
    const missedResponses = totalSymbols - responses.length;
    const totalResponses = responses.length;
    const accuracy = totalResponses > 0 ? correctResponses / totalResponses : 0;

    // Calculate reaction time statistics
    const reactionTimes = responses.map(r => r.reactionTime);
    const meanReactionTime = reactionTimes.length > 0
      ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
      : 0;

    const sortedRT = [...reactionTimes].sort((a, b) => a - b);
    const medianReactionTime = sortedRT.length > 0
      ? sortedRT.length % 2 === 0
        ? (sortedRT[sortedRT.length / 2 - 1] + sortedRT[sortedRT.length / 2]) / 2
        : sortedRT[Math.floor(sortedRT.length / 2)]
      : 0;

    const variance = reactionTimes.length > 0
      ? reactionTimes.reduce((sum, rt) => sum + Math.pow(rt - meanReactionTime, 2), 0) / reactionTimes.length
      : 0;
    const reactionTimeStdDev = Math.sqrt(variance);

    // Calculate post-switch vs normal reaction times
    const postSwitchResponses = responses.filter(r => r.isPostSwitch);
    const normalResponses = responses.filter(r => !r.isPostSwitch);

    const meanPostSwitchRT = postSwitchResponses.length > 0
      ? postSwitchResponses.reduce((sum, r) => sum + r.reactionTime, 0) / postSwitchResponses.length
      : 0;

    const meanNormalRT = normalResponses.length > 0
      ? normalResponses.reduce((sum, r) => sum + r.reactionTime, 0) / normalResponses.length
      : 0;

    // Calculate scores
    const focusStabilityScore = calculateFocusStabilityScore(responses);
    const switchingCost = calculateSwitchingCost(responses);
    const errorRate = 1 - accuracy;
    const dailyFocusLoss = calculateDailyFocusLoss(errorRate, switchingCost);
    const { simulatedAvgScore, percentile } = calculatePeerComparison(focusStabilityScore);

    // Build reaction time history for optional graphing
    const reactionTimeHistory = responses.map(r => ({
      time: r.timestamp,
      reactionTime: r.reactionTime,
      isPostSwitch: r.isPostSwitch,
    }));

    const results: GameResults = {
      focusStabilityScore,
      switchingCost,
      dailyFocusLoss,
      totalResponses,
      correctResponses,
      incorrectResponses,
      missedResponses,
      accuracy: accuracy * 100, // Convert to percentage
      meanReactionTime,
      medianReactionTime,
      reactionTimeStdDev,
      meanNormalRT,
      meanPostSwitchRT,
      simulatedAvgScore,
      percentile,
      reactionTimeHistory,
    };

    onGameComplete(results);
  }, [gameState, onGameComplete]);

  // Timer hook
  const { timeRemaining, isActive, start } = useGameTimer({
    duration: 30000, // 30 seconds
    onComplete: handleGameComplete,
  });

  // Start countdown when user confirms ready
  const handleReady = useCallback(() => {
    setShowReadyModal(false);
    setCountdown(3);
    
    // Countdown sequence: 3, 2, 1, then start
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval);
          setTimeout(() => {
            setCountdown(null);
            start();
          }, 1000); // Show "1" for 1 second before starting
          return prev;
        }
        return prev - 1;
      });
    }, 1000);
  }, [start]);

  // Symbol generator hook
  const handleNewSymbol = useCallback((symbol: Symbol) => {
    dispatch({ type: 'NEW_SYMBOL', symbol });
  }, []);

  useSymbolGenerator({
    isActive,
    onNewSymbol: handleNewSymbol,
  });

  // Rule switcher hook
  const handleRuleSwitch = useCallback(() => {
    dispatch({ type: 'RULE_SWITCH' });
  }, []);

  useRuleSwitcher({
    isActive,
    onRuleSwitch: handleRuleSwitch,
  });

  // Input handlers with feedback
  const handleKeyPress = useCallback((key: 'left' | 'right') => {
    if (isActive && gameState.currentSymbol) {
      // Determine if response is correct
      const expectedKey =
        gameState.currentSymbol.type === 'number'
          ? gameState.currentRule.numbersKey
          : gameState.currentRule.lettersKey;
      const correct = key === expectedKey;

      // Show feedback
      const feedbackId = Date.now();
      setFeedback({ correct, id: feedbackId });
      
      // Clear feedback after animation
      setTimeout(() => {
        setFeedback(prev => prev?.id === feedbackId ? null : prev);
      }, 500);

      dispatch({ type: 'USER_RESPONSE', key });
    }
  }, [isActive, gameState.currentSymbol, gameState.currentRule]);

  useKeyboardInput({
    isActive,
    onKeyPress: handleKeyPress,
  });

  useTouchInput({
    isActive,
    onKeyPress: handleKeyPress,
  });

  // Format time remaining for display (in seconds)
  const timeRemainingSeconds = Math.ceil(timeRemaining / 1000);

  return (
    <>
      {/* Ready Modal */}
      {showReadyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Ready to Start?
            </h2>
            <div className="space-y-3 mb-6 text-gray-700">
              <p className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Press <strong>LEFT</strong> arrow for numbers</span>
              </p>
              <p className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Press <strong>RIGHT</strong> arrow for letters</span>
              </p>
              <p className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Rules will change during the test</span>
              </p>
              <p className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Respond as fast and accurately as possible</span>
              </p>
            </div>
            <button
              onClick={handleReady}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* Countdown Overlay */}
      {countdown !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50 p-4">
          <div className="text-center mb-8">
            <p className="text-white text-2xl font-semibold mb-4">Starting Rule:</p>
            <p className="text-white text-3xl font-bold mb-6">
              Numbers → LEFT | Letters → RIGHT
            </p>
            <p className="text-yellow-300 text-lg font-medium">
              ⚠️ Rules may change during the test
            </p>
          </div>
          <div className="text-white text-9xl font-bold animate-countdown">
            {countdown}
          </div>
        </div>
      )}

      {/* Feedback Indicator */}
      {feedback && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none">
          <div className={`text-8xl font-bold animate-feedback ${
            feedback.correct ? 'text-green-500' : 'text-red-500'
          }`}>
            {feedback.correct ? '✓' : '✗'}
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
      {/* Rule display */}
      <div className="mb-8 text-center">
        <p className="text-sm text-gray-600 mb-2">Current Rule:</p>
        <p className="text-lg font-medium text-gray-800">
          Numbers → {gameState.currentRule.numbersKey.toUpperCase()} | Letters → {gameState.currentRule.lettersKey.toUpperCase()}
        </p>
      </div>

      {/* Symbol display */}
      <div className="mb-8">
        {gameState.currentSymbol && (
          <div className="w-48 h-48 flex items-center justify-center bg-white rounded-2xl shadow-lg">
            <span className="text-8xl font-bold text-blue-600">
              {gameState.currentSymbol.value}
            </span>
          </div>
        )}
      </div>

      {/* Timer display */}
      <div className="mb-8">
        <p className="text-2xl font-semibold text-gray-700">
          Time: {timeRemainingSeconds}s
        </p>
      </div>

      {/* Touch zones for mobile (visual hint) */}
      <div className="md:hidden fixed inset-0 pointer-events-none flex">
        <div className="w-1/2 border-r-2 border-gray-300 opacity-20 flex items-center justify-center">
          <span className="text-6xl text-gray-400">←</span>
        </div>
        <div className="w-1/2 flex items-center justify-center">
          <span className="text-6xl text-gray-400">→</span>
        </div>
      </div>

      {/* Instructions hint */}
      <div className="text-center text-sm text-gray-500 max-w-md">
        <p className="hidden md:block">Press LEFT or RIGHT arrow keys to respond</p>
        <p className="md:hidden">Tap left or right side of screen to respond</p>
      </div>
    </div>
    </>
  );
}
