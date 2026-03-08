# NeuroGym Focus Test MVP

A single-page React web application that delivers a 60-second cognitive assessment game measuring focus stability, reaction time, and cognitive switching costs.

## Features

- 60-second interactive cognitive assessment
- Real-time symbol classification with dynamic rule changes
- Comprehensive performance metrics and scoring
- Peer comparison and personalized feedback
- Fully responsive design (mobile and desktop)
- Zero backend dependency - runs entirely in the browser

## Tech Stack

- **React 18+** - Component-based UI with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool and dev server
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing
- **fast-check** - Property-based testing

## Project Structure

```
src/
├── App.tsx                          # Root component with routing
├── components/
│   ├── screens/                     # Screen components
│   ├── game/                        # Game-specific components
│   ├── report/                      # Report screen components
│   └── shared/                      # Reusable components
├── hooks/                           # Custom React hooks
├── utils/                           # Utility functions
├── types/                           # TypeScript type definitions
└── test/                            # Test setup and utilities
```

## Getting Started

### Prerequisites

- Node.js 18+ or compatible runtime
- npm, yarn, or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Lint code

### Testing Strategy

The project uses a dual testing approach:

1. **Unit Tests** - Test specific scenarios and component behavior
2. **Property-Based Tests** - Verify correctness properties across random inputs

All 24 correctness properties from the design document are covered with property-based tests using fast-check.

## Architecture

The application follows a single-page architecture with screen-based navigation:

- **Landing Page** - Hero section and call-to-action
- **Instructions Screen** - Game rules and examples
- **Game Screen** - 60-second cognitive assessment
- **Report Screen** - Results, metrics, and recommendations

State management uses React's built-in hooks (useState, useReducer) without external libraries.

## Performance

- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- All calculations run client-side
- No network requests during gameplay

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

Private - NeuroGym Focus Test MVP

## Spec Reference

This implementation follows the specification in `.kiro/specs/neurogym-focus-test-mvp/`
