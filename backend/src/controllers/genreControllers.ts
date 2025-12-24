import { Request, Response } from 'express';
import { sql } from '../database';

// Import interfaces
import { Genre } from '../types/entities'
import {
    ObjectRequest,
    GenreUpdateRequest
} from '../types/requests';
import {
    GenreResponse
} from '../types/responses';

export const updateGenre = async (req: Request<{}, {}, GenreUpdateRequest>, res: Response<GenreResponse>): Promise<void> => {
    try {
        // Get body params
        const { id, name, description, username } = req.body;

        if (id === -1) {
            res.status(400).json({
                id: id,
                name: name,
                description: description,
                hierarchy: [],
                error: "You cannot update Unknown genre"
            });
            return;
        }

        // Get connection from pool
        const pool = await req.db.getPoolPromise();

        // Update table
        const result = await pool.request()
            .input('pGenreId', sql.Int, id)
            .input('pGenreName', sql.NVarChar(255), name)
            .input('pGenreDescription', sql.NVarChar(4000), description)
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
            id: id,
            name: name,
            description: description,
            hierarchy: []
        })
    } catch (err) {
        console.error('Error updating genre:', err);
        const errorMessage = err instanceof Error
            ? err.message
            : "Unknown error";
        res.status(500).json({
            id: -1,
            name: '',
            description: '',
            hierarchy: [],
            error: errorMessage
        })
    }
};

export const getSingleGenre = async(req: Request<{}, {}, ObjectRequest>, res: Response<GenreResponse>): Promise<void> => {
    try {
        // Get query param
        const { id } = req.query;

        // Get connection from pool
        const pool = await req.db.getPoolPromise();

        // Retrieve info from the DB
        const result = await pool.request()
            .input('pGenreId', sql.Int, id)
            .query(`
                SELECT
                    g.GenreId
                    ,g.GenreName
                    ,g.[Description]
                FROM
                    dbo.Genre AS g
                WHERE
                    g.GenreId = @pGenreId
            `);

        if (result.recordset.length === 0) {
            res.status(400).json({
                id: -1,
                name: '',
                description: '',
                hierarchy: [],
                error: 'No genre exists'
            });

            return;
        }

        const genre: Genre = {
            id: result.recordset[0].GenreId,
            name: result.recordset[0].GenreName,
            description: result.recordset[0].Description,
            hierarchy: []
        };

        res.json({
            id: genre.id,
            name: genre.name,
            description: genre.description,
            hierarchy: genre.hierarchy
        });

    } catch (err) {
        console.error('Error retrieving genre:', err);
        const errorMessage = err instanceof Error
            ? err.message
            : "Unknown error";
        res.status(500).json({
            id: -1,
            name: '',
            description: '',
            hierarchy: [],
            error: errorMessage
        });
    }
};