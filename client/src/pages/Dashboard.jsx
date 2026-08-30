import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Briefcase, Map, Target, TrendingUp, Sparkles, AlertCircle, Mic, Star, Upload, Compass } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [analysis, setAnalysis] = useState(null);
    const [improvedResumeData, setImprovedResumeData] = useState(null);
    const [interviewData, setInterviewData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { data } = await api.get('/analysis/latest');
                setAnalysis(data);
            } catch (err) {
                console.log("No analysis found");
            }
            try {
                const { data } = await api.get('/resume-improvement/data');
                setImprovedResumeData(data.improvedResume);
            } catch (err) {
                console.log("No improved resume found");
            }
            try {
                const { data } = await api.get('/interviews/history');
                if (data && data.length > 0) {
                    setInterviewData(data[0]); // latest
                }
            } catch (err) {
                console.log("No interview history found");
            }
            setLoading(false);
        };
        fetchDashboardData();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
        </div>
    );

    const getApprovedCount = (sections) => {
        if (!sections) return 0;
        return Object.values(sections).filter(s => s.status === 'approved').length;
    };

    return (
        <div className="max-w-7xl mx-auto transition-colors duration-300">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-primary-theme flex items-center gap-3">
                        <Sparkles className="w-8 h-8 text-brand-500" />
                        Welcome back, {user.name.split(' ')[0]}!
                    </h1>
                    <p className="text-secondary-theme mt-2 text-lg">Here is an overview of your career preparation progress.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* CAREER ANALYSIS CARD */}
                <div className="lg:col-span-2 card p-8 relative overflow-hidden flex flex-col justify-between relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div>
                        <h2 className="text-lg font-bold text-primary-theme mb-2 uppercase tracking-wide flex items-center gap-2">
                            <Target className="w-5 h-5 text-brand-500" /> Career Readiness
                        </h2>
                        {analysis ? (
                            <div className="flex flex-col sm:flex-row items-center gap-6 mt-6">
                                <div className="text-center">
                                    <div className="text-5xl font-extrabold text-brand-600 dark:text-brand-400">{analysis.readinessScore}<span className="text-2xl text-gray-400">%</span></div>
                                    <p className="text-sm font-semibold text-secondary-theme mt-1 uppercase">Readiness Score</p>
                                </div>
                                <div className="flex-1 space-y-3 w-full">
                                    <div className="flex justify-between items-center bg-gray-50 dark:bg-dark-bg p-3 rounded-xl border border-gray-100 dark:border-dark-border">
                                        <span className="font-semibold text-secondary-theme">Target Role</span>
                                        <span className="font-bold text-primary-theme truncate ml-4">{analysis.careerName}</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="flex-1 bg-green-50 dark:bg-green-900/10 p-3 rounded-xl border border-green-100 dark:border-green-900/30 text-center">
                                            <div className="text-xl font-bold text-brand-600 dark:text-brand-400">{analysis.matchedSkills.length}</div>
                                            <div className="text-xs font-semibold text-brand-600 uppercase">Matched</div>
                                        </div>
                                        <div className="flex-1 bg-red-50 dark:bg-red-900/10 p-3 rounded-xl border border-red-100 dark:border-red-900/30 text-center">
                                            <div className="text-xl font-bold text-gold-600 dark:text-gold-400">{analysis.missingSkills.length}</div>
                                            <div className="text-xs font-semibold text-[#C86B5A] uppercase">Missing</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-secondary-theme mb-4">No analysis yet. Upload your resume to start.</p>
                                <button onClick={() => navigate('/upload-resume')} className="btn-primary">Analyze Resume</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* SIDE CARDS */}
                <div className="flex flex-col gap-6">
                    {/* RESUME IMPROVEMENT CARD */}
                    <div className="card p-6 relative overflow-hidden flex flex-col justify-between group flex-1 flex flex-col justify-between group">
                        <div>
                            <h2 className="text-sm font-bold text-secondary-theme uppercase tracking-wide flex items-center gap-2 mb-4">
                                <FileText className="w-4 h-4" /> AI Resume
                            </h2>
                            {improvedResumeData ? (
                                <div className="mb-4">
                                    <div className="text-3xl font-extrabold text-primary-theme">
                                        {getApprovedCount(improvedResumeData.sections)} <span className="text-lg text-gray-400">/ 8</span>
                                    </div>
                                    <p className="text-sm font-semibold text-secondary-theme mt-1">Improved Sections</p>
                                </div>
                            ) : (
                                <p className="text-sm text-secondary-theme mb-4">Transform your resume into a premium version.</p>
                            )}
                        </div>
                        <button onClick={() => navigate('/resume-improvement')} className="btn-secondary w-full border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300">
                            Improve Resume
                        </button>
                    </div>

                    {/* INTERVIEW READINESS CARD */}
                    <div className="card p-6 relative overflow-hidden flex flex-col justify-between group flex-1 flex flex-col justify-between group">
                        <div>
                            <h2 className="text-sm font-bold text-secondary-theme uppercase tracking-wide flex items-center gap-2 mb-4">
                                <Mic className="w-4 h-4" /> Interview Readiness
                            </h2>
                            {interviewData ? (
                                <div className="mb-4">
                                    <div className="text-3xl font-extrabold text-primary-theme">
                                        {interviewData.overallScore || 0} <span className="text-lg text-gray-400">/ 100</span>
                                    </div>
                                    <p className="text-sm font-semibold text-secondary-theme mt-1 truncate">Latest: {interviewData.role}</p>
                                </div>
                            ) : (
                                <p className="text-sm text-secondary-theme mb-4">No mock interviews completed yet.</p>
                            )}
                        </div>
                        <button onClick={() => navigate('/mock-interview')} className="btn-primary w-full">
                            Start Interview
                        </button>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-primary-theme mb-6">Explore Tools</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <button onClick={() => navigate('/upload-resume')} className="flex flex-col items-center justify-center gap-3 p-6 card rounded-2xl hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-md transition-all">
                    <div className="p-3 bg-brand-100 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-xl"><Upload className="w-6 h-6" /></div>
                    <span className="font-bold text-sm text-primary-theme text-center">Upload Resume</span>
                </button>
                <button onClick={() => navigate('/careers')} className="flex flex-col items-center justify-center gap-3 p-6 card rounded-2xl hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-md transition-all">
                    <div className="p-3 bg-brand-100 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-xl"><Compass className="w-6 h-6" /></div>
                    <span className="font-bold text-sm text-primary-theme text-center">Career Explorer</span>
                </button>
                <button onClick={() => navigate('/analysis')} className="flex flex-col items-center justify-center gap-3 p-6 card rounded-2xl hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-md transition-all">
                    <div className="p-3 bg-brand-100 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-xl"><Target className="w-6 h-6" /></div>
                    <span className="font-bold text-sm text-primary-theme text-center">Skill Analysis</span>
                </button>
                <button onClick={() => navigate('/roadmap')} className="flex flex-col items-center justify-center gap-3 p-6 card rounded-2xl hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-md transition-all">
                    <div className="p-3 bg-brand-100 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-xl"><Map className="w-6 h-6" /></div>
                    <span className="font-bold text-sm text-primary-theme text-center">My Roadmap</span>
                </button>
                <button onClick={() => navigate('/resume-improvement')} className="flex flex-col items-center justify-center gap-3 p-6 card rounded-2xl hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-md transition-all">
                    <div className="p-3 bg-gold-100 dark:bg-gold-900/20 text-gold-600 dark:text-gold-400 rounded-xl"><FileText className="w-6 h-6" /></div>
                    <span className="font-bold text-sm text-primary-theme text-center">AI Resume</span>
                </button>
                <button onClick={() => navigate('/mock-interview')} className="flex flex-col items-center justify-center gap-3 p-6 card rounded-2xl hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-md transition-all">
                    <div className="p-3 bg-gold-100 dark:bg-gold-900/20 text-gold-600 dark:text-gold-400 rounded-xl"><Mic className="w-6 h-6" /></div>
                    <span className="font-bold text-sm text-primary-theme text-center">Mock Interview</span>
                </button>
            </div>
        </div>
    );
};
export default Dashboard;
