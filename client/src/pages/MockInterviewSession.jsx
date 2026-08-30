import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bot, ChevronRight, CheckCircle2, AlertCircle, LoaderCircle, Send } from 'lucide-react';
import api from '../services/api';

const MockInterviewSession = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [answer, setAnswer] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAdvancing, setIsAdvancing] = useState(false);
    
    // Derived state
    const currentQuestion = session?.questions?.[session.currentQuestionIndex];
    const isAnswered = currentQuestion?.isAnswered;

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const res = await api.get(`/interviews/${id}`);
                setSession(res.data);
                if (res.data.status === 'completed') {
                    // Navigate to report if already completed (assume we will build a report component or render it here)
                }
            } catch (err) {
                console.error(err);
                alert('Session not found.');
                navigate('/mock-interview');
            } finally {
                setLoading(false);
            }
        };
        fetchSession();
    }, [id, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!answer.trim()) return;
        setIsSubmitting(true);
        try {
            const res = await api.post(`/interviews/${id}/answer`, { answer });
            setSession(res.data);
        } catch (err) {
            console.error(err);
            alert('Failed to evaluate answer.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNext = async () => {
        setIsAdvancing(true);
        try {
            const res = await api.post(`/interviews/${id}/next-question`);
            setSession(res.data);
            setAnswer('');
        } catch (err) {
            console.error(err);
            alert('Failed to advance.');
        } finally {
            setIsAdvancing(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <LoaderCircle className="w-12 h-12 animate-spin text-brand-500" />
        </div>
    );

    if (session?.status === 'completed') {
        return (
            <div className="max-w-4xl mx-auto py-12 transition-colors duration-300">
                <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border p-10 rounded-3xl shadow-sm text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="w-20 h-20 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Interview Complete!</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">You have successfully completed the mock interview for {session.role}.</p>
                    
                    <div className="bg-gray-50 dark:bg-dark-bg p-8 rounded-2xl inline-block w-full max-w-md border border-gray-200 dark:border-dark-border mb-8">
                        <div className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Overall Score</div>
                        <div className="text-6xl font-extrabold text-brand-600 dark:text-brand-400 mb-6">{session.overallScore} <span className="text-2xl text-gray-400">/ 100</span></div>
                        
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-gray-700 dark:text-gray-300">Technical</span>
                                <span className="font-bold text-gray-900 dark:text-white">{session.technicalScore}%</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-gray-700 dark:text-gray-300">Communication</span>
                                <span className="font-bold text-gray-900 dark:text-white">{session.communicationScore}%</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-gray-700 dark:text-gray-300">Problem Solving</span>
                                <span className="font-bold text-gray-900 dark:text-white">{session.problemSolvingScore}%</span>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <button onClick={() => navigate('/mock-interview')} className="bg-brand-500 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-brand-600 transition-colors shadow-sm">
                            Practice Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 transition-colors duration-300">
            {/* Header info */}
            <div className="flex flex-wrap items-center justify-between mb-8 gap-4 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border p-4 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 p-2 rounded-lg">
                        <Bot className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900 dark:text-white">{session?.role} Interview</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{session?.difficulty} • {session?.interviewType}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm font-bold text-gray-600 dark:text-gray-300">
                        Question {session?.currentQuestionIndex + 1} of {session?.totalQuestions}
                    </div>
                    <div className="w-32 bg-gray-100 dark:bg-dark-bg h-2.5 rounded-full overflow-hidden border border-gray-200 dark:border-dark-border">
                        <div 
                            className="bg-brand-500 h-full transition-all duration-500" 
                            style={{ width: `${((session?.currentQuestionIndex) / session?.totalQuestions) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Question Card */}
            <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border p-8 rounded-3xl shadow-sm mb-6 relative">
                <div className="flex items-start gap-4">
                    <div className="mt-1 shrink-0 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 p-3 rounded-full">
                        <Bot className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-brand-600 dark:text-brand-400 mb-1 uppercase tracking-wider">AI Interviewer</div>
                        <p className="text-xl font-medium text-gray-900 dark:text-white leading-relaxed">
                            {currentQuestion?.question}
                        </p>
                    </div>
                </div>
            </div>

            {/* Answer Area or Feedback */}
            {!isAnswered ? (
                <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border p-6 sm:p-8 rounded-3xl shadow-sm">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                        Your Answer
                    </label>
                    <form onSubmit={handleSubmit}>
                        <div className="relative">
                            {isSubmitting && (
                                <div className="absolute inset-0 bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-10">
                                    <LoaderCircle className="w-8 h-8 animate-spin text-brand-500 mb-2" />
                                    <span className="text-sm font-bold text-brand-600">Evaluating...</span>
                                </div>
                            )}
                            <textarea 
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="Type your answer here..."
                                className="w-full min-h-[200px] p-5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-900 dark:text-white resize-y"
                            />
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button 
                                type="submit"
                                disabled={!answer.trim() || isSubmitting}
                                className="px-8 py-3 bg-brand-500 text-white font-bold rounded-xl hover:bg-brand-600 disabled:opacity-50 transition-colors flex items-center gap-2"
                            >
                                Submit Answer <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* User's Answer */}
                    <div className="bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border p-6 rounded-3xl">
                        <div className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Your Answer</div>
                        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{currentQuestion.answer}</p>
                    </div>

                    {/* AI Feedback */}
                    <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border p-8 rounded-3xl shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <div className="text-sm font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider flex items-center gap-2">
                                <Sparkles className="w-4 h-4" /> Evaluation Feedback
                            </div>
                            <div className="bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border px-4 py-2 rounded-xl text-center">
                                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Score</div>
                                <div className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">{currentQuestion.score}<span className="text-base text-gray-400">/10</span></div>
                            </div>
                        </div>

                        <p className="text-gray-700 dark:text-gray-300 text-lg mb-8 leading-relaxed">
                            {currentQuestion.feedback}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-green-50/50 dark:bg-green-900/10 p-5 rounded-2xl border border-green-100 dark:border-green-900/30">
                                <h4 className="font-bold text-green-800 dark:text-green-400 mb-3 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" /> Strengths
                                </h4>
                                <ul className="space-y-2">
                                    {currentQuestion.strengths?.map((s, i) => (
                                        <li key={i} className="text-sm text-green-700 dark:text-green-500 flex items-start gap-2">
                                            <span className="shrink-0 mt-1">•</span>
                                            <span>{s}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-amber-50/50 dark:bg-amber-900/10 p-5 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                                <h4 className="font-bold text-amber-800 dark:text-amber-400 mb-3 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" /> Areas to Improve
                                </h4>
                                <ul className="space-y-2">
                                    {currentQuestion.improvements?.map((s, i) => (
                                        <li key={i} className="text-sm text-amber-700 dark:text-amber-500 flex items-start gap-2">
                                            <span className="shrink-0 mt-1">•</span>
                                            <span>{s}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-dark-border">
                            <button 
                                onClick={handleNext}
                                disabled={isAdvancing}
                                className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2 shadow-sm"
                            >
                                {isAdvancing ? 'Loading...' : (session.currentQuestionIndex + 1 >= session.totalQuestions ? 'Complete Interview' : 'Next Question')} 
                                {!isAdvancing && <ChevronRight className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MockInterviewSession;
