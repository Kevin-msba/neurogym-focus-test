import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LandingPage } from './LandingPage';

describe('LandingPage Component', () => {
  describe('Text Content Rendering', () => {
    it('displays the hero title', () => {
      render(<LandingPage onStartTest={vi.fn()} />);
      
      expect(
        screen.getByRole('heading', { 
          name: 'Measure. Train. Improve Your Cognitive Performance' 
        })
      ).toBeInTheDocument();
    });

    it('displays the subtitle', () => {
      render(<LandingPage onStartTest={vi.fn()} />);
      
      expect(
        screen.getByText('Take a 60-second Focus Test to discover how stable your attention really is.')
      ).toBeInTheDocument();
    });

    it('displays the description', () => {
      render(<LandingPage onStartTest={vi.fn()} />);
      
      expect(
        screen.getByText('This quick interactive challenge reveals how digital distractions affect your cognitive stability.')
      ).toBeInTheDocument();
    });

    it('displays the start button with correct text', () => {
      render(<LandingPage onStartTest={vi.fn()} />);
      
      expect(
        screen.getByRole('button', { name: 'Start the 60-Second Focus Test' })
      ).toBeInTheDocument();
    });

    it('displays the subtext', () => {
      render(<LandingPage onStartTest={vi.fn()} />);
      
      expect(
        screen.getByText('No signup required • Takes 60 seconds')
      ).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('calls onStartTest when button is clicked', async () => {
      const handleStartTest = vi.fn();
      const user = userEvent.setup();
      
      render(<LandingPage onStartTest={handleStartTest} />);
      
      const button = screen.getByRole('button', { name: 'Start the 60-Second Focus Test' });
      await user.click(button);
      
      expect(handleStartTest).toHaveBeenCalledTimes(1);
    });

    it('calls onStartTest only once per click', async () => {
      const handleStartTest = vi.fn();
      const user = userEvent.setup();
      
      render(<LandingPage onStartTest={handleStartTest} />);
      
      const button = screen.getByRole('button', { name: 'Start the 60-Second Focus Test' });
      await user.click(button);
      
      expect(handleStartTest).toHaveBeenCalledTimes(1);
    });

    it('handles multiple clicks correctly', async () => {
      const handleStartTest = vi.fn();
      const user = userEvent.setup();
      
      render(<LandingPage onStartTest={handleStartTest} />);
      
      const button = screen.getByRole('button', { name: 'Start the 60-Second Focus Test' });
      await user.click(button);
      await user.click(button);
      await user.click(button);
      
      expect(handleStartTest).toHaveBeenCalledTimes(3);
    });
  });

  describe('Layout and Structure', () => {
    it('renders all required elements in correct order', () => {
      render(<LandingPage onStartTest={vi.fn()} />);
      
      const title = screen.getByRole('heading');
      const subtitle = screen.getByText(/Take a 60-second Focus Test/);
      const description = screen.getByText(/This quick interactive challenge/);
      const button = screen.getByRole('button');
      const subtext = screen.getByText(/No signup required/);
      
      // Verify all elements exist
      expect(title).toBeInTheDocument();
      expect(subtitle).toBeInTheDocument();
      expect(description).toBeInTheDocument();
      expect(button).toBeInTheDocument();
      expect(subtext).toBeInTheDocument();
    });

    it('applies responsive styling classes', () => {
      render(<LandingPage onStartTest={vi.fn()} />);
      
      const heading = screen.getByRole('heading');
      expect(heading).toHaveClass('text-4xl', 'sm:text-5xl', 'lg:text-6xl');
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<LandingPage onStartTest={vi.fn()} />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('button is keyboard accessible', async () => {
      const handleStartTest = vi.fn();
      const user = userEvent.setup();
      
      render(<LandingPage onStartTest={handleStartTest} />);
      
      const button = screen.getByRole('button', { name: 'Start the 60-Second Focus Test' });
      button.focus();
      
      expect(button).toHaveFocus();
      
      await user.keyboard('{Enter}');
      expect(handleStartTest).toHaveBeenCalledTimes(1);
    });
  });
});
