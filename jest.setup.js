// Add any test setup needed for all test files
import '@testing-library/jest-dom';

// Mock global objects if needed
global.matchMedia = global.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

// Mock any global functions or objects used in tests
// For example, if you're using window.scrollTo in your components
global.scrollTo = jest.fn();
