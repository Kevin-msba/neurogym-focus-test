import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock performance.now() for consistent testing
if (typeof global.performance === 'undefined') {
  global.performance = {
    now: () => Date.now(),
  } as Performance;
}
