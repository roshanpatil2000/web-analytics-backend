import { Response } from 'express';
import { SuccessResponseBody, ErrorResponseBody } from './types';



const successResponse = (
    res: Response,
    data: Record<string, unknown> = {},
    status: number = 200
): Response => {
    const response: SuccessResponseBody = {
        success: true,
        status,
        data,
    };

    return res.status(status).json(response);
};

const errorResponse = (
    res: Response,
    error: Record<string, unknown> = {},
    status: number = 500
): Response => {
    const response: ErrorResponseBody = {
        success: false,
        error,
        status,
    };

    return res.status(status).json(response);
};

export { successResponse, errorResponse };