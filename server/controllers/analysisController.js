const CareerAnalysis = require('../models/CareerAnalysis');
const Resume = require('../models/Resume');
const User = require('../models/User');
const careers = require('../data/careerSkills');

exports.generateAnalysis = async (req, res, next) => {
    try {
        const { careerName } = req.body;
        if (!careerName) {
            res.status(400); throw new Error('Career name is required');
        }

        const career = careers.find(c => c.name.toLowerCase() === careerName.toLowerCase());
        if (!career) {
            res.status(404); throw new Error('Career not found');
        }

        const latestResume = await Resume.findOne({ userId: req.user._id }).sort({ uploadedAt: -1 });
        if (!latestResume) {
            res.status(404); throw new Error('Please upload a resume first');
        }

        // Extract raw names from detected skills
        const userSkills = latestResume.detectedSkills.map(s => s.name.toLowerCase());
        
        // Calculate matches
        const matchedSkills = [];
        const missingSkills = [];
        
        career.requiredSkills.forEach(reqSkill => {
            if (userSkills.includes(reqSkill.toLowerCase())) {
                matchedSkills.push(reqSkill);
            } else {
                missingSkills.push(reqSkill);
            }
        });
        
        const readinessScore = Math.round((matchedSkills.length / career.requiredSkills.length) * 100);
        
        // Update User
        await User.findByIdAndUpdate(req.user._id, { selectedCareer: career.name });
        
        // Save analysis
        const analysis = await CareerAnalysis.create({
            userId: req.user._id,
            careerName: career.name,
            readinessScore,
            matchedSkills,
            missingSkills
        });
        
        res.status(201).json(analysis);
    } catch (error) { next(error); }
};

exports.getLatestAnalysis = async (req, res, next) => {
    try {
        const analysis = await CareerAnalysis.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
        if (!analysis) {
            res.status(404); throw new Error('No analysis found');
        }
        res.status(200).json(analysis);
    } catch (error) { next(error); }
};
