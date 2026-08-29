import { Link } from 'react-router-dom';
import { Rocket, Target, Map, CheckCircle } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight sm:text-6xl">
                    Discover Your <span className="text-brand-500">Career Route</span> 🚀
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
                    Upload your resume, discover your skill gaps, and get a personalized learning roadmap to land your dream tech job.
                </p>
                <div className="mt-10 flex justify-center gap-4">
                    <Link to="/register" className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-500 hover:bg-brand-600 md:py-4 md:text-lg md:px-10 shadow-lg">
                        Get Started
                    </Link>
                    <Link to="/login" className="px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                        Login
                    </Link>
                </div>
            </div>

            <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 mx-auto bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mb-4">
                                <Target className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Identify Skill Gaps</h3>
                            <p className="text-gray-500">We analyze your resume against real-world job requirements.</p>
                        </div>
                        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 mx-auto bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mb-4">
                                <Map className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Personalized Roadmap</h3>
                            <p className="text-gray-500">Get a step-by-step learning path tailored to your missing skills.</p>
                        </div>
                        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="w-12 h-12 mx-auto bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Track Progress</h3>
                            <p className="text-gray-500">Check off steps as you learn and watch your readiness score grow.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default LandingPage;
