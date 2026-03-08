import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SymbolDisplay } from './SymbolDisplay';
import type { Symbol, ClassificationRule } from '../../types';

describe('SymbolDisplay', () => {
  const mockSymbol: Symbol = {
    value: '5',
    type: 'number',
    displayedAt: Date.now()
  };

  const mockRule: ClassificationRule = {
    numbersKey: 'left',
    lettersKey: 'right'
  };

  it('displays the symbol value in large text', () => {
    render(
      <SymbolDisplay 
        symbol={mockSymbol} 
        rule={mockRule} 
        timeRemaining={30000} 
      />
    );

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('displays the classification rule at the top', () => {
    render(
      <SymbolDisplay 
        symbol={mockSymbol} 
        rule={mockRule} 
        timeRemaining={30000} 
      />
    );

    expect(screen.getByText('Numbers → LEFT, Letters → RIGHT')).toBeInTheDocument();
  });

  it('displays time remaining in seconds', () => {
    render(
      <SymbolDisplay 
        symbol={mockSymbol} 
        rule={mockRule} 
        timeRemaining={45000} 
      />
    );

    expect(screen.getByText('45s')).toBeInTheDocument();
  });

  it('rounds up partial seconds', () => {
    render(
      <SymbolDisplay 
        symbol={mockSymbol} 
        rule={mockRule} 
        timeRemaining={45500} 
      />
    );

    expect(screen.getByText('46s')).toBeInTheDocument();
  });

  it('displays letter symbols correctly', () => {
    const letterSymbol: Symbol = {
      value: 'A',
      type: 'letter',
      displayedAt: Date.now()
    };

    render(
      <SymbolDisplay 
        symbol={letterSymbol} 
        rule={mockRule} 
        timeRemaining={30000} 
      />
    );

    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('displays inverted rule correctly', () => {
    const invertedRule: ClassificationRule = {
      numbersKey: 'right',
      lettersKey: 'left'
    };

    render(
      <SymbolDisplay 
        symbol={mockSymbol} 
        rule={invertedRule} 
        timeRemaining={30000} 
      />
    );

    expect(screen.getByText('Numbers → RIGHT, Letters → LEFT')).toBeInTheDocument();
  });

  it('displays zero seconds when time is almost up', () => {
    render(
      <SymbolDisplay 
        symbol={mockSymbol} 
        rule={mockRule} 
        timeRemaining={100} 
      />
    );

    expect(screen.getByText('1s')).toBeInTheDocument();
  });
});
