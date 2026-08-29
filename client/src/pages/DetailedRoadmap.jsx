import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckSquare, Square } from 'lucide-react';
import api from '../services/api';

const DetailedRoadmap = () => {
    const { career, skill } = useParams();
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoadmap = async () => {
            try {
                const { data } = await api.get(`/roadmap/${encodeURIComponent(career)}/${encodeURIComponent(skill)}`);
                setRoadmap(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRoadmap();
    }, [career, skill]);

    const handleToggleStep = async (stepNumber) => {
        let newCompleted = [...roadmap.completedSteps];
        if (newCompleted.includes(stepNumber)) {
            newCompleted = newCompleted.filter(s => s !== stepNumber);
        } else {
            newCompleted.push(stepNumber);
        }

        const newPercentage = Math.round((newCompleted.length / roadmap.steps.length) * 100);

        setRoadmap({ ...roadmap, completedSteps: newCompleted, progressPercentage: newPercentage });

        try {
            await api.post('/roadmap/progress', {
                careerName: career,
                skillName: skill,
                completedSteps: newCompleted,
                totalSteps: roadmap.steps.length
            });
        } catch (err) {
            console.error('Error saving progress', err);
        }
    };

    if (loading) return <div className="text-center mt-20">Loading roadmap...</div>;
    if (!roadmap) return <div className="text-center mt-20">Roadmap not found.</div>;

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <button onClick={() => navigate('/roadmap')} className="flex items-center text-gray-500 hover:text-brand-600 mb-8">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Overview
            </button>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{skill} Roadmap</h1>
                <p className="text-gray-600 mb-6">Career Path: {career}</p>
                
                <div className="mb-2 flex justify-between text-sm font-medium">
                    <span className="text-gray-700">Overall Progress</span>
                    <span className="text-brand-600">{roadmap.progressPercentage}% Complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-brand-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${roadmap.progressPercentage}%` }}></div>
                </div>
            </div>

            <div className="space-y-4">
                {roadmap.steps.map(step => {
                    const isCompleted = roadmap.completedSteps.includes(step.step);
                    return (
                        <div 
                            key={step.step} 
                            onClick={() => handleToggleStep(step.step)}
                            className={`p-6 rounded-xl border flex items-start gap-4 cursor-pointer transition-colors ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 hover:border-brand-300'}`}
                        >
                            <div className="mt-1">
                                {isCompleted ? <CheckSquare className="w-6 h-6 text-green-600" /> : <Square className="w-6 h-6 text-gray-400" />}
                            </div>
                            <div>
                                <h3 className={`text-lg font-bold mb-1 ${isCompleted ? 'text-green-800 line-through opacity-70' : 'text-gray-900'}`}>
                                    Step {step.step}: {step.title}
                                </h3>
                                <p className={`text-sm ${isCompleted ? 'text-green-600 opacity-70' : 'text-gray-600'}`}>
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
export default DetailedRoadmap;
