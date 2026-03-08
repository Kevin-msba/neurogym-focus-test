import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ScoreCard } from './ScoreCard';

describe('ScoreCard', () => {
  it('renders label correctly', () => {
    render(<ScoreCard label="Focus Stability" value={85} suffix=" / 100" />);
    expect(screen.getByText('Focus Stability')).toBeInTheDocument();
  });

  it('renders value with AnimatedCounter', () => {
    render(<ScoreCard label="Switching Cost" value={120} suffix=" ms" />);
    // AnimatedCounter will eventually show the target value
    expect(screen.getByText(/ms/)).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <ScoreCard 
        label="Daily Focus Loss" 
        value={2.5} 
        suffix=" hours" 
        description="Estimated time lost per day"
      />
    );
    expect(screen.getByText('Estimated time lost per day')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    const { container } = render(
      <ScoreCard label="Score" value={75} suffix=" / 100" />
    );
    const description = container.querySelector('.text-xs.text-gray-500');
    expect(description).not.toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    const { container } = render(
      <ScoreCard label="Test" value={50} suffix="" />
    );
    const card = container.querySelector('.bg-white.rounded-lg.shadow-md');
    expect(card).toBeInTheDocument();
  });
});
