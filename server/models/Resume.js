const mongoose = require('mongoose');

const resumeSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    originalFileName: { type: String, required: true },
    extractedText: { type: String, required: true },
    detectedSkills: [{ name: String, category: String }],
    uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', resumeSchema);
