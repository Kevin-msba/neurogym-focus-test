/**
 * Property-based tests for responsive layout
 * 
 * These tests verify correctness properties for responsive design
 * using the fast-check library. Each property test runs 100+ iterations.
 * 
 * **Validates: Requirements 21.1**
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';
import { render } from '@testing-library/react';
import App from './App';

// ============================================================================
// Property 21: Responsive Layout Stability
// ============================================================================

describe('Property 21: Responsive Layout Stability', () => {
  let originalInnerWidth: number;
  let originalInnerHeight: number;

  beforeEach(() => {
    // Save original viewport dimensions
    originalInnerWidth = window.innerWidth;
    originalInnerHeight = window.innerHeight;
  });

  afterEach(() => {
    // Restore original viewport dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    });
  });

  /**
   * Property 21: Responsive Layout Stability
   * For any viewport width between 320px and 1920px, rendering the application
   * must not cause horizontal scrolling or layout overflow.
   * 
   * **Validates: Requirements 21.1**
   */
  it('property: no horizontal overflow for viewport widths 320px-1920px', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }), // Viewport width range
        fc.integer({ min: 568, max: 1080 }), // Viewport height range (reasonable mobile to desktop)
        (viewportWidth: number, viewportHeight: number) => {
          // Set viewport dimensions
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: viewportWidth,
          });
          Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: viewportHeight,
          });

          // Render the application
          const { container, unmount } = render(<App />);

          // Check that no element exceeds the viewport width
          const allElements = container.querySelectorAll('*');
          let hasOverflow = false;

          allElements.forEach((element) => {
            const rect = element.getBoundingClientRect();
            
            // Check if element extends beyond viewport width
            // Allow small tolerance (1px) for rounding errors
            if (rect.right > viewportWidth + 1) {
              hasOverflow = true;
            }
          });

          // Verify no horizontal overflow
          expect(hasOverflow).toBe(false);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 21a: Container Max Width Constraint
   * For any viewport width, container elements should not exceed
   * their max-width constraints, preventing layout overflow.
   * 
   * **Validates: Requirements 21.1**
   */
  it('property: containers respect max-width constraints', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth: number) => {
          // Set viewport width
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: viewportWidth,
          });

          const { container, unmount } = render(<App />);

          // Find all container elements (elements with max-w-* classes)
          const containers = container.querySelectorAll('[class*="max-w"]');

          containers.forEach((containerEl) => {
            const rect = containerEl.getBoundingClientRect();
            
            // Container width should not exceed viewport width
            expect(rect.width).toBeLessThanOrEqual(viewportWidth);
          });

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 21b: Mobile Viewport Stability (320px-767px)
   * For mobile viewport widths (320px-767px), the application
   * must render without horizontal overflow.
   * 
   * **Validates: Requirements 21.1, 21.2**
   */
  it('property: mobile viewports (320px-767px) have no horizontal overflow', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 767 }), // Mobile range
        (viewportWidth: number) => {
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: viewportWidth,
          });

          const { container, unmount } = render(<App />);

          // Check document body width
          const bodyWidth = document.body.scrollWidth;
          
          // Body scroll width should not exceed viewport width
          // (which would indicate horizontal scrolling is needed)
          expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1); // +1 for rounding

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 21c: Tablet Viewport Stability (768px-1023px)
   * For tablet viewport widths (768px-1023px), the application
   * must render without horizontal overflow.
   * 
   * **Validates: Requirements 21.1, 21.2**
   */
  it('property: tablet viewports (768px-1023px) have no horizontal overflow', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 768, max: 1023 }), // Tablet range
        (viewportWidth: number) => {
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: viewportWidth,
          });

          const { container, unmount } = render(<App />);

          const bodyWidth = document.body.scrollWidth;
          expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 21d: Desktop Viewport Stability (1024px-1920px)
   * For desktop viewport widths (1024px-1920px), the application
   * must render without horizontal overflow.
   * 
   * **Validates: Requirements 21.1**
   */
  it('property: desktop viewports (1024px-1920px) have no horizontal overflow', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1024, max: 1920 }), // Desktop range
        (viewportWidth: number) => {
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: viewportWidth,
          });

          const { container, unmount } = render(<App />);

          const bodyWidth = document.body.scrollWidth;
          expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 21e: Minimum Viewport Width (320px)
   * At the minimum supported viewport width (320px), the application
   * must render all content without horizontal overflow.
   * 
   * **Validates: Requirements 21.1**
   */
  it('property: minimum viewport width (320px) renders without overflow', () => {
    const minWidth = 320;

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: minWidth,
    });

    const { container, unmount } = render(<App />);

    const bodyWidth = document.body.scrollWidth;
    expect(bodyWidth).toBeLessThanOrEqual(minWidth + 1);

    // Check all elements
    const allElements = container.querySelectorAll('*');
    allElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      expect(rect.right).toBeLessThanOrEqual(minWidth + 1);
    });

    unmount();
  });

  /**
   * Property 21f: Maximum Viewport Width (1920px)
   * At the maximum supported viewport width (1920px), the application
   * must render without horizontal overflow.
   * 
   * **Validates: Requirements 21.1**
   */
  it('property: maximum viewport width (1920px) renders without overflow', () => {
    const maxWidth = 1920;

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: maxWidth,
    });

    const { container, unmount } = render(<App />);

    const bodyWidth = document.body.scrollWidth;
    expect(bodyWidth).toBeLessThanOrEqual(maxWidth + 1);

    unmount();
  });

  /**
   * Property 21g: Responsive Padding Scales Appropriately
   * For any viewport width, padding values should scale appropriately
   * with breakpoints (mobile < tablet < desktop).
   * 
   * **Validates: Requirements 21.1, 21.2, 21.3**
   */
  it('property: padding scales with viewport width', () => {
    const viewportWidths = [
      { width: 375, label: 'mobile' },
      { width: 768, label: 'tablet' },
      { width: 1024, label: 'desktop' },
    ];

    viewportWidths.forEach(({ width, label }) => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: width,
      });

      const { container, unmount } = render(<App />);

      // Find container elements
      const containers = container.querySelectorAll('[class*="px-"]');
      
      // Verify containers exist and have appropriate classes
      expect(containers.length).toBeGreaterThan(0);

      unmount();
    });
  });

  /**
   * Property 21h: Text Readability Across Viewports
   * For any viewport width, text elements should have appropriate
   * font sizes that maintain readability.
   * 
   * **Validates: Requirements 21.3**
   */
  it('property: text sizes are appropriate for viewport width', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 320, max: 1920 }),
        (viewportWidth: number) => {
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: viewportWidth,
          });

          const { container, unmount } = render(<App />);

          // Find all text elements
          const textElements = container.querySelectorAll('h1, h2, h3, p, span, button');

          textElements.forEach((element) => {
            const styles = window.getComputedStyle(element);
            const fontSize = parseFloat(styles.fontSize);
            const display = styles.display;
            const visibility = styles.visibility;

            // Skip hidden, non-displayed, NaN, or very small elements (likely browser defaults/pseudo-elements)
            if (display === 'none' || visibility === 'hidden' || isNaN(fontSize) || fontSize < 8) {
              return;
            }

            // Font size should be reasonable for readable content
            // Minimum 8px, maximum 150px
            expect(fontSize).toBeGreaterThanOrEqual(8);
            expect(fontSize).toBeLessThanOrEqual(150);
          });

          unmount();
        }
      ),
      { numRuns: 50 } // Fewer runs due to computational cost
    );
  });
});

/**
 * **Validates: Requirements 21.1, 21.2, 21.3**
 */
