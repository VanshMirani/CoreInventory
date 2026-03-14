const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/stats', protect, dashboardController.getStats);
router.get('/activity', protect, dashboardController.getRecentActivity);

module.exports = router;
