const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/start', protect, interviewController.startSession);
router.get('/history', protect, interviewController.getHistory);
router.get('/:id', protect, interviewController.getSession);
router.post('/:id/answer', protect, interviewController.submitAnswer);
router.post('/:id/next-question', protect, interviewController.nextQuestion);
router.delete('/:id', protect, interviewController.deleteSession);

module.exports = router;
