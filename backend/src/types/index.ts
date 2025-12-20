export interface LoginRequest {
    username: string;
    password: string;
    originFrom: string;
}

export interface LoginResponse {
    authenticated: boolean;
    token?: string;
    user?: string;
    error?: string;
}

// DB config
export interface DatabaseConfig {
    server: string;
    database: string;
    user: string;
    password: string;
    options: {
        encrypt: boolean;
        trustServerCertificate: boolean;
        enableArithAbort: boolean;
    };
    pool: {
        max: number;
        min: number;
        idleTimeoutMillis: number;
    };
}

// Environment variables
export interface EnvVariables {
    PORT: number;
    NODE_ENV: 'develop' | 'production' | 'test';
    DB_USER: string;
    DB_PASSWORD: string;
    DB_SERVER: string;
    DB_DATABASE: string;
    PASSWORD_SALT: string;
    FRONTEND_URL: string;
}