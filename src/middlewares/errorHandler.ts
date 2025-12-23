import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/responseHandler';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);

    // In production, don't send stack trace
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const errorDetails = isDevelopment ? { message: err.message, stack: err.stack } : { message: 'Internal Server Error' };

    errorResponse(res, errorDetails, 500);
};