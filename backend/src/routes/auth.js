const express = require('express');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/password-reset', authController.requestPasswordReset);
router.get('/me', authenticate, authController.getCurrentUser);
router.put('/risk-appetite', authenticate, authController.updateRiskAppetite);

module.exports = router;