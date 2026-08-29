const RoadmapProgress = require('../models/RoadmapProgress');
const { roadmaps, getFallbackRoadmap } = require('../data/roadmapData');

exports.getSkillRoadmap = async (req, res, next) => {
    try {
        const { career, skill } = req.params;
        
        let roadmapSteps = roadmaps[skill] || getFallbackRoadmap(skill);
        
        const progress = await RoadmapProgress.findOne({
            userId: req.user._id,
            careerName: career,
            skillName: skill
        });
        
        res.status(200).json({
            skill,
            career,
            steps: roadmapSteps,
            completedSteps: progress ? progress.completedSteps : [],
            progressPercentage: progress ? progress.progressPercentage : 0
        });
    } catch (error) { next(error); }
};

exports.updateProgress = async (req, res, next) => {
    try {
        const { careerName, skillName, completedSteps, totalSteps } = req.body;
        
        const progressPercentage = Math.round((completedSteps.length / totalSteps) * 100);
        
        let progress = await RoadmapProgress.findOne({
            userId: req.user._id,
            careerName,
            skillName
        });
        
        if (progress) {
            progress.completedSteps = completedSteps;
            progress.progressPercentage = progressPercentage;
            await progress.save();
        } else {
            progress = await RoadmapProgress.create({
                userId: req.user._id,
                careerName,
                skillName,
                completedSteps,
                progressPercentage
            });
        }
        
        res.status(200).json(progress);
    } catch (error) { next(error); }
};

exports.getAllProgress = async (req, res, next) => {
    try {
        const progress = await RoadmapProgress.find({ userId: req.user._id });
        res.status(200).json(progress);
    } catch (error) { next(error); }
};
