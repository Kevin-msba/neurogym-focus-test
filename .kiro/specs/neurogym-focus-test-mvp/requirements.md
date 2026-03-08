# Requirements Document

## Introduction

NeuroGym Focus Test MVP is a single-page web application that provides users with a 60-second cognitive assessment game. The application measures focus stability, reaction time, and cognitive switching costs through an interactive symbol classification task. After completing the test, users receive a personalized cognitive report with peer comparisons and are encouraged to download the NeuroGym app. The entire experience runs locally in the browser without requiring backend services or user authentication.

## Glossary

- **Focus_Test_Application**: The complete single-page web application
- **Landing_Page**: The initial hero section that introduces the Focus Test
- **Instructions_Screen**: The screen that explains game rules before the test begins
- **Focus_Game**: The 60-second interactive cognitive assessment game
- **Symbol**: A randomly generated number (1-9) or letter (A-Z) displayed during the game
- **Classification_Rule**: The current rule determining which key to press for numbers vs letters
- **Rule_Switch**: An event where the Classification_Rule inverts
- **Reaction_Time**: The duration between Symbol display and user key press
- **Switching_Cost**: The difference in Reaction_Time during Rule_Switch periods vs normal periods
- **Focus_Stability_Score**: A calculated metric (0-100) based on accuracy and reaction time consistency
- **Report_Screen**: The screen displaying cognitive assessment results
- **Peer_Comparison**: Simulated comparison of user performance against average users
- **Product_Section**: The section introducing NeuroGym app features
- **CTA_Section**: The call-to-action section with download and waitlist options

## Requirements

### Requirement 1: Landing Page Display

**User Story:** As a visitor, I want to see an engaging landing page, so that I understand what the Focus Test offers and feel motivated to start.

#### Acceptance Criteria

1. THE Landing_Page SHALL display the title "Measure. Train. Improve Your Cognitive Performance"
2. THE Landing_Page SHALL display the subtitle "Take a 60-second Focus Test to discover how stable your attention really is."
3. THE Landing_Page SHALL display the description "This quick interactive challenge reveals how digital distractions affect your cognitive stability."
4. THE Landing_Page SHALL display a primary button labeled "Start the 60-Second Focus Test"
5. THE Landing_Page SHALL display the text "No signup required • Takes 60 seconds"
6. THE Landing_Page SHALL use a clean modern UI style consistent with productivity and wellness applications
7. THE Landing_Page SHALL be responsive on mobile and desktop viewports

### Requirement 2: Navigation to Instructions

**User Story:** As a user, I want to start the test from the landing page, so that I can proceed to the instructions.

#### Acceptance Criteria

1. WHEN the user clicks the "Start the 60-Second Focus Test" button, THE Focus_Test_Application SHALL display the Instructions_Screen
2. THE Focus_Test_Application SHALL hide the Landing_Page when displaying the Instructions_Screen

### Requirement 3: Instructions Screen Display

**User Story:** As a user, I want to see clear instructions before starting the game, so that I understand how to play.

#### Acceptance Criteria

1. THE Instructions_Screen SHALL display the title "How the Focus Test Works"
2. THE Instructions_Screen SHALL display the instruction "A symbol (number or letter) will appear every second"
3. THE Instructions_Screen SHALL display the instruction "Press LEFT if it is a number"
4. THE Instructions_Screen SHALL display the instruction "Press RIGHT if it is a letter"
5. THE Instructions_Screen SHALL display the instruction "But occasionally the rule will change"
6. THE Instructions_Screen SHALL display an example "Rule Change: Numbers → RIGHT, Letters → LEFT"
7. THE Instructions_Screen SHALL display the instruction "Respond as fast and accurately as possible"
8. THE Instructions_Screen SHALL display a "Start Test" button

### Requirement 4: Game Initialization

**User Story:** As a user, I want to start the game from the instructions screen, so that I can begin the cognitive assessment.

#### Acceptance Criteria

