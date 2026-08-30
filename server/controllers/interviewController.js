const InterviewSession = require('../models/InterviewSession');
const aiService = require('../services/aiService');

const GENERATOR_PROMPT = `You are an expert technical interviewer.
Generate a realistic interview question based on the candidate's requested role, difficulty, and type.
Do NOT repeat the previous questions. 
Return ONLY valid JSON.
{
    "question": "The generated question text"
}`;

const EVALUATOR_PROMPT = `You are an experienced professional interviewer.
Evaluate the candidate's answer based on the actual content.
Consider: Technical correctness, Conceptual understanding, Clarity, Communication, Problem-solving ability where applicable.
Give a realistic score from 0 to 10. Do not inflate scores. Do not give generic feedback. Identify specific strengths and areas for improvement.
If the answer is incorrect, explain the correct concept concisely.
Return ONLY valid JSON in this exact structure:
{
  "score": 8,
  "technicalScore": 8,
  "communicationScore": 7,
  "problemSolvingScore": 8,
  "strengths": ["string"],
  "improvements": ["string"],
  "feedback": "string"
}`;

exports.startSession = async (req, res) => {
    const { role, difficulty, interviewType, totalQuestions } = req.body;
    try {
        const session = new InterviewSession({
            userId: req.user.id,
            role,
            difficulty,
            interviewType,
            totalQuestions: parseInt(totalQuestions) || 5
        });
        
        // Generate first question
        const prompt = `Role: ${role}\nDifficulty: ${difficulty}\nType: ${interviewType}\nGenerate the first interview question.`;
        const rawJson = await aiService.generateJSON(GENERATOR_PROMPT, prompt);
        const parsed = JSON.parse(rawJson);
        
        session.questions.push({ question: parsed.question });
        await session.save();
        
        res.status(201).json(session);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to start interview session' });
    }
};

exports.getSession = async (req, res) => {
    try {
        const session = await InterviewSession.findOne({ _id: req.params.id, userId: req.user.id });
        if (!session) return res.status(404).json({ message: 'Session not found' });
        res.json(session);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching session' });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const sessions = await InterviewSession.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(sessions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching interview history' });
    }
};

exports.submitAnswer = async (req, res) => {
    const { answer } = req.body;
    try {
        const session = await InterviewSession.findOne({ _id: req.params.id, userId: req.user.id });
        if (!session) return res.status(404).json({ message: 'Session not found' });
        if (session.status === 'completed') return res.status(400).json({ message: 'Session already completed' });

        const currentQuestion = session.questions[session.currentQuestionIndex];
        
        const prompt = `Question: ${currentQuestion.question}\nCandidate Answer: ${answer}`;
        const rawJson = await aiService.generateJSON(EVALUATOR_PROMPT, prompt);
        const parsed = JSON.parse(rawJson);
        
        currentQuestion.answer = answer;
        currentQuestion.score = parsed.score;
        currentQuestion.technicalScore = parsed.technicalScore;
        currentQuestion.communicationScore = parsed.communicationScore;
        currentQuestion.problemSolvingScore = parsed.problemSolvingScore;
        currentQuestion.strengths = parsed.strengths;
        currentQuestion.improvements = parsed.improvements;
        currentQuestion.feedback = parsed.feedback;
        currentQuestion.isAnswered = true;
        
        await session.save();
        res.json(session);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to evaluate answer' });
    }
};

exports.nextQuestion = async (req, res) => {
    try {
        const session = await InterviewSession.findOne({ _id: req.params.id, userId: req.user.id });
        if (!session) return res.status(404).json({ message: 'Session not found' });
        if (session.status === 'completed') return res.status(400).json({ message: 'Session already completed' });

        const currentQuestion = session.questions[session.currentQuestionIndex];
        if (!currentQuestion.isAnswered) return res.status(400).json({ message: 'Must answer current question first' });

        if (session.currentQuestionIndex + 1 >= session.totalQuestions) {
            // End session
            session.status = 'completed';
            session.completedAt = new Date();
            
            // Calculate overall scores
            let total = 0, tTotal = 0, cTotal = 0, pTotal = 0;
            session.questions.forEach(q => {
                total += q.score || 0;
                tTotal += q.technicalScore || 0;
                cTotal += q.communicationScore || 0;
                pTotal += q.problemSolvingScore || 0;
            });
            const qCount = session.questions.length;
            session.overallScore = Math.round((total / (qCount * 10)) * 100);
            session.technicalScore = Math.round((tTotal / (qCount * 10)) * 100);
            session.communicationScore = Math.round((cTotal / (qCount * 10)) * 100);
            session.problemSolvingScore = Math.round((pTotal / (qCount * 10)) * 100);
            
            await session.save();
            return res.json(session);
        }

        // Generate next question
        session.currentQuestionIndex += 1;
        const previousQs = session.questions.map(q => q.question).join(' | ');
        const prompt = `Role: ${session.role}\nDifficulty: ${session.difficulty}\nType: ${session.interviewType}\nPrevious Questions: ${previousQs}\nGenerate the next interview question. DO NOT repeat previous questions.`;
        
        const rawJson = await aiService.generateJSON(GENERATOR_PROMPT, prompt);
        const parsed = JSON.parse(rawJson);
        
        session.questions.push({ question: parsed.question });
        await session.save();
        
        res.json(session);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to advance to next question' });
    }
};

exports.deleteSession = async (req, res) => {
    try {
        await InterviewSession.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        res.json({ message: 'Session deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete session' });
    }
};
