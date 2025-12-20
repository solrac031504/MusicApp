import dotenv from 'dotenv';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { Database } from './database';
import { EnvVariables } from './types';

// Load environment variables
const envPath = path.join(__dirname, '..', '..', '.env');

// Set environment variables
const env: Partial<EnvVariables> = {
    PORT: parseInt(process.env.PORT || '5000'),
    NODE_ENV: process.env.NODE_ENV as 'develop' | 'production' | 'test' || 'develop',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000'
};

const app: Express = express();
const PORT = env.PORT || 5000;

// CORS config
app.use(cors({
    origin: env.NODE_ENV === 'production'
        ? env.FRONTEND_URL
        : 'http://localhost:3000',
    credentials: true
}));

// Middleware
app.use(express.json());

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});

// DB middleware
app.use((req: Request, res: Response, next: NextFunction) => {
    req.db = Database.getInstance();
    next();
});

// Extend express request type
declare global {
    namespace Express {
        interface Request {
            db: Database;
        }
    }
}

/* ********************************* IMPLEMENT HEALTH CHECK LATER DONT FEEL LIKE IT NOW ********************************* */

/*
import listRoutes from './routes/list';
import loginRoutes from './routes/login';

app.use('/api/list', listRoutes);
app.use('/api/login', loginRoutes);
*/

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl
    });
});

// Error handling middleware
interface AppError extends Error {
    status?: number;
}

app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
    console.error('Server error: ', err.stack);
    res.status(err.status || 500).json({
        error: env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message,
        ...(env.NODE_ENV !== 'production' && { stack: err.stack })
    });
});

// Start server
async function startServer(): Promise<void> {
    try {
        // Initialize DB connection
        const db = Database.getInstance();
        await db.connect();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Environment: ${env.NODE_ENV || 'No environment specified'}`);
        });
    } catch (err) {
        console.log('Failed to start server due to database connection error:', err);
        process.exit(1);
    }
}

startServer();

export default app;