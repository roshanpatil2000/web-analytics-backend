import express, { Request, Response } from 'express';
import { createUser, getAllUsers } from '../controllers/user.controller';

const router = express.Router();

// user routes
router.post('/', createUser);
router.get("/", getAllUsers);




export default router;