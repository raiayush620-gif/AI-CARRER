import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

    if (loading) return <div className="text-center mt-20 text-gray-600">Building your personalized roadmap...</div>;

    if (!analysis || analysis.missingSkills.length === 0) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">You're all set!</h2>
                <p className="text-gray-600 mb-8">You already possess the core skills required for this career path.</p>
                <button onClick={() => navigate('/dashboard')} className="px-6 py-2 bg-brand-600 text-white rounded-md">Return to Dashboard</button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900">Your Personalized Learning Roadmap</h1>
                <p className="mt-2 text-lg text-gray-600">Based on your skill gap for <span className="font-semibold text-brand-600">{analysis.careerName}</span>.</p>
            </div>

            <div className="space-y-6">
                {analysis.missingSkills.map((skill, index) => (
                    <div key={skill} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-brand-300 transition-colors">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-brand-100 text-brand-700 font-bold rounded-full flex items-center justify-center flex-shrink-0 text-xl">
                                {index + 1}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{skill}</h3>
                                <p className="text-gray-600 text-sm mb-3">Master this core skill to fulfill the requirements for {analysis.careerName}.</p>
                                <div className="flex gap-3 text-xs font-medium">
                                    <span className="bg-red-50 text-red-700 px-2 py-1 rounded border border-red-100">Priority: High</span>
                                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">Duration: 2-3 Weeks</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-shrink-0 mt-4 md:mt-0 self-start md:self-center">
                            <button 
                                onClick={() => navigate(`/roadmap/${encodeURIComponent(analysis.careerName)}/${encodeURIComponent(skill)}`)}
                                className="px-6 py-2 bg-brand-50 text-brand-700 border border-brand-200 rounded-lg hover:bg-brand-600 hover:text-white transition-colors font-medium w-full md:w-auto"
                            >
                                Start Learning
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default PersonalizedRoadmap;
