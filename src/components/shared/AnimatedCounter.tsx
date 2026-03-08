import { useEffect, useState } from 'react';

export interface AnimatedCounterProps {
  targetValue: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({ 
  targetValue, 
  duration = 2000,
  suffix = '',
  className = ''
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    setDisplayValue(0);
    
    let animationFrameId: number | undefined;
    let intervalId: NodeJS.Timeout | undefined;
    let startTime: number | undefined;
    
    // Check if we're in a test environment
    const isTestEnv = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
    
    if (isTestEnv) {
      // In test environment, use setInterval with real time
      const frameRate = 16; // ~60fps
      const totalFrames = Math.ceil(duration / frameRate);
      let currentFrame = 0;
      
      intervalId = setInterval(() => {
        currentFrame++;
        const progress = Math.min(currentFrame / totalFrames, 1);
        
        // Ease-out cubic for smooth deceleration
        const eased = 1 - Math.pow(1 - progress, 3);
        
        // Always animate from 0 to targetValue
        const current = targetValue * eased;
        
        setDisplayValue(current);
        
        if (progress >= 1) {
          setDisplayValue(targetValue);
          if (intervalId) clearInterval(intervalId);
        }
      }, frameRate);
    } else {
      // Use RAF for production (smooth animation)
      const animate = (currentTime: number) => {
        // Initialize startTime on first frame
        if (startTime === undefined) {
          startTime = currentTime;
        }
        
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease-out cubic for smooth deceleration
        const eased = 1 - Math.pow(1 - progress, 3);
        
        // Animate from 0 to targetValue
        const current = targetValue * eased;
        
        setDisplayValue(current);
        
        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          setDisplayValue(targetValue);
        }
      };
      
      animationFrameId = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationFrameId !== undefined) {
        cancelAnimationFrame(animationFrameId);
      }
      if (intervalId !== undefined) {
        clearInterval(intervalId);
      }
    };
  }, [targetValue, duration]);
  
  // Format the display value based on the target value's precision
  const formatValue = (value: number): string => {
    // If target value has decimal places, preserve one decimal place
    if (targetValue % 1 !== 0) {
      return value.toFixed(1);
    }
    // Otherwise, round to integer
    return Math.round(value).toString();
  };
  
  return (
    <span className={className}>
      {formatValue(displayValue)}{suffix}
    </span>
  );
}
