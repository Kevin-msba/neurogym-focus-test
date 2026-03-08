import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProductSection } from './ProductSection';

describe('ProductSection', () => {
  it('renders title', () => {
    render(<ProductSection />);
    expect(screen.getByText('How NeuroGym Helps')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<ProductSection />);
    expect(screen.getByText(/NeuroGym continuously measures cognitive fatigue/)).toBeInTheDocument();
  });

  it('renders all three benefit items', () => {
    render(<ProductSection />);
    expect(screen.getByText('Detects attention instability in real time')).toBeInTheDocument();
    expect(screen.getByText('Predicts cognitive fatigue before productivity drops')).toBeInTheDocument();
    expect(screen.getByText('Provides personalized focus training and interventions')).toBeInTheDocument();
  });

  it('renders checkmark icons for each benefit', () => {
    const { container } = render(<ProductSection />);
    const checkmarks = container.querySelectorAll('svg');
    expect(checkmarks.length).toBe(3);
  });

  it('applies gradient background styling', () => {
    const { container } = render(<ProductSection />);
    const section = container.querySelector('.bg-gradient-to-br');
    expect(section).toBeInTheDocument();
  });
});
