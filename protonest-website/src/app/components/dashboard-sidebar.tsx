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

interface DashboardSidebarProps {
    sidebarOpen: boolean;
    onClose: () => void;
    currentPath: string;
    onLogout: () => void;
    sidebarRef: React.RefObject<HTMLDivElement | null>;
    isEmployee?: boolean;
}

const baseSidebarItems: SidebarItem[] = [
    { icon: 'solar:chart-square-bold-duotone', label: 'Dashboard Overview', path: '/dashboard' },
    { icon: 'solar:folder-with-files-bold-duotone', label: 'All Jobs', path: '/dashboard/all-jobs' },
    { icon: 'solar:minimalistic-magnifer-bold-duotone', label: 'Suggested Jobs', path: '/dashboard/suggested-jobs' },
    { icon: 'solar:diskette-bold-duotone', label: 'Saved Jobs', path: '/dashboard/saved-jobs' },
    { icon: 'solar:target-bold-duotone', label: 'Applied Jobs', path: '/dashboard/applied-jobs' },
    { icon: 'solar:cloud-upload-bold-duotone', label: 'Resubmit CV', path: '/dashboard/resubmit-cv' },
    { icon: 'solar:bell-bold-duotone', label: 'Manage Alerts', path: '/dashboard/alerts' },
    { icon: 'solar:user-bold-duotone', label: 'View/Edit Profile', path: '/dashboard/profile' },
];

const hrisItems: SidebarItem[] = [
    { icon: 'solar:buildings-bold-duotone', label: 'My HRIS Profile', path: '/dashboard/hris' },
];

const DashboardSidebar = ({ sidebarOpen, onClose, currentPath, onLogout, sidebarRef, isEmployee = false }: DashboardSidebarProps) => {
    const sidebarItems = isEmployee ? [...baseSidebarItems, ...hrisItems] : baseSidebarItems;
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
                    <nav className="space-y-1 flex-1 overflow-y-auto">
                        {sidebarItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.path}
                                onClick={onClose}
                                className={`w-full flex items-center px-4 py-3 rounded-lg text-left bg-[#FAFAFA] transition-colors ${currentPath === item.path
                                    ? 'font-semibold bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <div className={`w-5 h-5 mr-4 flex items-center justify-center ${currentPath !== item.path ? 'gradient-icon' : ''}`}>
                                    <Icon
                                        icon={item.icon}
                                        className={`w-5 h-5 ${currentPath === item.path ? 'text-white' : ''}`}
                                    />
                                </div>
                                <span className={`${currentPath === item.path ? 'font-medium' : 'font-normal'}`}>{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="pt-4 flex-shrink-0">
                        <button
                            onClick={onLogout}
                            className="w-full flex items-center px-4 py-3 bg-[#FAFAFA] rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
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

            <aside className="hidden lg:block font-poppins w-full lg:w-80 xl:w-85 2xl:w-96 flex-shrink-0">
                <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
                    <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
                        {sidebarItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.path}
                                className={`w-full flex items-center px-4 py-3 rounded-lg text-left bg-[#FAFAFA] transition-colors ${currentPath === item.path
                                    ? 'font-semibold bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <div className={`w-5 h-5 mr-4 flex items-center justify-center ${currentPath !== item.path ? 'gradient-icon' : ''}`}>
                                    <Icon
                                        icon={item.icon}
                                        className={`w-5 h-5 ${currentPath === item.path ? 'text-white' : ''}`}
                                    />
                                </div>
                                <span className={`${currentPath === item.path ? 'font-medium' : 'font-normal'}`}>{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="p-4 mt-auto">
                        <button
                            onClick={onLogout}
                            className="w-full flex items-center px-4 py-3 bg-[#FAFAFA] rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
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

export default DashboardSidebar;
