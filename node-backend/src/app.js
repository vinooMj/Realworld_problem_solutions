require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bookingRoutes = require('./routes/bookingRoutes');
const gateRoutes = require('./routes/gateRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/bookings', bookingRoutes);
app.use('/api/gate', gateRoutes);
app.use('/api/admin', adminRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Node Backend running on port ${process.env.PORT}`);
});
