import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ReactionTimeGraph } from './ReactionTimeGraph';

describe('ReactionTimeGraph', () => {
  const mockData = [
    { time: 1000, reactionTime: 500, isPostSwitch: false },
    { time: 2000, reactionTime: 450, isPostSwitch: false },
    { time: 3000, reactionTime: 600, isPostSwitch: true },
    { time: 4000, reactionTime: 550, isPostSwitch: true },
    { time: 5000, reactionTime: 480, isPostSwitch: false },
  ];

  it('renders title', () => {
    render(<ReactionTimeGraph reactionTimeHistory={mockData} />);
    expect(screen.getByText('Reaction Time Over Time')).toBeInTheDocument();
  });

  it('renders canvas element when data is provided', () => {
    const { container } = render(<ReactionTimeGraph reactionTimeHistory={mockData} />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('renders legend with reaction time and rule switch indicators', () => {
    render(<ReactionTimeGraph reactionTimeHistory={mockData} />);
    expect(screen.getByText('Reaction Time')).toBeInTheDocument();
    expect(screen.getByText('Rule Switch')).toBeInTheDocument();
  });

  it('shows message when no data is provided', () => {
    render(<ReactionTimeGraph reactionTimeHistory={[]} />);
    expect(screen.getByText('No reaction time data available')).toBeInTheDocument();
  });

  it('does not render canvas when no data is provided', () => {
    const { container } = render(<ReactionTimeGraph reactionTimeHistory={[]} />);
    const canvas = container.querySelector('canvas');
    expect(canvas).not.toBeInTheDocument();
  });
});
