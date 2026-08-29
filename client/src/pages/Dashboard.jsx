import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Briefcase, Map, Target } from 'lucide-react';
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
                // If 404, it means no analysis exists yet
                console.log("No analysis found");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return <div className="text-center mt-20">Loading dashboard...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name.split(' ')[0]} 👋</h1>
            <p className="text-gray-600 mb-8">Here is an overview of your career progress.</p>

            {analysis ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                            <Briefcase className="w-8 h-8 text-blue-500 mb-3" />
                            <h3 className="text-sm font-medium text-gray-500">Selected Career</h3>
                            <p className="text-xl font-bold text-gray-900 mt-1">{analysis.careerName}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                            <Target className="w-8 h-8 text-brand-500 mb-3" />
                            <h3 className="text-sm font-medium text-gray-500">Readiness Score</h3>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{analysis.readinessScore}%</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                            <Map className="w-8 h-8 text-green-500 mb-3" />
                            <h3 className="text-sm font-medium text-gray-500">Matched Skills</h3>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{analysis.matchedSkills.length}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                            <Map className="w-8 h-8 text-red-500 mb-3" />
                            <h3 className="text-sm font-medium text-gray-500">Skills to Learn</h3>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{analysis.missingSkills.length}</p>
                        </div>
                    </div>
                </>
            ) : (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center mb-10">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Target className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Analysis Yet</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">Upload your resume and select a career to generate your personalized skill gap analysis.</p>
                </div>
            )}

            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button onClick={() => navigate('/upload-resume')} className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-brand-500 hover:shadow-md transition-all text-left">
                    <div className="p-3 bg-brand-50 text-brand-600 rounded-lg"><FileText className="w-6 h-6" /></div>
                    <div><h4 className="font-semibold text-gray-900">Upload Resume</h4><p className="text-sm text-gray-500">Update your skills</p></div>
                </button>
                <button onClick={() => navigate('/careers')} className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-brand-500 hover:shadow-md transition-all text-left">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Briefcase className="w-6 h-6" /></div>
                    <div><h4 className="font-semibold text-gray-900">Choose Career</h4><p className="text-sm text-gray-500">Explore paths</p></div>
                </button>
                <button onClick={() => navigate('/analysis')} className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-brand-500 hover:shadow-md transition-all text-left">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Target className="w-6 h-6" /></div>
                    <div><h4 className="font-semibold text-gray-900">Skill Analysis</h4><p className="text-sm text-gray-500">View your gaps</p></div>
                </button>
                <button onClick={() => navigate('/roadmap')} className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-brand-500 hover:shadow-md transition-all text-left">
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg"><Map className="w-6 h-6" /></div>
                    <div><h4 className="font-semibold text-gray-900">View Roadmap</h4><p className="text-sm text-gray-500">Continue learning</p></div>
                </button>
            </div>
        </div>
    );
};
export default Dashboard;
