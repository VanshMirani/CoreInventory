const express = require('express');
const searchController = require('../controllers/searchController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', protect, searchController.search);

module.exports = router;
