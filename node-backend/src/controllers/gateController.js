const db = require('../config/db');
const qrService = require('../services/qrService');

exports.verifyEntry = async (req, res) => {
    const { qr_token, station_code } = req.body;
    try {
        const decoded = qrService.verifyToken(qr_token);
        const bookingRes = await db.query('SELECT * FROM bookings WHERE id = $1 AND booking_status = $2', [decoded.bookingId, 'CONFIRMED']);
        
        if (bookingRes.rows.length === 0) throw new Error("Invalid Ticket");
        
        const booking = bookingRes.rows[0];
        const today = new Date().toISOString().split('T')[0];
        if (booking.journey_date.toISOString().split('T')[0] !== today) {
            throw new Error("Ticket not valid for today's date");
        }

        await db.query('INSERT INTO gate_logs (booking_id, station_code, status) VALUES ($1, $2, $3)', [booking.id, station_code, 'ALLOWED']);
        res.json({ status: 'ALLOWED', message: 'Welcome! Please proceed to the platform.', passenger: booking.passenger_name });
    } catch (err) {
        res.status(401).json({ status: 'DENIED', message: err.message });
    }
};
