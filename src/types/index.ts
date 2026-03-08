/**
 * Core type definitions for NeuroGym Focus Test MVP
 */

export type Symbol = {
  value: string;        // '1'-'9' or 'A'-'Z'
  type: 'number' | 'letter';
  displayedAt: number;  // timestamp (ms)
};

export type ClassificationRule = {
  numbersKey: 'left' | 'right';
  lettersKey: 'left' | 'right';
};

export type Response = {
  symbol: Symbol;
  userKey: 'left' | 'right';
  correct: boolean;
  reactionTime: number;     // milliseconds
  isPostSwitch: boolean;    // true if within 2s after rule switch
  timestamp: number;        // when response occurred
};

export type GameState = {
  isActive: boolean;
  startTime: number;
  currentTime: number;
  timeRemaining: number;
  currentSymbol: Symbol | null;
  currentRule: ClassificationRule;
  responses: Response[];
  lastSwitchTime: number;
  nextSwitchTime: number;
  symbolCount: number;
};

export type GameResults = {
  focusStabilityScore: number;    // 0-100
  switchingCost: number;          // milliseconds
  dailyFocusLoss: number;         // hours (1 decimal)
  
  // Raw metrics
  totalResponses: number;
  correctResponses: number;
  incorrectResponses: number;
  missedResponses: number;
  accuracy: number;               // percentage
  
  // Reaction time stats
  meanReactionTime: number;
  medianReactionTime: number;
  reactionTimeStdDev: number;
  meanNormalRT: number;
  meanPostSwitchRT: number;
  
  // Peer comparison
  simulatedAvgScore: number;
  percentile: number;
  
  // Optional: for graphing
  reactionTimeHistory?: Array<{
    time: number;
    reactionTime: number;
    isPostSwitch: boolean;
  }>;
};

export type Screen = 'landing' | 'instructions' | 'game' | 'report';
