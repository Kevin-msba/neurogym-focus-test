import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CTASection } from './CTASection';

describe('CTASection', () => {
  it('renders Download NeuroGym button', () => {
    render(<CTASection />);
    expect(screen.getByText('Download NeuroGym')).toBeInTheDocument();
  });

  it('renders Join Early Access button', () => {
    render(<CTASection />);
    expect(screen.getByText('Join Early Access')).toBeInTheDocument();
  });

  it('calls onDownload when Download button is clicked', () => {
    const onDownload = vi.fn();
    render(<CTASection onDownload={onDownload} />);
    
    fireEvent.click(screen.getByText('Download NeuroGym'));
    expect(onDownload).toHaveBeenCalledTimes(1);
  });

  it('shows email input when Join Early Access is clicked', () => {
    render(<CTASection />);
    
    fireEvent.click(screen.getByText('Join Early Access'));
    expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
  });

  it('shows Join Waitlist button after clicking Join Early Access', () => {
    render(<CTASection />);
    
    fireEvent.click(screen.getByText('Join Early Access'));
    expect(screen.getByText('Join Waitlist')).toBeInTheDocument();
  });

  it('calls onJoinWaitlist with email when form is submitted', () => {
    const onJoinWaitlist = vi.fn();
    render(<CTASection onJoinWaitlist={onJoinWaitlist} />);
    
    fireEvent.click(screen.getByText('Join Early Access'));
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    fireEvent.click(screen.getByText('Join Waitlist'));
    
    expect(onJoinWaitlist).toHaveBeenCalledWith('test@example.com');
  });

  it('shows success message after email submission', () => {
    const onJoinWaitlist = vi.fn();
    render(<CTASection onJoinWaitlist={onJoinWaitlist} />);
    
    fireEvent.click(screen.getByText('Join Early Access'));
    
    const emailInput = screen.getByPlaceholderText('Enter your email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    fireEvent.click(screen.getByText('Join Waitlist'));
    
    expect(screen.getByText("Thanks! We'll be in touch soon.")).toBeInTheDocument();
  });

  it('requires email input to be filled', () => {
    render(<CTASection />);
    
    fireEvent.click(screen.getByText('Join Early Access'));
    
    const emailInput = screen.getByPlaceholderText('Enter your email') as HTMLInputElement;
    expect(emailInput.required).toBe(true);
  });
});
