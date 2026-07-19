const db = require('../config/db');
const inventoryService = require('../services/inventoryService');
const qrService = require('../services/qrService');

exports.checkAvailability = async (req, res) => {
    try {
        const { trainId, boarding, destination, date } = req.query;
        const availability = await inventoryService.getAvailableSeats(trainId, boarding, destination, date);
        res.json(availability);
    } catch (error) { res.status(400).json({ error: error.message }); }
};

exports.bookTicket = async (req, res) => {
    try {
        const { trainId, boarding, destination, passengerName, journeyDate } = req.body;
        const assignedSeat = await inventoryService.findSpecificAvailableSeat(trainId, boarding, destination, journeyDate);
        if (!assignedSeat) return res.status(400).json({ message: "No seats available." });

        const qr_token = qrService.generateToken(null, trainId, journeyDate); 
        
        const insertRes = await db.query(
            `INSERT INTO bookings (train_id, passenger_name, boarding_station, dropping_station, seat_number, journey_date, qr_token) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [trainId, passengerName, boarding, destination, assignedSeat, journeyDate, qr_token]
        );
        
        const newBooking = insertRes.rows[0];
        const finalToken = qrService.generateToken(newBooking.id, trainId, journeyDate);
        await db.query('UPDATE bookings SET qr_token = $1 WHERE id = $2', [finalToken, newBooking.id]);

        res.json({ message: "Ticket Booked!", seatNumber: assignedSeat, qr_token: finalToken, booking: newBooking });
    } catch (error) { res.status(500).json({ error: error.message }); }
};
