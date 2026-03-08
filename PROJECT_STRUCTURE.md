# Project Structure

This document describes the directory structure and organization of the NeuroGym Focus Test MVP.

## Root Directory

```
neurogym-focus-test-mvp/
├── .kiro/                          # Kiro spec files
│   └── specs/
│       └── neurogym-focus-test-mvp/
│           ├── requirements.md     # Feature requirements
│           ├── design.md           # Design document
│           └── tasks.md            # Implementation tasks
├── src/                            # Source code
├── index.html                      # HTML entry point
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite build configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
├── .eslintrc.cjs                   # ESLint configuration
├── .gitignore                      # Git ignore rules
└── README.md                       # Project documentation
```

## Source Directory (`src/`)

```
src/
├── main.tsx                        # Application entry point
├── App.tsx                         # Root component
├── App.test.tsx                    # App component tests
├── index.css                       # Global styles with Tailwind
│
├── components/                     # React components
│   ├── screens/                    # Full-screen components
│   │   ├── LandingPage.tsx         # Hero/landing screen
│   │   ├── InstructionsScreen.tsx  # Game instructions
│   │   ├── GameScreen.tsx          # Main game interface
│   │   └── ReportScreen.tsx        # Results and report
│   │
│   ├── game/                       # Game-specific components
│   │   ├── SymbolDisplay.tsx       # Symbol display component
│   │   ├── GameTimer.tsx           # Timer display
│   │   └── ProgressBar.tsx         # Progress indicator (optional)
│   │
│   ├── report/                     # Report screen components
│   │   ├── ScoreCard.tsx           # Individual metric card
│   │   ├── AnimatedCounter.tsx     # Animated number counter
│   │   ├── PeerComparison.tsx      # Peer comparison chart
│   │   ├── ResultInterpretation.tsx # Score interpretation
│   │   ├── ReactionTimeGraph.tsx   # RT graph (optional)
│   │   ├── ProductSection.tsx      # NeuroGym product info
│   │   └── CTASection.tsx          # Call-to-action buttons
│   │
│   └── shared/                     # Reusable components
│       ├── Button.tsx              # Button component
│       └── Container.tsx           # Layout container
│
├── hooks/                          # Custom React hooks
│   ├── useGameTimer.ts             # 60-second countdown timer
│   ├── useSymbolGenerator.ts       # Symbol generation logic
│   ├── useRuleSwitcher.ts          # Rule switching logic
│   ├── useKeyboardInput.ts         # Keyboard event handling
│   └── useTouchInput.ts            # Touch input for mobile
│
├── utils/                          # Utility functions
│   ├── scoreCalculator.ts          # Score calculation algorithms
│   ├── symbolGenerator.ts          # Symbol generation utility
│   └── formatters.ts               # Display formatting utilities
│
├── types/                          # TypeScript type definitions
│   ├── index.ts                    # All type exports
│   └── index.test.ts               # Type definition tests
│
└── test/                           # Test configuration
    └── setup.ts                    # Vitest setup file
```

## Component Hierarchy

```
App
├── LandingPage
│   ├── Container
│   └── Button
│
├── InstructionsScreen
│   ├── Container
│   └── Button
│
├── GameScreen
│   ├── SymbolDisplay
│   ├── GameTimer
│   └── ProgressBar (optional)
│
└── ReportScreen
    ├── Container
    ├── ScoreCard (x3)
    │   └── AnimatedCounter
    ├── PeerComparison
    ├── ResultInterpretation
    ├── ReactionTimeGraph (optional)
    ├── ProductSection
    └── CTASection
        └── Button (x2)
```

## File Naming Conventions

- **Components**: PascalCase (e.g., `LandingPage.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useGameTimer.ts`)
- **Utils**: camelCase (e.g., `scoreCalculator.ts`)
- **Types**: camelCase (e.g., `index.ts`)
- **Tests**: Same as source file with `.test.ts(x)` suffix

## Import Organization

Imports should be organized in the following order:

1. React and React-related imports
2. Third-party library imports
3. Internal component imports
4. Internal hook imports
5. Internal utility imports
6. Type imports
7. Style imports

Example:
```typescript
import { useState, useEffect } from 'react';
import { someLibrary } from 'some-library';
import Button from '../shared/Button';
import { useGameTimer } from '../../hooks/useGameTimer';
import { calculateScore } from '../../utils/scoreCalculator';
import type { GameResults } from '../../types';
import './styles.css';
```

## Testing Structure

- Unit tests are co-located with source files (`.test.ts(x)`)
- Property-based tests use fast-check library
- Test setup is in `src/test/setup.ts`
- All tests run with Vitest

## Build Output

```
dist/
├── index.html                      # Processed HTML
├── assets/                         # Bundled JS and CSS
│   ├── index-[hash].js
│   └── index-[hash].css
└── vite.svg                        # Favicon
```

## Configuration Files

- **tsconfig.json**: TypeScript compiler options
- **tsconfig.node.json**: TypeScript config for build tools
- **vite.config.ts**: Vite bundler and test configuration
- **tailwind.config.js**: Tailwind CSS customization
- **postcss.config.js**: PostCSS plugins (Tailwind + Autoprefixer)
- **.eslintrc.cjs**: ESLint rules for code quality

## Development Workflow

1. **Development**: `npm run dev` - Start Vite dev server
2. **Testing**: `npm test` - Run all tests once
3. **Watch Mode**: `npm run test:watch` - Run tests in watch mode
4. **Linting**: `npm run lint` - Check code quality
5. **Build**: `npm run build` - Create production build
6. **Preview**: `npm run preview` - Preview production build locally

## Notes

- All paths are relative to the workspace root
- The project uses ES modules (type: "module" in package.json)
- TypeScript strict mode is enabled
- Tailwind CSS uses JIT (Just-In-Time) mode
- No backend or API calls - fully client-side application
