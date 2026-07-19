const express = require('express');
const router = express.Router();
const gateController = require('../controllers/gateController');

router.post('/verify', gateController.verifyEntry);

module.exports = router;
