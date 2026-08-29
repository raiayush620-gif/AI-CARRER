import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Target, Briefcase, Clock, ChevronRight } from 'lucide-react';
import api from '../services/api';

const CareerDetails = () => {
    const { name } = useParams();
    const [career, setCareer] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCareer = async () => {
            try {
                const { data } = await api.get(`/careers/${name}`);
                setCareer(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCareer();
    }, [name]);

    const handleSelectCareer = async () => {
        try {
            await api.post('/analysis', { careerName: career.name });
            navigate('/analysis');
        } catch (err) {
            alert(err.response?.data?.message || 'Error. Ensure you have uploaded a resume.');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
        </div>
    );
    if (!career) return <div className="text-center mt-20 text-gray-500 dark:text-gray-400">Career not found.</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 transition-colors duration-300">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-8">
                <button onClick={() => navigate('/careers')} className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Careers Catalog
                </button>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 dark:text-white font-bold">{career.name}</span>
            </div>
            
            <div className="bg-white dark:bg-dark-card p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-dark-border relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8 relative z-10">
                    <div className="w-20 h-20 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border rounded-2xl flex items-center justify-center text-4xl shadow-sm">
                        {career.icon}
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{career.name}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-dark-bg px-3 py-1.5 rounded-lg border border-gray-200 dark:border-dark-border">
                                <Briefcase className="w-4 h-4 text-brand-500" /> {career.difficulty}
                            </span>
                            <span className="flex items-center gap-1.5 bg-gray-100 dark:bg-dark-bg px-3 py-1.5 rounded-lg border border-gray-200 dark:border-dark-border">
                                <Clock className="w-4 h-4 text-brand-500" /> {career.estimatedDuration}
                            </span>
                        </div>
                    </div>
                </div>
                
                <p className="text-xl text-gray-700 dark:text-gray-300 mb-10 leading-relaxed relative z-10">{career.description}</p>
                
                <div className="bg-gray-50 dark:bg-dark-bg rounded-2xl p-8 mb-10 border border-gray-100 dark:border-dark-border relative z-10">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        Industry Requirements
                        <span className="text-gray-400 dark:text-gray-500 text-lg">({career.requiredSkills.length})</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {career.requiredSkills.map(skill => (
                            <div key={skill} className="flex items-start gap-3 bg-white dark:bg-dark-card p-3 rounded-xl border border-gray-100 dark:border-dark-border shadow-sm">
                                <CheckCircle2 className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
                                <span className="font-bold text-gray-800 dark:text-gray-200">{skill}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-4 border-t border-gray-100 dark:border-dark-border pt-8 relative z-10">
                    <button onClick={handleSelectCareer} className="w-full sm:w-auto px-8 py-4 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/30 flex items-center justify-center gap-2">
                        <Target className="w-5 h-5" /> Select This Career
                    </button>
                </div>
            </div>
        </div>
    );
};
export default CareerDetails;
