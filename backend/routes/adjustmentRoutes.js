const express = require('express');
const adjustmentController = require('../controllers/adjustmentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', protect, adjustmentController.getAll);
router.get('/:id', protect, adjustmentController.getById);
router.post('/', protect, adjustmentController.create);
router.delete('/:id', protect, adjustmentController.remove);

module.exports = router;
