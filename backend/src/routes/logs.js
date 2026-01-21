const express = require('express');
const logController = require('../controllers/logController');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, logController.getUserLogs);
router.get('/error-summary', authenticate, logController.getErrorSummary);
router.get('/all', authenticate, isAdmin, logController.getAllLogs);

module.exports = router;