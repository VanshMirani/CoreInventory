const express = require('express');
const transferController = require('../controllers/transferController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', protect, transferController.getAll);
router.get('/:id', protect, transferController.getById);
router.post('/', protect, transferController.create);
router.delete('/:id', protect, transferController.remove);

module.exports = router;
