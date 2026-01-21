const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
const { generatePortfolioInsights } = require('../services/aiService');

// Create investment
exports.createInvestment = async (req, res) => {
  try {
    const { product_id, amount } = req.body;

    if (!product_id || !amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid investment details' });
    }

    // Get product details
    const [products] = await pool.query('SELECT * FROM investment_products WHERE id = ?', [product_id]);
    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = products[0];

    // Validate investment amount
    if (amount < product.min_investment) {
      return res.status(400).json({ error: `Minimum investment is ${product.min_investment}` });
    }
    if (product.max_investment && amount > product.max_investment) {
      return res.status(400).json({ error: `Maximum investment is ${product.max_investment}` });
    }

    // Calculate expected return and maturity date
    const expected_return = amount * (1 + (product.annual_yield / 100) * (product.tenure_months / 12));
    const maturity_date = new Date();
    maturity_date.setMonth(maturity_date.getMonth() + product.tenure_months);

    const investmentId = uuidv4();

    await pool.query(
      `INSERT INTO investments (id, user_id, product_id, amount, expected_return, maturity_date) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [investmentId, req.user.id, product_id, amount, expected_return.toFixed(2), maturity_date.toISOString().split('T')[0]]
    );

    res.status(201).json({
      message: 'Investment created successfully',
      investment: {
        id: investmentId,
        product_id,
        amount,
        expected_return: expected_return.toFixed(2),
        maturity_date: maturity_date.toISOString().split('T')[0]
      }
    });
  } catch (error) {
    console.error('Create investment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get user portfolio
exports.getPortfolio = async (req, res) => {
  try {
    const [investments] = await pool.query(
      `SELECT i.*, p.name, p.investment_type, p.risk_level, p.annual_yield, p.tenure_months
       FROM investments i
       JOIN investment_products p ON i.product_id = p.id
       WHERE i.user_id = ? AND i.status = 'active'
       ORDER BY i.invested_at DESC`,
      [req.user.id]
    );

    // Calculate total portfolio value
    const totalInvested = investments.reduce((sum, inv) => sum + parseFloat(inv.amount), 0);
    const totalExpectedReturn = investments.reduce((sum, inv) => sum + parseFloat(inv.expected_return), 0);

    res.json({
      portfolio: {
        total_invested: totalInvested.toFixed(2),
        total_expected_return: totalExpectedReturn.toFixed(2),
        total_gain: (totalExpectedReturn - totalInvested).toFixed(2),
        investments_count: investments.length,
        investments
      }
    });
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get portfolio insights (AI)
exports.getPortfolioInsights = async (req, res) => {
  try {
    const [investments] = await pool.query(
      `SELECT i.*, p.name, p.investment_type, p.risk_level, p.annual_yield
       FROM investments i
       JOIN investment_products p ON i.product_id = p.id
       WHERE i.user_id = ? AND i.status = 'active'`,
      [req.user.id]
    );

    if (investments.length === 0) {
      return res.json({ insights: { message: 'No investments yet', suggestions: [] } });
    }

    const [products] = await pool.query('SELECT * FROM investment_products');

    // AI: Generate insights
    const insights = await generatePortfolioInsights(investments, products);

    res.json({ insights });
  } catch (error) {
    console.error('Portfolio insights error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get investment by ID
exports.getInvestmentById = async (req, res) => {
  try {
    const [investments] = await pool.query(
      `SELECT i.*, p.name, p.investment_type, p.risk_level, p.annual_yield, p.tenure_months, p.description
       FROM investments i
       JOIN investment_products p ON i.product_id = p.id
       WHERE i.id = ? AND i.user_id = ?`,
      [req.params.id, req.user.id]
    );

    if (investments.length === 0) {
      return res.status(404).json({ error: 'Investment not found' });
    }

    res.json({ investment: investments[0] });
  } catch (error) {
    console.error('Get investment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Cancel investment
exports.cancelInvestment = async (req, res) => {
  try {
    const { id } = req.params;

    const [investments] = await pool.query(
      'SELECT * FROM investments WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (investments.length === 0) {
      return res.status(404).json({ error: 'Investment not found' });
    }

    if (investments[0].status !== 'active') {
      return res.status(400).json({ error: 'Investment cannot be cancelled' });
    }

    await pool.query('UPDATE investments SET status = ? WHERE id = ?', ['cancelled', id]);

    res.json({ message: 'Investment cancelled' });
  } catch (error) {
    console.error('Cancel investment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};