import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Rocket, Menu, X, User as UserIcon, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-brand-950 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <Rocket className="h-8 w-8 text-brand-500" />
                            <span className="font-bold text-xl tracking-tight">Career Route</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="hover:text-brand-500 transition-colors">Dashboard</Link>
                                <Link to="/careers" className="hover:text-brand-500 transition-colors">Careers</Link>
                                <Link to="/upload-resume" className="hover:text-brand-500 transition-colors">Upload Resume</Link>
                                
                                <div className="relative">
                                    <button 
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="flex items-center gap-2 bg-brand-900 rounded-full py-2 px-4 hover:bg-brand-800 transition-colors"
                                    >
                                        <UserIcon className="h-5 w-5" />
                                        <span>{user.name.split(' ')[0]}</span>
                                    </button>
                                    
                                    {dropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 text-gray-800">
                                            <div className="px-4 py-2 border-b text-sm font-medium">
                                                {user.email}
                                            </div>
                                            <button 
                                                onClick={handleLogout}
                                                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="hover:text-brand-500 transition-colors">Login</Link>
                                <Link to="/register" className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2 rounded-md font-medium transition-colors">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white">
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-brand-900 px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-brand-800">Dashboard</Link>
                            <Link to="/careers" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-brand-800">Careers</Link>
                            <Link to="/upload-resume" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-brand-800">Upload Resume</Link>
                            <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-brand-800">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-brand-800">Login</Link>
                            <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-brand-800">Sign Up</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
