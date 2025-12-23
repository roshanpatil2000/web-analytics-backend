import express, { Request, Response } from 'express';
import { errorResponse, successResponse } from './utils/responseHandler';

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json());

// Sample route
app.get('/', (req: Request, res: Response) => {
    // res.status(200).json({ message: 'Hello, World!' });
    successResponse(res, 'Hello, World!', {});
});

// routes




// Handle 404 - Not Found
app.use((req: Request, res: Response) => {
    // res.status(404).json({ message: 'Route not found' });
    errorResponse(res, { message: 'Route not found' }, 404);
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

