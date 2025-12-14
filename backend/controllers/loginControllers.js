const { sql, poolPromise } = require('../database.js');
const crypto = require('crypto');

// Compute SHA256 hash
function computeSHA256Hash(password, salt)
{
    const input = password + '|' + salt;

    // Convert to UTF-16LE buffer
    const utf16Buffer = Buffer.from(input, 'utf16le');

    // Hash
    const hash = crypto.createHash('sha256').update(utf16Buffer).digest('hex');

    return hash;
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

        // Get the salt from the environment
        const salt = process.env.PASSWORD_SALT;

        const hashPassword = computeSHA256Hash(password, salt);

        // Convert to buffer BINARY(32)
        const passwordBuffer = Buffer.from(hashPassword, 'hex');

        // Get connection from pool
        const pool = await poolPromise;

        // Login the user with the proc
        const result = await pool.request()
            .input('pUserName', sql.NVarChar(50), username)
            .input('pPassword', sql.Binary(32), passwordBuffer)
            .input('pLastLoginOrigin', sql.NVarChar(50), originFrom)
            .output('poAuthenticated', sql.Bit)
            .execute('[user].LoginUser');

        if (!result.output.poAuthenticated)
        {
            return res.status(401).json({
                authenticated: result.output.poAuthenticated,
                error: 'Invalid credentials'
            })
        }

        // Return results
        res.json({
            authenticated: result.output.poAuthenticated
        });
    } catch (err) {
        console.error('Error attempting to login user:', err);
        res.status(500).json({ error: 'An error occurred during login' });
    }
};

module.exports = {
    loginUser
};