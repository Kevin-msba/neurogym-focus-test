import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameTimer } from './GameTimer';

describe('GameTimer', () => {
  it('displays time remaining in seconds with one decimal place', () => {
    render(<GameTimer timeRemaining={45000} />);
    expect(screen.getByText('45.0s')).toBeInTheDocument();
  });

  it('displays fractional seconds correctly', () => {
    render(<GameTimer timeRemaining={45500} />);
    expect(screen.getByText('45.5s')).toBeInTheDocument();
  });

  it('displays time with proper decimal precision', () => {
    render(<GameTimer timeRemaining={30123} />);
    expect(screen.getByText('30.1s')).toBeInTheDocument();
  });

  it('displays zero seconds correctly', () => {
    render(<GameTimer timeRemaining={0} />);
    expect(screen.getByText('0.0s')).toBeInTheDocument();
  });

  it('displays full 60 seconds at start', () => {
    render(<GameTimer timeRemaining={60000} />);
    expect(screen.getByText('60.0s')).toBeInTheDocument();
  });

  it('displays milliseconds as fractional seconds', () => {
    render(<GameTimer timeRemaining={1234} />);
    expect(screen.getByText('1.2s')).toBeInTheDocument();
  });

  it('handles very small time values', () => {
    render(<GameTimer timeRemaining={50} />);
    expect(screen.getByText('0.1s')).toBeInTheDocument();
  });
});
