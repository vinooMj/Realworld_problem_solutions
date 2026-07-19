const db = require('../config/db');
const aiClient = require('../services/aiClient');

exports.getRecommendations = async (req, res) => {
    try {
        const { train_id, date } = req.query;
        const trainRes = await db.query('SELECT base_capacity FROM trains WHERE id = $1', [train_id]);
        const currentCapacity = trainRes.rows[0].base_capacity;

        const aiPrediction = await aiClient.getPeakRecommendation(train_id, date, currentCapacity);

        await db.query(
            'INSERT INTO ai_recommendations (train_id, journey_date, predicted_demand, recommended_extra_compartments) VALUES ($1, $2, $3, $4)',
            [train_id, date, aiPrediction.predicted_demand, aiPrediction.recommended_extra_compartments]
        );

        res.json(aiPrediction);
    } catch (error) { res.status(500).json({ error: error.message }); }
};
