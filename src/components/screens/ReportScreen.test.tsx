import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReportScreen } from './ReportScreen';
import { GameResults } from '../../types';

// Mock game results for testing
const mockResults: GameResults = {
  focusStabilityScore: 75,
  switchingCost: 150,
  dailyFocusLoss: 1.5,
  totalResponses: 50,
  correctResponses: 40,
  incorrectResponses: 8,
  missedResponses: 2,
  accuracy: 80,
  meanReactionTime: 450,
  medianReactionTime: 420,
  reactionTimeStdDev: 120,
  meanNormalRT: 400,
  meanPostSwitchRT: 550,
  simulatedAvgScore: 70,
  percentile: 65,
};

const lowScoreMockResults: GameResults = {
  ...mockResults,
  focusStabilityScore: 55,
  switchingCost: 250,
  dailyFocusLoss: 2.8,
  simulatedAvgScore: 68,
  percentile: 35,
};

describe('ReportScreen Component', () => {
  describe('Title Rendering', () => {
    it('displays the title "Your Cognitive Snapshot"', () => {
      render(<ReportScreen results={mockResults} onTryAgain={vi.fn()} />);
      
      expect(
        screen.getByRole('heading', { name: 'Your Cognitive Snapshot' })
      ).toBeInTheDocument();
    });

    it('applies correct heading styles', () => {
      render(<ReportScreen results={mockResults} onTryAgain={vi.fn()} />);
      
      const heading = screen.getByRole('heading', { name: 'Your Cognitive Snapshot' });
      expect(heading).toHaveClass('text-3xl', 'md:text-4xl', 'font-bold', 'text-center');
    });
  });

  describe('Score Cards Rendering', () => {
    it('renders Focus Stability Score card', () => {
      render(<ReportScreen results={mockResults} onTryAgain={vi.fn()} />);
      
      expect(screen.getByText('Focus Stability Score')).toBeInTheDocument();
      expect(screen.getByText('Overall cognitive performance')).toBeInTheDocument();
    });

    it('renders Switching Cost card', () => {
      render(<ReportScreen results={mockResults} onTryAgain={vi.fn()} />);
      
      expect(screen.getByText('Switching Cost')).toBeInTheDocument();
      expect(screen.getByText('Time penalty when rules change')).toBeInTheDocument();
    });

    it('renders Daily Focus Loss card', () => {
      render(<ReportScreen results={mockResults} onTryAgain={vi.fn()} />);
      
      expect(screen.getByText('Daily Focus Loss')).toBeInTheDocument();
      expect(screen.getByText('Estimated productivity impact')).toBeInTheDocument();
    });

    it('displays all three score cards', () => {
      render(<ReportScreen results={mockResults} onTryAgain={vi.fn()} />);
      
      const focusCard = screen.getByText('Focus Stability Score');
      const switchingCard = screen.getByText('Switching Cost');
      const focusLossCard = screen.getByText('Daily Focus Loss');
      
      expect(focusCard).toBeInTheDocument();
      expect(switchingCard).toBeInTheDocument();
      expect(focusLossCard).toBeInTheDocument();
    });
  });

  describe('Peer Comparison Section', () => {
    it('renders PeerComparison component', () => {
      render(<ReportScreen results={mockResults} onTryAgain={vi.fn()} />);
      
      expect(screen.getByText('How You Compare')).toBeInTheDocument();
    });

    it('displays user score in peer comparison', () => {
      render(<ReportScreen results={mockResults} onTryAgain={vi.fn()} />);
      
      expect(screen.getByText('Your Score')).toBeInTheDocument();
      expect(screen.getByText('75')).toBeInTheDocument();
    });

    it('displays average score in peer comparison', () => {
      render(<ReportScreen results={mockResults} onTryAgain={vi.fn()} />);
      
      expect(screen.getByText('Average User')).toBeInTheDocument();
      expect(screen.getByText('70')).toBeInTheDocument();
    });

    it('displays percentile in peer comparison', () => {
      render(<ReportScreen results={mockResults} onTryAgain={vi.fn()} />);
      
      expect(screen.getByText('Your Percentile')).toBeInTheDocument();
      expect(screen.getByText('65th')).toBeInTheDocument();
    });
  });

  describe('Result Interpretation Section', () => {
    it('renders ResultInterpretation component', () => {
      render(<ReportScreen results={mockResults} onTryAgain={vi.fn()} />);
      
      expect(screen.getByText('What This Means')).toBeInTheDocument();
    });

    it('displays positive interpretation for high scores', () => {
      render(<ReportScreen results={mockResults} onTryAgain={vi.fn()} />);
      
      expect(
        screen.getByText(/strong focus stability and effective cognitive switching abilities/)
      ).toBeInTheDocument();
    });

    it('displays negative interpretation for low scores', () => {
      render(<ReportScreen results={lowScoreMockResults} onTryAgain={vi.fn()} />);
      
      expect(
        screen.getByText(/elevated cognitive switching costs and unstable attention patterns/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/losing 1–2 hours of productive focus daily/)
      ).toBeInTheDocument();
    });
  });

  describe('Product Section', () => {
    it('renders ProductSection component', () => {
      render(<ReportScreen results={mockResults} onTryAgain={vi.fn()} />);
      
      expect(screen.getByText('How NeuroGym Helps')).toBeInTheDocument();
    });

    it('displays product description', () => {
      render(<ReportScreen results={mockResults} onTryAgain={vi.fn()} />);
      
      expect(
        screen.getByText(/NeuroGym continuously measures cognitive fatigue/)
      ).toBeInTheDocument();
    });

    it('displays all three benefits', () => {
      render(<ReportScreen results={mockResults} onTryAgain={vi.fn()} />);
      
      expect(screen.getByText('Detects attention instability in real time')).toBeInTheDocument();
      expect(screen.getByText('Predicts cognitive fatigue before productivity drops')).toBeInTheDocument();
      expect(screen.getByText('Provides personalized focus training and interventions')).toBeInTheDocument();
    });
  });

  describe('CTA Section', () => {
    it('renders CTASection component', () => {
      render(<ReportScreen results={mockResults} onTryAgain={vi.fn()} />);
      
      expect(screen.getByRole('button', { name: 'Download NeuroGym' })).toBeInTheDocument();
    });

    it('displays download button', () => {
      render(<ReportScreen results={mockResults} onTryAgain={vi.fn()} />);
      
      const downloadButton = screen.getByRole('button', { name: 'Download NeuroGym' });
      expect(downloadButton).toBeInTheDocument();
    });

    it('displays join early access button', () => {
      render(<ReportScreen results={mockResults} onTryAgain={vi.fn()} />);
      
      const joinButton = screen.getByRole('button', { name: 'Join Early Access' });
      expect(joinButton).toBeInTheDocument();
    });
  });

  describe('Try Again Button', () => {
    it('displays "Try Again" button', () => {
      render(<ReportScreen results={mockResults} onTryAgain={vi.fn()} />);
      
      expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
    });

    it('calls onTryAgain when button is clicked', async () => {
      const handleTryAgain = vi.fn();
      const user = userEvent.setup();
      
      render(<ReportScreen results={mockResults} onTryAgain={handleTryAgain} />);
      
      const button = screen.getByRole('button', { name: 'Try Again' });
      await user.click(button);
      
      expect(handleTryAgain).toHaveBeenCalledTimes(1);
    });

    it('calls onTryAgain only once per click', async () => {
      const handleTryAgain = vi.fn();
      const user = userEvent.setup();
      
      render(<ReportScreen results={mockResults} onTryAgain={handleTryAgain} />);
      
      const button = screen.getByRole('button', { name: 'Try Again' });
      await user.click(button);
      
      expect(handleTryAgain).toHaveBeenCalledTimes(1);
    });

    it('handles multiple clicks correctly', async () => {
      const handleTryAgain = vi.fn();
      const user = userEvent.setup();
      
      render(<ReportScreen results={mockResults} onTryAgain={handleTryAgain} />);
      
      const button = screen.getByRole('button', { name: 'Try Again' });
      await user.click(button);
      await user.click(button);
      await user.click(button);
      
      expect(handleTryAgain).toHaveBeenCalledTimes(3);
    });

    it('applies secondary variant styling', () => {
      render(<ReportScreen results={mockResults} onTryAgain={vi.fn()} />);
      
      const button = screen.getByRole('button', { name: 'Try Again' });
      expect(button).toHaveClass('bg-gray-200');
    });
  });

  describe('Layout and Structure', () => {
    it('renders all required sections', () => {
      render(<ReportScreen results={mockResults} onTryAgain={vi.fn()} />);
      
      const title = screen.getByRole('heading', { name: 'Your Cognitive Snapshot' });
      const focusCard = screen.getByText('Focus Stability Score');
      const peerComparison = screen.getByText('How You Compare');
      const interpretation = screen.getByText('What This Means');
      const productSection = screen.getByText('How NeuroGym Helps');
      const tryAgainButton = screen.getByRole('button', { name: 'Try Again' });
      
      expect(title).toBeInTheDocument();
      expect(focusCard).toBeInTheDocument();
      expect(peerComparison).toBeInTheDocument();
      expect(interpretation).toBeInTheDocument();
      expect(productSection).toBeInTheDocument();
      expect(tryAgainButton).toBeInTheDocument();
    });

    it('uses Container component for consistent padding', () => {
      const { container } = render(<ReportScreen results={mockResults} onTryAgain={vi.fn()} />);
      
      const containerDiv = container.querySelector('.max-w-7xl');
      expect(containerDiv).toBeInTheDocument();
    });

    it('applies responsive grid layout for score cards', () => {
      const { container } = render(<ReportScreen results={mockResults} onTryAgain={vi.fn()} />);
      
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-3');
    });

    it('applies proper spacing between sections', () => {
      const { container } = render(<ReportScreen results={mockResults} onTryAgain={vi.fn()} />);
      
      const mainContainer = container.querySelector('.space-y-8');
      expect(mainContainer).toBeInTheDocument();
    });
  });

  describe('Data Display', () => {
    it('passes correct data to score cards', () => {
      render(<ReportScreen results={mockResults} onTryAgain={vi.fn()} />);
      
      // The AnimatedCounter will eventually display these values
      expect(screen.getByText('Focus Stability Score')).toBeInTheDocument();
      expect(screen.getByText('Switching Cost')).toBeInTheDocument();
      expect(screen.getByText('Daily Focus Loss')).toBeInTheDocument();
    });

    it('passes correct data to peer comparison', () => {
      render(<ReportScreen results={mockResults} onTryAgain={vi.fn()} />);
      
      expect(screen.getByText('75')).toBeInTheDocument(); // user score
      expect(screen.getByText('70')).toBeInTheDocument(); // avg score
      expect(screen.getByText('65th')).toBeInTheDocument(); // percentile
    });

    it('passes correct score to result interpretation', () => {
      render(<ReportScreen results={mockResults} onTryAgain={vi.fn()} />);
      
      // Score of 75 should show positive interpretation
      expect(
        screen.getByText(/strong focus stability/)
      ).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<ReportScreen results={mockResults} onTryAgain={vi.fn()} />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Your Cognitive Snapshot');
    });

    it('try again button is keyboard accessible', async () => {
      const handleTryAgain = vi.fn();
      const user = userEvent.setup();
      
      render(<ReportScreen results={mockResults} onTryAgain={handleTryAgain} />);
      
      const button = screen.getByRole('button', { name: 'Try Again' });
      button.focus();
      
      expect(button).toHaveFocus();
      
      await user.keyboard('{Enter}');
      expect(handleTryAgain).toHaveBeenCalledTimes(1);
    });

    it('all buttons are accessible', () => {
      render(<ReportScreen results={mockResults} onTryAgain={vi.fn()} />);
      
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThanOrEqual(3); // Try Again, Download, Join Early Access
      
      buttons.forEach(button => {
        expect(button).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles zero scores correctly', () => {
      const zeroResults: GameResults = {
        ...mockResults,
        focusStabilityScore: 0,
        switchingCost: 0,
        dailyFocusLoss: 0,
      };
      
      const { container } = render(<ReportScreen results={zeroResults} onTryAgain={vi.fn()} />);
      
      expect(screen.getByText('Focus Stability Score')).toBeInTheDocument();
      expect(container).toBeInTheDocument();
    });

    it('handles perfect scores correctly', () => {
      const perfectResults: GameResults = {
        ...mockResults,
        focusStabilityScore: 100,
        switchingCost: 0,
        dailyFocusLoss: 0,
        percentile: 100,
      };
      
      render(<ReportScreen results={perfectResults} onTryAgain={vi.fn()} />);
      
      expect(screen.getByText('Focus Stability Score')).toBeInTheDocument();
      expect(screen.getByText('100th')).toBeInTheDocument();
    });

    it('handles negative switching cost correctly', () => {
      const negativeResults: GameResults = {
        ...mockResults,
        switchingCost: -50,
      };
      
      render(<ReportScreen results={negativeResults} onTryAgain={vi.fn()} />);
      
      expect(screen.getByText('Switching Cost')).toBeInTheDocument();
    });

    it('handles high daily focus loss correctly', () => {
      const highLossResults: GameResults = {
        ...mockResults,
        dailyFocusLoss: 7.8,
      };
      
      render(<ReportScreen results={highLossResults} onTryAgain={vi.fn()} />);
      
      expect(screen.getByText('Daily Focus Loss')).toBeInTheDocument();
    });

    // Error handling tests
    it('handles null results gracefully', () => {
      render(<ReportScreen results={null as any} onTryAgain={vi.fn()} />);
      
      expect(screen.getByText('No Results Available')).toBeInTheDocument();
      expect(screen.getByText(/haven't completed a test yet/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Start Test' })).toBeInTheDocument();
    });

    it('handles undefined results gracefully', () => {
      render(<ReportScreen results={undefined as any} onTryAgain={vi.fn()} />);
      
      expect(screen.getByText('No Results Available')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Start Test' })).toBeInTheDocument();
    });

    it('calls onTryAgain when Start Test button is clicked with null results', async () => {
      const handleTryAgain = vi.fn();
      const user = userEvent.setup();
      
      render(<ReportScreen results={null as any} onTryAgain={handleTryAgain} />);
      
      const button = screen.getByRole('button', { name: 'Start Test' });
      await user.click(button);
      
      expect(handleTryAgain).toHaveBeenCalledTimes(1);
    });
  });

  describe('Responsive Design', () => {
    it('applies responsive text sizing to title', () => {
      render(<ReportScreen results={mockResults} onTryAgain={vi.fn()} />);
      
      const heading = screen.getByRole('heading', { name: 'Your Cognitive Snapshot' });
      expect(heading).toHaveClass('text-3xl', 'md:text-4xl');
    });

    it('applies responsive grid layout', () => {
      const { container } = render(<ReportScreen results={mockResults} onTryAgain={vi.fn()} />);
      
      const grid = container.querySelector('.grid');
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-3');
    });

    it('centers try again button', () => {
      render(<ReportScreen results={mockResults} onTryAgain={vi.fn()} />);
      
      const buttonContainer = screen.getByRole('button', { name: 'Try Again' }).parentElement;
      expect(buttonContainer).toHaveClass('flex', 'justify-center');
    });
  });
});
