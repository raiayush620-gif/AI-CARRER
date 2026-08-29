exports.generateFallbackResponse = (message) => {
    const msg = message.toLowerCase();
    if (msg.includes('career route') || msg.includes('what is this')) {
        return 'Career Route is an AI-powered skill gap analysis and personalized learning roadmap platform. You can upload your resume, select a desired career, and receive a customized roadmap to bridge your skill gaps.';
    }
    if (msg.includes('resume') || msg.includes('upload')) {
        return 'To upload your resume, go to the "Upload Resume" section from the dashboard. Ensure your resume is a text-based PDF (not an image). Our system will extract your skills automatically.';
    }
    if (msg.includes('readiness') || msg.includes('score')) {
        return 'Your Career Readiness Score is calculated by comparing the skills detected in your resume against the required skills for your selected career path.';
    }
    if (msg.includes('matched skill')) {
        return 'Matched skills are the skills you already possess (detected in your resume) that are required for your chosen career.';
    }
    if (msg.includes('missing skill') || msg.includes('gap')) {
        return 'Missing skills are the required skills for your chosen career that were not detected in your resume. These form the basis of your learning roadmap.';
    }
    if (msg.includes('roadmap') || msg.includes('learn')) {
        return 'Your learning roadmap provides step-by-step guidance for each missing skill, tracking your progress as you complete learning objectives.';
    }
    if (msg.includes('hello') || msg.includes('hi ')) {
        return 'Hello! I am your AI Career Assistant. How can I help you with your career journey today?';
    }
    return 'AI chat is currently not configured with an external provider. I am running in fallback mode and can only answer basic questions about how Career Route works. You can still use all core Career Route features normally!';
};
