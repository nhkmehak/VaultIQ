const express = require('express');
const cors = require('cors');
require('dotenv').config();
const logTransaction = require('./middleware/logger');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const investmentRoutes = require('./routes/investments');
const logRoutes = require('./routes/logs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(logTransaction);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/logs', logRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Grip Invest API is running' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});