import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Sparkles, AlertCircle, Copy, Check, Download, Briefcase, Plus, LoaderCircle, Settings, Target } from 'lucide-react';
import api from '../services/api';

const ResumeImprovement = () => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState('professionalSummary');
    const [editorContent, setEditorContent] = useState('');
    const [aiImprovedText, setAiImprovedText] = useState('');
    const [targetRole, setTargetRole] = useState('');
    const [isImproving, setIsImproving] = useState(false);
    
    // AI Evaluation data
    const [suggestions, setSuggestions] = useState([]);
    const [weakStatements, setWeakStatements] = useState([]);
    const [atsKeywords, setAtsKeywords] = useState([]);
    
    // Feedback states
    const [copySuccess, setCopySuccess] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const SECTIONS = [
        { id: 'professionalSummary', label: 'Professional Summary' },
        { id: 'objective', label: 'Objective' },
        { id: 'skills', label: 'Skills' },
        { id: 'experience', label: 'Experience' },
        { id: 'projects', label: 'Projects' },
        { id: 'education', label: 'Education' },
        { id: 'achievements', label: 'Achievements' },
        { id: 'certifications', label: 'Certifications' }
    ];

    const IMPROVEMENT_MODES = [
        'Improve Writing',
        'Make Professional',
        'Make Concise',
        'Make Impactful',
        'Make ATS Friendly',
        'Fix Grammar'
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await api.get('/resume-improvement/data');
            setData(res.data.improvedResume);
            setTargetRole(res.data.improvedResume.targetRole || res.data.resume.careerName || '');
            const sec = res.data.improvedResume.sections[activeSection];
            if (sec) {
                setEditorContent(sec.original || '');
                setAiImprovedText(sec.improved || '');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSectionChange = (sectionId) => {
        setActiveSection(sectionId);
        if (data && data.sections[sectionId]) {
            setEditorContent(data.sections[sectionId].original || '');
            setAiImprovedText(data.sections[sectionId].improved || '');
        } else {
            setEditorContent('');
            setAiImprovedText('');
        }
        setSuggestions([]);
        setWeakStatements([]);
    };

    const handleImprove = async (mode) => {
        if (!editorContent.trim()) return alert('Please enter some content first.');
        setIsImproving(true);
        try {
            const res = await api.post('/resume-improvement/improve-section', {
                sectionName: SECTIONS.find(s => s.id === activeSection).label,
                content: editorContent,
                mode,
                targetRole
            });
            
            setAiImprovedText(res.data.improvedText || '');
            setSuggestions(res.data.suggestions || []);
            setWeakStatements(res.data.weakStatements || []);
            
            // Auto save original in backend
            await api.post('/resume-improvement/save-progress', {
                sections: {
                    [activeSection]: {
                        original: editorContent,
                        improved: res.data.improvedText,
                        status: 'pending'
                    }
                },
                targetRole
            });
            
            // update local state
            setData(prev => ({
                ...prev,
                sections: {
                    ...prev.sections,
                    [activeSection]: {
                        ...prev.sections[activeSection],
                        original: editorContent,
                        improved: res.data.improvedText,
                        status: 'pending'
                    }
                }
            }));
            
        } catch (err) {
            console.error(err);
            alert('Failed to generate improvements. Please try again.');
        } finally {
            setIsImproving(false);
        }
    };

    const fetchAtsKeywords = async () => {
        if (!targetRole) return alert('Please enter a target role first.');
        try {
            const skillsSec = data.sections.skills?.original || '';
            const res = await api.post('/resume-improvement/ats-keywords', {
                targetRole,
                currentSkills: skillsSec
            });
            setAtsKeywords(res.data.suggestedKeywords || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleApply = async () => {
        if (!aiImprovedText) return;
        try {
            await api.post('/resume-improvement/save-progress', {
                sections: {
                    [activeSection]: {
                        original: editorContent,
                        improved: aiImprovedText,
                        status: 'approved'
                    }
                }
            });
            
            setData(prev => ({
                ...prev,
                sections: {
                    ...prev.sections,
                    [activeSection]: {
                        ...prev.sections[activeSection],
                        original: editorContent,
                        improved: aiImprovedText,
                        status: 'approved'
                    }
                }
            }));
            
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 2000);
        } catch (err) {
            console.error(err);
            alert('Failed to save progress.');
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(aiImprovedText);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const downloadResume = async () => {
        try {
            const res = await api.get('/resume-improvement/download', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'improved_resume.txt');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            console.error(err);
            alert('Error downloading resume.');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <LoaderCircle className="w-12 h-12 animate-spin text-brand-500" />
        </div>
    );

    if (!data) return (
        <div className="max-w-xl mx-auto px-4 py-20 text-center transition-colors duration-300">
            <div className="w-20 h-20 bg-gray-50 dark:bg-dark-bg rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100 dark:border-dark-border shadow-sm">
                <FileText className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">No Resume Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Upload and analyze your resume first to use the AI Improvement tools.</p>
            <button onClick={() => navigate('/upload-resume')} className="bg-brand-500 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/30">
                Upload Resume
            </button>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto transition-colors duration-300 flex flex-col h-[calc(100vh-100px)]">
            <div className="flex justify-between items-end mb-6 shrink-0">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
                        <Sparkles className="w-8 h-8 text-brand-500" />
                        AI Resume Improvement
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 font-medium">Transform your resume into a more professional, impactful, and ATS-friendly version.</p>
                </div>
                <button onClick={downloadResume} className="hidden sm:flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2.5 rounded-xl font-bold hover:opacity-90 transition-opacity">
                    <Download className="w-4 h-4" /> Download Improved
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
                {/* Left Panel - Sections */}
                <div className="lg:w-64 shrink-0 flex flex-col gap-3 overflow-y-auto pr-2 pb-4">
                    <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border p-4 rounded-2xl mb-2">
                        <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block">Target Job Role</label>
                        <input 
                            type="text" 
                            value={targetRole}
                            onChange={(e) => setTargetRole(e.target.value)}
                            placeholder="e.g. Frontend Developer"
                            className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-brand-500 text-gray-900 dark:text-white"
                        />
                    </div>
                    
                    <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2">Resume Sections</h3>
                    {SECTIONS.map(sec => {
                        const isApproved = data.sections[sec.id]?.status === 'approved';
                        return (
                            <button 
                                key={sec.id}
                                onClick={() => handleSectionChange(sec.id)}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all border ${
                                    activeSection === sec.id 
                                        ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 border-brand-200 dark:border-brand-800/30 shadow-sm' 
                                        : 'bg-white dark:bg-dark-card text-gray-600 dark:text-gray-400 border-transparent hover:border-gray-200 dark:hover:border-dark-border'
                                }`}
                            >
                                <span>{sec.label}</span>
                                {isApproved && <Check className="w-4 h-4 text-green-500" />}
                            </button>
                        );
                    })}
                </div>

                {/* Right Panel - Editor */}
                <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl shadow-sm">
                    <div className="flex-1 overflow-y-auto p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-dark-border pb-4">
                            {SECTIONS.find(s => s.id === activeSection)?.label}
                        </h2>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {/* Original Content */}
                            <div className="flex flex-col">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-gray-400" /> Original Content
                                </label>
                                <textarea 
                                    value={editorContent}
                                    onChange={(e) => setEditorContent(e.target.value)}
                                    placeholder={`Paste or type your existing ${activeSection} here...`}
                                    className="flex-1 min-h-[250px] p-4 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white resize-y"
                                />
                                
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {IMPROVEMENT_MODES.map(mode => (
                                        <button 
                                            key={mode}
                                            onClick={() => handleImprove(mode)}
                                            disabled={isImproving}
                                            className="px-3 py-1.5 text-xs font-bold bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300 rounded-lg hover:border-brand-500 hover:text-brand-600 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                                        >
                                            <Sparkles className="w-3 h-3" /> {mode}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* AI Improved Version */}
                            <div className="flex flex-col">
                                <label className="text-sm font-bold text-brand-600 dark:text-brand-400 mb-2 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" /> AI Improved Version
                                </label>
                                <div className="relative flex-1 min-h-[250px]">
                                    {isImproving ? (
                                        <div className="absolute inset-0 bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-10 border border-brand-100 dark:border-brand-900/30">
                                            <LoaderCircle className="w-8 h-8 animate-spin text-brand-500 mb-3" />
                                            <span className="text-sm font-bold text-brand-600 dark:text-brand-400">AI is improving your resume...</span>
                                        </div>
                                    ) : null}
                                    <textarea 
                                        value={aiImprovedText}
                                        onChange={(e) => setAiImprovedText(e.target.value)}
                                        placeholder="AI improvements will appear here..."
                                        className="w-full h-full p-4 bg-brand-50/50 dark:bg-brand-900/10 border border-brand-100 dark:border-brand-900/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white resize-y"
                                    />
                                </div>
                                
                                <div className="mt-4 flex gap-3">
                                    <button 
                                        onClick={handleApply}
                                        disabled={!aiImprovedText || isImproving}
                                        className="flex-1 bg-brand-500 text-white py-2 rounded-xl font-bold hover:bg-brand-600 disabled:opacity-50 transition-colors shadow-sm flex justify-center items-center gap-2"
                                    >
                                        {saveSuccess ? <Check className="w-4 h-4" /> : <Target className="w-4 h-4" />}
                                        {saveSuccess ? 'Applied!' : 'Apply Changes'}
                                    </button>
                                    <button 
                                        onClick={handleCopy}
                                        disabled={!aiImprovedText || isImproving}
                                        className="px-4 bg-gray-100 dark:bg-dark-bg text-gray-700 dark:text-gray-300 py-2 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center gap-2"
                                    >
                                        {copySuccess ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Analysis Feedback Sections */}
                        {(suggestions.length > 0 || weakStatements.length > 0) && (
                            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-gray-100 dark:border-dark-border">
                                {suggestions.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <Briefcase className="w-4 h-4 text-brand-500" /> Stronger Action Verbs
                                        </h4>
                                        <div className="space-y-3">
                                            {suggestions.map((s, i) => (
                                                <div key={i} className="bg-gray-50 dark:bg-dark-bg p-3 rounded-xl border border-gray-100 dark:border-dark-border text-sm">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="line-through text-gray-400">{s.original}</span>
                                                        <span className="text-gray-400">→</span>
                                                        <span className="font-bold text-green-600 dark:text-green-400">{s.suggestion}</span>
                                                    </div>
                                                    <p className="text-gray-500 dark:text-gray-400 text-xs">{s.reason}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {weakStatements.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 text-amber-500" /> Weak Statements Detected
                                        </h4>
                                        <div className="space-y-3">
                                            {weakStatements.map((w, i) => (
                                                <div key={i} className="bg-amber-50/50 dark:bg-amber-900/10 p-3 rounded-xl border border-amber-100 dark:border-amber-900/30 text-sm">
                                                    <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">"{w.text}"</p>
                                                    <p className="text-amber-700 dark:text-amber-500 text-xs font-semibold mb-1">{w.reason}</p>
                                                    <p className="text-gray-600 dark:text-gray-400 text-xs">Suggestion: {w.suggestion}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ATS Keywords */}
                        {activeSection === 'skills' && (
                            <div className="mt-10 pt-8 border-t border-gray-100 dark:border-dark-border">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Target className="w-4 h-4 text-brand-500" /> ATS Keyword Suggestions
                                    </h4>
                                    <button onClick={fetchAtsKeywords} className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 px-3 py-1.5 rounded-lg hover:bg-brand-100 transition-colors">
                                        Generate Keywords
                                    </button>
                                </div>
                                {atsKeywords.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {atsKeywords.map((kw, i) => (
                                            <div key={i} className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border px-3 py-1.5 rounded-lg text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2 shadow-sm">
                                                {kw}
                                                <button 
                                                    onClick={() => setAiImprovedText(prev => prev ? `${prev}, ${kw}` : kw)}
                                                    className="text-brand-500 hover:text-brand-600"
                                                    title="Add to improved text"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Click generate to get role-specific keywords. Do not add skills you don't actually possess.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeImprovement;
