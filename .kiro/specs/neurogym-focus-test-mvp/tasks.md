# Implementation Plan: NeuroGym Focus Test MVP

## Overview

This plan implements a single-page React web application with TypeScript and Tailwind CSS that delivers a 60-second cognitive assessment game. The implementation follows a component-based architecture with custom hooks for game logic, score calculation utilities, and comprehensive property-based testing.

## Tasks

- [x] 1. Project setup and core infrastructure
  - Initialize React project with TypeScript and Tailwind CSS
  - Configure build tools (Vite or Create React App)
  - Set up project directory structure (components, hooks, utils, types)
  - Install testing dependencies (Jest, React Testing Library, fast-check)
  - Create base TypeScript type definitions file
  - _Requirements: 20.1, 20.2, 20.3_

- [ ] 2. Define TypeScript types and interfaces
  - [x] 2.1 Create core type definitions
    - Define Symbol, ClassificationRule, Response, GameState, GameResults, Screen types
    - Export all types from src/types/index.ts
    - _Requirements: 5.2, 6.1, 6.2, 7.2, 8.1, 8.2, 8.3_
  
  - [x] 2.2 Write property test for type definitions
    - **Property 1: Symbol Generation Validity**
    - **Validates: Requirements 5.2**

- [ ] 3. Implement utility functions
  - [x] 3.1 Create symbol generator utility
    - Implement generateSymbol() function to create random numbers (1-9) or letters (A-Z)
    - Add timestamp tracking with performance.now()
    - _Requirements: 5.1, 5.2_
  
  - [x] 3.2 Write property tests for symbol generator
    - **Property 1: Symbol Generation Validity**
    - **Property 24: Symbol Generation Frequency**
    - **Validates: Requirements 5.1, 5.2**
  
  - [x] 3.3 Create score calculation utilities
    - Implement calculateFocusStabilityScore() with accuracy and consistency weighting
    - Implement calculateSwitchingCost() for post-switch vs normal reaction time difference
    - Implement calculateDailyFocusLoss() heuristic formula
    - Implement calculatePeerComparison() for simulated average and percentile
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 11.1, 11.2, 11.3, 12.1, 12.2, 12.3, 14.5, 14.6_
  
  - [x] 3.4 Write property tests for score calculations
    - **Property 7: Focus Stability Score Range**
    - **Property 8: Accuracy Impact on Score**
    - **Property 9: Consistency Impact on Score**
    - **Property 10: Switching Cost Calculation**
    - **Property 11: Daily Focus Loss Monotonicity**
    - **Property 12: Daily Focus Loss Precision**
    - **Property 17: Simulated Average Score Range**
    - **Property 18: Percentile Calculation Consistency**
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.4, 11.1, 11.2, 11.3, 12.2, 12.3, 14.5, 14.6**
  
  - [x] 3.5 Create formatting utilities
    - Implement formatFocusScore() for "X / 100" pattern
    - Implement formatSwitchingCost() for "+X ms" pattern
    - Implement formatDailyFocusLoss() for "X hours" pattern with one decimal
    - _Requirements: 13.2, 13.3, 13.4_
  
  - [x] 3.6 Write property tests for formatters
    - **Property 13: Score Display Formatting**
    - **Property 14: Switching Cost Display Formatting**
    - **Property 15: Daily Focus Loss Display Formatting**
    - **Validates: Requirements 13.2, 13.3, 13.4**
  
  - [x] 3.7 Create rule switching utility
    - Implement invertRule() function to swap number/letter key assignments
    - _Requirements: 7.2_
  
  - [x] 3.8 Write property test for rule switching
    - **Property 3: Rule Switch Inversion**
    - **Validates: Requirements 7.2**

- [ ] 4. Implement custom hooks
  - [x] 4.1 Create useGameTimer hook
    - Implement 60-second countdown using requestAnimationFrame
    - Use performance.now() for high-precision timing
    - Trigger onComplete callback when timer reaches zero
    - _Requirements: 4.3, 9.1, 9.2_
  
  - [x] 4.2 Create useSymbolGenerator hook
    - Generate new symbol every 1000ms during active game
    - Call onNewSymbol callback with generated symbol
    - _Requirements: 5.1, 5.2_
  
  - [x] 4.3 Create useRuleSwitcher hook
    - Trigger rule switch every 5-8 seconds (random interval)
    - Call onRuleSwitch callback when switch occurs
    - _Requirements: 7.1, 7.2_
  
  - [x] 4.4 Write property test for rule switcher timing
    - **Property 23: Rule Switch Timing**
    - **Validates: Requirements 7.1**
  
  - [x] 4.5 Create useKeyboardInput hook
    - Listen for ArrowLeft and ArrowRight key presses
    - Call onKeyPress callback with 'left' or 'right'
    - Prevent default browser behavior for arrow keys
    - _Requirements: 6.1, 6.2_
  
  - [x] 4.6 Create useTouchInput hook
    - Detect touch on left/right half of screen for mobile
    - Call onKeyPress callback with 'left' or 'right'
    - _Requirements: 21.4_

