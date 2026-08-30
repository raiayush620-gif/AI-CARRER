import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Briefcase, BookOpen, Clock, AlertCircle, Target } from 'lucide-react';
import api from '../services/api';

const Careers = () => {
    const [careers, setCareers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCareers = async () => {
            try {
                const { data } = await api.get('/careers');
                setCareers(data);
            } catch (err) {
                console.error('Failed to fetch careers', err);
                setError('Could not load career paths at this time.');
            } finally {
                setLoading(false);
            }
        };
        fetchCareers();
    }, []);

    const handleSelectCareer = async (careerName) => {
        try {
            await api.post('/analysis', { careerName });
            navigate('/analysis');
        } catch (err) {
            alert(err.response?.data?.message || 'Error generating analysis. Make sure you uploaded a resume.');
            if (err.response?.status === 404) {
                navigate('/upload-resume');
            }
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
        </div>
    );

    if (error) return (
        <div className="max-w-xl mx-auto px-4 py-20 text-center transition-colors duration-300">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100 dark:border-red-900/30">
                <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-primary-theme mb-2">Oops!</h2>
            <p className="text-secondary-theme">{error}</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-16 transition-colors duration-300">
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 font-medium text-sm mb-6 border border-brand-100 dark:border-brand-800/30">
                    <Compass className="w-4 h-4" /> 
                    <span>Career Pathways</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-primary-theme tracking-tight mb-4">Choose Your Path</h1>
                <p className="mt-2 text-xl text-secondary-theme max-w-2xl mx-auto">
                    Select a career destination. Our AI will analyze your skills against the industry standards required to get hired.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {careers.map((career) => (
                    <div key={career.name} className="group bg-white dark:bg-dark-card p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-dark-border hover:shadow-xl hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-300 flex flex-col h-full relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-500/10 transition-colors"></div>
                        
                        <div className="flex items-center gap-4 mb-6 relative z-10">
                            <div className="w-14 h-14 bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                                {career.icon}
                            </div>
                            <h3 className="text-xl font-bold text-primary-theme leading-tight">{career.name}</h3>
                        </div>
                        
                        <p className="text-secondary-theme text-base mb-8 flex-grow leading-relaxed">
                            {career.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm font-bold text-secondary-theme mb-8 border-t border-b border-gray-100 dark:border-dark-border py-4">
                            <div className="flex items-center gap-1.5">
                                <Briefcase className="w-4 h-4 text-brand-500" />
                                <span className="bg-gray-100 dark:bg-dark-bg px-2.5 py-1 rounded-md">{career.difficulty}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-brand-500" />
                                <span>{career.estimatedDuration}</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 mt-auto relative z-10">
                            <button 
                                onClick={() => navigate(`/careers/${career.name}`)}
                                className="flex-1 py-3 bg-white dark:bg-dark-card border-2 border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300 rounded-xl hover:border-brand-500 dark:hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition-all font-bold flex items-center justify-center gap-2"
                            >
                                <BookOpen className="w-4 h-4" /> Details
                            </button>
                            <button 
                                onClick={() => handleSelectCareer(career.name)}
                                className="flex-1 py-3 bg-brand-500 text-white rounded-xl hover:bg-brand-600 transition-all shadow-md shadow-brand-500/20 font-bold flex items-center justify-center gap-2"
                            >
                                <Target className="w-4 h-4" /> Select
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Assuming Target needs to be imported, I forgot to add it in the import list
// It will break if I don't import it. I'll add Target to lucide-react import
export default Careers;
