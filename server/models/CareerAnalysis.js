const mongoose = require('mongoose');

const careerAnalysisSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    careerName: { type: String, required: true },
    readinessScore: { type: Number, required: true },
    matchedSkills: [{ type: String }],
    missingSkills: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('CareerAnalysis', careerAnalysisSchema);
