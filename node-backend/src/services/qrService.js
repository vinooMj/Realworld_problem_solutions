const jwt = require('jsonwebtoken');

function generateToken(bookingId, trainId, journeyDate) {
    return jwt.sign(
        { bookingId, trainId, journeyDate },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
}

function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { generateToken, verifyToken };
