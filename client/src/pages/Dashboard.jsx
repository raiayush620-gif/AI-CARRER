import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Briefcase, Map, Target, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { data } = await api.get('/analysis/latest');
                setAnalysis(data);
            } catch (err) {
                console.log("No analysis found");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-300">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
                        Welcome back, {user?.name.split(' ')[0]} <span className="text-2xl">👋</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">Continue building your career journey with CAREER MAKER.</p>
                </div>
                <button onClick={() => navigate('/chat')} className="mt-4 md:mt-0 flex items-center gap-2 bg-white dark:bg-dark-card text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-900 px-6 py-2.5 rounded-full hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors shadow-sm font-medium">
                    <Sparkles className="w-4 h-4" /> Ask AI Assistant
                </button>
            </div>

            {analysis ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border flex flex-col items-center text-center group hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Briefcase className="w-7 h-7" />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Target Career</h3>
                            <p className="text-xl font-bold text-gray-900 dark:text-white mt-1 truncate w-full px-2" title={analysis.careerName}>{analysis.careerName}</p>
                        </div>
                        <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border flex flex-col items-center text-center group hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-brand-50 dark:bg-brand-900/20 text-brand-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Target className="w-7 h-7" />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Readiness Score</h3>
                            <div className="flex items-end justify-center gap-1 mt-1">
                                <p className="text-3xl font-extrabold text-gray-900 dark:text-white leading-none">{analysis.readinessScore}</p>
                                <span className="text-lg font-bold text-gray-500 dark:text-gray-400 mb-0.5">%</span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border flex flex-col items-center text-center group hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Map className="w-7 h-7" />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Matched Skills</h3>
                            <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1 leading-none">{analysis.matchedSkills.length}</p>
                        </div>
                        <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border flex flex-col items-center text-center group hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-7 h-7" />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Skills to Learn</h3>
                            <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1 leading-none">{analysis.missingSkills.length}</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-brand-600 to-blue-700 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between mb-12 shadow-lg">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Resume analyzed successfully!</h3>
                            <p className="text-brand-100 max-w-xl">You're on your way to becoming a {analysis.careerName}. Follow your personalized roadmap to master your missing skills.</p>
                        </div>
                        <button onClick={() => navigate('/roadmap')} className="mt-6 md:mt-0 shrink-0 bg-white text-brand-700 hover:bg-gray-50 px-6 py-3 rounded-xl font-bold transition-colors shadow-sm">
                            View My Roadmap
                        </button>
                    </div>
                </>
            ) : (
                <div className="bg-white dark:bg-dark-card p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-dark-border text-center mb-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="w-20 h-20 bg-gray-50 dark:bg-dark-bg rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100 dark:border-dark-border">
                        <AlertCircle className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No Analysis Yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto text-lg">Upload your resume and select a career to generate your personalized skill gap analysis.</p>
                    <button onClick={() => navigate('/upload-resume')} className="inline-flex items-center gap-2 bg-brand-500 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/30">
                        <FileText className="w-5 h-5" /> Analyze My Resume Now
                    </button>
                </div>
            )}

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <button onClick={() => navigate('/upload-resume')} className="group flex items-start gap-4 p-5 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-md transition-all text-left">
                    <div className="p-3.5 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-xl group-hover:scale-110 transition-transform"><FileText className="w-6 h-6" /></div>
                    <div><h4 className="font-bold text-gray-900 dark:text-white">Upload Resume</h4><p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Update your skills</p></div>
                </button>
                <button onClick={() => navigate('/careers')} className="group flex items-start gap-4 p-5 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all text-left">
                    <div className="p-3.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl group-hover:scale-110 transition-transform"><Briefcase className="w-6 h-6" /></div>
                    <div><h4 className="font-bold text-gray-900 dark:text-white">Choose Career</h4><p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Explore paths</p></div>
                </button>
                <button onClick={() => navigate('/analysis')} className="group flex items-start gap-4 p-5 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-md transition-all text-left">
                    <div className="p-3.5 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl group-hover:scale-110 transition-transform"><Target className="w-6 h-6" /></div>
                    <div><h4 className="font-bold text-gray-900 dark:text-white">Skill Analysis</h4><p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">View your gaps</p></div>
                </button>
                <button onClick={() => navigate('/roadmap')} className="group flex items-start gap-4 p-5 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl hover:border-green-500 dark:hover:border-green-500 hover:shadow-md transition-all text-left">
                    <div className="p-3.5 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl group-hover:scale-110 transition-transform"><Map className="w-6 h-6" /></div>
                    <div><h4 className="font-bold text-gray-900 dark:text-white">View Roadmap</h4><p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Continue learning</p></div>
                </button>
            </div>
        </div>
    );
};
export default Dashboard;
