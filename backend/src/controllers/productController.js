const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
const { generateProductDescription, recommendProducts } = require('../services/aiService');

// Create product (admin only)
exports.createProduct = async (req, res) => {
  try {
    const { name, investment_type, tenure_months, annual_yield, risk_level, min_investment, max_investment } = req.body;

    if (!name || !investment_type || !tenure_months || !annual_yield || !risk_level) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const productId = uuidv4();

    // AI: Generate description
    const description = await generateProductDescription({
      name, investment_type, tenure_months, annual_yield, risk_level
    });

    await pool.query(
      `INSERT INTO investment_products (id, name, investment_type, tenure_months, annual_yield, risk_level, min_investment, max_investment, description) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [productId, name, investment_type, tenure_months, annual_yield, risk_level, min_investment || 1000, max_investment || null, description]
    );

    res.status(201).json({ message: 'Product created', productId, description });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const { type, risk_level, min_yield, max_yield } = req.query;
    
    let query = 'SELECT * FROM investment_products WHERE 1=1';
    const params = [];

    if (type) {
      query += ' AND investment_type = ?';
      params.push(type);
    }
    if (risk_level) {
      query += ' AND risk_level = ?';
      params.push(risk_level);
    }
    if (min_yield) {
      query += ' AND annual_yield >= ?';
      params.push(min_yield);
    }
    if (max_yield) {
      query += ' AND annual_yield <= ?';
      params.push(max_yield);
    }

    query += ' ORDER BY annual_yield DESC';

    const [products] = await pool.query(query, params);
    res.json({ products });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const [products] = await pool.query('SELECT * FROM investment_products WHERE id = ?', [req.params.id]);
    
    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product: products[0] });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update product (admin only)
exports.updateProduct = async (req, res) => {
  try {
    const { name, investment_type, tenure_months, annual_yield, risk_level, min_investment, max_investment, description } = req.body;
    const { id } = req.params;

    const [existing] = await pool.query('SELECT * FROM investment_products WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await pool.query(
      `UPDATE investment_products 
       SET name = ?, investment_type = ?, tenure_months = ?, annual_yield = ?, risk_level = ?, 
           min_investment = ?, max_investment = ?, description = ?
       WHERE id = ?`,
      [
        name || existing[0].name,
        investment_type || existing[0].investment_type,
        tenure_months || existing[0].tenure_months,
        annual_yield || existing[0].annual_yield,
        risk_level || existing[0].risk_level,
        min_investment || existing[0].min_investment,
        max_investment || existing[0].max_investment,
        description || existing[0].description,
        id
      ]
    );

    res.json({ message: 'Product updated' });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete product (admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query('DELETE FROM investment_products WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get AI recommendations - FIXED VERSION
exports.getRecommendations = async (req, res) => {
  try {
    const [products] = await pool.query('SELECT * FROM investment_products');
    
    // Check if there are any products
    if (products.length === 0) {
      return res.json({ recommendations: [] });
    }
    
    // AI: Get recommendations based on user's risk appetite
    const recommendationIds = await recommendProducts(products, req.user.risk_appetite || 'moderate');

    // Validate recommendations array
    if (!recommendationIds || !Array.isArray(recommendationIds) || recommendationIds.length === 0) {
      // Return top 3 products by yield as fallback
      const topProducts = products.slice(0, 3);
      return res.json({ recommendations: topProducts });
    }

    // Filter out any invalid IDs
    const validIds = recommendationIds.filter(id => id && typeof id === 'string');
    
    if (validIds.length === 0) {
      // Return top 3 products by yield as fallback
      const topProducts = products.slice(0, 3);
      return res.json({ recommendations: topProducts });
    }

    // Create placeholders for SQL IN clause
    const placeholders = validIds.map(() => '?').join(',');
    
    const [recommendedProducts] = await pool.query(
      `SELECT * FROM investment_products WHERE id IN (${placeholders})`,
      validIds
    );

    res.json({ recommendations: recommendedProducts });
  } catch (error) {
    console.error('Recommendations error:', error);
    
    // Fallback: return top 3 products on error
    try {
      const [products] = await pool.query('SELECT * FROM investment_products ORDER BY annual_yield DESC LIMIT 3');
      res.json({ recommendations: products });
    } catch (fallbackError) {
      res.status(500).json({ error: 'Server error', recommendations: [] });
    }
  }
};