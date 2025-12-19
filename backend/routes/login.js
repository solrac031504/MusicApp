const express = require('express');
const {
    loginUser
} = require('../controllers/loginControllers.js');

const router = express.Router();

// POST user login auth bool
router.post('/login', loginUser);

module.exports = router;