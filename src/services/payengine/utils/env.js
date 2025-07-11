/**
 * Environment variable validation for PayEngine
 * Ensures all required environment variables are set
 */

/**
 * Required environment variables for PayEngine
 */
const REQUIRED_ENV_VARS = [
  'VITE_PAYENGINE_API_KEY',
  'VITE_PAYENGINE_BASE_URL'
];

/**
 * Validate environment variables
 * @throws {Error} If any required environment variables are missing
 */
export function validateEnv() {
  const missingVars = REQUIRED_ENV_VARS.filter(
    varName => !import.meta.env[varName] || import.meta.env[varName] === 'demo_token_replace_with_actual'
  );

  if (missingVars.length > 0) {
    const errorMessage = `Missing required PayEngine environment variables: ${missingVars.join(', ')}`;
    console.error('Environment Validation Error:', errorMessage);
    throw new Error(errorMessage);
  }

  // Log environment info (without sensitive data)
  if (import.meta.env.DEV) {
    console.log('PayEngine Environment:', {
      baseURL: import.meta.env.VITE_PAYENGINE_BASE_URL,
      timeout: import.meta.env.VITE_PAYENGINE_TIMEOUT || '30000 (default)',
      environment: import.meta.env.MODE,
    });
  }
}

/**
 * Get PayEngine configuration from environment variables
 * @returns {Object} Configuration object
 */
export function getConfigFromEnv() {
  return {
    baseURL: import.meta.env.VITE_PAYENGINE_BASE_URL || 'https://console.payengine.dev',
    apiKey: import.meta.env.VITE_PAYENGINE_API_KEY,
    timeout: parseInt(import.meta.env.VITE_PAYENGINE_TIMEOUT) || 30000,
    enableCaching: import.meta.env.VITE_PAYENGINE_CACHE !== 'false',
    cacheTTL: parseInt(import.meta.env.VITE_PAYENGINE_CACHE_TTL) || 300000, // 5 minutes
    requestsPerSecond: parseInt(import.meta.env.VITE_PAYENGINE_RATE_LIMIT) || 10,
  };
}

/**
 * Check if the API is running in demo mode
 * @returns {boolean} True if in demo mode
 */
export function isDemoMode() {
  return !import.meta.env.VITE_PAYENGINE_API_KEY || 
         import.meta.env.VITE_PAYENGINE_API_KEY === 'demo_token_replace_with_actual';
}

export default {
  validateEnv,
  getConfigFromEnv,
  isDemoMode,
};
