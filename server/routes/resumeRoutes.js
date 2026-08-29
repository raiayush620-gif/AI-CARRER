const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadResume, getLatestResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');

// Use memory storage for Vercel serverless compatibility
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    }
});

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/latest', protect, getLatestResume);

module.exports = router;
