const express = require('express');
const router = express.Router();
const { getCareers, getCareerByName } = require('../controllers/careerController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getCareers);
router.get('/:name', protect, getCareerByName);

module.exports = router;
