import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
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

    if (loading) return <div className="text-center mt-20">Loading...</div>;
    if (!career) return <div className="text-center mt-20">Career not found.</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <button onClick={() => navigate('/careers')} className="flex items-center text-gray-500 hover:text-brand-600 mb-8">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Careers
            </button>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                    <span className="text-5xl">{career.icon}</span>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{career.name}</h1>
                        <p className="text-gray-500">{career.difficulty} • {career.estimatedDuration}</p>
                    </div>
                </div>
                
                <p className="text-lg text-gray-700 mb-8">{career.description}</p>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">Required Skills ({career.requiredSkills.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
                    {career.requiredSkills.map(skill => (
                        <div key={skill} className="flex items-center gap-2 text-gray-700">
                            <CheckCircle className="w-5 h-5 text-brand-500" />
                            {skill}
                        </div>
                    ))}
                </div>

                <div className="flex justify-end border-t pt-6">
                    <button onClick={handleSelectCareer} className="px-8 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors">
                        Choose This Career
                    </button>
                </div>
            </div>
        </div>
    );
};
export default CareerDetails;
