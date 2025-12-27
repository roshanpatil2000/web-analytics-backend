// import express, { Request, Response } from 'express';
// import { errorResponse, successResponse } from "../utils/responseHandler";

// import 'dotenv/config';
// import { drizzle } from 'drizzle-orm/node-postgres';
// import { eq } from 'drizzle-orm';
// import { usersTable } from '../db/schema';

// const db = drizzle(process.env.DATABASE_URL!);

// // Create a new user
// const createUser = async (req: Request, res: Response) => {
//     try {
//         const { name, age, email } = req.body;
//         if (!name || !age || !email) {
//             return errorResponse(res, { message: "Missing required fields" }, 400);
//         }

//         const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email));
//         if (existingUser.length > 0) {
//             return errorResponse(res, { message: "User already exists" }, 400);
//         }

//         const newUser = await db.insert(usersTable).values({ name, age, email }).returning();
//         console.log('New user created!', newUser);
//         return successResponse(res, { message: "User created successfully", user: newUser[0] });
//     } catch (error) {
//         console.error('Error creating user:', error);
//         return errorResponse(res, { message: "Internal Server Error" }, 500);
//     }
// };

// // Get all users
// const getAllUsers = async (_req: Request, res: Response) => {
//     try {
//         const users = await db.select().from(usersTable);
//         console.log('Fetched users:', users);
//         return successResponse(res, { message: "Users fetched successfully", users });
//     } catch (error) {
//         console.error('Error fetching users:', error);
//         return errorResponse(res, { message: "Internal Server Error" }, 500);
//     }
// };

// // Delete all users
// const deleteAllUsers = async (_req: Request, res: Response) => {
//     try {
//         await db.delete(usersTable).returning();
//         return successResponse(res, { message: "All users deleted successfully" });
//     } catch (error) {
//         console.log('Error deleting all users:', error);
//         return errorResponse(res, { message: "Internal Server Error" }, 500);
//     }
// };

// // Delete user by id
// const deleteUserById = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;
//         if (!id) {
//             return errorResponse(res, { message: "User id is required" }, 400);
//         }

//         const deleted = await db.delete(usersTable).where(eq(usersTable.id, id)).returning();
//         if (deleted.length === 0) {
//             return errorResponse(res, { message: "User not found" }, 404);
//         }

//         return successResponse(res, { message: "User deleted successfully", user: deleted[0] });
//     } catch (error) {
//         console.error('Error deleting user:', error);
//         return errorResponse(res, { message: "Internal Server Error" }, 500);
//     }
// };

// export { createUser, getAllUsers, deleteAllUsers, deleteUserById };





// last changes

// import express, { Request, Response } from 'express';
// import { errorResponse, successResponse } from "../utils/responseHandler";

// import 'dotenv/config';
// import { drizzle } from 'drizzle-orm/node-postgres';
// import { eq } from 'drizzle-orm';
// import { usersTable } from '../db/schema';
// import { validate as isUuid } from "uuid";

// const db = drizzle(process.env.DATABASE_URL!);

// // Create a new user
// const Signup = async (req: Request, res: Response) => {
//     try {
//         const { name, email, password } = req.body;
//         if (!name || !email || !password) {
//             return errorResponse(res, { message: "All fields are required!" }, 400)
//         }

//         const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email));
//         if (existingUser.length > 0) {
//             return errorResponse(res, { message: "User already exists" }, 400)
//         }

//         const newUser = await db.insert(usersTable).values({
//             name: name,
//             email: email,
//             password: password,
//             lastLogin: new Date(),
//             isVerified: true,
//             hasPremium: false,
//             authToken: null,
//             resetPasswordToken: null,
//             resetPasswordExpiresAt: null,
//             verificationToken: null,
//             verificationExpiresAt: null,
//             createdAt: new Date(),
//             updatedAt: new Date(),
//         }).returning()
//         return successResponse(res, { newUser }, 201)
//     } catch (error) {
//         console.log("error", error);
//         return errorResponse(res, { message: "Something went wrong!" }, 500)
//     }

// };

// // Login user
// const Login = async (req: Request, res: Response) => {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             return errorResponse(res, { message: "Email and password are required!" }, 400)
//         }

//         const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email));

//         if (existingUser.length === 0) {
//             return errorResponse(res, { message: "User not found!" }, 404)
//         }

//         const user = existingUser[0];

//         if (user.password !== password) {
//             return errorResponse(res, { message: "Invalid credentials!" }, 401)
//         }

//         await db.update(usersTable).set({ lastLogin: new Date() }).where(eq(usersTable.id, user.id)).returning();
//         return successResponse(res, { message: "Login successful!", user }, 200)

//     } catch (error) {
//         console.log("error", error);
//         return errorResponse(res, { message: "Something went wrong!" }, 500)
//     }

// };

// // Get all users
// const getAllUsers = async (_req: Request, res: Response) => {
//     try {
//         const users = await db.select().from(usersTable);
//         console.log('Fetched users:', users);
//         return successResponse(res, { users }, 200)
//     } catch (error) {
//         console.log("error", error);
//         return errorResponse(res, { message: "Something went wrong!" }, 500)
//     }

// };

// // get user by id 
// const getUserById = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;
//         console.log("id--->", id)
//         if (!id) {
//             return errorResponse(res, { message: "user id required!" }, 400)
//         }
//         if (!isUuid(id)) {
//             return errorResponse(res, { message: "invalid user id " }, 404)
//         }


//         const checkUser = await db.select().from(usersTable).where(eq(usersTable.id, id))
//         console.log("checkUser", checkUser)
//         return successResponse(res, { users: checkUser }, 200)
//     } catch (error) {
//         console.log(error);
//         return errorResponse(res, { message: "Something went wrong!" }, 500)
//     }

// }

// // Delete all users
// const deleteAllUsers = async (_req: Request, res: Response) => {
//     try {
//         await db.delete(usersTable).returning()
//         return successResponse(res, { message: "all users deleted successfully!" }, 200)
//     } catch (err) {
//         return errorResponse(res, { message: "something went wrong!" }, 500)
//     }

// };

// // Delete user by id
// const deleteUserById = async (req: Request, res: Response) => {
//     const { id } = req.params;
//     try {
//         if (!isUuid(id)) {
//             return errorResponse(res, { message: "invalid user id" }, 404)
//         }

//         const existingUser = await db.select().from(usersTable).where(eq(usersTable.id, id))

//         if (existingUser.length <= 0) {
//             return errorResponse(res, { message: "user not found" }, 400)
//         }

//         await db.delete(usersTable).where(eq(usersTable.id, id)).returning()
        
//         return successResponse(res, { message: "user deleted successfully!" }, 200)
//     } catch (err) {
//         return errorResponse(res, { message: "something went wrong!" }, 500)
//     }

// };

// export { Signup, Login, getAllUsers, getUserById, deleteAllUsers, deleteUserById };