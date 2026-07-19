const axios = require('axios');
const PYTHON_AI_URL = process.env.PYTHON_AI_URL || 'http://localhost:8000';

async function getPredictedBuffer(trainId, boarding, destination) {
    try {
        const res = await axios.post(`${PYTHON_AI_URL}/api/ai/predict-buffer`, { train_id: trainId, boarding, destination });
        return res.data.dynamic_buffer;
    } catch (error) { return 10; }
}

async function getPeakRecommendation(trainId, journeyDate, currentCapacity) {
    try {
        const res = await axios.post(`${PYTHON_AI_URL}/api/ai/predict-peak`, { train_id: trainId, journey_date: journeyDate, current_capacity: currentCapacity });
        return res.data;
    } catch (error) { return { recommended_extra_compartments: 0, recommendation_text: "AI Service unavailable" }; }
}

module.exports = { getPredictedBuffer, getPeakRecommendation };
