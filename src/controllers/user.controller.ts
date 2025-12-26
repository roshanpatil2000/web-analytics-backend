import express, { Request, Response } from 'express';
import { errorResponse, successResponse } from "../utils/responseHandler";

import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { usersTable } from '../db/schema';
import { validate as isUuid } from "uuid";

const db = drizzle(process.env.DATABASE_URL!);

// Create a new user
const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, age } = req.body;
        if (!name || !email || !age) {
            return errorResponse(res, { message: "All fileds are required!" }, 400)
        }

        const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email));
        if (existingUser.length > 0) {
            return errorResponse(res, { message: "User already exits" }, 400)
        }

        const newUser = await db.insert(usersTable).values({ name, email, age }).returning()
        return successResponse(res, { newUser }, 201)
    } catch (error) {
        console.log(error);
        return errorResponse(res, { message: "Something went wrong!" }, 500)
    }

};

// Get all users
const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await db.select().from(usersTable);
        console.log('Fetched users:', users);
        return successResponse(res, { users }, 200)
    } catch (error) {
        console.log(error);
        return errorResponse(res, { message: "Something went wrong!" }, 500)
    }

};

// get user by id 
const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        console.log(id)
        if (!id) {
            return errorResponse(res, { message: "user id required!" }, 400)
        }
        if (!isUuid(id)) {
            return errorResponse(res, { message: "invalid user id " }, 404)
        }


        const checkUser = await db.select().from(usersTable).where(eq(usersTable.userId, id))
        console.log("checkUser", checkUser)
        return successResponse(res, { users: checkUser }, 200)
    } catch (error) {
        console.log(error);
        return errorResponse(res, { message: "Something went wrong!" }, 500)
    }

}

// Delete all users
const deleteAllUsers = async (_req: Request, res: Response) => {
    try {
        await db.delete(usersTable).returning()
        return successResponse(res, { message: "all users deleted suceesfully!" }, 200)
    } catch (err) {
        return errorResponse(res, { message: "something went wrong!" }, 500)
    }

};

// Delete user by id
const deleteUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        if (!isUuid(id)) {
            return errorResponse(res, { message: "invalid user id" }, 404)
        }

        const existingUser = await db.select().from(usersTable).where(eq(usersTable.userId, id))

        if (existingUser.length <= 0) {
            return errorResponse(res, { message: "user not found" }, 400)
        }

        await db.delete(usersTable).where(eq(usersTable.userId, id)).returning()
        return successResponse(res, { message: "user deleted suceesfully!" }, 200)
    } catch (err) {
        return errorResponse(res, { message: "something went wrong!" }, 500)
    }

};

export { createUser, getAllUsers, getUserById, deleteAllUsers, deleteUserById };