import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Target, Map, CheckCircle, Bot, Code, Briefcase, FileText, ChevronRight, LayoutDashboard, Search } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="p-6 bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border hover:shadow-lg transition-all duration-300 group">
        <div className="w-14 h-14 bg-brand-50 dark:bg-brand-900/20 text-brand-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Icon className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
    </div>
);

const StepCard = ({ number, title, description }) => (
    <div className="relative flex flex-col items-center text-center max-w-xs mx-auto">
        <div className="w-16 h-16 bg-white dark:bg-dark-card border-2 border-brand-500 rounded-full flex items-center justify-center text-xl font-bold text-brand-500 mb-4 shadow-lg z-10">
            {number}
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
);

const CareerCategory = ({ title }) => (
    <div className="px-6 py-4 bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-xl font-medium text-gray-800 dark:text-gray-200 shadow-sm hover:shadow-md hover:border-brand-500 dark:hover:border-brand-500 transition-all cursor-default">
        {title}
    </div>
);

const LandingPage = () => {
    return (
        <div className="bg-gray-50 dark:bg-dark-bg min-h-screen transition-colors duration-300 overflow-hidden">
            {/* HERO SECTION */}
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
                {/* Background glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-brand-500/10 dark:bg-brand-500/5 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                    {/* Left: Content */}
                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 font-medium text-sm mb-6 border border-brand-100 dark:border-brand-800/30">
                            <Sparkles className="w-4 h-4" /> 
                            <span>Premium AI-Powered Career Platform</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight mb-6">
                            CAREER MAKER
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-blue-600 mt-2">
                                Build Skills. Close Gaps.<br />Build Your Future.
                            </span>
                        </h1>
                        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            Analyze your resume, discover your skill gaps, explore career paths, generate personalized learning roadmaps, and get guidance from your AI Career Assistant.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                            <Link to="/upload-resume" className="flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white bg-brand-500 hover:bg-brand-600 font-semibold text-lg transition-all shadow-lg shadow-brand-500/30">
                                <FileText className="w-5 h-5" /> Analyze My Resume
                            </Link>
                            <Link to="/careers" className="flex items-center justify-center gap-2 px-8 py-4 rounded-full text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold text-lg transition-all shadow-sm">
                                <Search className="w-5 h-5" /> Explore Careers
                            </Link>
                        </div>
                        <div className="mt-6 flex justify-center lg:justify-start">
                            <Link to="/chat" className="text-brand-600 dark:text-brand-400 font-medium hover:underline flex items-center gap-1">
                                <Bot className="w-4 h-4" /> Try AI Assistant
                            </Link>
                        </div>
                    </div>

                    {/* Right: Floating Visuals */}
                    <div className="relative h-[500px] hidden lg:block">
                        <div className="absolute inset-0 bg-gradient-to-tr from-brand-100 to-blue-50 dark:from-brand-900/20 dark:to-blue-900/10 rounded-full blur-3xl opacity-50"></div>
                        
                        {/* Center Image/Circle */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-full shadow-2xl flex flex-col items-center justify-center z-10">
                            <Target className="w-16 h-16 text-brand-500 mb-2" />
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">Software</div>
                            <div className="text-gray-500 dark:text-gray-400 font-medium">Developer</div>
                        </div>

                        {/* Floating Cards */}
                        <div className="absolute top-[15%] left-[5%] bg-white dark:bg-dark-card p-4 rounded-xl shadow-xl border border-gray-100 dark:border-dark-border flex items-center gap-4 animate-[bounce_6s_infinite]">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600">
                                <span className="font-bold text-lg">85%</span>
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Resume Score</div>
                                <div className="font-bold text-gray-900 dark:text-white">Excellent</div>
                            </div>
                        </div>

                        <div className="absolute bottom-[20%] left-[0%] bg-white dark:bg-dark-card p-4 rounded-xl shadow-xl border border-gray-100 dark:border-dark-border flex items-center gap-4 animate-[bounce_7s_infinite_0.5s]">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600">
                                <Code className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Skill Match</div>
                                <div className="font-bold text-gray-900 dark:text-white">12 Skills</div>
                            </div>
                        </div>

                        <div className="absolute top-[30%] right-[0%] bg-white dark:bg-dark-card p-4 rounded-xl shadow-xl border border-gray-100 dark:border-dark-border flex items-center gap-4 animate-[bounce_8s_infinite_1s]">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600">
                                <Map className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Learning Progress</div>
                                <div className="font-bold text-gray-900 dark:text-white">68%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FEATURES SECTION */}
            <div className="py-24 bg-white dark:bg-[#151e2e] relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Everything you need to land your dream job</h2>
                        <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Powerful tools to analyze your strengths, discover gaps, and guide your learning journey.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard 
                            icon={FileText} 
                            title="Resume Analysis" 
                            description="Upload your resume and let our intelligent engine extract your key skills and experience instantly."
                        />
                        <FeatureCard 
                            icon={Target} 
                            title="Skill Gap Detection" 
                            description="Compare your current skills with industry requirements to identify exactly what you are missing."
                        />
                        <FeatureCard 
                            icon={Briefcase} 
                            title="Career Explorer" 
                            description="Explore diverse career paths matched to your unique skill set and personal interests."
                        />
                        <FeatureCard 
                            icon={Map} 
                            title="Personalized Roadmap" 
                            description="Get a step-by-step, prioritized learning path specifically designed to fill your skill gaps."
                        />
                        <FeatureCard 
                            icon={Bot} 
                            title="AI Career Assistant" 
                            description="Chat with an intelligent assistant to prepare for interviews, debug code, and ask career questions."
                        />
                        <FeatureCard 
                            icon={LayoutDashboard} 
                            title="Progress Dashboard" 
                            description="Track your skill development, monitor your readiness score, and manage your career journey."
                        />
                    </div>
                </div>
            </div>

            {/* HOW IT WORKS */}
            <div className="py-24 bg-gray-50 dark:bg-dark-bg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">How it works</h2>
                        <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">Five simple steps to accelerate your career.</p>
                    </div>
                    
                    <div className="relative">
                        {/* Connecting Line */}
                        <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-brand-200 dark:bg-brand-900/30"></div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10">
                            <StepCard number="01" title="Upload Resume" description="Share your current experience and skills." />
                            <StepCard number="02" title="AI Skill Analysis" description="We extract and verify your technical abilities." />
                            <StepCard number="03" title="Discover Gaps" description="See what skills you are missing." />
                            <StepCard number="04" title="Choose Path" select description="Select your target career goal." />
                            <StepCard number="05" title="Get Roadmap" description="Follow a step-by-step learning journey." />
                        </div>
                    </div>
                </div>
            </div>

            {/* AI PROMO SECTION */}
            <div className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-brand-900"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <Bot className="w-20 h-20 mx-auto text-brand-300 mb-8" />
                    <h2 className="text-4xl font-bold mb-6">Meet Your AI Career Assistant</h2>
                    <p className="text-xl text-brand-100 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Stuck on a coding problem? Need interview advice? Want project ideas? Your personal AI-powered guide is ready to help you across programming, careers, and learning.
                    </p>
                    <Link to="/chat" className="inline-flex items-center gap-2 bg-white text-brand-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-50 transition-colors shadow-xl">
                        Ask AI Assistant <ChevronRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>

            {/* CAREER CATEGORIES */}
            <div className="py-24 bg-white dark:bg-[#151e2e]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-12">Explore Top Career Paths</h2>
                    <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                        <CareerCategory title="Software Developer" />
                        <CareerCategory title="Data Scientist" />
                        <CareerCategory title="Frontend Developer" />
                        <CareerCategory title="Backend Developer" />
                        <CareerCategory title="Full Stack Developer" />
                        <CareerCategory title="AI / Machine Learning Engineer" />
                        <CareerCategory title="Cloud Engineer" />
                        <CareerCategory title="Cybersecurity Analyst" />
                        <CareerCategory title="UI/UX Designer" />
                    </div>
                    <div className="mt-12">
                        <Link to="/careers" className="text-brand-500 font-semibold hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                            View all careers →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-50 dark:bg-dark-bg py-12 border-t border-gray-200 dark:border-dark-border text-center text-gray-500 dark:text-gray-400">
                <div className="flex justify-center items-center gap-2 mb-4">
                    <Rocket className="w-6 h-6 text-brand-500" />
                    <span className="font-bold text-gray-900 dark:text-white text-lg">CAREER MAKER</span>
                </div>
                <p>© {new Date().getFullYear()} Career Maker. Build Skills. Shape Your Future.</p>
            </footer>
        </div>
    );
};

// Fix the missing Sparkles icon import
const Sparkles = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
  </svg>
);

export default LandingPage;
