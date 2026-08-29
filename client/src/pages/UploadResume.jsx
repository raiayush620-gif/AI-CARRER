import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, X, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../services/api';

const UploadResume = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isDragActive, setIsDragActive] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        validateFile(selectedFile);
    };

    const validateFile = (selectedFile) => {
        setError('');
        setIsDragActive(false);
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
        setIsDragActive(false);
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
        <div className="max-w-4xl mx-auto px-4 py-16 transition-colors duration-300">
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 font-medium text-sm mb-6 border border-brand-100 dark:border-brand-800/30">
                    <Sparkles className="w-4 h-4" /> 
                    <span>AI-Powered Extraction</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">Upload Your Resume</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Upload your resume in PDF format. Our AI engine will extract your skills and help identify your career gaps.</p>
            </div>

            <div className="bg-white dark:bg-dark-card p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100 dark:border-dark-border relative overflow-hidden transition-colors duration-300">
                {/* Background glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                {!file ? (
                    <div 
                        onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
                        onDragLeave={() => setIsDragActive(false)}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300 ${isDragActive ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-900/10' : 'border-gray-300 dark:border-dark-border hover:border-brand-400 hover:bg-gray-50 dark:hover:bg-dark-bg'}`}
                    >
                        <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 transition-colors ${isDragActive ? 'bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400' : 'bg-gray-100 text-gray-500 dark:bg-dark-border dark:text-gray-400'}`}>
                            <UploadCloud className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Drag & drop your resume</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">Supports PDF up to 5MB</p>
                        <label className="cursor-pointer bg-brand-500 text-white px-8 py-3.5 rounded-full font-bold hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/30 inline-flex items-center gap-2">
                            Browse Files
                            <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                        </label>
                    </div>
                ) : (
                    <div className="border border-brand-200 dark:border-brand-900/50 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between bg-brand-50/50 dark:bg-brand-900/10">
                        <div className="flex items-center gap-5 w-full">
                            <div className="p-4 bg-white dark:bg-dark-card rounded-xl shadow-sm border border-brand-100 dark:border-brand-800/30">
                                <FileText className="h-10 w-10 text-brand-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-900 dark:text-white truncate">{file.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB • PDF Document</p>
                            </div>
                            <button onClick={() => !loading && setFile(null)} disabled={loading} className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors ml-4 shrink-0">
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                {loading && (
                    <div className="mt-6 p-6 border border-brand-200 dark:border-brand-900/50 rounded-2xl bg-brand-50/50 dark:bg-brand-900/10 text-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500 mx-auto mb-4"></div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-1">Analyzing Resume...</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Extracting skills using AI.</p>
                    </div>
                )}

                {file && !loading && (
                    <div className="mt-8 flex justify-end">
                        <button 
                            onClick={handleSubmit} 
                            className="px-8 py-3.5 rounded-full font-bold text-white transition-all bg-brand-500 hover:bg-brand-600 shadow-lg shadow-brand-500/30 w-full md:w-auto flex items-center justify-center gap-2"
                        >
                            <Sparkles className="w-5 h-5" /> Extract Skills
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
export default UploadResume;
