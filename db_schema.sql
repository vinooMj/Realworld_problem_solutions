CREATE TABLE trains (
    id SERIAL PRIMARY KEY,
    train_number VARCHAR(10) UNIQUE NOT NULL,
    route JSONB NOT NULL,
    base_capacity INT DEFAULT 300
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    train_id INT REFERENCES trains(id),
    passenger_name VARCHAR(100),
    boarding_station VARCHAR(10) NOT NULL,
    dropping_station VARCHAR(10) NOT NULL,
    seat_number INT,
    journey_date DATE NOT NULL,
    qr_token TEXT UNIQUE,
    booking_status VARCHAR(20) DEFAULT 'CONFIRMED'
);

CREATE TABLE gate_logs (
    id SERIAL PRIMARY KEY,
    booking_id INT REFERENCES bookings(id),
    station_code VARCHAR(10),
    entry_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20)
);

CREATE TABLE ai_recommendations (
    id SERIAL PRIMARY KEY,
    train_id INT REFERENCES trains(id),
    journey_date DATE,
    predicted_demand INT,
    recommended_extra_compartments INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
