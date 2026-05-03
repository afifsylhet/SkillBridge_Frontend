/**
 * API Error class for consistent error handling across the app.
 */

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number = 500
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static fromResponse(response: Response, data: any): ApiError {
    const code = data?.error?.code || `ERROR_${response.status}`;
    const message = data?.error?.message || response.statusText || 'An error occurred';
    return new ApiError(code, message, response.status);
  }

  static unauthorized(): ApiError {
    return new ApiError('UNAUTHORIZED', 'You are not authorized to perform this action', 401);
  }

  static notFound(): ApiError {
    return new ApiError('NOT_FOUND', 'Resource not found', 404);
  }

  static badRequest(message: string): ApiError {
    return new ApiError('BAD_REQUEST', message, 400);
  }

  static serverError(message: string = 'Server error'): ApiError {
    return new ApiError('SERVER_ERROR', message, 500);
  }

  static networkError(message: string = 'Network error'): ApiError {
    return new ApiError('NETWORK_ERROR', message, 0);
  }
}
