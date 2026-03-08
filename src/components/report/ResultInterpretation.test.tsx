import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ResultInterpretation } from './ResultInterpretation';

describe('ResultInterpretation', () => {
  it('renders title', () => {
    render(<ResultInterpretation score={75} />);
    expect(screen.getByText('What This Means')).toBeInTheDocument();
  });

  describe('when score is below 70', () => {
    it('displays negative interpretation text', () => {
      render(<ResultInterpretation score={65} />);
      expect(screen.getByText(/elevated cognitive switching costs and unstable attention patterns/)).toBeInTheDocument();
    });

    it('displays productivity loss message', () => {
      render(<ResultInterpretation score={50} />);
      expect(screen.getByText(/losing 1–2 hours of productive focus daily/)).toBeInTheDocument();
    });

    it('applies orange styling', () => {
      const { container } = render(<ResultInterpretation score={60} />);
      const card = container.querySelector('.bg-orange-50');
      expect(card).toBeInTheDocument();
    });
  });

  describe('when score is 70 or above', () => {
    it('displays positive interpretation text', () => {
      render(<ResultInterpretation score={75} />);
      expect(screen.getByText(/strong focus stability and effective cognitive switching abilities/)).toBeInTheDocument();
    });

    it('displays positive attention control message', () => {
      render(<ResultInterpretation score={85} />);
      expect(screen.getByText(/good attention control and minimal cognitive switching costs/)).toBeInTheDocument();
    });

    it('applies green styling', () => {
      const { container } = render(<ResultInterpretation score={80} />);
      const card = container.querySelector('.bg-green-50');
      expect(card).toBeInTheDocument();
    });
  });

  describe('boundary cases', () => {
    it('shows negative interpretation for score exactly 69', () => {
      render(<ResultInterpretation score={69} />);
      expect(screen.getByText(/elevated cognitive switching costs/)).toBeInTheDocument();
    });

    it('shows positive interpretation for score exactly 70', () => {
      render(<ResultInterpretation score={70} />);
      expect(screen.getByText(/strong focus stability/)).toBeInTheDocument();
    });
  });
});
