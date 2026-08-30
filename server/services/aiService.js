const axios = require('axios');

const generateWithOpenAI = async (messages, apiKey) => {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 1500,
        response_format: { type: "json_object" }
    }, {
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }
    });
    return response.data.choices[0].message.content;
};

const generateWithGroq = async (messages, apiKey) => {
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: 'llama3-8b-8192',
        messages,
        max_tokens: 1500,
        response_format: { type: "json_object" }
    }, {
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' }
    });
    return response.data.choices[0].message.content;
};

const generateWithGemini = async (messages, apiKey) => {
    const filteredMessages = messages.filter(msg => msg.role !== 'system');
    const contents = filteredMessages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
    }));

    const systemMessage = messages.find(msg => msg.role === 'system')?.content || '';

    // Note: The main app uses gemini-3.6-flash, so I'll match that.
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
        contents,
        systemInstruction: { parts: [{ text: systemMessage }] },
        generationConfig: { responseMimeType: "application/json" }
    }, {
        headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.data.candidates && response.data.candidates.length > 0) {
        return response.data.candidates[0].content.parts[0].text;
    }
    throw new Error('No response from Gemini');
};

exports.generateJSON = async (systemPrompt, userPrompt) => {
    const provider = process.env.AI_PROVIDER || 'fallback';
    const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
    ];

    try {
        if (provider === 'openai' && process.env.OPENAI_API_KEY) {
            return await generateWithOpenAI(messages, process.env.OPENAI_API_KEY);
        } else if (provider === 'groq' && process.env.GROQ_API_KEY) {
            return await generateWithGroq(messages, process.env.GROQ_API_KEY);
        } else if (provider === 'gemini' && process.env.GEMINI_API_KEY) {
            return await generateWithGemini(messages, process.env.GEMINI_API_KEY);
        } else {
            throw new Error('No valid AI provider configured for JSON generation.');
        }
    } catch (error) {
        console.error('AI JSON Provider Error:', error?.response?.data || error.message);
        throw new Error('Failed to generate AI response.');
    }
};
