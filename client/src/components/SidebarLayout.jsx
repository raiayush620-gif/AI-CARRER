import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const SidebarLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col font-sans bg-transparent transition-colors duration-300">
            {/* Top Navbar */}
            <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
                
                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto bg-transparent">
                    <div className="w-full h-full p-4 lg:p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SidebarLayout;
