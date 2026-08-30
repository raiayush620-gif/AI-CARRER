const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const { protect } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// Check if Cloudinary is configured
const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;

let storage;

if (isCloudinaryConfigured) {
    storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'career-route-profiles',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 400, height: 400, crop: 'limit' }]
      },
    });
} else {
    // Fallback to memory storage if Cloudinary is not configured
    // The controller will convert the buffer to a Base64 string to store in MongoDB
    storage = multer.memoryStorage();
}

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post('/profile-image', protect, upload.single('image'), userController.uploadProfileImage);
router.delete('/profile-image', protect, userController.removeProfileImage);

module.exports = router;
