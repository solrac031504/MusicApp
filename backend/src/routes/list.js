const express = require('express');
const {
    getStreamingServices
} = require('../controllers/listControllers.js');

const router = express.Router();

// GET streaming services
router.get('/streamingservices', getStreamingServices);

module.exports = router;