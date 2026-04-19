import { Request, Response } from 'express';
import { sql } from '../database';
import { LoginRequest, LoginResponse } from '../types';

interface StreamingService {
    ServiceId: number;
    ServiceName: string;
};

interface StreamingServiceResponse {
    data: StreamingService[];
    error?: string;
}

export const getStreamingServices = async (req: Request, res: Response<StreamingServiceResponse>): Promise<void> => {
    try {
        // Get connection from pool
        const pool = await req.db.getPoolPromise();

        // Login user with proc
        const result = await pool.request()
            .execute('list.ListStreamingServices');

        // Type assertion
        const services = result.recordset as StreamingService[];

        // Return results
        res.json({
            data: services
        });
    } catch (err) {
        console.error('Error fetching streaming services:', err);

        const errorMessage = err instanceof Error
            ? err.message
            : 'Unknown error occurred';

        res.status(500).json({
            data: [],
            error: errorMessage
        })
    }
};