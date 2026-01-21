const pool = require('../config/database');

const logTransaction = (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    // Restore original send
    res.send = originalSend;
    
    // Log the transaction asynchronously (don't await)
    const logData = {
      user_id: req.user?.id || null,
      email: req.user?.email || null,
      endpoint: req.path,
      http_method: req.method,
      status_code: res.statusCode,
      error_message: res.statusCode >= 400 ? (typeof data === 'string' ? data : JSON.stringify(data)) : null
    };

    // Fire and forget - don't block the response
    pool.query(
      'INSERT INTO transaction_logs (user_id, email, endpoint, http_method, status_code, error_message) VALUES (?, ?, ?, ?, ?, ?)',
      [logData.user_id, logData.email, logData.endpoint, logData.http_method, logData.status_code, logData.error_message]
    ).catch(err => {
      console.error('Logging error:', err.message);
    });

    // Send the response
    return originalSend.call(this, data);
  };
  
  next();
};

module.exports = logTransaction;