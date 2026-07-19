const db = require('../config/db');
const aiClient = require('./aiClient');

async function getAvailableSeats(trainId, boarding, destination, journeyDate) {
    const trainRes = await db.query('SELECT route, base_capacity FROM trains WHERE id = $1', [trainId]);
    if (trainRes.rows.length === 0) throw new Error("Train not found");
    
    const route = trainRes.rows[0].route;
    const totalCapacity = trainRes.rows[0].base_capacity;
    
    const aiBuffer = await aiClient.getPredictedBuffer(trainId, boarding, destination);
    const totalAllowed = totalCapacity + aiBuffer;

    const boardIndex = route.indexOf(boarding);
    const destIndex = route.indexOf(destination);
    if (boardIndex === -1 || destIndex === -1) throw new Error("Invalid stations");

    const bookingsRes = await db.query(
        'SELECT boarding_station, dropping_station FROM bookings WHERE train_id = $1 AND journey_date = $2 AND booking_status = $3',
        [trainId, journeyDate, 'CONFIRMED']
    );
    const activeBookings = bookingsRes.rows;

    let maxOccupiedOnAnyLeg = 0;

    for (let i = boardIndex; i < destIndex; i++) {
        const occupiedOnThisLeg = activeBookings.filter(booking => {
            const bBoardIdx = route.indexOf(booking.boarding_station);
            const bDropIdx = route.indexOf(booking.dropping_station);
            return bBoardIdx <= i && bDropIdx > i; 
        }).length;

        if (occupiedOnThisLeg > maxOccupiedOnAnyLeg) maxOccupiedOnAnyLeg = occupiedOnThisLeg;
    }

    return {
        totalCapacity, aiBuffer, occupied: maxOccupiedOnAnyLeg,
        available: Math.max(0, totalAllowed - maxOccupiedOnAnyLeg)
    };
}

async function findSpecificAvailableSeat(trainId, boarding, destination, journeyDate) {
    const trainRes = await db.query('SELECT route, base_capacity FROM trains WHERE id = $1', [trainId]);
    const route = trainRes.rows[0].route;
    const totalCapacity = trainRes.rows[0].base_capacity;

    const boardIndex = route.indexOf(boarding);
    const destIndex = route.indexOf(destination);
    
    const bookingsRes = await db.query(
        'SELECT boarding_station, dropping_station, seat_number FROM bookings WHERE train_id = $1 AND journey_date = $2 AND booking_status = $3',
        [trainId, journeyDate, 'CONFIRMED']
    );
    const activeBookings = bookingsRes.rows;

    let seatAvailability = new Array(totalCapacity).fill(true);

    for (let i = boardIndex; i < destIndex; i++) {
        activeBookings.forEach(booking => {
            const bBoardIdx = route.indexOf(booking.boarding_station);
            const bDropIdx = route.indexOf(booking.dropping_station);
            if (bBoardIdx <= i && bDropIdx > i) {
                seatAvailability[booking.seat_number - 1] = false; 
            }
        });
    }

    const availableSeatIndex = seatAvailability.indexOf(true);
    return availableSeatIndex === -1 ? null : availableSeatIndex + 1;
}

module.exports = { getAvailableSeats, findSpecificAvailableSeat };
