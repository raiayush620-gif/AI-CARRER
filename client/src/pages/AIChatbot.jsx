import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Trash2, LoaderCircle, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import api from '../services/api';

const AIChatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchingHistory, setFetchingHistory] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchHistory = async () => {
        try {
            const { data } = await api.get('/chat/history');
            if (data.success && data.messages) {
                setMessages(data.messages);
            }
        } catch (error) {
            console.error('Error fetching chat history:', error);
        } finally {
            setFetchingHistory(false);
        }
    };

    const clearHistory = async () => {
        if (!window.confirm('Are you sure you want to clear your chat history?')) return;
        try {
            await api.delete('/chat/history');
            setMessages([]);
        } catch (error) {
            console.error('Error clearing chat history:', error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = async (e) => {
        e?.preventDefault();
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
            <div className="flex justify-center items-center h-96">
                <LoaderCircle className="w-8 h-8 animate-spin text-brand-500" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-80px)] flex flex-col">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Bot className="w-8 h-8 text-brand-500" />
                        AI Career Assistant
                    </h1>
                    <p className="text-gray-600 mt-2">Ask anything about programming, careers, interviews, projects, and your learning journey.</p>
                </div>
                {messages.length > 0 && (
                    <button onClick={clearHistory} className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-2 text-sm font-medium">
                        <Trash2 className="w-4 h-4" /> Clear Chat
                    </button>
                )}
            </div>

            <div className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50/50">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto">
                            <div className="w-16 h-16 bg-brand-100 text-brand-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Hi! I'm your AI Career Assistant.</h2>
                            <p className="text-gray-600 mb-8">I can help you analyze your skills, prepare for interviews, or explain technical concepts.</p>
                            
                            <div className="flex flex-wrap gap-2 justify-center">
                                {['What should I learn to become a MERN developer?', 'How can I improve my resume?', 'Explain React hooks.', 'Suggest a project for my current skill level.'].map((q, i) => (
                                    <button key={i} onClick={() => suggestQuestion(q)} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-brand-300 hover:text-brand-600 transition-colors shadow-sm text-left">
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3.5 shadow-sm ${
                                        msg.role === 'user' 
                                            ? 'bg-brand-600 text-white rounded-br-sm' 
                                            : msg.isError 
                                                ? 'bg-red-50 text-red-700 border border-red-100 rounded-bl-sm' 
                                                : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm'
                                    }`}>
                                        {msg.role === 'assistant' && !msg.isError && (
                                            <div className="flex items-center gap-2 mb-1.5 text-brand-600 font-medium text-xs uppercase tracking-wide">
                                                <Bot className="w-3.5 h-3.5" /> AI Assistant
                                            </div>
                                        )}
                                        <div className="prose prose-sm sm:prose-base max-w-none break-words">
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
                                    <div className="bg-white border border-gray-100 text-gray-500 rounded-2xl rounded-bl-sm px-5 py-4 shadow-sm flex items-center gap-3">
                                        <LoaderCircle className="w-4 h-4 animate-spin text-brand-500" />
                                        <span className="text-sm font-medium">Career Assistant is thinking...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                <div className="p-4 bg-white border-t border-gray-100">
                    <form onSubmit={handleSend} className="relative max-w-4xl mx-auto flex items-end gap-2">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask anything about your career or programming..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all resize-none max-h-32 min-h-[52px]"
                            rows="1"
                        />
                        <button 
                            type="submit" 
                            disabled={!input.trim() || loading}
                            className="absolute right-2 bottom-1.5 p-2 bg-brand-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-700 transition-colors"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                    <p className="text-center text-xs text-gray-400 mt-2">AI can make mistakes. Consider verifying important information.</p>
                </div>
            </div>
        </div>
    );
};

export default AIChatbot;
