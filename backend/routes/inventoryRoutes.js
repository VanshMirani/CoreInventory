const express = require('express');
const inventoryController = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', protect, inventoryController.getAll);
router.get('/warehouse/:warehouseId', protect, inventoryController.getByWarehouse);
router.get('/product/:productId', protect, inventoryController.getByProduct);

module.exports = router;
