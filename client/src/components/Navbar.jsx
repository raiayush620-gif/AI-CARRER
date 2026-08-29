import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Rocket, Menu, X, User as UserIcon, LogOut, Moon, Sun, Bot } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;
    
    const navLinkClass = (path) => `transition-colors duration-200 ${isActive(path) ? 'text-brand-500 font-semibold' : 'hover:text-brand-500'}`;

    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-gray-200 dark:border-dark-border text-gray-800 dark:text-gray-200 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-brand-500 text-white p-1.5 rounded-lg group-hover:bg-brand-600 transition-colors">
                                <Rocket className="h-6 w-6" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">CAREER MAKER</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {user && (
                            <div className="flex space-x-6 text-sm font-medium">
                                <Link to="/dashboard" className={navLinkClass('/dashboard')}>Dashboard</Link>
                                <Link to="/careers" className={navLinkClass('/careers')}>Careers</Link>
                                <Link to="/upload-resume" className={navLinkClass('/upload-resume')}>Upload Resume</Link>
                                <Link to="/chat" className={`flex items-center gap-1.5 ${navLinkClass('/chat')}`}>
                                    <Bot className="w-4 h-4" /> AI Assistant
                                </Link>
                            </div>
                        )}

                        <div className="flex items-center space-x-4">
                            <button 
                                onClick={toggleTheme} 
                                className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
                                aria-label="Toggle Theme"
                            >
                                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </button>

                            {user ? (
                                <div className="relative">
                                    <button 
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="flex items-center gap-2 bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-full py-1.5 px-4 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <UserIcon className="h-4 w-4" />
                                        <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
                                    </button>
                                    
                                    {dropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card rounded-xl shadow-lg border border-gray-100 dark:border-dark-border py-1 z-10 overflow-hidden">
                                            <div className="px-4 py-3 border-b border-gray-100 dark:border-dark-border text-xs text-gray-500 dark:text-gray-400 truncate">
                                                {user.email}
                                            </div>
                                            <button 
                                                onClick={handleLogout}
                                                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <Link to="/login" className="text-sm font-medium hover:text-brand-500 transition-colors">Login</Link>
                                    <Link to="/register" className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors shadow-sm shadow-brand-500/30">
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center gap-4">
                        <button onClick={toggleTheme} className="text-gray-500 dark:text-gray-400">
                            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 dark:text-gray-300">
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white dark:bg-dark-bg border-b border-gray-200 dark:border-dark-border px-4 py-4 space-y-2 shadow-lg">
                    {user ? (
                        <>
                            <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-lg text-base font-medium hover:bg-gray-100 dark:hover:bg-dark-card">Dashboard</Link>
                            <Link to="/careers" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-lg text-base font-medium hover:bg-gray-100 dark:hover:bg-dark-card">Careers</Link>
                            <Link to="/upload-resume" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-lg text-base font-medium hover:bg-gray-100 dark:hover:bg-dark-card">Upload Resume</Link>
                            <Link to="/chat" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-4 py-3 rounded-lg text-base font-medium hover:bg-gray-100 dark:hover:bg-dark-card">
                                <Bot className="w-5 h-5 text-brand-500" /> AI Assistant
                            </Link>
                            <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-4 py-3 rounded-lg text-base font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                                <LogOut className="w-5 h-5" /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-lg text-base font-medium hover:bg-gray-100 dark:hover:bg-dark-card">Login</Link>
                            <Link to="/register" onClick={() => setIsOpen(false)} className="block px-4 py-3 rounded-lg text-base font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20">Sign Up</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
