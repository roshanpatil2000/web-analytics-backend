import { JwtPayload } from 'jsonwebtoken';

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

export interface TokenPayload {
    id: string;
    email: string;
    role?: "user" | "admin";
}

export interface SignupBody {
    name: string;
    email: string;
    password: string;
    role?: 'user' | 'admin';
}