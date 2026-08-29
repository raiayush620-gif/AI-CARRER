import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import api from '../services/api';

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

    if (loading) return <div className="text-center mt-20 text-gray-600">Calculating your skill gap...</div>;
    
    if (error || !analysis) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete your setup</h2>
                <p className="text-gray-600 mb-8">{error || 'Upload your resume and choose a career to view your analysis.'}</p>
                <div className="flex justify-center gap-4">
                    <button onClick={() => navigate('/upload-resume')} className="px-6 py-2 bg-brand-600 text-white rounded-md">Upload Resume</button>
                    <button onClick={() => navigate('/careers')} className="px-6 py-2 border border-brand-600 text-brand-600 rounded-md">Explore Careers</button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900">Skill Gap Analysis</h1>
                <p className="mt-2 text-xl text-gray-600">Career: <span className="font-semibold text-brand-600">{analysis.careerName}</span></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Score Section */}
                <div className="md:col-span-1 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center h-full">
                    <h3 className="text-lg font-medium text-gray-500 mb-4">Career Readiness Score</h3>
                    <div className="relative w-40 h-40 flex items-center justify-center rounded-full border-8 border-brand-100 mb-6">
                        <div className="absolute inset-0 rounded-full border-8 border-brand-500" style={{ clipPath: `inset(0 0 ${100 - analysis.readinessScore}% 0)` }}></div>
                        <span className="text-4xl font-extrabold text-gray-900 z-10">{analysis.readinessScore}%</span>
                    </div>
                    <p className="text-gray-600 font-medium">
                        {analysis.readinessScore < 30 ? 'Getting Started' :
                         analysis.readinessScore < 60 ? 'Building Foundation' :
                         analysis.readinessScore < 80 ? 'Good Progress' : 'Job Ready Foundation'}
                    </p>
                </div>

                {/* Skills Section */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100">
                        <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" /> Matched Skills ({analysis.matchedSkills.length})
                        </h3>
                        {analysis.matchedSkills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {analysis.matchedSkills.map(skill => (
                                    <span key={skill} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
                                        ✓ {skill}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No exact skill matches found from your resume.</p>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100">
                        <h3 className="text-lg font-bold text-orange-800 mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" /> Missing Skills ({analysis.missingSkills.length})
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">Focus on the missing skills below to strengthen your preparation for this career path.</p>
                        
                        {analysis.missingSkills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {analysis.missingSkills.map(skill => (
                                    <span key={skill} className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium border border-orange-200">
                                        ⚠ {skill}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-green-600 font-medium">You have all the core required skills!</p>
                        )}
                    </div>
                    
                    <div className="flex justify-end pt-4">
                        <button 
                            onClick={() => navigate('/roadmap')}
                            className="flex items-center gap-2 px-8 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors shadow-sm"
                        >
                            View Personalized Roadmap <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default SkillAnalysis;
