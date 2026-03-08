import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('renders with 0% progress', () => {
    const { container } = render(<ProgressBar progress={0} />);
    const progressBar = container.querySelector('[style*="width"]');
    expect(progressBar).toHaveStyle({ width: '0%' });
  });

  it('renders with 50% progress', () => {
    const { container } = render(<ProgressBar progress={50} />);
    const progressBar = container.querySelector('[style*="width"]');
    expect(progressBar).toHaveStyle({ width: '50%' });
  });

  it('renders with 100% progress', () => {
    const { container } = render(<ProgressBar progress={100} />);
    const progressBar = container.querySelector('[style*="width"]');
    expect(progressBar).toHaveStyle({ width: '100%' });
  });

  it('clamps progress above 100 to 100%', () => {
    const { container } = render(<ProgressBar progress={150} />);
    const progressBar = container.querySelector('[style*="width"]');
    expect(progressBar).toHaveStyle({ width: '100%' });
  });

  it('clamps negative progress to 0%', () => {
    const { container } = render(<ProgressBar progress={-10} />);
    const progressBar = container.querySelector('[style*="width"]');
    expect(progressBar).toHaveStyle({ width: '0%' });
  });

  it('handles fractional progress values', () => {
    const { container } = render(<ProgressBar progress={33.33} />);
    const progressBar = container.querySelector('[style*="width"]');
    expect(progressBar).toHaveStyle({ width: '33.33%' });
  });

  it('renders the progress bar container', () => {
    const { container } = render(<ProgressBar progress={50} />);
    const outerBar = container.querySelector('.bg-gray-200');
    expect(outerBar).toBeInTheDocument();
  });

  it('renders the progress fill with blue color', () => {
    const { container } = render(<ProgressBar progress={50} />);
    const progressFill = container.querySelector('.bg-blue-500');
    expect(progressFill).toBeInTheDocument();
  });
});
