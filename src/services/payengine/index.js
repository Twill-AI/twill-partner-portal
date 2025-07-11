// Main PayEngine service module
// Provides a clean API for interacting with PayEngine services

import PayEngineClient from './api/client';
import { retry, retryStrategies } from './utils/retry';

// Default configuration
const DEFAULT_CONFIG = {
  baseURL: import.meta.env.VITE_PAYENGINE_BASE_URL || 'https://console.payengine.dev',
  apiKey: import.meta.env.VITE_PAYENGINE_API_KEY,
  timeout: parseInt(import.meta.env.VITE_PAYENGINE_TIMEOUT) || 30000,
  enableCaching: true,
  cacheTTL: 5 * 60 * 1000, // 5 minutes
  requestsPerSecond: 10, // PayEngine rate limit
};

// Create a singleton instance of the PayEngine client
let clientInstance = null;

/**
 * Get the PayEngine client instance
 * @param {Object} [config] - Configuration overrides
 * @returns {PayEngineClient} The PayEngine client instance
 */
function getClient(config = {}) {
  if (!clientInstance) {
    clientInstance = new PayEngineClient({
      ...DEFAULT_CONFIG,
      ...config,
    });
  }
  return clientInstance;
}

/**
 * Merchant API methods
 */
const merchants = {
  /**
   * List merchants with optional filtering and pagination
   * @param {Object} [params] - Query parameters
   * @param {number} [params.limit=100] - Number of items per page
   * @param {number} [params.offset=0] - Pagination offset
   * @param {string} [params.status] - Filter by status
   * @param {string} [params.search] - Search query
   * @param {Object} [options] - Request options
   * @returns {Promise<Array>} List of merchants
   */
  list: async (params = {}, options = {}) => {
    const client = getClient();
    return client.get('merchants', params, {
      useCache: true,
      cacheTTL: 60000, // 1 minute cache for lists
      ...options,
    });
  },

  /**
   * Get a merchant by ID
   * @param {string} merchantId - Merchant ID
   * @param {Object} [options] - Request options
   * @returns {Promise<Object>} Merchant details
   */
  get: async (merchantId, options = {}) => {
    const client = getClient();
    return client.get(`merchants/${merchantId}`, {}, {
      useCache: true,
      ...options,
    });
  },

  /**
   * Create a new merchant
   * @param {Object} merchantData - Merchant data
   * @param {Object} [options] - Request options
   * @returns {Promise<Object>} Created merchant
   */
  create: async (merchantData, options = {}) => {
    const client = getClient();
    return client.post('merchants', merchantData, {
      useCache: false,
      ...options,
    });
  },

  /**
   * Update a merchant
   * @param {string} merchantId - Merchant ID
   * @param {Object} updates - Fields to update
   * @param {Object} [options] - Request options
   * @returns {Promise<Object>} Updated merchant
   */
  update: async (merchantId, updates, options = {}) => {
    const client = getClient();
    return client.patch(`merchants/${merchantId}`, updates, {
      useCache: false,
      ...options,
    });
  },
};

/**
 * Transactions API methods
 */
const transactions = {
  /**
   * List transactions with optional filtering
   * @param {Object} [params] - Query parameters
   * @param {string} [params.merchantId] - Filter by merchant ID
   * @param {string} [params.status] - Filter by status
   * @param {string} [params.type] - Filter by transaction type
   * @param {string} [params.startDate] - Start date (ISO format)
   * @param {string} [params.endDate] - End date (ISO format)
   * @param {number} [params.limit=100] - Number of items per page
   * @param {number} [params.offset=0] - Pagination offset
   * @param {Object} [options] - Request options
   * @returns {Promise<Array>} List of transactions
   */
  list: async (params = {}, options = {}) => {
    const client = getClient();
    return client.get('transactions', params, {
      useCache: true,
      cacheTTL: 30000, // 30 seconds cache for transaction lists
      ...options,
    });
  },

  /**
   * Get a transaction by ID
   * @param {string} transactionId - Transaction ID
   * @param {Object} [options] - Request options
   * @returns {Promise<Object>} Transaction details
   */
  get: async (transactionId, options = {}) => {
    const client = getClient();
    return client.get(`transactions/${transactionId}`, {}, {
      useCache: true,
      ...options,
    });
  },
};

/**
 * Chargebacks API methods
 */
const chargebacks = {
  /**
   * List chargebacks with optional filtering
   * @param {Object} [params] - Query parameters
   * @param {string} [params.merchantId] - Filter by merchant ID
   * @param {string} [params.status] - Filter by status
   * @param {number} [params.limit=50] - Number of items per page
   * @param {number} [params.offset=0] - Pagination offset
   * @param {Object} [options] - Request options
   * @returns {Promise<Array>} List of chargebacks
   */
  list: async (params = {}, options = {}) => {
    const client = getClient();
    return client.get('chargebacks', params, {
      useCache: true,
      cacheTTL: 30000, // 30 seconds cache for chargeback lists
      ...options,
    });
  },
};

/**
 * Balances API methods
 */
const balances = {
  /**
   * Get balances for a merchant
   * @param {string} merchantId - Merchant ID
   * @param {Object} [options] - Request options
   * @returns {Promise<Object>} Balance information
   */
  get: async (merchantId, options = {}) => {
    const client = getClient();
    return client.get(`merchants/${merchantId}/balances`, {}, {
      useCache: true,
      cacheTTL: 60000, // 1 minute cache for balances
      ...options,
    });
  },
};

/**
 * Fee Schedules API methods
 */
const feeSchedules = {
  /**
   * List all fee schedules
   * @param {Object} [options] - Request options
   * @returns {Promise<Array>} List of fee schedules
   */
  list: async (options = {}) => {
    const client = getClient();
    return client.get('fee-schedules', {}, {
      useCache: true,
      cacheTTL: 5 * 60 * 1000, // 5 minutes cache for fee schedules
      ...options,
    });
  },
};

// Export the API methods
export default {
  // Configure the client (can only be called once)
  configure: (config) => {
    if (clientInstance) {
      console.warn('PayEngine client already initialized');
      return;
    }
    getClient(config);
  },

  // API endpoints
  merchants,
  transactions,
  chargebacks,
  balances,
  feeSchedules,

  // Utility methods
  getClient,
  retry,
  retryStrategies,
};

export {
  merchants,
  transactions,
  chargebacks,
  balances,
  feeSchedules,
  retry,
  retryStrategies,
};
