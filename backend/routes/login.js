const express = require('express');
const {
    loginUser
} = require('../controllers/loginControllers.js');

const router = express.Router();

// GET user login auth bool
router.get('/login', loginUser);

module.exports = router;