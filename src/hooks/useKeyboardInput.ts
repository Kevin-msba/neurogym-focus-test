import { useEffect } from 'react';

export interface UseKeyboardInputOptions {
  isActive: boolean;
  onKeyPress: (key: 'left' | 'right') => void;
}

/**
 * Custom hook for handling keyboard input during the game.
 * Listens for ArrowLeft and ArrowRight key presses and calls the onKeyPress callback.
 * Prevents default browser behavior for arrow keys to avoid scrolling.
 * 
 * @param isActive - Whether the keyboard listener should be active
 * @param onKeyPress - Callback function triggered when left or right arrow key is pressed
 */
export function useKeyboardInput({ isActive, onKeyPress }: UseKeyboardInputOptions): void {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onKeyPress('left');
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        onKeyPress('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, onKeyPress]);
}
