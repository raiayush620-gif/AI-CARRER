const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Optional: If user already has an image, delete it from Cloudinary to save space
        if (user.profileImage) {
            try {
                // Extract public_id from Cloudinary URL
                // Example URL: https://res.cloudinary.com/demo/image/upload/v1234567890/folder/filename.jpg
                const urlParts = user.profileImage.split('/');
                const filenameWithExt = urlParts[urlParts.length - 1];
                const filename = filenameWithExt.split('.')[0];
                const folderIndex = urlParts.indexOf('upload') + 2; // +1 is version, +2 is folder
                
                let publicId = filename;
                if (folderIndex < urlParts.length - 1) {
                    const pathParts = urlParts.slice(folderIndex, urlParts.length - 1);
                    publicId = pathParts.join('/') + '/' + filename;
                }
                
                await cloudinary.uploader.destroy(publicId);
            } catch (err) {
                console.error("Failed to delete previous image from Cloudinary", err);
            }
        }

        user.profileImage = req.file.path; // The Cloudinary URL provided by multer-storage-cloudinary
        await user.save();

        res.json({ message: 'Profile image uploaded', profileImage: user.profileImage });
    } catch (error) {
        console.error("Error uploading profile image:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.removeProfileImage = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.profileImage) {
            try {
                const urlParts = user.profileImage.split('/');
                const filenameWithExt = urlParts[urlParts.length - 1];
                const filename = filenameWithExt.split('.')[0];
                const folderIndex = urlParts.indexOf('upload') + 2; 
                
                let publicId = filename;
                if (folderIndex < urlParts.length - 1) {
                    const pathParts = urlParts.slice(folderIndex, urlParts.length - 1);
                    publicId = pathParts.join('/') + '/' + filename;
                }
                
                await cloudinary.uploader.destroy(publicId);
            } catch (err) {
                console.error("Failed to delete image from Cloudinary", err);
            }
        }

        user.profileImage = '';
        await user.save();

        res.json({ message: 'Profile image removed' });
    } catch (error) {
        console.error("Error removing profile image:", error);
        res.status(500).json({ message: 'Server error' });
    }
};
