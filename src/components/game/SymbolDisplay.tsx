import type { Symbol, ClassificationRule } from '../../types';

interface SymbolDisplayProps {
  symbol: Symbol;
  rule: ClassificationRule;
  timeRemaining: number;
}

export function SymbolDisplay({ symbol, rule, timeRemaining }: SymbolDisplayProps) {
  // Format rule text
  const ruleText = `Numbers → ${rule.numbersKey.toUpperCase()}, Letters → ${rule.lettersKey.toUpperCase()}`;
  
  // Format time remaining in seconds
  const secondsRemaining = Math.ceil(timeRemaining / 1000);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      {/* Rule display at top */}
      <div className="absolute top-4 md:top-8 left-0 right-0 text-center">
        <p className="text-sm md:text-base text-gray-600 font-medium">
          {ruleText}
        </p>
      </div>

      {/* Symbol display in center */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-8xl md:text-9xl font-bold text-gray-900">
          {symbol.value}
        </div>
      </div>

      {/* Timer display at bottom */}
      <div className="absolute bottom-4 md:bottom-8 left-0 right-0 text-center">
        <p className="text-lg md:text-xl text-gray-500 font-medium">
          {secondsRemaining}s
        </p>
      </div>
    </div>
  );
}
