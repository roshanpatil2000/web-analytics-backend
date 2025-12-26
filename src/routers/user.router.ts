import express, { Request, Response } from 'express';
import { createUser, deleteAllUsers, deleteUserById, getAllUsers, getUserById } from '../controllers/user.controller';

const router = express.Router();

// user routes
router.post('/', createUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.delete("/", deleteAllUsers);
router.delete("/:id", deleteUserById);




export default router;