import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, File, X, CheckCircle } from 'lucide-react';
import api from '../services/api';

const UploadResume = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        validateFile(selectedFile);
    };

    const validateFile = (selectedFile) => {
        setError('');
        if (!selectedFile) return;

        if (selectedFile.type !== 'application/pdf') {
            setError('Please upload a PDF file.');
            setFile(null);
            return;
        }

        if (selectedFile.size > 5 * 1024 * 1024) {
            setError('File size must be less than 5MB.');
            setFile(null);
            return;
        }

        setFile(selectedFile);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        validateFile(droppedFile);
    };

    const handleSubmit = async () => {
        if (!file) return;
        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('resume', file);

        try {
            await api.post('/resume/upload', formData);
            setTimeout(() => {
                navigate('/careers');
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || 'Error uploading resume');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900">Upload Your Resume</h1>
                <p className="mt-2 text-gray-600">Upload your resume in PDF format. We'll analyze your skills and help identify your career gaps.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                {!file ? (
                    <div 
                        onDragOver={e => e.preventDefault()} 
                        onDrop={handleDrop}
                        className="border-2 border-dashed border-brand-300 rounded-xl p-12 text-center hover:bg-brand-50 transition-colors"
                    >
                        <UploadCloud className="mx-auto h-12 w-12 text-brand-500 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Drag and drop your resume</h3>
                        <p className="text-sm text-gray-500 mb-4">PDF up to 5MB</p>
                        <label className="cursor-pointer bg-brand-50 text-brand-700 px-6 py-2 rounded-md font-medium hover:bg-brand-100 transition-colors">
                            Choose PDF File
                            <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                        </label>
                    </div>
                ) : (
                    <div className="border border-gray-200 rounded-xl p-6 flex items-center justify-between bg-gray-50">
                        <div className="flex items-center gap-4">
                            <File className="h-8 w-8 text-brand-500" />
                            <div>
                                <p className="font-medium text-gray-900">{file.name}</p>
                                <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        </div>
                        <button onClick={() => setFile(null)} className="text-gray-400 hover:text-red-500">
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                )}

                {error && <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}
                {loading && <div className="mt-4 p-3 bg-blue-50 text-blue-600 rounded-md text-sm flex items-center gap-2">Analyzing your resume...</div>}

                <div className="mt-8 flex justify-end">
                    <button 
                        onClick={handleSubmit} 
                        disabled={!file || loading}
                        className={`px-8 py-3 rounded-lg font-medium text-white transition-colors ${!file || loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700'}`}
                    >
                        {loading ? 'Processing...' : 'Analyze Skills'}
                    </button>
                </div>
            </div>
        </div>
    );
};
export default UploadResume;
