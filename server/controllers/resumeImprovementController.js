const ImprovedResume = require('../models/ImprovedResume');
const Resume = require('../models/Resume');
const aiService = require('../services/aiService');

const SYSTEM_PROMPT = `You are an expert professional resume writing assistant.
Your responsibility is to improve resume content while preserving factual accuracy.
Improve: Grammar, Clarity, Professional tone, Action verbs, Readability, ATS compatibility, Conciseness, Technical terminology where supported by user content.
NEVER invent: Companies, Job titles, Work experience, Degrees, Certifications, Projects, Skills, Achievements, Metrics, Results.
Preserve the factual meaning of the user's content.
Return valid JSON.`;

exports.getResumeData = async (req, res) => {
    try {
        const resume = await Resume.findOne({ userId: req.user.id }).sort({ uploadedAt: -1 });
        if (!resume) {
            return res.status(404).json({ message: 'No resume found' });
        }
        
        let improvedResume = await ImprovedResume.findOne({ userId: req.user.id, resumeId: resume._id });
        if (!improvedResume) {
            // First time accessing improvement, initialize sections from raw text
            improvedResume = new ImprovedResume({
                userId: req.user.id,
                resumeId: resume._id,
                sections: {
                    professionalSummary: { original: '', improved: '', status: 'pending' },
                    skills: { original: resume.detectedSkills.map(s => s.name).join(', '), improved: '', status: 'pending' },
                    experience: { original: '', improved: '', status: 'pending' },
                    education: { original: '', improved: '', status: 'pending' },
                    projects: { original: '', improved: '', status: 'pending' },
                }
            });
            // Try to extract basic sections from raw text via AI if possible, but for safety and speed, we will just return it empty and let user paste/select from the raw text, OR we can do a one-off parse. 
            // To be robust, let's just save the initialized state and pass extractedText to frontend so user can copy-paste or AI can parse.
            await improvedResume.save();
        }
        
        res.json({ resume, improvedResume });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching resume data' });
    }
};

exports.improveSection = async (req, res) => {
    const { sectionName, content, mode, targetRole } = req.body;
    
    if (!content) return res.status(400).json({ message: 'Content is required' });

    let modeInstruction = "Improve this content generally.";
    if (mode === 'Make Professional') modeInstruction = "Make this highly professional and formal.";
    if (mode === 'Make Concise') modeInstruction = "Reduce unnecessary words while preserving meaning.";
    if (mode === 'Make Impactful') modeInstruction = "Use strong action-oriented language and highlight impact.";
    if (mode === 'Make ATS Friendly') modeInstruction = `Optimize relevant terminology for a ${targetRole || 'general'} role without inventing skills.`;
    if (mode === 'Fix Grammar') modeInstruction = "Correct grammar and spelling only. Preserve exact original meaning.";

    const prompt = `Section: ${sectionName}
Content:
${content}

Task: ${modeInstruction}

Respond ONLY with this JSON structure:
{
    "improvedText": "the new text",
    "suggestions": [{"original": "weak phrase", "suggestion": "stronger verb", "reason": "why"}],
    "weakStatements": [{"text": "vague sentence", "reason": "why it's weak", "suggestion": "how to fix it"}]
}`;

    try {
        const rawJson = await aiService.generateJSON(SYSTEM_PROMPT, prompt);
        const parsed = JSON.parse(rawJson);
        res.json(parsed);
    } catch (error) {
        console.error('Error improving section:', error);
        res.status(500).json({ message: 'Failed to generate improvement' });
    }
};

exports.getAtsKeywords = async (req, res) => {
    const { targetRole, currentSkills } = req.body;
    if (!targetRole) return res.status(400).json({ message: 'Target role is required' });

    const prompt = `Target Role: ${targetRole}
Current Skills on Resume: ${currentSkills}

Suggest relevant ATS keywords for this role that the user might want to include if they possess them. 
Return ONLY JSON:
{
    "suggestedKeywords": ["keyword1", "keyword2"]
}`;

    try {
        const rawJson = await aiService.generateJSON(SYSTEM_PROMPT, prompt);
        const parsed = JSON.parse(rawJson);
        res.json(parsed);
    } catch (error) {
        console.error('Error fetching keywords:', error);
        res.status(500).json({ message: 'Failed to generate keywords' });
    }
};

exports.saveProgress = async (req, res) => {
    const { sections, targetRole } = req.body;
    try {
        const improvedResume = await ImprovedResume.findOne({ userId: req.user.id });
        if (!improvedResume) return res.status(404).json({ message: 'Record not found' });

        improvedResume.sections = { ...improvedResume.sections, ...sections };
        if (targetRole) improvedResume.targetRole = targetRole;

        await improvedResume.save();
        res.json({ message: 'Progress saved successfully', improvedResume });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error saving progress' });
    }
};

exports.downloadResume = async (req, res) => {
    // Generate a basic HTML to PDF or text output for the user to download.
    // Since we can't reliably spin up puppeteer without breaking serverless, 
    // we will return the text content nicely formatted and frontend can trigger download, or we can send a simple text file.
    
    try {
        const improvedResume = await ImprovedResume.findOne({ userId: req.user.id });
        if (!improvedResume) return res.status(404).json({ message: 'No improved resume found' });

        let document = `RESUME\n\n`;
        if (improvedResume.targetRole) document += `Target Role: ${improvedResume.targetRole}\n\n`;
        
        const sectionsToInclude = [
            { key: 'professionalSummary', label: 'PROFESSIONAL SUMMARY' },
            { key: 'objective', label: 'OBJECTIVE' },
            { key: 'skills', label: 'SKILLS' },
            { key: 'experience', label: 'EXPERIENCE' },
            { key: 'projects', label: 'PROJECTS' },
            { key: 'education', label: 'EDUCATION' },
            { key: 'achievements', label: 'ACHIEVEMENTS' },
            { key: 'certifications', label: 'CERTIFICATIONS' }
        ];

        for (const sec of sectionsToInclude) {
            const data = improvedResume.sections[sec.key];
            if (data && data.status === 'approved' && data.improved) {
                document += `${sec.label}\n`;
                document += `${data.improved}\n\n`;
            } else if (data && data.original) {
                document += `${sec.label}\n`;
                document += `${data.original}\n\n`;
            }
        }

        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', 'attachment; filename=improved_resume.txt');
        res.send(document);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error downloading resume' });
    }
};
