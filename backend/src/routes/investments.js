const express = require('express');
const investmentController = require('../controllers/investmentController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticate, investmentController.createInvestment);
router.get('/portfolio', authenticate, investmentController.getPortfolio);
router.get('/insights', authenticate, investmentController.getPortfolioInsights);
router.get('/:id', authenticate, investmentController.getInvestmentById);
router.put('/:id/cancel', authenticate, investmentController.cancelInvestment);

module.exports = router;