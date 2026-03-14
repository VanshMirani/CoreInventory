const express = require('express');
const movementController = require('../controllers/movementController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', protect, movementController.getAll);

module.exports = router;
