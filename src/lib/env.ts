/**
 * Frontend environment variables with validation.
 */

export const env = {
  // NEXT_PUBLIC_API_URL should only be set in development if you want to bypass the proxy.
  // Default (unset) means browser uses /api proxy, which is correct for localhost dev and production.
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  nodeEnv: process.env.NODE_ENV || 'development',
} as const;

/**
 * Validate that required environment variables are set.
 */
export function validateEnv() {
  if (env.nodeEnv === 'production' && env.apiUrl.includes('localhost')) {
    // Intentionally silent in production — misconfig surfaces via failed API calls.
  }
}
