const skillDatabase = require('../data/skillDatabase');

const detectSkills = (resumeText) => {
    const text = resumeText.toLowerCase();
    const detectedSkills = [];
    const seen = new Set();
    
    // Some common aliases to normalize
    const aliases = {
        'react.js': 'React', 'react js': 'React',
        'node.js': 'Node.js', 'nodejs': 'Node.js', 'node js': 'Node.js',
        'express.js': 'Express.js', 'expressjs': 'Express.js',
        'mongo': 'MongoDB',
        'js': 'JavaScript',
        'ts': 'TypeScript'
    };
    
    Object.keys(skillDatabase).forEach(category => {
        skillDatabase[category].forEach(skill => {
            let skillLower = skill.toLowerCase();
            
            // Check exact skill name as a whole word, or aliases
            // Using regex for whole word match to avoid matching 'js' inside 'objects'
            let matched = false;
            const regex = new RegExp(`\\b${skillLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
            
            if (regex.test(text)) {
                matched = true;
            } else {
                // Check aliases
                for (let [alias, canonical] of Object.entries(aliases)) {
                    if (canonical === skill) {
                        const aliasRegex = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
                        if (aliasRegex.test(text)) {
                            matched = true;
                            break;
                        }
                    }
                }
            }
            
            if (matched && !seen.has(skill)) {
                seen.add(skill);
                detectedSkills.push({ name: skill, category });
            }
        });
    });
    
    return detectedSkills;
};

module.exports = detectSkills;
