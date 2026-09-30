const pool = require('../config/db');

/**
 * GET /history?user_id=...
 * Returns the latest 5 logs for the given user, sorted by created_at DESC
 * Same response format as the Flask backend
 */
async function getHistory(req, res) {
  const userId = req.query.user_id;

  if (!userId) {
    return res.status(400).json({ error: 'User ID required' });
  }

  try {
    const result = await pool.query(
      `SELECT id, user_id, sleep_hours, study_hours, screen_time, stress_level, fatigue_result, recommendation, created_at 
       FROM user_logs 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 5`,
      [userId]
    );

    const history = result.rows.map((row) => ({
      id: row.id,
      user_id: row.user_id,
      sleep_hours: row.sleep_hours,
      study_hours: row.study_hours,
      screen_time: row.screen_time,
      stress_level: row.stress_level,
      fatigue_result: row.fatigue_result,
      recommendation: row.recommendation,
      created_at: row.created_at ? String(row.created_at) : null
    }));

    return res.json(history);
  } catch (err) {
    console.error('History error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { getHistory };
