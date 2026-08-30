import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle, ArrowRight, Target, LayoutDashboard, Compass } from 'lucide-react';
import api from '../services/api';

const CircularProgress = ({ percentage }) => {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    className="text-gray-100 dark:text-dark-border"
                    strokeWidth="12"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="80"
                    cy="80"
                />
                <circle
                    className="text-brand-500 transition-all duration-1000 ease-out"
                    strokeWidth="12"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="80"
                    cy="80"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold text-primary-theme">{percentage}%</span>
            </div>
        </div>
    );
};

const SkillAnalysis = () => {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const { data } = await api.get('/analysis/latest');
                setAnalysis(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load analysis');
            } finally {
                setLoading(false);
            }
        };
        fetchAnalysis();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
        </div>
    );
    
    if (error || !analysis) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-20 text-center transition-colors duration-300">
                <div className="w-20 h-20 bg-gray-50 dark:bg-dark-bg rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100 dark:border-dark-border">
                    <Compass className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                </div>
                <h2 className="text-3xl font-extrabold text-primary-theme mb-4">Complete your setup</h2>
                <p className="text-secondary-theme mb-8 text-lg">{error || 'Upload your resume and choose a career to view your analysis.'}</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button onClick={() => navigate('/upload-resume')} className="btn-primary px-8 py-3.5">Upload Resume</button>
                    <button onClick={() => navigate('/careers')} className="btn-secondary px-8 py-3.5">Explore Careers</button>
                </div>
            </div>
        );
    }

    const readinessLevel = analysis.readinessScore < 30 ? 'Getting Started' :
                         analysis.readinessScore < 60 ? 'Building Foundation' :
                         analysis.readinessScore < 80 ? 'Good Progress' : 'Job Ready Foundation';

    return (
        <div className="max-w-5xl mx-auto px-4 py-12 transition-colors duration-300">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-primary-theme tracking-tight mb-4">Skill Gap Analysis</h1>
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 font-medium border border-brand-100 dark:border-brand-800/30 text-lg">
                    <Target className="w-5 h-5" />
                    <span>Target Career: <strong className="font-bold">{analysis.careerName}</strong></span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Score Section */}
                <div className="md:col-span-1 card p-8 flex flex-col items-center justify-center text-center h-full relative overflow-hidden transition-colors duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                    <h3 className="text-sm font-bold text-secondary-theme uppercase tracking-wider mb-8">Career Readiness Score</h3>
                    
                    <CircularProgress percentage={analysis.readinessScore} />
                    
                    <p className="mt-8 text-brand-600 dark:text-brand-400 font-bold text-lg bg-brand-50 dark:bg-brand-900/20 px-6 py-2 rounded-full border border-brand-100 dark:border-brand-800/30">
                        {readinessLevel}
                    </p>
                </div>

                {/* Skills Section */}
                <div className="md:col-span-2 space-y-6">
                    <div className="card border-brand-500/30 p-8 transition-colors duration-300">
                        <h3 className="text-xl font-bold text-primary-theme mb-6 flex items-center gap-3">
                            <div className="p-2 bg-brand-500/20 text-brand-500 rounded-lg">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                            Matched Skills <span className="text-gray-400 dark:text-gray-500 text-base font-medium">({analysis.matchedSkills.length})</span>
                        </h3>
                        {analysis.matchedSkills.length > 0 ? (
                            <div className="flex flex-wrap gap-3">
                                {analysis.matchedSkills.map(skill => (
                                    <span key={skill} className="px-4 py-2 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 rounded-xl text-sm font-bold border border-green-200 dark:border-green-900/30 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> {skill}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-secondary-theme bg-gray-50 dark:bg-dark-bg p-4 rounded-xl border border-gray-100 dark:border-dark-border text-center font-medium">No exact skill matches found from your resume.</p>
                        )}
                    </div>

                    <div className="card border-gold-500/30 p-8 transition-colors duration-300">
                        <h3 className="text-xl font-bold text-primary-theme mb-3 flex items-center gap-3">
                            <div className="p-2 bg-gold-500/20 text-gold-500 rounded-lg">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            Missing Skills <span className="text-gray-400 dark:text-gray-500 text-base font-medium">({analysis.missingSkills.length})</span>
                        </h3>
                        <p className="text-secondary-theme mb-6 font-medium">Mastering these skills will significantly boost your readiness for this career path.</p>
                        
                        {analysis.missingSkills.length > 0 ? (
                            <div className="flex flex-wrap gap-3">
                                {analysis.missingSkills.map(skill => (
                                    <span key={skill} className="px-4 py-2 bg-orange-50 dark:bg-orange-900/10 text-orange-700 dark:text-orange-400 rounded-xl text-sm font-bold border border-orange-200 dark:border-orange-900/30 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> {skill}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-900/30 text-center">You have all the core required skills!</p>
                        )}
                    </div>
                    
                    <div className="flex justify-end pt-6">
                        <button 
                            onClick={() => navigate('/roadmap')}
                            className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/30 group"
                        >
                            Generate Personalized Roadmap <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default SkillAnalysis;
