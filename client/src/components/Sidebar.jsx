import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, Compass, Upload, BarChart2, Map, BookOpen, 
    FileText, Mic, Bot, Settings, LogOut, X
} from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const location = useLocation();
    const { logout } = useContext(AuthContext);

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
        { path: '/careers', label: 'Career Explorer', icon: <Compass className="w-5 h-5" /> },
        { path: '/upload-resume', label: 'Upload Resume', icon: <Upload className="w-5 h-5" /> },
        { path: '/analysis', label: 'Skill Analysis', icon: <BarChart2 className="w-5 h-5" /> },
        { path: '/roadmap', label: 'My Roadmap', icon: <Map className="w-5 h-5" /> },
        // { path: '/learn', label: 'Learn Skills', icon: <BookOpen className="w-5 h-5" /> }, // Assumed mapped to something, keeping it commented if /learn doesn't exist yet, wait Roadmap provides learning
        { path: '/resume-improvement', label: 'Resume Improvement', icon: <FileText className="w-5 h-5" /> },
        { path: '/mock-interview', label: 'Mock Interview', icon: <Mic className="w-5 h-5" /> },
        { path: '/chat', label: 'AI Assistant', icon: <Bot className="w-5 h-5" /> }
    ];

    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Content */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-dark-bg border-r border-gray-200 dark:border-dark-border transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col h-[calc(100vh-64px)] overflow-y-auto`}>
                <div className="flex-1 py-6 flex flex-col gap-1 px-4">
                    <div className="lg:hidden flex justify-end mb-4">
                        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 px-3">Main Menu</div>
                    
                    {navItems.map((item) => (
                        <Link 
                            key={item.path} 
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium ${
                                isActive(item.path) 
                                    ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400' 
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-card hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-dark-border space-y-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-card transition-all font-medium">
                        <Settings className="w-5 h-5" /> Settings
                    </button>
                    <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-medium">
                        <LogOut className="w-5 h-5" /> Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
