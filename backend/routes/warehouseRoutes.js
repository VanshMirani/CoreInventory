const express = require('express');
const warehouseController = require('../controllers/warehouseController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', protect, warehouseController.getAll);
router.get('/:id', protect, warehouseController.getById);
router.post('/', protect, warehouseController.create);
router.put('/:id', protect, warehouseController.update);
router.delete('/:id', protect, warehouseController.remove);

module.exports = router;
