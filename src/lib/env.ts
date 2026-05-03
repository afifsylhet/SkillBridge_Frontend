/**
 * Frontend environment variables with validation.
 */

export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  nodeEnv: process.env.NODE_ENV || 'development',
} as const;

/**
 * Validate that required environment variables are set.
 */
export function validateEnv() {
  if (!env.apiUrl) {
    console.warn('NEXT_PUBLIC_API_URL is not set. Using default: http://localhost:4000/api');
  }

  if (env.nodeEnv === 'production' && env.apiUrl.includes('localhost')) {
    console.warn('Production build with localhost API. Check NEXT_PUBLIC_API_URL.');
  }
}
