import { useReducer, useCallback } from 'react'
import { LandingPage } from './components/screens/LandingPage'
import { InstructionsScreen } from './components/screens/InstructionsScreen'
import { GameScreen } from './components/screens/GameScreen'
import { ReportScreen } from './components/screens/ReportScreen'
import type { GameResults, Screen } from './types'

type AppState = {
  currentScreen: Screen;
  gameResults: GameResults | null;
}

type AppAction =
  | { type: 'NAVIGATE_TO_SCREEN'; screen: Screen }
  | { type: 'GAME_COMPLETED'; results: GameResults }
  | { type: 'RESET_APPLICATION' }

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'NAVIGATE_TO_SCREEN':
      return { ...state, currentScreen: action.screen }
    
    case 'GAME_COMPLETED':
      return {
        currentScreen: 'report',
        gameResults: action.results
      }
    
    case 'RESET_APPLICATION':
      return {
        currentScreen: 'instructions',
        gameResults: null
      }
    
    default:
      return state
  }
}

const initialState: AppState = {
  currentScreen: 'landing',
  gameResults: null
}

function App() {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const handleStartTest = useCallback(() => {
    dispatch({ type: 'NAVIGATE_TO_SCREEN', screen: 'instructions' })
  }, [])

  const handleStartGame = useCallback(() => {
    dispatch({ type: 'NAVIGATE_TO_SCREEN', screen: 'game' })
  }, [])

  const handleGameComplete = useCallback((results: GameResults) => {
    dispatch({ type: 'GAME_COMPLETED', results })
  }, [])

  const handleTryAgain = useCallback(() => {
    dispatch({ type: 'RESET_APPLICATION' })
  }, [])

  return (
    <>
      {state.currentScreen === 'landing' && (
        <div className="screen-transition">
          <LandingPage onStartTest={handleStartTest} />
        </div>
      )}
      
      {state.currentScreen === 'instructions' && (
        <div className="screen-transition">
          <InstructionsScreen onStartGame={handleStartGame} />
        </div>
      )}
      
      {state.currentScreen === 'game' && (
        <div className="screen-transition">
          <GameScreen onGameComplete={handleGameComplete} />
        </div>
      )}
      
      {state.currentScreen === 'report' && state.gameResults && (
        <div className="screen-transition">
          <ReportScreen 
            results={state.gameResults}
            onTryAgain={handleTryAgain}
          />
        </div>
      )}
    </>
  )
}

export default App
