const Chat = require('../models/Chat');
const CareerAnalysis = require('../models/CareerAnalysis');
const { generateChatResponse } = require('../services/chatService');

exports.sendMessage = async (req, res, next) => {
    try {
        const { message } = req.body;
        if (!message || typeof message !== 'string' || message.trim() === '') {
            res.status(400); throw new Error('Please enter a valid message.');
        }
        if (message.length > 5000) {
            res.status(400); throw new Error('Message is too long. Max 5000 characters.');
        }

        // Fetch User Context
        const latestAnalysis = await CareerAnalysis.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
        const userContext = {
            career: latestAnalysis?.careerName,
            readiness: latestAnalysis?.readinessScore,
            missingSkills: latestAnalysis?.missingSkills
        };

        // Fetch Chat History
        let chat = await Chat.findOne({ userId: req.user._id });
        if (!chat) {
            chat = new Chat({ userId: req.user._id, messages: [] });
        }

        const previousMessages = chat.messages.map(m => ({ role: m.role, content: m.content }));
        
        // Add user message
        chat.messages.push({ role: 'user', content: message });
        
        // Generate AI Response
        const reply = await generateChatResponse(userContext, previousMessages, message);
        
        // Add AI response
        chat.messages.push({ role: 'assistant', content: reply });
        
        // Save history (Limit history length optionally, but keeping it simple)
        await chat.save();
        
        res.status(200).json({ success: true, message, reply });
    } catch (error) { next(error); }
};

exports.getChatHistory = async (req, res, next) => {
    try {
        const chat = await Chat.findOne({ userId: req.user._id });
        res.status(200).json({ success: true, messages: chat ? chat.messages : [] });
    } catch (error) { next(error); }
};

exports.clearChatHistory = async (req, res, next) => {
    try {
        await Chat.findOneAndDelete({ userId: req.user._id });
        res.status(200).json({ success: true, message: 'Chat history cleared' });
    } catch (error) { next(error); }
};
