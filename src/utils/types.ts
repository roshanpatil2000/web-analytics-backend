export interface SuccessResponseBody {
    success: true;
    message: string;
    data?: Record<string, unknown>;
}

export interface ErrorResponseBody {
    success: false;
    status: number;
    error: Record<string, unknown>;
}