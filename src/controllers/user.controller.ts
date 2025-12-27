import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { errorResponse, successResponse } from '../utils/responseHandler';
import db from '../db';
import { usersTable } from '../db/schema';
import { SignupBody } from '../utils/types';
import { generateToken } from '../utils/generateToken';
import { generateVerificationToken, generateVerificationTokenNew } from '../utils/generateVerficationtoken';

const sanitizeUser = (u: any) => {
    const { password, ...safe } = u;
    return safe;
};

const Signup = async (req: Request<{}, {}, SignupBody>, res: Response) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return errorResponse(res, { message: "All fields are required!" }, 400)
        }

        // check if user already exists
        const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email));

        if (existingUser.length > 0) {
            return errorResponse(res, { message: "User already exists" }, 409)
        }

        const hashed = await bcrypt.hash(password, 10);
        const verificationToken = generateVerificationToken();

        // Verification token generated - sent to user via email (not logged for security)

        // if user not already exits then create new user 
        const [created] = await db
            .insert(usersTable)
            .values({
                email,
                password: hashed,
                name,
                role: role || 'user',
                verificationToken: verificationToken,
                verificationExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now

            })
            .returning();

        const token = await generateToken({ id: created.id, email: created.email, role: created.role });
        const [addToken] = await db.update(usersTable).set({ authToken: token }).where(eq(usersTable.id, created.id)).returning();

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000,
        });

        console.log('User created:', sanitizeUser(addToken));
        return successResponse(res, { message: "User created successfully", user: sanitizeUser(addToken) }, 201)
    } catch (error) {
        console.error('Signup error:', error);
        return errorResponse(res, { message: "Something went wrong!" }, 500)
    }
};

const Login = (req: Request, res: Response) => { };
const getAllUsers = (req: Request, res: Response) => { };
const getUserById = (req: Request, res: Response) => { };
const deleteAllUsers = (req: Request, res: Response) => { };
const deleteUserById = (req: Request, res: Response) => { };

export { Signup, Login, deleteAllUsers, deleteUserById, getAllUsers, getUserById }