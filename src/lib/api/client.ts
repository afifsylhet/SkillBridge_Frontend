const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export type ApiSuccess<T> = { success: true; data: T };
export type ApiFailure = {
    success: false;
    error: { code: string; message: string; details?: unknown };
};
export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export class ApiError extends Error {
    code: string;
    status: number;
    details?: unknown;
    constructor(code: string, message: string, status: number, details?: unknown) {
        super(message);
        this.name = 'ApiError';
        this.code = code;
        this.status = status;
        this.details = details;
    }
}

export async function apiCall<T>(
    endpoint: string,
    options: RequestInit = {},
): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    let response: Response;
    try {
        response = await fetch(url, {
            ...options,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });
    } catch (err) {
        return {
            success: false,
            error: {
                code: 'NETWORK_ERROR',
                message: err instanceof Error ? err.message : 'Network error',
            },
        };
    }

    let envelope: Partial<ApiSuccess<T>> & Partial<ApiFailure> = {};
    try {
        envelope = (await response.json()) as typeof envelope;
    } catch {
        // Non-JSON response — leave envelope empty
    }

    if (!response.ok || envelope.success !== true) {
        return {
            success: false,
            error: envelope.error ?? {
                code: 'UNKNOWN_ERROR',
                message: `Request failed with status ${response.status}`,
            },
        };
    }

    return { success: true, data: envelope.data as T };
}

export async function apiCallOrThrow<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const res = await apiCall<T>(endpoint, options);
    if (!res.success) {
        throw new ApiError(res.error.code, res.error.message, 0, res.error.details);
    }
    return res.data;
}
