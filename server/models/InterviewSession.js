const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, default: '' },
    score: { type: Number, default: null },
    technicalScore: { type: Number, default: null },
    communicationScore: { type: Number, default: null },
    problemSolvingScore: { type: Number, default: null },
    strengths: [{ type: String }],
    improvements: [{ type: String }],
    feedback: { type: String, default: '' },
    isAnswered: { type: Boolean, default: false }
}, { _id: false });

const interviewSessionSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, required: true },
    difficulty: { type: String, required: true },
    interviewType: { type: String, required: true },
    totalQuestions: { type: Number, required: true },
    currentQuestionIndex: { type: Number, default: 0 },
    questions: [questionSchema],
    overallScore: { type: Number, default: null },
    technicalScore: { type: Number, default: null },
    communicationScore: { type: Number, default: null },
    problemSolvingScore: { type: Number, default: null },
    status: { type: String, enum: ['in-progress', 'completed'], default: 'in-progress' },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('InterviewSession', interviewSessionSchema);
