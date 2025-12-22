"use client";

import { Icon } from '@iconify/react';
import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface SidebarItem {
    icon: string;
    label: string;
    path: string;
}

interface AdminSidebarProps {
    sidebarOpen: boolean;
    onClose: () => void;
    currentPath: string;
    onLogout: () => void;
    sidebarRef: React.RefObject<HTMLDivElement | null>;
}

const sidebarItems: SidebarItem[] = [
    { icon: 'solar:chart-square-bold-duotone', label: 'Dashboard', path: '/admin-dashboard' },
    { icon: 'solar:user-bold-duotone', label: 'Candidate Management', path: '/admin-dashboard/candidates' },
    { icon: 'solar:document-bold-duotone', label: 'Job Postings', path: '/admin-dashboard/jobs' },
    { icon: 'mingcute:refresh-3-line', label: 'Application Pipeline', path: '/admin-dashboard/applications' },
    { icon: 'solar:pen-new-square-bold-duotone', label: 'NDA & Compliance Log', path: '/admin-dashboard/nda' },
    { icon: 'solar:bell-bold-duotone', label: 'Subscription Management', path: '/admin-dashboard/subscriptions' },
    { icon: 'solar:document-add-bold-duotone', label: 'Blog Manager', path: '/admin-dashboard/blog' },
    { icon: 'solar:magnifer-bold-duotone', label: 'Research Manager', path: '/admin-dashboard/research' },
    { icon: 'solar:users-group-two-rounded-bold-duotone', label: 'Talent Pool', path: '/admin-dashboard/talent-pool' },
    { icon: 'solar:dialog-2-bold-duotone', label: 'Contact Form Messages', path: '/admin-dashboard/contact' },
    { icon: 'solar:settings-bold-duotone', label: 'Settings', path: '/admin-dashboard/settings' },
];

const AdminSidebar = ({ sidebarOpen, onClose, currentPath, onLogout, sidebarRef }: AdminSidebarProps) => {
    const isItemActive = (path: string) => {
        if (path === '/admin-dashboard') {
            return currentPath === '/admin-dashboard';
        }
        return currentPath === path || currentPath.startsWith(path + '/');
    };

    return (
        <>
            <style jsx global>{`
                .gradient-icon svg {
                    width: 100%;
                    height: 100%;
                }
                
                .gradient-icon svg path {
                    fill: url(#icon-gradient) !important;
                }
                
                .gradient-icon svg circle {
                    fill: url(#icon-gradient) !important;
                }
                
                .gradient-icon svg rect {
                    fill: url(#icon-gradient) !important;
                }
                
                .gradient-icon svg polygon {
                    fill: url(#icon-gradient) !important;
                }
            `}</style>

            <svg width="0" height="0" style={{ position: 'absolute' }}>
                <defs>
                    <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#4520E0" />
                        <stop offset="100%" stopColor="#D01888" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Mobile Sidebar */}
            <div
                ref={sidebarRef}
                className={`fixed top-0 right-0 h-full w-80 z-30 bg-white transform transition-transform duration-300 ease-in-out shadow-xl lg:hidden flex flex-col ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex justify-between items-center p-4 flex-shrink-0">
                    <Link href="/" className="w-[60px] relative">
                        <Image
                            src="/logo.webp"
                            alt="Protonest Logo"
                            width={60}
                            height={40}
                            className="object-contain"
                        />
                    </Link>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <div className="flex-1 flex flex-col p-4 overflow-hidden">
                    <nav className="space-y-1 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                        {sidebarItems.map((item, index) => {
                            const active = isItemActive(item.path);
                            return (
                                <Link
                                    key={index}
                                    href={item.path}
                                    onClick={onClose}
                                    className={`w-full flex items-center px-4 py-2 rounded-lg text-left bg-[#FAFAFA] transition-colors ${active
                                        ? 'font-semibold bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className={`w-5 h-5 mr-4 flex items-center justify-center ${!active ? 'gradient-icon' : ''}`}>
                                        <Icon
                                            icon={item.icon}
                                            className={`w-5 h-5 ${active ? 'text-white' : ''}`}
                                        />
                                    </div>
                                    <span className={`${active ? 'font-medium' : 'font-normal'}`}>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="pt-4 flex-shrink-0">
                        <button
                            onClick={onLogout}
                            className="w-full flex items-center px-4 py-2 bg-[#FAFAFA] rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            <div className="w-5 h-5 mr-4 flex items-center justify-center gradient-icon">
                                <Icon
                                    icon="solar:login-3-bold-duotone"
                                    className="w-5 h-5"
                                />
                            </div>
                            <span className="font-normal">Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block font-poppins w-full lg:w-80 xl:w-85 2xl:w-96 flex-shrink-0">
                <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
                    <nav className="p-4 space-y-1 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                        {sidebarItems.map((item, index) => {
                            const active = isItemActive(item.path);
                            return (
                                <Link
                                    key={index}
                                    href={item.path}
                                    className={`w-full flex items-center px-4 py-2 rounded-lg text-left bg-[#FAFAFA] transition-colors ${active
                                        ? 'font-semibold bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className={`w-5 h-5 mr-4 flex items-center justify-center ${!active ? 'gradient-icon' : ''}`}>
                                        <Icon
                                            icon={item.icon}
                                            className={`w-5 h-5 ${active ? 'text-white' : ''}`}
                                        />
                                    </div>
                                    <span className={`${active ? 'font-medium' : 'font-normal'}`}>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 mt-auto">
                        <button
                            onClick={onLogout}
                            className="w-full flex items-center px-4 py-2 bg-[#FAFAFA] rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            <div className="w-5 h-5 mr-4 flex items-center justify-center gradient-icon">
                                <Icon
                                    icon="solar:login-3-bold-duotone"
                                    className="w-5 h-5"
                                />
                            </div>
                            <span className="font-normal">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
