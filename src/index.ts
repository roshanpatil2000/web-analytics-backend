import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import { errorResponse, successResponse } from './utils/responseHandler';
import healthRouter from './routers/health.router';
import userRouter from './routers/user.router';
import { errorHandler } from './middlewares/errorHandler';
import { connectDb, disconnectDb } from './db/index';

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
connectDb().catch((error) => {
    console.error('Failed to connect to database on startup:', error);
    process.exit(1);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('Received SIGINT, shutting down gracefully...');
    await disconnectDb();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('Received SIGTERM, shutting down gracefully...');
    await disconnectDb();
    process.exit(0);
});

// middlewares
app.use(express.json());

// Sample route
app.get('/', (req: Request, res: Response) => {
    // res.status(200).json({ message: 'Hello, World!' });
    successResponse(res, {});
});

// routes
app.use('/api/v1/health', healthRouter);
app.use('/api/v1/user', userRouter);


// Handle 404 - Not Found
app.use((req: Request, res: Response) => {
    // res.status(404).json({ message: 'Route not found' });
    errorResponse(res, { message: 'Route not found' }, 404);
});

// Error handling middleware
app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

