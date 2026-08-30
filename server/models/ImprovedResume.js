const mongoose = require('mongoose');

const sectionSchema = mongoose.Schema({
    original: { type: String, default: '' },
    improved: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { _id: false });

const improvedResumeSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
    targetRole: { type: String, default: '' },
    sections: {
        professionalSummary: sectionSchema,
        objective: sectionSchema,
        skills: sectionSchema,
        experience: sectionSchema,
        projects: sectionSchema,
        education: sectionSchema,
        achievements: sectionSchema,
        certifications: sectionSchema
    },
    atsKeywords: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('ImprovedResume', improvedResumeSchema);
