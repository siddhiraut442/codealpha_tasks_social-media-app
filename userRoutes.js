
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');

// Register user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.json({ success: false, message: 'All fields are required' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';

  db.query(query, [username, email, hashedPassword], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.json({ success: false, message: 'Email already registered' });
      }
      return res.status(500).json({ success: false, message: err.message });
    }
    res.json({ success: true, message: 'Registration successful' });
  });
});

// Login user
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';

  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (results.length === 0) return res.json({ success: false, message: 'User not found' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ success: false, message: 'Invalid password' });

    res.json({
      success: true,
      message: 'Login successful',
      user: { id: user.id, username: user.username }
    });
  });
});
// Get user by ID (for profile viewing)
router.get('/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'SELECT id, username, email FROM users WHERE id = ?';

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'User not found' });

    res.json(results[0]);
  });
});

module.exports = router;