1. WHEN the user clicks the "Start Test" button, THE Focus_Test_Application SHALL initialize the Focus_Game
2. WHEN the Focus_Game initializes, THE Focus_Test_Application SHALL hide the Instructions_Screen
3. WHEN the Focus_Game initializes, THE Focus_Test_Application SHALL set a 60-second countdown timer
4. WHEN the Focus_Game initializes, THE Focus_Test_Application SHALL set an initial Classification_Rule
5. WHEN the Focus_Game initializes, THE Focus_Test_Application SHALL display the first Symbol

### Requirement 5: Symbol Generation and Display

**User Story:** As a user, I want to see a new symbol every second, so that I can respond to the cognitive challenge.

#### Acceptance Criteria

1. WHILE the Focus_Game is active, THE Focus_Game SHALL generate a new Symbol every 1000 milliseconds
2. THE Focus_Game SHALL randomly select each Symbol as either a number (1-9) or a letter (A-Z)
3. THE Focus_Game SHALL display the current Symbol in the center of the screen
4. THE Focus_Game SHALL display the current Classification_Rule at the top of the screen
5. THE Focus_Game SHALL display the remaining time in seconds

### Requirement 6: User Input Handling

**User Story:** As a user, I want to respond to symbols using arrow keys, so that I can complete the cognitive assessment.

#### Acceptance Criteria

1. WHEN the user presses the left arrow key during the Focus_Game, THE Focus_Game SHALL record a "LEFT" response
2. WHEN the user presses the right arrow key during the Focus_Game, THE Focus_Game SHALL record a "RIGHT" response
3. WHEN the user provides a response, THE Focus_Game SHALL record the Reaction_Time from Symbol display to key press
4. WHEN the user provides a response, THE Focus_Game SHALL evaluate response correctness based on the current Classification_Rule
5. WHEN the user provides a response, THE Focus_Game SHALL display the next Symbol

### Requirement 7: Rule Switching Mechanism

**User Story:** As a user, I want the classification rules to change periodically, so that the test measures my cognitive flexibility.

#### Acceptance Criteria

1. WHILE the Focus_Game is active, THE Focus_Game SHALL trigger a Rule_Switch every 5 to 8 seconds
2. WHEN a Rule_Switch occurs, THE Focus_Game SHALL invert the Classification_Rule
3. WHEN a Rule_Switch occurs, THE Focus_Game SHALL display the updated Classification_Rule
4. WHEN a Rule_Switch occurs, THE Focus_Game SHALL mark subsequent responses as post-switch responses for 2 seconds

### Requirement 8: Performance Metrics Tracking

**User Story:** As a user, I want my performance to be tracked accurately, so that I receive meaningful results.

#### Acceptance Criteria

1. WHILE the Focus_Game is active, THE Focus_Game SHALL track the count of correct responses
2. WHILE the Focus_Game is active, THE Focus_Game SHALL track the count of incorrect responses
3. WHILE the Focus_Game is active, THE Focus_Game SHALL track the count of missed responses
4. WHILE the Focus_Game is active, THE Focus_Game SHALL track all Reaction_Time values
5. WHILE the Focus_Game is active, THE Focus_Game SHALL track Reaction_Time values during post-switch periods separately
6. WHILE the Focus_Game is active, THE Focus_Game SHALL track Reaction_Time values during normal periods separately

### Requirement 9: Game Completion

**User Story:** As a user, I want the game to end after 60 seconds, so that I can see my results.

#### Acceptance Criteria

1. WHEN the 60-second timer reaches zero, THE Focus_Game SHALL stop accepting user input
2. WHEN the 60-second timer reaches zero, THE Focus_Game SHALL stop generating new Symbols
3. WHEN the 60-second timer reaches zero, THE Focus_Test_Application SHALL calculate the Focus_Stability_Score
4. WHEN the 60-second timer reaches zero, THE Focus_Test_Application SHALL calculate the Switching_Cost
5. WHEN the 60-second timer reaches zero, THE Focus_Test_Application SHALL calculate the estimated daily focus loss
6. WHEN the 60-second timer reaches zero, THE Focus_Test_Application SHALL display the Report_Screen

