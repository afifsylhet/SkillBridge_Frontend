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
  if (process.env.NEXT_PUBLIC_API_URL) {
    console.info('NEXT_PUBLIC_API_URL is set to:', process.env.NEXT_PUBLIC_API_URL);
  }

  if (env.nodeEnv === 'production' && env.apiUrl.includes('localhost')) {
    console.warn('Production build with localhost API. Check NEXT_PUBLIC_API_URL.');
  }
}
