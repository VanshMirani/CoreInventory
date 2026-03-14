const express = require('express');
const deliveryController = require('../controllers/deliveryController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', protect, deliveryController.getAll);
router.get('/:id', protect, deliveryController.getById);
router.post('/', protect, deliveryController.create);
router.delete('/:id', protect, deliveryController.remove);

module.exports = router;
