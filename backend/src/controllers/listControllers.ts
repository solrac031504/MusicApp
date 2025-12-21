import { Request, Response } from 'express';

// All list data pretty much comes in like this
interface ListData {
    Id: number;
    Name: string;
};

interface ListResponse {
    data: ListData[];
    error?: string;
}

export const getStreamingServices = async (req: Request, res: Response<ListResponse>): Promise<void> => {
    try {
        // Get connection from pool
        const pool = await req.db.getPoolPromise();

        const result = await pool.request()
            .execute('list.ListStreamingServices');

        // Type assertion
        const services = result.recordset as ListData[];

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
        });
    }
};

export const getGenres = async (req: Request, res: Response<ListResponse>): Promise<void> => {
    try {
        // Get connection from pool
        const pool = await req.db.getPoolPromise();

        const result = await pool.request()
            .execute('list.ListGenres');

        // Type assertion
        const services = result.recordset as ListData[];

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
        });
    }
};