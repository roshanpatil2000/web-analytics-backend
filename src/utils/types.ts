export interface SuccessResponseBody {
    success: true;
    // message: string;
    data?: Record<string, unknown>;
    status: number;
}

export interface ErrorResponseBody {
    success: false;
    status: number;
    error: Record<string, unknown>;
}