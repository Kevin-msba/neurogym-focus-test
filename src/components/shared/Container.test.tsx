import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Container } from './Container';

describe('Container', () => {
  it('renders children correctly', () => {
    render(
      <Container>
        <div>Test Content</div>
      </Container>
    );
    
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies base responsive padding classes', () => {
    const { container } = render(
      <Container>
        <div>Content</div>
      </Container>
    );
    
    const containerDiv = container.firstChild as HTMLElement;
    expect(containerDiv.className).toContain('px-4');
    expect(containerDiv.className).toContain('py-8');
    expect(containerDiv.className).toContain('sm:px-6');
    expect(containerDiv.className).toContain('sm:py-10');
    expect(containerDiv.className).toContain('md:px-8');
    expect(containerDiv.className).toContain('md:py-12');
    expect(containerDiv.className).toContain('lg:px-16');
    expect(containerDiv.className).toContain('lg:py-16');
  });

  it('applies max-width constraint', () => {
    const { container } = render(
      <Container>
        <div>Content</div>
      </Container>
    );
    
    const containerDiv = container.firstChild as HTMLElement;
    expect(containerDiv.className).toContain('max-w-7xl');
  });

  it('centers content with mx-auto', () => {
    const { container } = render(
      <Container>
        <div>Content</div>
      </Container>
    );
    
    const containerDiv = container.firstChild as HTMLElement;
    expect(containerDiv.className).toContain('mx-auto');
  });

  it('applies full width', () => {
    const { container } = render(
      <Container>
        <div>Content</div>
      </Container>
    );
    
    const containerDiv = container.firstChild as HTMLElement;
    expect(containerDiv.className).toContain('w-full');
  });

  it('merges custom className with base styles', () => {
    const { container } = render(
      <Container className="custom-class">
        <div>Content</div>
      </Container>
    );
    
    const containerDiv = container.firstChild as HTMLElement;
    expect(containerDiv.className).toContain('custom-class');
    expect(containerDiv.className).toContain('px-4');
    expect(containerDiv.className).toContain('max-w-7xl');
  });

  it('renders without custom className', () => {
    const { container } = render(
      <Container>
        <div>Content</div>
      </Container>
    );
    
    const containerDiv = container.firstChild as HTMLElement;
    expect(containerDiv).toBeInTheDocument();
  });
});
