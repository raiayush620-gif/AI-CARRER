import { Link, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Bot, Sun, Moon, LogOut, User as UserIcon, Menu, Rocket, X } from 'lucide-react';

const Navbar = ({ setSidebarOpen }) => {
    const { user, logout } = useContext(AuthContext);
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        setMobileMenuOpen(false);
    };

    return (
        <nav className="sticky top-0 z-40 w-full bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-gray-200 dark:border-dark-border text-gray-800 dark:text-gray-200 transition-colors duration-300">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left Side */}
                    <div className="flex items-center gap-4">
                        {user && setSidebarOpen && (
                            <button 
                                onClick={() => setSidebarOpen(prev => !prev)} 
                                className="lg:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-card rounded-lg"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                        )}
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-brand-500 text-white p-1.5 rounded-lg group-hover:bg-brand-600 transition-colors">
                                <Rocket className="h-6 w-6" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">CAREER MAKER</span>
                        </Link>
                    </div>

                    {/* Desktop Right */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button 
                            onClick={toggleTheme} 
                            className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
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
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-card rounded-xl shadow-lg border border-gray-100 dark:border-dark-border py-1 z-50">
                                        <div className="px-4 py-3 border-b border-gray-100 dark:border-dark-border text-xs text-gray-500 truncate">
                                            {user.email}
                                        </div>
                                        <button 
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                        >
                                            <LogOut className="h-4 w-4" /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3 ml-2">
                                <Link to="/login" className="text-sm font-medium hover:text-brand-500 transition-colors">Login</Link>
                                <Link to="/register" className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors">Sign Up</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Toggle (Unauthenticated only or simplified) */}
                    <div className="md:hidden flex items-center gap-3">
                        <button onClick={toggleTheme} className="text-gray-500 dark:text-gray-400">
                            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                        {!user && (
                            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-600 dark:text-gray-300">
                                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Nav for Unauthenticated Users */}
            {!user && mobileMenuOpen && (
                <div className="md:hidden bg-white dark:bg-dark-bg border-b border-gray-200 dark:border-dark-border px-4 py-4 space-y-2">
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-dark-card">Login</Link>
                    <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20">Sign Up</Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
