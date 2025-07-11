import { retry } from '../utils/retry';
import { Cache } from '../utils/cache';
import { RateLimiter } from '../utils/rateLimiter';

/**
 * @typedef {Object} RequestOptions
 * @property {Object} [headers] - Custom headers to include in the request
 * @property {number} [timeout=30000] - Request timeout in milliseconds
 * @property {boolean} [retry=true] - Whether to retry failed requests
 * @property {number} [maxRetries=3] - Maximum number of retry attempts
 * @property {boolean} [useCache=true] - Whether to use caching
 * @property {number} [cacheTTL=300000] - Cache TTL in milliseconds (5 minutes default)
 */

/**
 * PayEngine API Client
 * Handles all API communication with PayEngine services
 */
class PayEngineClient {
  /**
   * Create a new PayEngineClient instance
   * @param {Object} config - Configuration options
   * @param {string} config.apiKey - PayEngine API key
   * @param {string} [config.baseURL='https://console.payengine.dev'] - Base API URL
   * @param {number} [config.timeout=30000] - Default request timeout
   * @param {boolean} [config.enableCaching=true] - Enable request caching
   * @param {number} [config.cacheTTL=300000] - Default cache TTL in ms
   */
  constructor({
    apiKey,
    baseURL = 'https://console.payengine.dev',
    timeout = 30000,
    enableCaching = true,
    cacheTTL = 300000,
  } = {}) {
    if (!apiKey) {
      throw new Error('PayEngine API key is required');
    }

    this.apiKey = apiKey;
    this.baseURL = baseURL.replace(/\/+$/, ''); // Remove trailing slashes
    this.timeout = timeout;
    this.cache = enableCaching ? new Cache({ defaultTTL: cacheTTL }) : null;
    this.rateLimiter = new RateLimiter({
      requestsPerSecond: 10, // Adjust based on PayEngine rate limits
    });

    // Bind methods
    this.request = this.request.bind(this);
    this.get = this.get.bind(this);
    this.post = this.post.bind(this);
    this.put = this.put.bind(this);
    this.patch = this.patch.bind(this);
    this.delete = this.delete.bind(this);
  }

  /**
   * Make an authenticated request to the PayEngine API
   * @param {string} method - HTTP method (GET, POST, etc.)
   * @param {string} endpoint - API endpoint path
   * @param {Object} [params] - Query parameters (for GET) or request body (for POST/PUT/PATCH)
   * @param {RequestOptions} [options] - Request options
   * @returns {Promise<any>} - API response data
   */
  async request(method, endpoint, params = {}, options = {}) {
    const {
      headers = {},
      timeout = this.timeout,
      retry: shouldRetry = true,
      maxRetries = 3,
      useCache = true,
      cacheTTL = this.cache?.defaultTTL,
      ...fetchOptions
    } = options;

    // Normalize endpoint (remove leading/trailing slashes)
    const normalizedEndpoint = endpoint.replace(/^\/+|\/+$/g, '');
    let url = `${this.baseURL}/${normalizedEndpoint}`;

    // Create cache key for GET requests
    const cacheKey = useCache && method.toUpperCase() === 'GET' 
      ? this._createCacheKey(method, normalizedEndpoint, params)
      : null;

    // Check cache for GET requests
    if (cacheKey && this.cache) {
      const cached = this.cache.get(cacheKey);
      if (cached !== undefined) {
        return cached;
      }
    }

    // Prepare request configuration
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${this.apiKey}`,
        'X-API-Version': '1.0',
        'User-Agent': 'Twill-Partner-Hub/1.0.0',
        ...headers,
      },
      ...fetchOptions,
    };

    // Add query parameters for GET requests
    if (method.toUpperCase() === 'GET' && params && Object.keys(params).length > 0) {
      const queryString = new URLSearchParams(
        Object.entries(params)
          .filter(([_, value]) => value !== undefined && value !== null)
          .map(([key, value]) => [key, String(value)])
      ).toString();
      
      if (queryString) {
        url = `${url}?${queryString}`;
      }
    } else if (params && Object.keys(params).length > 0) {
      // Add request body for non-GET requests
      config.body = JSON.stringify(params);
    }

    // Execute request with retry logic
    const executeRequest = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      try {
        const response = await fetch(url, {
          ...config,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const error = new Error(`HTTP error! status: ${response.status}`);
          error.status = response.status;
          error.response = response;
          throw error;
        }

        const data = await response.json();

        // Cache successful responses for GET requests
        if (cacheKey && this.cache) {
          this.cache.set(cacheKey, data, cacheTTL);
        }

        return data;
      } catch (error) {
        clearTimeout(timeoutId);

        // Don't retry on 4xx errors (except 429 Too Many Requests)
        if (error.status >= 400 && error.status < 500 && error.status !== 429) {
          throw error;
        }

        throw error;
      }
    };

    try {
      // Apply rate limiting
      await this.rateLimiter.acquire();
      
      // Execute with retry logic if enabled
      const result = shouldRetry
        ? await retry(executeRequest, { maxRetries })
        : await executeRequest();

      return result;
    } catch (error) {
      console.error(`PayEngine API request failed: ${method} ${endpoint}`, error);
      throw this._formatError(error);
    }
  }

  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint path
   * @param {Object} [params] - Query parameters
   * @param {RequestOptions} [options] - Request options
   * @returns {Promise<any>} - API response data
   */
  get(endpoint, params = {}, options = {}) {
    return this.request('GET', endpoint, params, options);
  }

  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint path
   * @param {Object} [data] - Request body
   * @param {RequestOptions} [options] - Request options
   * @returns {Promise<any>} - API response data
   */
  post(endpoint, data = {}, options = {}) {
    return this.request('POST', endpoint, data, options);
  }

  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint path
   * @param {Object} [data] - Request body
   * @param {RequestOptions} [options] - Request options
   * @returns {Promise<any>} - API response data
   */
  put(endpoint, data = {}, options = {}) {
    return this.request('PUT', endpoint, data, options);
  }

  /**
   * Make a PATCH request
   * @param {string} endpoint - API endpoint path
   * @param {Object} [data] - Request body
   * @param {RequestOptions} [options] - Request options
   * @returns {Promise<any>} - API response data
   */
  patch(endpoint, data = {}, options = {}) {
    return this.request('PATCH', endpoint, data, options);
  }

  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint path
   * @param {RequestOptions} [options] - Request options
   * @returns {Promise<any>} - API response data
   */
  delete(endpoint, options = {}) {
    return this.request('DELETE', endpoint, null, options);
  }

  /**
   * Create a cache key from request parameters
   * @private
   */
  _createCacheKey(method, endpoint, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${JSON.stringify(params[key])}`)
      .join('&');
    
    return `${method}:${endpoint}:${sortedParams}`;
  }

  /**
   * Format error with additional context
   * @private
   */
  async _formatError(error) {
    if (error.response) {
      try {
        const errorData = await error.response.json();
        error.message = errorData.message || error.message;
        error.details = errorData;
      } catch (e) {
        // If we can't parse the error response, use the original error
        console.error('Failed to parse error response:', e);
      }
    }
    
    return error;
  }
}

export default PayEngineClient;
