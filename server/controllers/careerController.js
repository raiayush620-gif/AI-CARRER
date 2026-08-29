const careers = require('../data/careerSkills');

exports.getCareers = async (req, res, next) => {
    try {
        res.status(200).json(careers);
    } catch (error) { next(error); }
};

exports.getCareerByName = async (req, res, next) => {
    try {
        const career = careers.find(c => c.name.toLowerCase() === req.params.name.toLowerCase());
        if (!career) {
            res.status(404); throw new Error('Career not found');
        }
        res.status(200).json(career);
    } catch (error) { next(error); }
};
