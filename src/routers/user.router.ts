import express, { Request, Response } from 'express';
import { Signup, Login, deleteAllUsers, deleteUserById, getAllUsers, getUserById } from '../controllers/user.controller';

const router = express.Router();

// user routes
router.post('/signup', Signup);
// router.post('/login', Login);
// router.get("/", getAllUsers);
// router.get("/:id", getUserById);
// router.delete("/", deleteAllUsers);
// router.delete("/:id", deleteUserById);




export default router;