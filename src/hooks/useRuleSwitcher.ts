import { useEffect, useRef } from 'react';

export interface UseRuleSwitcherOptions {
  isActive: boolean;
  onRuleSwitch: () => void;
}

/**
 * Custom hook for triggering rule switches at random intervals between 5-8 seconds.
 * Each time a switch occurs, a new random interval is calculated for the next switch.
 * 
 * @param isActive - Whether the rule switcher should be active
 * @param onRuleSwitch - Callback function called when a rule switch occurs
 */
export function useRuleSwitcher({ isActive, onRuleSwitch }: UseRuleSwitcherOptions): void {
  const onRuleSwitchRef = useRef(onRuleSwitch);

  // Keep callback ref up to date
  useEffect(() => {
    onRuleSwitchRef.current = onRuleSwitch;
  }, [onRuleSwitch]);

  useEffect(() => {
    if (!isActive) return;

    let timeoutId: NodeJS.Timeout;

    const scheduleNextSwitch = () => {
      // Random interval between 5000ms (5s) and 8000ms (8s)
      const delay = 5000 + Math.random() * 3000;
      
      timeoutId = setTimeout(() => {
        onRuleSwitchRef.current();
        scheduleNextSwitch();
      }, delay);
    };

    scheduleNextSwitch();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isActive]);
}
