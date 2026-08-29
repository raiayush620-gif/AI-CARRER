const express = require('express');
const router = express.Router();
const { generateAnalysis, getLatestAnalysis } = require('../controllers/analysisController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, generateAnalysis);
router.get('/latest', protect, getLatestAnalysis);

module.exports = router;