- [ ] 5. Implement shared components
  - [x] 5.1 Create Button component
    - Support primary and secondary variants
    - Apply Tailwind CSS styling
    - _Requirements: 19.1, 19.2_
  
  - [x] 5.2 Create Container component
    - Implement responsive padding and max-width
    - _Requirements: 21.1, 21.2_
  
  - [x] 5.3 Create AnimatedCounter component
    - Animate number counting from 0 to target using requestAnimationFrame
    - Support duration and suffix props
    - Use ease-out cubic easing
    - _Requirements: 13.5_
  
  - [x] 5.4 Write property test for AnimatedCounter
    - **Property 16: Score Animation Bounds**
    - **Validates: Requirements 13.5**

- [x] 6. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implement LandingPage screen
  - [x] 7.1 Create LandingPage component
    - Display hero title, subtitle, and description
    - Display "Start the 60-Second Focus Test" button
    - Display "No signup required • Takes 60 seconds" text
    - Apply responsive layout with Tailwind CSS
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_
  
  - [x] 7.2 Write unit tests for LandingPage
    - Test all text elements render correctly
    - Test button click triggers onStartTest callback
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 8. Implement InstructionsScreen
  - [x] 8.1 Create InstructionsScreen component
    - Display "How the Focus Test Works" title
    - Display 4 instruction items
    - Display rule change example
    - Display "Start Test" button
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_
  
  - [x] 8.2 Write unit tests for InstructionsScreen
    - Test all instruction text renders correctly
    - Test button click triggers onStartGame callback
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [x] 9. Implement game components
  - [x] 9.1 Create SymbolDisplay component
    - Display current symbol in large centered text
    - Display current classification rule at top
    - Display time remaining
    - Apply responsive styling
    - _Requirements: 5.3, 5.4, 5.5_
  
  - [x] 9.2 Create GameTimer component
    - Display countdown timer in seconds
    - Update every frame for smooth countdown
    - _Requirements: 5.5_
  
  - [x] 9.3 Create ProgressBar component (optional feature)
    - Display progress bar filling from 0% to 100%
    - Update based on elapsed time
    - _Requirements: 23.1, 23.2, 23.3_

- [x] 10. Implement GameScreen with core logic
  - [x] 10.1 Create GameScreen component with state management
    - Initialize game state with useReducer
    - Set up currentSymbol, currentRule, timeRemaining, responses state
    - Integrate useGameTimer, useSymbolGenerator, useRuleSwitcher hooks
    - Integrate useKeyboardInput and useTouchInput hooks
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [x] 10.2 Implement response handling logic
    - Record user key press with timestamp
    - Calculate reaction time from symbol display to key press
    - Evaluate correctness based on current rule
    - Mark post-switch responses (within 2s after rule switch)
    - Store response in responses array
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 7.4_
  
  - [x] 10.3 Write property tests for response handling
    - **Property 2: Response Correctness Evaluation**
    - **Property 4: Post-Switch Response Marking**
    - **Property 22: Reaction Time Recording Accuracy**
    - **Validates: Requirements 6.3, 6.4, 7.4**
  
  - [x] 10.4 Implement rule switching logic
    - Invert classification rule when switch occurs
    - Update UI to show new rule
    - Track lastSwitchTime for post-switch marking
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  
  - [x] 10.5 Implement performance tracking
    - Track correct, incorrect, and missed response counts
    - Separate post-switch and normal reaction times
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_
  
  - [x] 10.6 Write property tests for performance tracking
    - **Property 5: Response Categorization Completeness**
    - **Property 6: Reaction Time Categorization**
    - **Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 8.6**
  
  - [x] 10.7 Implement game completion logic
    - Stop accepting input when timer reaches zero
    - Stop generating symbols when timer reaches zero
    - Calculate all scores using utility functions
    - Trigger onGameComplete callback with results
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_
  
  - [x] 10.8 Write unit tests for GameScreen
    - Test game initialization
    - Test symbol generation and display
    - Test key press handling
    - Test game completion flow
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 9.1, 9.2_

