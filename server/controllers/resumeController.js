const pdfParse = require('pdf-parse');
const Resume = require('../models/Resume');
const detectSkills = require('../utils/skillDetector');

exports.uploadResume = async (req, res, next) => {
    try {
        if (!req.file) {
            res.status(400); throw new Error('Please upload a file');
        }

        const dataBuffer = req.file.buffer;
        const data = await pdfParse(dataBuffer);
        const extractedText = data.text?.trim() || 'NO_TEXT_EXTRACTED';
        
        const detectedSkills = detectSkills(extractedText);
        
        const resume = await Resume.create({
            userId: req.user._id,
            originalFileName: req.file?.originalname || 'resume.pdf',
            extractedText,
            detectedSkills
        });
        
        res.status(201).json({ success: true, resumeId: resume._id, detectedSkills });
    } catch (error) { next(error); }
};

exports.getLatestResume = async (req, res, next) => {
    try {
        const resume = await Resume.findOne({ userId: req.user._id }).sort({ uploadedAt: -1 });
        if (!resume) {
            res.status(404); throw new Error('No resume found');
        }
        res.status(200).json(resume);
    } catch (error) { next(error); }
};
