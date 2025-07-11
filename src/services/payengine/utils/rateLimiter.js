/**
 * Rate limiter for API requests
 * Implements a token bucket algorithm for rate limiting
 */
export class RateLimiter {
  /**
   * Create a new RateLimiter
   * @param {Object} options - Rate limiter options
   * @param {number} [options.requestsPerSecond=10] - Maximum requests per second
   * @param {number} [options.maxTokens=10] - Maximum number of tokens in the bucket
   */
  constructor({ requestsPerSecond = 10, maxTokens = 10 } = {}) {
    this.tokens = maxTokens;
    this.maxTokens = maxTokens;
    this.requestsPerSecond = requestsPerSecond;
    this.lastRefill = Date.now();
    this.queue = [];
    this.isRefilling = false;
  }

  /**
   * Acquire a token from the rate limiter
   * @returns {Promise<void>} Resolves when a token is available
   */
  acquire() {
    return new Promise(resolve => {
      this.queue.push(resolve);
      this.processQueue();
    });
  }

  /**
   * Process the queue of waiting requests
   * @private
   */
  processQueue() {
    if (this.queue.length === 0) return;

    this.refillTokens();

    // Process as many requests as we have tokens for
    while (this.tokens > 0 && this.queue.length > 0) {
      this.tokens--;
      const resolve = this.queue.shift();
      resolve();
    }

    // Schedule next check if we still have queued requests
    if (this.queue.length > 0) {
      const timeUntilNextToken = 1000 / this.requestsPerSecond;
      setTimeout(() => this.processQueue(), timeUntilNextToken);
    }
  }

  /**
   * Refill tokens based on time elapsed
   * @private
   */
  refillTokens() {
    if (this.isRefilling) return;
    this.isRefilling = true;

    try {
      const now = Date.now();
      const elapsed = now - this.lastRefill;
      
      // Calculate how many tokens to add based on time elapsed
      const tokensToAdd = Math.floor((elapsed * this.requestsPerSecond) / 1000);
      
      if (tokensToAdd > 0) {
        this.tokens = Math.min(this.tokens + tokensToAdd, this.maxTokens);
        this.lastRefill = now;
      }
    } finally {
      this.isRefilling = false;
    }
  }

  /**
   * Update the rate limit
   * @param {number} requestsPerSecond - New requests per second limit
   */
  updateRateLimit(requestsPerSecond) {
    this.requestsPerSecond = requestsPerSecond;
  }

  /**
   * Get the current queue length
   * @returns {number} Number of requests waiting in the queue
   */
  getQueueLength() {
    return this.queue.length;
  }

  /**
   * Clear the queue and reset the rate limiter
   */
  reset() {
    this.tokens = this.maxTokens;
    this.lastRefill = Date.now();
    this.queue = [];
  }
}

export default RateLimiter;
