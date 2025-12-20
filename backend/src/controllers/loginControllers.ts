import { Request, Response } from 'express';
import crypto from 'crypto';
import { sql } from '../database';
import { LoginRequest, LoginResponse } from '../types';

interface LoginProcResult {
    output: {
        poAuthenticated: boolean;
    };
}

// Compute SHA256 hash
function computeSHA256Hash(password: string, salt: string): string {
    const input = password + '|' + salt;
    const utf16Buffer = Buffer.from(input, 'utf16le');
    const hash = crypto.createHash('sha256').update(utf16Buffer).digest('hex');
    return hash;
}

// User login
export const loginUser = async (req: Request<{}, {}, LoginRequest>, res: Response<LoginResponse>): Promise<void> => {
    try {
        // Get body params
        const { username, password, originFrom } = req.body;

        // Validate fields
        if (!username || !password) {
            res.status(400).json({
                authenticated: false,
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
        const request = await pool.request();

        // Add inputs
        request.input('pUserName', sql.NVarChar(50), username);
        request.input('pPassword', sql.Binary, passwordBuffer);
        request.input('pLastLoginOrigin', sql.NVarChar(50), originFrom);
        
        // Capture output
        request.output('poAuthenticated', sql.Bit);

        // Execute sproc
        const result = await request.execute('[user].LoginUser');

        const isAuthenticated = result.output.poAuthenticated as boolean;

        if (!isAuthenticated) {
            res.status(401).json({
                authenticated: false,
                error: 'Invalid credentials'
            });
            return;
        }

        // Return results
        res.json({
            authenticated: true
        });
    } catch (err) {
        console.error('Error attempting to login user:', err);
        res.status(500).json({
            authenticated: false,
            error: 'An error occurred during login'
        });
    }
};