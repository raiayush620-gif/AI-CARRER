import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Target, Layers, Hash, Sparkles, ChevronRight, History } from 'lucide-react';
import api from '../services/api';

const MockInterviewSetup = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('');
    const [difficulty, setDifficulty] = useState('Intermediate');
    const [interviewType, setInterviewType] = useState('Technical');
    const [totalQuestions, setTotalQuestions] = useState(5);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    
    const ROLES = [
        'Software Developer', 'Java Developer', 'Frontend Developer', 
        'Backend Developer', 'Full Stack Developer', 'Data Analyst', 
        'Data Scientist', 'AI Engineer', 'Cloud Engineer', 'Cybersecurity Analyst'
    ];

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get('/interviews/history');
                setHistory(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchHistory();
    }, []);

    const handleStart = async (e) => {
        e.preventDefault();
        if (!role.trim()) return alert('Please enter or select a job role');
        setLoading(true);
        try {
            const res = await api.post('/interviews/start', {
                role, difficulty, interviewType, totalQuestions
            });
            navigate(`/mock-interview/${res.data._id}`);
        } catch (err) {
            console.error(err);
            alert('Failed to start interview.');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-8 transition-colors duration-300">
            <div className="text-center mb-12">
                <div className="w-20 h-20 bg-brand-500/10 text-brand-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-500/10">
                    <Mic className="w-10 h-10" />
                </div>
                <h1 className="text-4xl font-extrabold text-primary-theme mb-3">AI Mock Interview</h1>
                <p className="text-secondary-theme text-lg max-w-xl mx-auto">Practice realistic interviews, receive personalized feedback, and improve your communication skills.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Configuration Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleStart} className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border p-8 rounded-3xl shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                        
                        <div className="relative z-10 space-y-6">
                            <div>
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                                    <Target className="w-4 h-4 text-brand-500" /> Target Job Role
                                </label>
                                <input 
                                    type="text" 
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    placeholder="e.g. Frontend Developer"
                                    list="roles"
                                    className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 text-primary-theme"
                                />
                                <datalist id="roles">
                                    {ROLES.map(r => <option key={r} value={r} />)}
                                </datalist>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                                        <Layers className="w-4 h-4 text-brand-500" /> Difficulty Level
                                    </label>
                                    <select 
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 text-primary-theme appearance-none"
                                    >
                                        <option>Beginner</option>
                                        <option>Intermediate</option>
                                        <option>Advanced</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                                        <Sparkles className="w-4 h-4 text-brand-500" /> Interview Type
                                    </label>
                                    <select 
                                        value={interviewType}
                                        onChange={(e) => setInterviewType(e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 text-primary-theme appearance-none"
                                    >
                                        <option>Technical</option>
                                        <option>HR</option>
                                        <option>Mixed</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                                    <Hash className="w-4 h-4 text-brand-500" /> Number of Questions
                                </label>
                                <div className="flex gap-4">
                                    {[5, 10, 15].map(num => (
                                        <button 
                                            key={num}
                                            type="button"
                                            onClick={() => setTotalQuestions(num)}
                                            className={`flex-1 py-3 rounded-xl font-bold transition-colors border ${
                                                totalQuestions === num 
                                                    ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-500 text-brand-600 dark:text-brand-400' 
                                                    : 'bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border text-secondary-theme hover:border-brand-300'
                                            }`}
                                        >
                                            {num} Questions
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4">
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full py-4 bg-brand-500 text-white font-bold rounded-xl hover:bg-brand-600 disabled:opacity-50 transition-all shadow-lg shadow-brand-500/30 flex justify-center items-center gap-2 text-lg"
                                >
                                    {loading ? 'Setting up session...' : 'Start Mock Interview'} 
                                    {!loading && <ChevronRight className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* History Panel */}
                <div>
                    <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border p-6 rounded-3xl shadow-sm h-full flex flex-col">
                        <h2 className="text-lg font-bold text-primary-theme mb-6 flex items-center gap-2">
                            <History className="w-5 h-5 text-gray-400" /> My Interview History
                        </h2>
                        
                        <div className="flex-1 overflow-y-auto space-y-4">
                            {history.length === 0 ? (
                                <div className="text-center py-10 text-secondary-theme">
                                    <p>No interviews completed yet.</p>
                                </div>
                            ) : (
                                history.map(session => (
                                    <div key={session._id} className="p-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-primary-theme truncate pr-2">{session.role}</h3>
                                            <div className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20 px-2 py-1 rounded-md">
                                                {session.overallScore !== null ? `${session.overallScore}/100` : 'Inc.'}
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 text-xs text-secondary-theme mb-3">
                                            <span className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border px-2 py-0.5 rounded">{session.difficulty}</span>
                                            <span className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border px-2 py-0.5 rounded">{session.interviewType}</span>
                                        </div>
                                        {session.status === 'completed' && (
                                            <button className="text-xs font-bold text-brand-500 hover:text-brand-600">
                                                View Report
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MockInterviewSetup;