- [x] 11. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 12. Implement report components
  - [x] 12.1 Create ScoreCard component
    - Display metric label and animated value
    - Use AnimatedCounter for number animation
    - Apply card styling with Tailwind CSS
    - _Requirements: 13.2, 13.3, 13.4, 13.5_
  
  - [x] 12.2 Create PeerComparison component
    - Display user score vs simulated average
    - Display percentile ranking
    - Apply visual comparison styling
    - _Requirements: 14.1, 14.2, 14.3, 14.4_
  
  - [x] 12.3 Create ResultInterpretation component
    - Display interpretation text based on score threshold
    - Show negative interpretation for scores below 70
    - Show positive interpretation for scores 70 and above
    - _Requirements: 15.1, 15.2, 15.3_
  
  - [x] 12.4 Create ProductSection component
    - Display "How NeuroGym Helps" title
    - Display description and 3 benefit items
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_
  
  - [x] 12.5 Create CTASection component
    - Display "Download NeuroGym" primary button
    - Display "Join Early Access" secondary button
    - Display email input field for waitlist
    - _Requirements: 17.1, 17.2, 17.3_
  
  - [x] 12.6 Create ReactionTimeGraph component (optional feature)
    - Display line graph of reaction times over 60 seconds
    - Highlight rule switch points on graph
    - Animate graph drawing
    - _Requirements: 22.1, 22.2, 22.3_

- [x] 13. Implement ReportScreen
  - [x] 13.1 Create ReportScreen component
    - Display "Your Cognitive Snapshot" title
    - Render 3 ScoreCard components for focus score, switching cost, daily loss
    - Render PeerComparison component
    - Render ResultInterpretation component
    - Render ProductSection component
    - Render CTASection component
    - Display "Try Again" button
    - Apply responsive layout
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6_
  
  - [x] 13.2 Write unit tests for ReportScreen
    - Test all sections render with correct data
    - Test "Try Again" button triggers onTryAgain callback
    - _Requirements: 13.1, 18.1_

- [x] 14. Implement App component with navigation
  - [x] 14.1 Create App component with state management
    - Set up application state with useReducer (currentScreen, gameResults)
    - Implement screen navigation logic
    - Render current screen based on state
    - _Requirements: 2.1, 2.2, 4.1_
  
  - [x] 14.2 Implement navigation handlers
    - Handle landing to instructions navigation
    - Handle instructions to game navigation
    - Handle game to report navigation with results
    - Handle retry functionality (reset state and return to instructions)
    - _Requirements: 2.1, 2.2, 4.1, 9.6, 18.2, 18.3_
  
  - [x] 14.3 Write property test for application reset
    - **Property 19: Game State Reset Completeness**
    - **Validates: Requirements 18.2**
  
  - [x] 14.4 Write integration tests for App
    - Test complete user flow from landing to report
    - Test retry functionality
    - Test screen transitions
    - _Requirements: 2.1, 2.2, 4.1, 9.6, 18.1, 18.2, 18.3_

- [x] 15. Implement responsive design and styling
  - [x] 15.1 Apply Tailwind CSS responsive classes
    - Configure mobile-first breakpoints (sm, md, lg, xl)
    - Apply responsive padding, text sizes, and layouts
    - Test viewport widths from 320px to 1920px
    - _Requirements: 1.7, 19.1, 19.2, 19.3, 19.4, 19.5, 19.6, 21.1, 21.2, 21.3_
  
  - [x] 15.2 Implement mobile touch controls
    - Display touch zones on mobile (left/right screen halves)
    - Add visual indicators for touch areas
    - _Requirements: 21.4_
  
  - [x] 15.3 Write property test for responsive layout
    - **Property 21: Responsive Layout Stability**
    - **Validates: Requirements 21.1**

- [x] 16. Implement no-backend validation
  - [x] 16.1 Write property test for no backend dependency
    - **Property 20: No Backend Dependency**
    - **Validates: Requirements 20.2, 20.3**

- [x] 17. Performance optimization and error handling
  - [x] 17.1 Add React.memo to static components
    - Memoize LandingPage and InstructionsScreen
    - _Requirements: 20.1_
  
  - [x] 17.2 Add useCallback for event handlers
    - Wrap navigation handlers and game callbacks
    - _Requirements: 20.1_
  
  - [x] 17.3 Implement error handling
    - Handle division by zero in score calculations
    - Handle missing game results on report screen
    - Handle timer edge cases
    - Prevent default touch behaviors on mobile
    - _Requirements: 9.1, 9.2, 11.3_
  
  - [x] 17.4 Write unit tests for error handling
    - Test score calculation with empty responses
    - Test score calculation with no post-switch responses
    - Test report screen with null results
    - _Requirements: 11.3_

- [x] 18. Final integration and polish
  - [x] 18.1 Add subtle animations and transitions
    - Apply fade transitions between screens
    - Add hover effects to buttons
    - _Requirements: 19.6_
  
  - [x] 18.2 Verify all requirements coverage
    - Cross-reference each component with requirements
    - Ensure all acceptance criteria are met
    - _Requirements: All_
  
  - [x] 18.3 Run full test suite
    - Execute all unit tests
    - Execute all property-based tests (100+ iterations each)
    - Verify 80% code coverage minimum
    - _Requirements: All_

- [x] 19. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property-based tests use fast-check library with 100+ iterations per property
- All 24 correctness properties from the design document are covered
- The implementation is pure client-side with no backend dependencies
- Mobile touch input is supported as an alternative to keyboard controls
- Responsive design works from 320px to 1920px viewport widths
