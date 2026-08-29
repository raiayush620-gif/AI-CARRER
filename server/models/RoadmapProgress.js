const mongoose = require('mongoose');

const roadmapProgressSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    careerName: { type: String, required: true },
    skillName: { type: String, required: true },
    completedSteps: [{ type: Number }], // Array of completed step numbers
    progressPercentage: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('RoadmapProgress', roadmapProgressSchema);