### Requirement 10: Focus Stability Score Calculation

**User Story:** As a user, I want to receive a Focus Stability Score, so that I can understand my cognitive performance.

#### Acceptance Criteria

1. THE Focus_Test_Application SHALL calculate the Focus_Stability_Score as a value between 0 and 100
2. THE Focus_Test_Application SHALL base the Focus_Stability_Score on response accuracy
3. THE Focus_Test_Application SHALL base the Focus_Stability_Score on Reaction_Time consistency
4. THE Focus_Test_Application SHALL reduce the Focus_Stability_Score for high variance in Reaction_Time values

### Requirement 11: Switching Cost Calculation

**User Story:** As a user, I want to see my cognitive switching cost, so that I understand how rule changes affect my performance.

#### Acceptance Criteria

1. THE Focus_Test_Application SHALL calculate the Switching_Cost as the difference between average post-switch Reaction_Time and average normal Reaction_Time
2. THE Focus_Test_Application SHALL express the Switching_Cost in milliseconds
3. IF no post-switch responses were recorded, THEN THE Focus_Test_Application SHALL set the Switching_Cost to 0 milliseconds

### Requirement 12: Daily Focus Loss Estimation

**User Story:** As a user, I want to see an estimated daily focus loss, so that I understand the practical impact of my cognitive performance.

#### Acceptance Criteria

1. THE Focus_Test_Application SHALL calculate the estimated daily focus loss in hours
2. THE Focus_Test_Application SHALL base the estimated daily focus loss on error rate and Switching_Cost
3. THE Focus_Test_Application SHALL express the estimated daily focus loss with one decimal place precision

### Requirement 13: Report Screen Display

**User Story:** As a user, I want to see a comprehensive cognitive report, so that I understand my test results.

#### Acceptance Criteria

1. THE Report_Screen SHALL display the title "Your Cognitive Snapshot"
2. THE Report_Screen SHALL display the Focus_Stability_Score with the format "X / 100"
3. THE Report_Screen SHALL display the Switching_Cost with the format "+X ms"
4. THE Report_Screen SHALL display the estimated daily focus loss with the format "X hours"
5. THE Report_Screen SHALL animate the score numbers counting up from 0 to their final values
6. THE Report_Screen SHALL use a clean modern UI style consistent with the Landing_Page

### Requirement 14: Peer Comparison Display

**User Story:** As a user, I want to see how my performance compares to others, so that I can contextualize my results.

#### Acceptance Criteria

1. THE Report_Screen SHALL display a Peer_Comparison section
2. THE Report_Screen SHALL display the user's Focus_Stability_Score in the Peer_Comparison
3. THE Report_Screen SHALL display a simulated average user score in the Peer_Comparison
4. THE Report_Screen SHALL display a percentile ranking in the Peer_Comparison
5. THE Focus_Test_Application SHALL calculate the simulated average user score as a value between 65 and 75
6. THE Focus_Test_Application SHALL calculate the percentile ranking based on the user's score relative to the simulated average

### Requirement 15: Result Interpretation Display

**User Story:** As a user, I want to see an interpretation of my results, so that I understand what my scores mean.

#### Acceptance Criteria

1. WHEN the Focus_Stability_Score is below 70, THE Report_Screen SHALL display the text "Your results suggest elevated cognitive switching costs and unstable attention patterns during digital tasks"
2. WHEN the Focus_Stability_Score is below 70, THE Report_Screen SHALL display the text "Users with similar scores report losing 1–2 hours of productive focus daily due to task fragmentation"
3. WHEN the Focus_Stability_Score is 70 or above, THE Report_Screen SHALL display positive interpretation text

### Requirement 16: Product Section Display

**User Story:** As a user, I want to learn about NeuroGym, so that I can understand how the app can help me.

#### Acceptance Criteria

