const express = require('express');
const productController = require('../controllers/productController');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, productController.getProducts);
router.get('/recommendations', authenticate, productController.getRecommendations);
router.get('/:id', authenticate, productController.getProductById);
router.post('/', authenticate, isAdmin, productController.createProduct);
router.put('/:id', authenticate, isAdmin, productController.updateProduct);
router.delete('/:id', authenticate, isAdmin, productController.deleteProduct);

module.exports = router;