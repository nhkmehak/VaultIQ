const pool = require('../config/database');
const { summarizeErrors } = require('../services/aiService');

// Get logs for current user
exports.getUserLogs = async (req, res) => {
  try {
    const { status_code, http_method, limit = 50 } = req.query;

    let query = 'SELECT * FROM transaction_logs WHERE user_id = ?';
    const params = [req.user.id];

    if (status_code) {
      query += ' AND status_code = ?';
      params.push(status_code);
    }

    if (http_method) {
      query += ' AND http_method = ?';
      params.push(http_method);
    }

    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(parseInt(limit));

    const [logs] = await pool.query(query, params);

    res.json({ logs, count: logs.length });
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get error summary (AI)
exports.getErrorSummary = async (req, res) => {
  try {
    const [errorLogs] = await pool.query(
      `SELECT endpoint, http_method, status_code, error_message, created_at 
       FROM transaction_logs 
       WHERE user_id = ? AND status_code >= 400 
       ORDER BY created_at DESC 
       LIMIT 20`,
      [req.user.id]
    );

    if (errorLogs.length === 0) {
      return res.json({ summary: 'No errors found for this user.' });
    }

    // AI: Summarize errors
    const summary = await summarizeErrors(errorLogs);

    res.json({ 
      summary,
      errorCount: errorLogs.length,
      recentErrors: errorLogs.slice(0, 5)
    });
  } catch (error) {
    console.error('Error summary error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all logs (admin only)
exports.getAllLogs = async (req, res) => {
  try {
    const { user_id, email, limit = 100 } = req.query;

    let query = 'SELECT * FROM transaction_logs WHERE 1=1';
    const params = [];

    if (user_id) {
      query += ' AND user_id = ?';
      params.push(user_id);
    }

    if (email) {
      query += ' AND email = ?';
      params.push(email);
    }

    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(parseInt(limit));

    const [logs] = await pool.query(query, params);

    res.json({ logs, count: logs.length });
  } catch (error) {
    console.error('Get all logs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};