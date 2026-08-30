import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Circle, Compass, ChevronRight } from 'lucide-react';
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

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
        </div>
    );
    if (!roadmap) return (
        <div className="text-center mt-20 text-secondary-theme">Roadmap not found.</div>
    );

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 transition-colors duration-300">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm font-medium text-secondary-theme mb-8">
                <button onClick={() => navigate('/roadmap')} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Overview
                </button>
                <ChevronRight className="w-4 h-4" />
                <span className="text-primary-theme truncate max-w-[150px] sm:max-w-xs">{career}</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-brand-600 dark:text-brand-400 font-bold truncate">{skill}</span>
            </div>
            
            {/* Header Card */}
            <div className="bg-white dark:bg-dark-card p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-dark-border mb-12 relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 font-medium text-sm mb-4 border border-brand-100 dark:border-brand-800/30">
                            <Compass className="w-4 h-4" /> 
                            <span>Learning Module</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-primary-theme mb-2">{skill}</h1>
                        <p className="text-lg text-secondary-theme">Master this skill to advance your career as a {career}.</p>
                    </div>
                    <div className="w-full md:w-64">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-sm font-bold text-secondary-theme uppercase tracking-wider">Progress</span>
                            <span className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">{roadmap.progressPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-dark-bg rounded-full h-3 border border-gray-200 dark:border-dark-border overflow-hidden">
                            <div className="bg-brand-500 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(20,184,166,0.5)]" style={{ width: `${roadmap.progressPercentage}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Curriculum */}
            <h2 className="text-2xl font-bold text-primary-theme mb-6">Module Curriculum</h2>
            <div className="space-y-4">
                {roadmap.steps.map(step => {
                    const isCompleted = roadmap.completedSteps.includes(step.step);
                    return (
                        <div 
                            key={step.step} 
                            onClick={() => handleToggleStep(step.step)}
                            className={`group relative p-6 md:p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-start gap-5 ${
                                isCompleted 
                                ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30 shadow-none' 
                                : 'bg-white dark:bg-dark-card border-gray-100 dark:border-dark-border hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md'
                            }`}
                        >
                            <div className="mt-0.5 shrink-0 transition-transform group-hover:scale-110">
                                {isCompleted ? (
                                    <CheckCircle2 className="w-7 h-7 text-brand-500 dark:text-green-400" />
                                ) : (
                                    <Circle className="w-7 h-7 text-gray-300 dark:text-gray-600 group-hover:text-brand-400" />
                                )}
                            </div>
                            <div>
                                <h3 className={`text-xl font-bold mb-2 transition-colors ${
                                    isCompleted 
                                    ? 'text-secondary-theme line-through' 
                                    : 'text-primary-theme'
                                }`}>
                                    <span className="text-brand-500 dark:text-brand-400 mr-2 opacity-80">Step {step.step}.</span>
                                    {step.title}
                                </h3>
                                <p className={`text-base leading-relaxed transition-colors ${
                                    isCompleted 
                                    ? 'text-gray-400 dark:text-gray-500 line-through opacity-70' 
                                    : 'text-gray-600 dark:text-gray-300'
                                }`}>
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {roadmap.progressPercentage === 100 && (
                <div className="mt-12 p-8 bg-gradient-to-r from-brand-600 to-blue-600 rounded-3xl text-center text-white shadow-xl">
                    <CheckCircle2 className="w-16 h-16 mx-auto text-white mb-4 opacity-90" />
                    <h3 className="text-3xl font-bold mb-2">Module Completed!</h3>
                    <p className="text-brand-100 text-lg max-w-lg mx-auto mb-8">You have successfully mastered {skill}. Keep going and tackle your next missing skill.</p>
                    <button onClick={() => navigate('/roadmap')} className="px-8 py-3.5 bg-white text-brand-700 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                        Back to Roadmap
                    </button>
                </div>
            )}
        </div>
    );
};
export default DetailedRoadmap;
