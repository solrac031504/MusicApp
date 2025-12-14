const { sql, poolPromise } = require('../database.js');
const crypto = require('crypto');

// Hash helper function
const getSHA256Hash = async (password, salt) => {
    const input = password + '|' + salt;

    const msgBuffer = new TextEncoder().encode(message);

    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return '0x' + hashHex.toUpperCase();
}

// User login
const loginUser = async (req, res) => {
    try {
        // Get body params
        const { username, password, originFrom } = req.body;

        // Validate fields
        if (!username || !password)
        {
            return res.status(400).json({
                error: "Username and password are both required"
            });
        }

        // Get the sale from the environment
        const salt = process.env.PASSWORD_SALT;

        const hashPassword = await getSHA256Hash(password, salt);

        // Get connection from pool
        const pool = await poolPromise;

        // Login the user with the proc
        const result = await pool.request()
            .input('pUserName', sql.NVarChar(50), username)
            .input('pPassword', sql.Binary(32), password)
            .input('pLastOriginFrom', sql.NVarChar(50), originFrom)
            .output('Authenticated', sql.Bit);

        if (!result.output.Authenticated)
        {
            return res.status(401).json({
                authenticated: result.output.Authenticated,
                error: 'Invalid credentials'
            })
        }

        // Return results
        res.json({
            authenticated: result.output.Authenticated
        });
    } catch (err) {
        console.error('Error attempting to login user');
        res.status(500).json({ error: err });
    }
};

module.exports = {
    loginUser
};