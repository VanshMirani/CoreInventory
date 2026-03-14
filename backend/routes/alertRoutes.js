const express = require('express');
const alertController = require('../controllers/alertController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/low-stock', protect, alertController.getLowStock);

module.exports = router;
