const pool = require('../config/db');

/**
 * POST /signup
 * Accepts { email, password }
 * Returns { message, user_id } on success
 * Returns { error } on failure
 */
async function signup(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    // Check if email exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Insert new user
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id',
      [email, password]
    );
    const userId = result.rows[0].id;

    return res.status(201).json({ message: 'Signup successful', user_id: userId });
  } catch (err) {
    console.error('Signup error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

/**
 * POST /login
 * Accepts { email, password }
 * Returns { message, user_id } on success
 * Returns { error } with 401 for invalid credentials
 */
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const result = await pool.query(
      'SELECT id FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (result.rows.length > 0) {
      return res.status(200).json({ message: 'Login successful', user_id: result.rows[0].id });
    } else {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = { signup, login };
