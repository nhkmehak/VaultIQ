const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');

// Signup
exports.signup = async (req, res) => {
  try {
    const { first_name, last_name, email, password, risk_appetite } = req.body;

    // Validate input
    if (!first_name || !email || !password) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    // Check if user exists
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

 

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    // Insert user
    await pool.query(
      'INSERT INTO users (id, first_name, last_name, email, password_hash, risk_appetite) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, first_name, last_name || null, email, password_hash, risk_appetite || 'moderate']
    );

    // Generate token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: userId, first_name, last_name, email, risk_appetite: risk_appetite || 'moderate' }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error during signup' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        risk_appetite: user.risk_appetite
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, first_name, last_name, email, risk_appetite, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update risk appetite
exports.updateRiskAppetite = async (req, res) => {
  try {
    const { risk_appetite } = req.body;

    if (!['low', 'moderate', 'high'].includes(risk_appetite)) {
      return res.status(400).json({ error: 'Invalid risk appetite' });
    }

    await pool.query('UPDATE users SET risk_appetite = ? WHERE id = ?', [risk_appetite, req.user.id]);

    res.json({ message: 'Risk appetite updated', risk_appetite });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Password reset (simplified - generates OTP)
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const [users] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'Email not found' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // In production, you'd send this via email and store it temporarily
    // For this assignment, we'll just return it
    res.json({ message: 'OTP generated', otp, note: 'In production, this would be sent via email' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};