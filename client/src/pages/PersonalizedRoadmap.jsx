import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, AlertCircle, BookOpen, CheckCircle, Sparkles } from 'lucide-react';
import api from '../services/api';

const PersonalizedRoadmap = () => {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const { data } = await api.get('/analysis/latest');
                setAnalysis(data);
            } catch (err) {
                console.error(err);
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

    if (!analysis || analysis.missingSkills.length === 0) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-20 text-center transition-colors duration-300">
                <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-100 dark:border-green-900/30">
                    <CheckCircle className="w-10 h-10 text-green-500 dark:text-green-400" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">You're all set!</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">You already possess the core skills required for this career path.</p>
                <button onClick={() => navigate('/dashboard')} className="px-8 py-3.5 bg-brand-500 text-white font-bold rounded-xl hover:bg-brand-600 shadow-lg shadow-brand-500/30 transition-all">Return to Dashboard</button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-16 transition-colors duration-300">
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 font-medium text-sm mb-6 border border-brand-100 dark:border-brand-800/30">
                    <Sparkles className="w-4 h-4" /> 
                    <span>AI-Generated Path</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">Your Personalized Roadmap</h1>
                <p className="mt-2 text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    A step-by-step curriculum designed to bridge your skill gap for <strong className="font-bold text-gray-900 dark:text-white">{analysis.careerName}</strong>.
                </p>
            </div>

            <div className="relative">
                {/* Vertical Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-dark-border hidden md:block"></div>

                <div className="space-y-6">
                    {analysis.missingSkills.map((skill, index) => (
                        <div key={skill} className="relative flex flex-col md:flex-row gap-6 md:gap-8 group">
                            {/* Timeline Node */}
                            <div className="hidden md:flex flex-col items-center z-10 pt-4">
                                <div className="w-16 h-16 bg-white dark:bg-dark-card border-4 border-gray-100 dark:border-dark-border group-hover:border-brand-500 dark:group-hover:border-brand-500 rounded-full flex items-center justify-center text-xl font-bold text-gray-400 dark:text-gray-500 group-hover:text-brand-500 transition-colors shadow-sm">
                                    {index + 1}
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="flex-1 bg-white dark:bg-dark-card p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-dark-border hover:shadow-lg hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="md:hidden w-8 h-8 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 font-bold rounded-full flex items-center justify-center text-sm">
                                            {index + 1}
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{skill}</h3>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-base mb-5 leading-relaxed">
                                        Master this core skill to fulfill the requirements for {analysis.careerName}. This comprehensive module will guide you from basics to advanced concepts.
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-3">
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 rounded-lg text-sm font-bold border border-red-100 dark:border-red-900/30">
                                            <AlertCircle className="w-4 h-4" /> High Priority
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-bold border border-blue-100 dark:border-blue-900/30">
                                            <Clock className="w-4 h-4" /> 2-3 Weeks
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/10 text-purple-700 dark:text-purple-400 rounded-lg text-sm font-bold border border-purple-100 dark:border-purple-900/30">
                                            <BookOpen className="w-4 h-4" /> 5 Modules
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full md:w-auto shrink-0">
                                    <button 
                                        onClick={() => navigate(`/roadmap/${encodeURIComponent(analysis.careerName)}/${encodeURIComponent(skill)}`)}
                                        className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 font-bold rounded-xl hover:bg-brand-500 hover:text-white transition-colors border border-brand-200 dark:border-brand-900/50 group-hover:border-brand-500"
                                    >
                                        <Play className="w-5 h-5" /> Start Learning
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default PersonalizedRoadmap;
