import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PeerComparison } from './PeerComparison';

describe('PeerComparison', () => {
  it('renders title correctly', () => {
    render(<PeerComparison userScore={85} avgScore={70} percentile={75} />);
    expect(screen.getByText('How You Compare')).toBeInTheDocument();
  });

  it('displays user score', () => {
    render(<PeerComparison userScore={85} avgScore={70} percentile={75} />);
    expect(screen.getByText('Your Score')).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();
  });

  it('displays average score', () => {
    render(<PeerComparison userScore={85} avgScore={70} percentile={75} />);
    expect(screen.getByText('Average User')).toBeInTheDocument();
    expect(screen.getByText('70')).toBeInTheDocument();
  });

  it('displays percentile ranking', () => {
    render(<PeerComparison userScore={85} avgScore={70} percentile={75} />);
    expect(screen.getByText('Your Percentile')).toBeInTheDocument();
    expect(screen.getByText('75th')).toBeInTheDocument();
  });

  it('shows positive message when above average', () => {
    render(<PeerComparison userScore={85} avgScore={70} percentile={75} />);
    expect(screen.getByText('You scored better than 75% of users')).toBeInTheDocument();
  });

  it('shows different message when below average', () => {
    render(<PeerComparison userScore={60} avgScore={70} percentile={35} />);
    expect(screen.getByText('65% of users scored higher')).toBeInTheDocument();
  });

  it('applies green color for above average score', () => {
    const { container } = render(
      <PeerComparison userScore={85} avgScore={70} percentile={75} />
    );
    const percentileValue = screen.getByText('75th');
    expect(percentileValue).toHaveClass('text-green-600');
  });

  it('applies orange color for below average score', () => {
    const { container } = render(
      <PeerComparison userScore={60} avgScore={70} percentile={35} />
    );
    const percentileValue = screen.getByText('35th');
    expect(percentileValue).toHaveClass('text-orange-600');
  });
});
