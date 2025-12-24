import { Request, Response } from 'express';
import crypto from 'crypto';
import { sql } from '../database';
import { LoginRequest } from '../types/requests';
import { LoginResponse } from '../types/responses';

// Compute SHA256 hash
function computeSHA256Hash(password: string, salt: string): string {
    const input = password + '|' + salt;
    const utf16Buffer = Buffer.from(input, 'utf16le');
    const hash = crypto.createHash('sha256').update(utf16Buffer).digest('hex');
    return hash;
}

// User login
export const loginUser = async (req: Request<{}, {}, LoginRequest>, res: Response<LoginResponse>): Promise<void> => {
    // Error message. Overwritten after proc execution
    let errorMessage = "An error occurred during login";

    try {
        // Get body params
        const { username, password, originFrom } = req.body;

        // Validate fields
        if (!username || !password) {
            res.status(400).json({
                authenticated: false,
                admin: false,
                error: "Username and password are both required!"
            });
            return;
        }

        // Get salt from environment
        const salt = process.env.PASSWORD_SALT || '';

        const hashPassword = computeSHA256Hash(password, salt);
        const passwordBuffer = Buffer.from(hashPassword, 'hex');

        // Get connection from pool
        const pool = await req.db.getPoolPromise();

        // Login user with proc
        const result = await pool.request()
            .input('pUserName', sql.NVarChar(50), username)
            .input('pPassword', sql.Binary, passwordBuffer)
            .input('pLastLoginOrigin', sql.NVarChar(50), originFrom)
            .output('poAuthenticated', sql.Bit)
            .output('poAuthExpiration', sql.DateTime)
            .output('poIsAdmin', sql.Bit)
            .output('poErrorMessage', sql.NVarChar(255))
            .execute('[user].LoginUser');

        const isAuthenticated = result.output.poAuthenticated as boolean;
        const authExpiration = result.output.poAuthExpiration as Date;
        const isAdmin = result.output.poIsAdmin as boolean;
        errorMessage = result.output.poErrorMessage as string;

        if (!isAuthenticated) {
            res.status(401).json({
                authenticated: isAuthenticated,
                error: errorMessage
            });
            return;
        }

        // Return results
        res.json({
            authenticated: isAuthenticated,
            loginExpiration: authExpiration,
            admin: isAdmin,
            error: errorMessage
        });
    } catch (err) {
        console.error('Error attempting to login user:', err);
        res.status(500).json({
            authenticated: false,
            error: errorMessage
        });
    }
};