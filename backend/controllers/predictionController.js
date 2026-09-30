const pool = require('../config/db');
const { getRecommendation } = require('../services/geminiService');

/**
 * POST /predict
 * Accepts { user_id, sleep, study, screen, stress }
 * Returns { fatigue, message, recommendation }
 * 
 * Fatigue logic (unchanged from Flask):
 *   IF sleep < 5 AND screen > 8 → HIGH
 *   ELSE IF sleep < 7           → MEDIUM
 *   ELSE                        → LOW
 */
async function predict(req, res) {
  const { user_id } = req.body;
  const sleep = parseFloat(req.body.sleep) || 0;
  const study = parseFloat(req.body.study) || 0;
  const screen = parseFloat(req.body.screen) || 0;
  const stress = parseInt(req.body.stress, 10) || 0;

  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  // Simple Logic Rule (exact same as Flask)
  let fatigue, msg;
  if (sleep < 5 && screen > 8) {
    fatigue = 'HIGH';
    msg = 'High fatigue detected';
  } else if (sleep < 7) {
    fatigue = 'MEDIUM';
    msg = 'Slight fatigue detected';
  } else {
    fatigue = 'LOW';
    msg = 'You are doing well';
  }

  // Get AI recommendation (with cache + timeout, same as Flask)
  const recDict = await getRecommendation(fatigue, sleep, study, screen, stress);
  const recStr = JSON.stringify(recDict);

  // IST timestamp (same as Flask using pytz Asia/Kolkata)
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  const istDate = new Date(now.getTime() + istOffset);
  const createdAt = istDate.toISOString().replace('T', ' ').substring(0, 19);

  try {
    await pool.query(
      `INSERT INTO user_logs 
       (user_id, sleep_hours, study_hours, screen_time, stress_level, fatigue_result, recommendation, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [user_id, sleep, study, screen, stress, fatigue, recStr, createdAt]
    );

    return res.json({
      fatigue,
      message: msg,
      recommendation: recDict
    });
  } catch (err) {
    console.error('Predict error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { predict };
