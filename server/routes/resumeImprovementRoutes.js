const express = require('express');
const router = express.Router();
const resumeImprovementController = require('../controllers/resumeImprovementController');
const { protect } = require('../middleware/authMiddleware');

router.get('/data', protect, resumeImprovementController.getResumeData);
router.post('/improve-section', protect, resumeImprovementController.improveSection);
router.post('/ats-keywords', protect, resumeImprovementController.getAtsKeywords);
router.post('/save-progress', protect, resumeImprovementController.saveProgress);
router.get('/download', protect, resumeImprovementController.downloadResume);

module.exports = router;
