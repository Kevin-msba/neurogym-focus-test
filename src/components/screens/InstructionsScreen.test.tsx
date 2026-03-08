import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InstructionsScreen } from './InstructionsScreen';

describe('InstructionsScreen Component', () => {
  describe('Text Content Rendering', () => {
    it('displays the title "How the Focus Test Works"', () => {
      render(<InstructionsScreen onStartGame={vi.fn()} />);
      
      expect(
        screen.getByRole('heading', { name: 'How the Focus Test Works' })
      ).toBeInTheDocument();
    });

    it('displays instruction 1: "A symbol (number or letter) will appear every second"', () => {
      render(<InstructionsScreen onStartGame={vi.fn()} />);
      
      expect(
        screen.getByText('A symbol (number or letter) will appear every second')
      ).toBeInTheDocument();
    });

    it('displays instruction 2: "Press LEFT if it is a number"', () => {
      render(<InstructionsScreen onStartGame={vi.fn()} />);
      
      expect(
        screen.getByText('Press LEFT if it is a number')
      ).toBeInTheDocument();
    });

    it('displays instruction 3: "Press RIGHT if it is a letter"', () => {
      render(<InstructionsScreen onStartGame={vi.fn()} />);
      
      expect(
        screen.getByText('Press RIGHT if it is a letter')
      ).toBeInTheDocument();
    });

    it('displays instruction 4: "But occasionally the rule will change"', () => {
      render(<InstructionsScreen onStartGame={vi.fn()} />);
      
      expect(
        screen.getByText('But occasionally the rule will change')
      ).toBeInTheDocument();
    });

    it('displays rule change example', () => {
      render(<InstructionsScreen onStartGame={vi.fn()} />);
      
      expect(
        screen.getByText('Rule Change: Numbers → RIGHT, Letters → LEFT')
      ).toBeInTheDocument();
    });

    it('displays final instruction: "Respond as fast and accurately as possible"', () => {
      render(<InstructionsScreen onStartGame={vi.fn()} />);
      
      expect(
        screen.getByText('Respond as fast and accurately as possible')
      ).toBeInTheDocument();
    });

    it('displays "Start Test" button', () => {
      render(<InstructionsScreen onStartGame={vi.fn()} />);
      
      expect(
        screen.getByRole('button', { name: 'Start Test' })
      ).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('calls onStartGame when button is clicked', async () => {
      const handleStartGame = vi.fn();
      const user = userEvent.setup();
      
      render(<InstructionsScreen onStartGame={handleStartGame} />);
      
      const button = screen.getByRole('button', { name: 'Start Test' });
      await user.click(button);
      
      expect(handleStartGame).toHaveBeenCalledTimes(1);
    });

    it('calls onStartGame only once per click', async () => {
      const handleStartGame = vi.fn();
      const user = userEvent.setup();
      
      render(<InstructionsScreen onStartGame={handleStartGame} />);
      
      const button = screen.getByRole('button', { name: 'Start Test' });
      await user.click(button);
      
      expect(handleStartGame).toHaveBeenCalledTimes(1);
    });

    it('handles multiple clicks correctly', async () => {
      const handleStartGame = vi.fn();
      const user = userEvent.setup();
      
      render(<InstructionsScreen onStartGame={handleStartGame} />);
      
      const button = screen.getByRole('button', { name: 'Start Test' });
      await user.click(button);
      await user.click(button);
      await user.click(button);
      
      expect(handleStartGame).toHaveBeenCalledTimes(3);
    });
  });

  describe('Layout and Structure', () => {
    it('renders all required elements', () => {
      render(<InstructionsScreen onStartGame={vi.fn()} />);
      
      const title = screen.getByRole('heading', { name: 'How the Focus Test Works' });
      const instruction1 = screen.getByText(/A symbol \(number or letter\) will appear every second/);
      const instruction2 = screen.getByText(/Press LEFT if it is a number/);
      const instruction3 = screen.getByText(/Press RIGHT if it is a letter/);
      const instruction4 = screen.getByText(/But occasionally the rule will change/);
      const ruleExample = screen.getByText(/Rule Change: Numbers → RIGHT, Letters → LEFT/);
      const finalInstruction = screen.getByText(/Respond as fast and accurately as possible/);
      const button = screen.getByRole('button', { name: 'Start Test' });
      
      expect(title).toBeInTheDocument();
      expect(instruction1).toBeInTheDocument();
      expect(instruction2).toBeInTheDocument();
      expect(instruction3).toBeInTheDocument();
      expect(instruction4).toBeInTheDocument();
      expect(ruleExample).toBeInTheDocument();
      expect(finalInstruction).toBeInTheDocument();
      expect(button).toBeInTheDocument();
    });

    it('displays instructions in numbered order', () => {
      render(<InstructionsScreen onStartGame={vi.fn()} />);
      
      // Check that numbered badges exist
      const numbers = screen.getAllByText(/^[1-4]$/);
      expect(numbers).toHaveLength(4);
    });

    it('applies responsive styling classes', () => {
      render(<InstructionsScreen onStartGame={vi.fn()} />);
      
      const heading = screen.getByRole('heading', { name: 'How the Focus Test Works' });
      expect(heading).toHaveClass('text-3xl', 'sm:text-4xl', 'lg:text-5xl');
    });
  });

  describe('Accessibility', () => {
    it('has proper heading hierarchy', () => {
      render(<InstructionsScreen onStartGame={vi.fn()} />);
      
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('How the Focus Test Works');
    });

    it('button is keyboard accessible', async () => {
      const handleStartGame = vi.fn();
      const user = userEvent.setup();
      
      render(<InstructionsScreen onStartGame={handleStartGame} />);
      
      const button = screen.getByRole('button', { name: 'Start Test' });
      button.focus();
      
      expect(button).toHaveFocus();
      
      await user.keyboard('{Enter}');
      expect(handleStartGame).toHaveBeenCalledTimes(1);
    });

    it('uses semantic list structure for instructions', () => {
      const { container } = render(<InstructionsScreen onStartGame={vi.fn()} />);
      
      const orderedList = container.querySelector('ol');
      expect(orderedList).toBeInTheDocument();
      
      const listItems = container.querySelectorAll('ol li');
      expect(listItems).toHaveLength(4);
    });
  });

  describe('Visual Design', () => {
    it('applies proper styling to rule change example', () => {
      render(<InstructionsScreen onStartGame={vi.fn()} />);
      
      const ruleExample = screen.getByText('Rule Change: Numbers → RIGHT, Letters → LEFT');
      const parent = ruleExample.parentElement;
      
      expect(parent).toHaveClass('bg-amber-50', 'border-amber-200');
    });

    it('centers content appropriately', () => {
      render(<InstructionsScreen onStartGame={vi.fn()} />);
      
      const heading = screen.getByRole('heading');
      expect(heading).toHaveClass('text-center');
      
      const finalInstruction = screen.getByText('Respond as fast and accurately as possible');
      expect(finalInstruction).toHaveClass('text-center');
    });
  });
});
