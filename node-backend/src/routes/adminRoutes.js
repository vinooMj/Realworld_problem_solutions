const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/recommendations', adminController.getRecommendations);

module.exports = router;
