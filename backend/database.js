const sql = require('mssql');

// Create config object
const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
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
}

// Create connection pool
const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to database');
        return pool;
    })
    .catch(err => {
        console.error('Failed to connect to the database!', err);
        // Exit on DB conn failure
        process.exit(1);
    });

// Export modules
module.exports = {
    sql,
    poolPromise,
    getConnection: () => poolPromise
}