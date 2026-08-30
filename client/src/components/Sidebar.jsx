import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, Compass, Upload, BarChart2, Map, BookOpen, 
    FileText, Mic, Bot, Settings, LogOut, X
} from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const location = useLocation();
    const { logout, user } = useContext(AuthContext);

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
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-light-card/95 dark:bg-dark-sidebar/95 backdrop-blur-xl border-r border-gray-200/50 dark:border-dark-border transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col h-[calc(100vh-64px)] overflow-y-auto`}>
                <div className="flex-1 py-6 flex flex-col gap-1 px-3">
                    <div className="lg:hidden flex justify-end mb-4 px-3">
                        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 px-4">Main Menu</div>
                    
                    {navItems.map((item) => {
                        const active = isActive(item.path);
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-medium border-l-2 ${
                                    active 
                                        ? 'bg-brand-50 dark:bg-brand-500/45 border-brand-500 dark:border-gold-500 text-brand-700 dark:text-gray-100' 
                                        : 'border-transparent text-gray-600 dark:text-[#B8B9AF] hover:bg-gray-50 dark:hover:bg-brand-500/22 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                <div className={`${active ? 'text-brand-500 dark:text-gold-500' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400'}`}>
                                    {item.icon}
                                </div>
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-dark-border space-y-1">
                    <Link to="/settings" onClick={() => setIsOpen(false)} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border-l-2 border-transparent text-gray-600 dark:text-[#B8B9AF] hover:bg-gray-50 dark:hover:bg-brand-500/22 transition-all font-medium">
                        <div className="text-gray-400 dark:text-gray-500"><Settings className="w-5 h-5" /></div> Settings
                    </Link>
                    <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border-l-2 border-transparent text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-medium">
                        <div className="text-red-400"><LogOut className="w-5 h-5" /></div> Logout
                    </button>
                    
                    {user && (
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-border flex items-center gap-3 px-2">
                            {user.profileImage ? (
                                <img src={user.profileImage} alt="Profile" className="w-9 h-9 rounded-full object-cover" />
                            ) : (
                                <div className="w-9 h-9 bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</div>
                            </div>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
