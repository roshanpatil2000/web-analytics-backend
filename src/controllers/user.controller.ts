import express, { Request, Response } from 'express';
import { successResponse } from "../utils/responseHandler";

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { usersTable } from '../db/schema';
import { log } from 'console';


const db = drizzle(process.env.DATABASE_URL!);

const createUser = async (req: Request, res: Response) => {
    const user: typeof usersTable.$inferInsert = {
        name: 'Roshan Patil',
        age: 27,
        email: 'roshan-2@example.com',
    };
    const newUser = await db.insert(usersTable).values(user).returning();
    console.log('New user created!', newUser);

    successResponse(res, { message: "User created successfully", user: newUser[0] })
}


const getAllUsers = async (req: Request, res: Response) => {
    const users = await db.select().from(usersTable);
    log('Fetched users:', users);
    successResponse(res, { message: "User Fetched successfully", users })

}

export { createUser, getAllUsers };