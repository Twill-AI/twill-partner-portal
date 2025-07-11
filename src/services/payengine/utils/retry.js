/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {Object} options - Retry options
 * @param {number} [options.maxRetries=3] - Maximum number of retry attempts
 * @param {number} [options.initialDelay=100] - Initial delay in milliseconds
 * @param {number} [options.maxDelay=10000] - Maximum delay in milliseconds
 * @param {Function} [options.shouldRetry] - Function to determine if a retry should be attempted
 * @returns {Promise<any>} - Result of the function call
 */
export async function retry(fn, { 
  maxRetries = 3, 
  initialDelay = 100, 
  maxDelay = 10000,
  shouldRetry = () => true 
} = {}) {
  let retries = 0;
  let lastError;

  while (retries <= maxRetries) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry if we've reached max retries or shouldRetry returns false
      if (retries >= maxRetries || !shouldRetry(error)) {
        break;
      }

      // Calculate delay with exponential backoff and jitter
      const delay = Math.min(
        initialDelay * Math.pow(2, retries - 1) * (0.8 + 0.4 * Math.random()),
        maxDelay
      );

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
      
      retries++;
    }
  }

  throw lastError;
}

/**
 * Create a retryable function
 * @param {Object} options - Retry options
 * @returns {Function} - A function that will retry when called
 */
retry.create = function(options) {
  return function(fn) {
    return retry(fn, options);
  };
};

// Common retry strategies
export const retryStrategies = {
  // Retry on network errors and 5xx responses
  network: (error) => {
    if (error.name === 'AbortError' || error.status === 408) {
      return true; // Retry on timeouts
    }
    
    // Retry on network errors or 5xx responses
    return error.name === 'TypeError' || 
           (error.status >= 500 && error.status < 600);
  },
  
  // Retry on rate limits (429) and server errors
  rateLimit: (error) => {
    return error.status === 429 || 
           (error.status >= 500 && error.status < 600);
  },
  
  // Always retry (use with caution)
  always: () => true,
  
  // Never retry
  never: () => false
};

export default retry;
