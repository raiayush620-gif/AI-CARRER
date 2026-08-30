import { useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const BACKGROUND_MAP = {
    '/dashboard': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1920&q=80', // Workspace / Analytics
    '/careers': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1920&q=80', // Exploration / Paths
    '/upload-resume': 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=1920&q=80', // Resume / Documents
    '/analysis': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1920&q=80', // Data / Tech
    '/roadmap': 'https://images.unsplash.com/photo-1473625247510-8ceb1760943f?auto=format&fit=crop&w=1920&q=80', // Journey / Milestones
    '/learn': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1920&q=80', // Online learning
    '/resume-improvement': 'https://images.unsplash.com/photo-1455390582262-044cdead27d8?auto=format&fit=crop&w=1920&q=80', // Professional writing
    '/mock-interview': 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1920&q=80', // Interview / Office
    '/chat': 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1920&q=80', // AI / Future
    '/settings': 'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1920&q=80', // Minimal workspace
};

const DEFAULT_BG = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80';

const AppBackground = () => {
    const location = useLocation();
    const { isDarkMode } = useContext(ThemeContext);

    // Find matching background, exact or starting with (e.g. /careers/frontend-developer)
    let currentBg = DEFAULT_BG;
    const path = location.pathname;
    
    // Check exact matches first
    if (BACKGROUND_MAP[path]) {
        currentBg = BACKGROUND_MAP[path];
    } else {
        // Fallback for nested routes
        for (const [route, bg] of Object.entries(BACKGROUND_MAP)) {
            if (path.startsWith(route) && route !== '/') {
                currentBg = bg;
                break;
            }
        }
    }

    // Don't show these backgrounds on auth or landing pages to keep them clean if desired,
    // but the prompt said "every major feature/page in CAREER MAKER".
    // We will render it globally behind the SidebarLayout.

    return (
        <div className="fixed inset-0 z-[-10] pointer-events-none transition-opacity duration-700 ease-in-out">
            {/* Background Image Layer */}
            <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out"
                style={{ backgroundImage: `url(${currentBg})` }}
            />
            
            {/* Overlay Layer for Light/Dark mode readability */}
            <div className={`absolute inset-0 transition-colors duration-700 ease-in-out ${
                isDarkMode 
                    ? 'bg-gray-900/90 backdrop-blur-[2px]' // Dark mode: dark tint, slight blur
                    : 'bg-white/90 backdrop-blur-[2px]' // Light mode: light tint, slight blur
            }`} />
        </div>
    );
};

export default AppBackground;
