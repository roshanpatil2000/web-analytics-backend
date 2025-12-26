import express, { Request, Response } from 'express';
import { errorResponse, successResponse } from "../utils/responseHandler";

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { usersTable } from '../db/schema';

const db = drizzle(process.env.DATABASE_URL!);

// Create a new user
const createUser = async (req: Request, res: Response) => {
    try {
        const { name, age, email } = req.body;
        if (!name || !age || !email) {
            return errorResponse(res, { message: "Missing required fields" }, 400);
        }

        const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email));
        if (existingUser.length > 0) {
            return errorResponse(res, { message: "User already exists" }, 400);
        }

        const newUser = await db.insert(usersTable).values({ name, age, email }).returning();
        console.log('New user created!', newUser);
        return successResponse(res, { message: "User created successfully", user: newUser[0] });
    } catch (error) {
        console.error('Error creating user:', error);
        return errorResponse(res, { message: "Internal Server Error" }, 500);
    }
};

// Get all users
const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await db.select().from(usersTable);
        console.log('Fetched users:', users);
        return successResponse(res, { message: "Users fetched successfully", users });
    } catch (error) {
        console.error('Error fetching users:', error);
        return errorResponse(res, { message: "Internal Server Error" }, 500);
    }
};

// Delete all users
const deleteAllUsers = async (_req: Request, res: Response) => {
    try {
        await db.delete(usersTable).returning();
        return successResponse(res, { message: "All users deleted successfully" });
    } catch (error) {
        console.log('Error deleting all users:', error);
        return errorResponse(res, { message: "Internal Server Error" }, 500);
    }
};

// Delete user by id
const deleteUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return errorResponse(res, { message: "User id is required" }, 400);
        }

        const deleted = await db.delete(usersTable).where(eq(usersTable.userId, id)).returning();
        if (deleted.length === 0) {
            return errorResponse(res, { message: "User not found" }, 404);
        }

        return successResponse(res, { message: "User deleted successfully", user: deleted[0] });
    } catch (error) {
        console.error('Error deleting user:', error);
        return errorResponse(res, { message: "Internal Server Error" }, 500);
    }
};

export { createUser, getAllUsers, deleteAllUsers, deleteUserById };