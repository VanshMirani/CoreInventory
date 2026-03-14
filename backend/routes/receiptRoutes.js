const express = require('express');
const receiptController = require('../controllers/receiptController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', protect, receiptController.getAll);
router.get('/:id', protect, receiptController.getById);
router.post('/', protect, receiptController.create);
router.delete('/:id', protect, receiptController.remove);

module.exports = router;
