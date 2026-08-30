const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

const isCloudinaryConfigured = 
    process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
    process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_KEY !== 'your_api_key' &&
    process.env.CLOUDINARY_API_SECRET && process.env.CLOUDINARY_API_SECRET !== 'your_api_secret';

if (isCloudinaryConfigured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
}

exports.uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (isCloudinaryConfigured) {
            // Delete old image from Cloudinary
            if (user.profileImage && user.profileImage.includes('cloudinary')) {
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
                    console.error("Failed to delete previous image from Cloudinary", err);
                }
            }
            user.profileImage = req.file.path; // Cloudinary URL
        } else {
            // Fallback: Convert memory buffer to Base64 data URI
            const b64 = Buffer.from(req.file.buffer).toString('base64');
            const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
            user.profileImage = dataURI;
        }

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

        if (isCloudinaryConfigured && user.profileImage && user.profileImage.includes('cloudinary')) {
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
