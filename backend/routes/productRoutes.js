const express = require('express');
const productController = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', protect, productController.getAll);
router.get('/generate-sku', protect, productController.generateSkuRoute);
router.get('/:id', protect, productController.getById);
router.post('/', protect, productController.create);
router.put('/:id', protect, productController.update);
router.delete('/:id', protect, productController.remove);

module.exports = router;
