// Get the environment variables
require('dotenv').config({ path: '../.env' });

// Server stuff
const express = require('express');
const cors = require('cors');

// Database
const db = require('./database.js');

// Express ap
const app = express();

// Port listening
const PORT = process.env.PORT || 5000;

// Enable cors
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : `http://localhost:${PORT}`,
    credentials: true
}));

// Only parse json
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});

// Make DB accessible to routes
app.use((req, res, next) => {
    req.db = db;
    next();
});

/* ********************************* IMPLEMENT HEALTH CHECK LATER DONT FEEL LIKE IT NOW ********************************* */

// Routes
const listRoutes = require('./routes/list.js');

// Add routes
app.use('/api/list', listRoutes);

// Basic 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error: ', err.stack);
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
});

// Start server if DB connection was successful
db.poolPromise.then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'No environment specified!'}`)
    });
}).catch(err => {
    console.error('Failed to start server due to database connection error');
    process.exit(1);
});

module.exports = app;