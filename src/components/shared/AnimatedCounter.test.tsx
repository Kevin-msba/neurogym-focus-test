import { render, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AnimatedCounter } from './AnimatedCounter';

describe('AnimatedCounter', () => {
  it('renders with initial value of 0', () => {
    const { container } = render(<AnimatedCounter targetValue={100} />);
    const text = container.textContent;
    expect(text).toBe('0');
  });

  it('animates to target value', async () => {
    const { container } = render(<AnimatedCounter targetValue={100} duration={500} />);
    
    // Wait for animation to complete
    await waitFor(() => {
      const text = container.textContent;
      expect(text).toBe('100');
    }, { timeout: 1000 });
  });

  it('displays suffix when provided', async () => {
    const { container } = render(
      <AnimatedCounter targetValue={75} duration={500} suffix=" / 100" />
    );
    
    await waitFor(() => {
      const text = container.textContent;
      expect(text).toBe('75 / 100');
    }, { timeout: 1000 });
  });

  it('applies custom className', () => {
    const { container } = render(
      <AnimatedCounter targetValue={50} className="text-blue-600 font-bold" />
    );
    
    const span = container.querySelector('span');
    expect(span).toHaveClass('text-blue-600', 'font-bold');
  });

  it('handles zero target value', async () => {
    const { container } = render(<AnimatedCounter targetValue={0} duration={500} />);
    
    await waitFor(() => {
      const text = container.textContent;
      expect(text).toBe('0');
    }, { timeout: 1000 });
  });

  it('handles negative target value', async () => {
    const { container } = render(<AnimatedCounter targetValue={-50} duration={500} />);
    
    await waitFor(() => {
      const text = container.textContent;
      expect(text).toBe('-50');
    }, { timeout: 1000 });
  });

  it('animates through intermediate values', async () => {
    const { container } = render(<AnimatedCounter targetValue={100} duration={500} />);
    
    // Check that we see an intermediate value
    await waitFor(() => {
      const text = container.textContent || '';
      const value = parseInt(text);
      expect(value).toBeGreaterThan(0);
      expect(value).toBeLessThan(100);
    }, { timeout: 300 });
    
    // Then check final value
    await waitFor(() => {
      const text = container.textContent;
      expect(text).toBe('100');
    }, { timeout: 1000 });
  });

  it('uses ease-out cubic easing', async () => {
    const { container } = render(<AnimatedCounter targetValue={100} duration={1000} />);
    
    // With ease-out cubic, the animation should progress faster at the beginning
    // After 250ms (25% of duration), we should be more than 25% complete
    await new Promise(resolve => setTimeout(resolve, 250));
    const text = container.textContent || '';
    const value = parseInt(text);
    
    // With ease-out cubic, at 25% time we should be at ~58% progress
    // So we expect value to be greater than 25 (linear) but less than 100
    expect(value).toBeGreaterThan(25);
    expect(value).toBeLessThan(100);
  });
});
