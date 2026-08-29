import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Careers = () => {
    const [careers, setCareers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCareers = async () => {
            try {
                const { data } = await api.get('/careers');
                setCareers(data);
            } catch (err) {
                console.error('Failed to fetch careers', err);
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

    if (loading) return <div className="text-center mt-20">Loading careers...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900">Choose Your Career Path</h1>
                <p className="mt-2 text-gray-600">Select a career to see how your current skills align with industry requirements.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {careers.map((career) => (
                    <div key={career.name} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">{career.icon}</span>
                            <h3 className="text-xl font-bold text-gray-900">{career.name}</h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-6 flex-grow">{career.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                            <span className="bg-gray-100 px-2 py-1 rounded">{career.difficulty}</span>
                            <span>{career.estimatedDuration}</span>
                        </div>

                        <div className="flex gap-3 mt-auto">
                            <button 
                                onClick={() => navigate(`/careers/${career.name}`)}
                                className="flex-1 py-2 border border-brand-500 text-brand-600 rounded-lg hover:bg-brand-50 transition-colors font-medium text-sm"
                            >
                                View Details
                            </button>
                            <button 
                                onClick={() => handleSelectCareer(career.name)}
                                className="flex-1 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium text-sm"
                            >
                                Choose Career
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default Careers;
