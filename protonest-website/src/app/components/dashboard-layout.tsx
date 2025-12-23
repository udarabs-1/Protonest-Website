"use client";

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import DashboardBreadcrumb from './dashboard-breadcrumb';
import DashboardHeader from './dashboard-header';
import DashboardSidebar from './dashboard-sidebar';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface DashboardLayoutProps {
    children: React.ReactNode;
    breadcrumbItems: BreadcrumbItem[];
    profileImage: string;
}

const DashboardLayout = ({ children, breadcrumbItems, profileImage }: DashboardLayoutProps) => {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setSidebarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [sidebarOpen]);

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('tokenExpiration');
        setShowLogoutDialog(false);
        window.location.href = '/careers';
    };

    return (
        <div>
            {showLogoutDialog && (
                <div
                    className="font-poppins fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                    onClick={() => setShowLogoutDialog(false)}
                >
                    <div
                        className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Logout</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowLogoutDialog(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="font-poppins h-screen bg-white flex flex-col overflow-hidden">
                {sidebarOpen && (
                    <div className="fixed inset-0 z-20 lg:hidden backdrop-blur-xs"></div>
                )}

                <DashboardHeader
                    profileImage={profileImage}
                    onLogout={() => setShowLogoutDialog(true)}
                />

                <div className="flex-1 flex overflow-hidden">
                    <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex gap-8 overflow-hidden">
                        <DashboardSidebar
                            sidebarOpen={sidebarOpen}
                            onClose={() => setSidebarOpen(false)}
                            currentPath={pathname}
                            onLogout={() => setShowLogoutDialog(true)}
                            sidebarRef={sidebarRef}
                        />

                        <main className={`flex-1 flex flex-col overflow-hidden ${sidebarOpen ? 'blur-sm lg:blur-0' : ''}`}>
                            <DashboardBreadcrumb
                                items={breadcrumbItems}
                                onMenuClick={() => setSidebarOpen(true)}
                            />

                            <div className="flex-1 overflow-y-auto">
                                {children}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
