const express = require('express');
const router = express.Router();
const { getSkillRoadmap, updateProgress, getAllProgress } = require('../controllers/roadmapController');
const { protect } = require('../middleware/authMiddleware');

router.get('/progress', protect, getAllProgress);
router.get('/:career/:skill', protect, getSkillRoadmap);
router.post('/progress', protect, updateProgress);

module.exports = router;
