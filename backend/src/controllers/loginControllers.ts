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

}