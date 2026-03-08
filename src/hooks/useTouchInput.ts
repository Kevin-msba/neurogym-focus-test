import { useEffect } from 'react';

export interface UseTouchInputOptions {
  isActive: boolean;
  onKeyPress: (key: 'left' | 'right') => void;
}

/**
 * Custom hook for handling touch input during the game on mobile devices.
 * Detects touch events on the left or right half of the screen and calls the onKeyPress callback.
 * This provides an alternative input method for mobile users who don't have arrow keys.
 * 
 * @param isActive - Whether the touch listener should be active
 * @param onKeyPress - Callback function triggered when left or right half of screen is touched
 */
export function useTouchInput({ isActive, onKeyPress }: UseTouchInputOptions): void {
  useEffect(() => {
    if (!isActive) return;

    const handleTouchStart = (event: TouchEvent) => {
      // Prevent default touch behaviors (pull-to-refresh, swipe navigation)
      event.preventDefault();
      
      const touch = event.touches[0];
      if (!touch) return;
      
      const screenWidth = window.innerWidth;
      const touchX = touch.clientX;

      // Left half = left, right half = right
      if (touchX < screenWidth / 2) {
        onKeyPress('left');
      } else {
        onKeyPress('right');
      }
    };

    // Use passive: false to allow preventDefault
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, [isActive, onKeyPress]);
}
