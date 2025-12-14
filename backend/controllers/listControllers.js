const { sql, poolPromise } = require('../database.js');

// Get the streaming services
const getStreamingServices = async (req, res) => {
    try {
        // Get pool from pool promise
        const pool = await poolPromise;

        // List streaming services with proc
        const result = await pool.request()
            .execute('list.ListStreamingServices');

        // Return results
        res.json({
            data: result.recordset
        });
    } catch (err) {
        console.error('Error fetching streaming services: ', err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getStreamingServices
};