1. THE Product_Section SHALL display the title "How NeuroGym Helps"
2. THE Product_Section SHALL display the text "NeuroGym continuously measures cognitive fatigue and helps restore focus using AI-powered cognitive training"
3. THE Product_Section SHALL display the benefit "Detects attention instability in real time"
4. THE Product_Section SHALL display the benefit "Predicts cognitive fatigue before productivity drops"
5. THE Product_Section SHALL display the benefit "Provides personalized focus training and interventions"

### Requirement 17: Call-to-Action Display

**User Story:** As a user, I want to download NeuroGym or join the waitlist, so that I can improve my cognitive performance.

#### Acceptance Criteria

1. THE CTA_Section SHALL display a primary button labeled "Download NeuroGym"
2. THE CTA_Section SHALL display a secondary button labeled "Join Early Access"
3. WHERE the user wants to join the waitlist, THE CTA_Section SHALL display an email input field

### Requirement 18: Retry Functionality

**User Story:** As a user, I want to retake the test, so that I can try to improve my score.

#### Acceptance Criteria

1. THE Report_Screen SHALL display a "Try Again" button
2. WHEN the user clicks the "Try Again" button, THE Focus_Test_Application SHALL reset all game state
3. WHEN the user clicks the "Try Again" button, THE Focus_Test_Application SHALL display the Instructions_Screen

### Requirement 19: Visual Design System

**User Story:** As a user, I want a visually appealing interface, so that I have a pleasant experience.

#### Acceptance Criteria

1. THE Focus_Test_Application SHALL use Tailwind CSS for styling
2. THE Focus_Test_Application SHALL use a minimal UI design approach
3. THE Focus_Test_Application SHALL use soft colors as the primary color palette
4. THE Focus_Test_Application SHALL use blue as the accent color for cognition-related elements
5. THE Focus_Test_Application SHALL use clean typography throughout
6. THE Focus_Test_Application SHALL apply subtle animations to enhance user experience

### Requirement 20: Performance and Loading

**User Story:** As a user, I want the application to load quickly, so that I can start the test without delay.

#### Acceptance Criteria

1. THE Focus_Test_Application SHALL load all assets within 3 seconds on a standard broadband connection
2. THE Focus_Test_Application SHALL perform all calculations locally in the browser
3. THE Focus_Test_Application SHALL operate without requiring backend API calls
4. THE Focus_Test_Application SHALL operate without requiring user authentication

### Requirement 21: Responsive Design

**User Story:** As a mobile user, I want the application to work well on my device, so that I can take the test anywhere.

#### Acceptance Criteria

1. THE Focus_Test_Application SHALL display correctly on viewport widths from 320px to 1920px
2. THE Focus_Test_Application SHALL adapt layout for mobile devices with viewport widths below 768px
3. THE Focus_Test_Application SHALL maintain readability and usability on all supported viewport sizes
4. WHEN on mobile devices, THE Focus_Game SHALL accept touch input as an alternative to arrow keys

### Requirement 22: Reaction Time Graph Display

**User Story:** As a user, I want to see a visual representation of my reaction times, so that I can understand my performance patterns.

#### Acceptance Criteria

1. WHERE the reaction time graph feature is implemented, THE Report_Screen SHALL display a graph of Reaction_Time values over the 60-second test duration
2. WHERE the reaction time graph feature is implemented, THE Report_Screen SHALL animate the graph drawing
3. WHERE the reaction time graph feature is implemented, THE Report_Screen SHALL highlight Rule_Switch points on the graph

### Requirement 23: Progress Indication During Game

**User Story:** As a user, I want to see my progress during the test, so that I know how much time remains.

#### Acceptance Criteria

1. WHERE the progress bar feature is implemented, THE Focus_Game SHALL display a progress bar showing elapsed time
2. WHERE the progress bar feature is implemented, THE Focus_Game SHALL update the progress bar every second
3. WHERE the progress bar feature is implemented, THE progress bar SHALL fill from 0% to 100% over the 60-second duration
