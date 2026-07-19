const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.get('/availability', bookingController.checkAvailability);
router.post('/book', bookingController.bookTicket);

module.exports = router;
