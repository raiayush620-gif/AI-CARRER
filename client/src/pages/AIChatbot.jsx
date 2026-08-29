import { useState, useEffect, useRef } from 'react';
import { Send, Bot, LoaderCircle, Sparkles, Trash2, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import api from '../services/api';

const AIChatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchingHistory, setFetchingHistory] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { data } = await api.get('/chat/history');
                if (data.history) {
                    setMessages(data.history);
                }
            } catch (error) {
                console.error('Error fetching chat history:', error);
            } finally {
                setFetchingHistory(false);
            }
        };
        fetchHistory();
    }, []);

    const clearHistory = async () => {
        if (!confirm('Are you sure you want to clear your chat history?')) return;
        try {
            await api.delete('/chat/history');
            setMessages([]);
        } catch (err) {
            console.error('Failed to clear history', err);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        const trimmed = input.trim();
        if (!trimmed || loading) return;

        const userMsg = { role: 'user', content: trimmed };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const { data } = await api.post('/chat', { message: trimmed });
            if (data.success) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: "Sorry, I couldn't generate a response right now. Please try again.",
                isError: true
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const suggestQuestion = (q) => {
        setInput(q);
    };

    if (fetchingHistory) {
        return (
            <div className="flex justify-center items-center h-[80vh]">
                <LoaderCircle className="w-10 h-10 animate-spin text-brand-500" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-80px)] flex flex-col transition-colors duration-300">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
                        <div className="bg-brand-100 dark:bg-brand-900/30 p-2 rounded-xl text-brand-600 dark:text-brand-400">
                            <Bot className="w-7 h-7" />
                        </div>
                        AI Career Assistant
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2 font-medium">Your personal guide for programming, career growth, and interviews.</p>
                </div>
                {messages.length > 0 && (
                    <button onClick={clearHistory} className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-2 text-sm font-bold bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border px-4 py-2 rounded-lg hover:border-red-200 dark:hover:border-red-900/50">
                        <Trash2 className="w-4 h-4" /> Clear Chat
                    </button>
                )}
            </div>

            <div className="flex-1 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl shadow-sm flex flex-col overflow-hidden transition-colors duration-300">
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gray-50/50 dark:bg-dark-bg/50">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
                            <div className="w-20 h-20 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-brand-500/10">
                                <Sparkles className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Hi! I'm your AI Assistant.</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-10 text-lg">I can help you analyze your skills, prepare for technical interviews, debug code, or explain complex concepts.</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                                {['What should I learn to become a MERN developer?', 'How can I improve my resume?', 'Explain React hooks with examples.', 'Suggest a project for my current skill level.'].map((q, i) => (
                                    <button key={i} onClick={() => suggestQuestion(q)} className="px-5 py-4 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-brand-400 dark:hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 hover:shadow-md transition-all text-left flex items-start gap-3 group">
                                        <ArrowRight className="w-5 h-5 shrink-0 text-gray-300 dark:text-gray-600 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors mt-0.5" />
                                        <span>{q}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[90%] sm:max-w-[80%] rounded-3xl px-6 py-4 shadow-sm ${
                                        msg.role === 'user' 
                                            ? 'bg-brand-500 text-white rounded-br-sm' 
                                            : msg.isError 
                                                ? 'bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-bl-sm' 
                                                : 'bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border text-gray-800 dark:text-gray-200 rounded-bl-sm shadow-sm'
                                    }`}>
                                        {msg.role === 'assistant' && !msg.isError && (
                                            <div className="flex items-center gap-2 mb-2 text-brand-600 dark:text-brand-400 font-bold text-xs uppercase tracking-wider">
                                                <Bot className="w-4 h-4" /> Career Maker AI
                                            </div>
                                        )}
                                        <div className={`prose prose-sm sm:prose-base max-w-none break-words ${msg.role === 'user' ? 'text-white' : 'dark:prose-invert prose-brand'}`}>
                                            {msg.role === 'assistant' && !msg.isError ? (
                                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                                            ) : (
                                                <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border text-gray-500 dark:text-gray-400 rounded-3xl rounded-bl-sm px-6 py-4 shadow-sm flex items-center gap-3">
                                        <LoaderCircle className="w-5 h-5 animate-spin text-brand-500" />
                                        <span className="text-sm font-bold">Assistant is thinking...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                <div className="p-4 sm:p-6 bg-white dark:bg-dark-card border-t border-gray-100 dark:border-dark-border transition-colors duration-300">
                    <form onSubmit={handleSend} className="relative max-w-4xl mx-auto flex items-end gap-3">
                        <div className="relative w-full">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Message AI Career Assistant..."
                                className="w-full bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-2xl py-4 pl-5 pr-14 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white dark:focus:bg-dark-card text-gray-900 dark:text-white transition-all resize-none max-h-32 min-h-[60px]"
                                rows="1"
                            />
                            <button 
                                type="submit" 
                                disabled={!input.trim() || loading}
                                className="absolute right-2 bottom-2 p-3 bg-brand-500 text-white rounded-xl disabled:opacity-50 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed hover:bg-brand-600 hover:shadow-md hover:shadow-brand-500/20 transition-all"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                    <p className="text-center text-xs font-medium text-gray-400 dark:text-gray-500 mt-3">AI can make mistakes. Consider verifying important information.</p>
                </div>
            </div>
        </div>
    );
};

export default AIChatbot;
