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
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
                        <Sparkles className="w-8 h-8 text-brand-500" />
                        Welcome back, {user.name.split(' ')[0]}!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">Here is an overview of your career preparation progress.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* CAREER ANALYSIS CARD */}
                <div className="lg:col-span-2 bg-white dark:bg-dark-card p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-dark-border relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-wide flex items-center gap-2">
                            <Target className="w-5 h-5 text-brand-500" /> Career Readiness
                        </h2>
                        {analysis ? (
                            <div className="flex flex-col sm:flex-row items-center gap-6 mt-6">
                                <div className="text-center">
                                    <div className="text-5xl font-extrabold text-brand-600 dark:text-brand-400">{analysis.readinessScore}<span className="text-2xl text-gray-400">%</span></div>
                                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1 uppercase">Readiness Score</p>
                                </div>
                                <div className="flex-1 space-y-3 w-full">
                                    <div className="flex justify-between items-center bg-gray-50 dark:bg-dark-bg p-3 rounded-xl border border-gray-100 dark:border-dark-border">
                                        <span className="font-semibold text-gray-600 dark:text-gray-300">Target Role</span>
                                        <span className="font-bold text-gray-900 dark:text-white truncate ml-4">{analysis.careerName}</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="flex-1 bg-green-50 dark:bg-green-900/10 p-3 rounded-xl border border-green-100 dark:border-green-900/30 text-center">
                                            <div className="text-xl font-bold text-green-600 dark:text-green-400">{analysis.matchedSkills.length}</div>
                                            <div className="text-xs font-semibold text-green-700 dark:text-green-500 uppercase">Matched</div>
                                        </div>
                                        <div className="flex-1 bg-red-50 dark:bg-red-900/10 p-3 rounded-xl border border-red-100 dark:border-red-900/30 text-center">
                                            <div className="text-xl font-bold text-red-600 dark:text-red-400">{analysis.missingSkills.length}</div>
                                            <div className="text-xs font-semibold text-red-700 dark:text-red-500 uppercase">Missing</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-gray-500 dark:text-gray-400 mb-4">No analysis yet. Upload your resume to start.</p>
                                <button onClick={() => navigate('/upload-resume')} className="bg-brand-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-brand-600 transition-colors">Analyze Resume</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* SIDE CARDS */}
                <div className="flex flex-col gap-6">
                    {/* RESUME IMPROVEMENT CARD */}
                    <div className="bg-white dark:bg-dark-card p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-dark-border flex-1 flex flex-col justify-between group">
                        <div>
                            <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-2 mb-4">
                                <FileText className="w-4 h-4" /> AI Resume
                            </h2>
                            {improvedResumeData ? (
                                <div className="mb-4">
                                    <div className="text-3xl font-extrabold text-gray-900 dark:text-white">
                                        {getApprovedCount(improvedResumeData.sections)} <span className="text-lg text-gray-400">/ 8</span>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1">Improved Sections</p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Transform your resume into a premium version.</p>
                            )}
                        </div>
                        <button onClick={() => navigate('/resume-improvement')} className="w-full py-2.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:border-brand-500 hover:text-brand-600 transition-colors">
                            Improve Resume
                        </button>
                    </div>

                    {/* INTERVIEW READINESS CARD */}
                    <div className="bg-white dark:bg-dark-card p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-dark-border flex-1 flex flex-col justify-between group">
                        <div>
                            <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-2 mb-4">
                                <Mic className="w-4 h-4" /> Interview Readiness
                            </h2>
                            {interviewData ? (
                                <div className="mb-4">
                                    <div className="text-3xl font-extrabold text-gray-900 dark:text-white">
                                        {interviewData.overallScore || 0} <span className="text-lg text-gray-400">/ 100</span>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1 truncate">Latest: {interviewData.role}</p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">No mock interviews completed yet.</p>
                            )}
                        </div>
                        <button onClick={() => navigate('/mock-interview')} className="w-full py-2.5 bg-brand-500 text-white font-bold rounded-xl hover:bg-brand-600 transition-colors shadow-sm shadow-brand-500/20">
                            Start Interview
                        </button>
                    </div>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Explore Tools</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <button onClick={() => navigate('/upload-resume')} className="flex flex-col items-center justify-center gap-3 p-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-md transition-all">
                    <div className="p-3 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-xl"><Upload className="w-6 h-6" /></div>
                    <span className="font-bold text-sm text-gray-900 dark:text-white text-center">Upload Resume</span>
                </button>
                <button onClick={() => navigate('/careers')} className="flex flex-col items-center justify-center gap-3 p-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl"><Compass className="w-6 h-6" /></div>
                    <span className="font-bold text-sm text-gray-900 dark:text-white text-center">Career Explorer</span>
                </button>
                <button onClick={() => navigate('/analysis')} className="flex flex-col items-center justify-center gap-3 p-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-md transition-all">
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl"><Target className="w-6 h-6" /></div>
                    <span className="font-bold text-sm text-gray-900 dark:text-white text-center">Skill Analysis</span>
                </button>
                <button onClick={() => navigate('/roadmap')} className="flex flex-col items-center justify-center gap-3 p-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl hover:border-green-500 dark:hover:border-green-500 hover:shadow-md transition-all">
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl"><Map className="w-6 h-6" /></div>
                    <span className="font-bold text-sm text-gray-900 dark:text-white text-center">My Roadmap</span>
                </button>
                <button onClick={() => navigate('/resume-improvement')} className="flex flex-col items-center justify-center gap-3 p-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl hover:border-orange-500 dark:hover:border-orange-500 hover:shadow-md transition-all">
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-xl"><FileText className="w-6 h-6" /></div>
                    <span className="font-bold text-sm text-gray-900 dark:text-white text-center">AI Resume</span>
                </button>
                <button onClick={() => navigate('/mock-interview')} className="flex flex-col items-center justify-center gap-3 p-6 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl hover:border-red-500 dark:hover:border-red-500 hover:shadow-md transition-all">
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl"><Mic className="w-6 h-6" /></div>
                    <span className="font-bold text-sm text-gray-900 dark:text-white text-center">Mock Interview</span>
                </button>
            </div>
        </div>
    );
};
export default Dashboard;
