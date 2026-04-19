import sql, { ConnectionPool, config } from 'mssql';
import dotenv from 'dotenv'
import path from 'path';
import { DatabaseConfig } from './types';

// Env path
const envPath = path.join(__dirname, '..', '..', '.env');

dotenv.config({ path: envPath });

export class Database {
    private static instance: Database;
    private pool!: ConnectionPool;
    private poolPromise!: Promise<ConnectionPool>;

    private constructor() {}

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        
        return Database.instance;
    }

    private getConfig(): config {
        const dbConfig: DatabaseConfig = {
            server: process.env.DB_SERVER!,
            database: process.env.DB_NAME!,
            user: process.env.DB_USER!,
            password: process.env.DB_PASSWORD!,
            options: {
                encrypt: true,
                trustServerCertificate: false,
                enableArithAbort: true
            },
            pool: {
                max: 10,
                min: 0,
                idleTimeoutMillis: 60000
            }
        };

        return dbConfig;
    }

    public async connect(): Promise<ConnectionPool> {
        if (this.pool && this.pool.connected) {
            return this.pool;
        }

        try {
            this.poolPromise = sql.connect(this.getConfig());
            this.pool = await this.poolPromise;
            console.log('Database connected successfully');
            
            return this.pool;
        } catch (err) {
            console.error('Database connection failed', err);
            throw err;
        }
    }

    public getPoolPromise(): Promise<ConnectionPool> {
        if (!this.poolPromise) {
            this.poolPromise = this.connect();
        }

        return this.poolPromise;
    }

    public async disconnect(): Promise<void> {
        try {
            if (this.pool && this.pool.connected) {
                await this.pool.close();
                console.log('Database disconnected');
            }
        } catch (err) {
            console.error('Error disconnecting database:', err);
        }
    }
}

export { sql };