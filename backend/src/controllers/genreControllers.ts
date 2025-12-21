import { Request, Response } from 'express';
import { sql } from '../database'

interface GenreUpdateRequest {
    genreId: number;
    genreName: string;
    genreDescription: string;
    username: string;
}

interface GenreUpdateResponse {
    genreId?: number;
    genreName?: string;
    genreDescription?: string;
    error?: string;
}

export const updateGenre = async (req: Request<{}, {}, GenreUpdateRequest>, res: Response<GenreUpdateResponse>): Promise<void> => {
    try {
        // Get body params
        const { genreId, genreName, genreDescription, username } = req.body;

        if (genreId === -1) {
            res.status(400).json({
                genreId: genreId,
                genreName: genreName,
                genreDescription: genreDescription,
                error: "You cannot update Unknown genre"
            });
            return;
        }

        // Get connection from pool
        const pool = await req.db.getPoolPromise();

        // Update table
        const result = await pool.request()
            .input('pGenreId', sql.Int, genreId)
            .input('pGenreName', sql.NVarChar(255), genreName)
            .input('pGenreDescription', sql.NVarChar(4000), genreDescription)
            .input('pUsername', sql.NVarChar(255), username)
            .query(`
                UPDATE
                    g
                SETc
                    g.GenreName = @pGenreName
                    ,g.[Description] = @pGenreDescription
                    ,g.ModifiedBy = @pUsername
                    ,g.ModifiedUtc = GETUTCDATE()
                FROM
                    dbo.Genre AS g
                WHERE
                    g.GenreId = @pGenreId
            `);

        // Return results
        res.json({
            genreId: genreId,
            genreName: genreName,
            genreDescription: genreDescription
        })
    } catch (err) {
        console.error('Error updating genre:', err);
        const errorMessage = err instanceof Error
            ? err.message
            : "Unknown error";
        res.status(500).json({
            error: errorMessage
        })
    }
};