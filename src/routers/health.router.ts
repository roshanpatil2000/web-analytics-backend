import express, { Request, Response } from 'express';
import { healthcheckHandler } from '../controllers/healthCheckupHandler';

const router = express.Router();

// Sample health route
router.get('/', healthcheckHandler);


export default router;