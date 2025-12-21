"use client";

import { LogOut, User } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface DashboardHeaderProps {
    profileImage: string;
    onLogout: () => void;
}

const DashboardHeader = ({ profileImage, onLogout }: DashboardHeaderProps) => {
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const profileDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showProfileDropdown && profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
                setShowProfileDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showProfileDropdown]);

    return (
        <header className="bg-white py-4 flex-shrink-0">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <Link href="/" className="w-[80px] lg:w-[110px] relative">
                            <Image
                                src="/logo.webp"
                                alt="Protonest Logo"
                                width={110}
                                height={70}
                                className="object-contain"
                            />
                        </Link>
                    </div>

                    <div className="flex items-center relative" ref={profileDropdownRef}>
                        <button
                            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                            className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#5530fa] focus:ring-offset-2"
                        >
                            <Image
                                src={profileImage}
                                alt="User Avatar"
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                            />
                        </button>

                        {showProfileDropdown && (
                            <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                <Link
                                    href="/dashboard/profile"
                                    onClick={() => setShowProfileDropdown(false)}
                                    className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <User className="w-4 h-4" />
                                    <span className="text-sm font-medium">Profile</span>
                                </Link>
                                <button
                                    onClick={() => {
                                        setShowProfileDropdown(false);
                                        onLogout();
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="text-sm font-medium">Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
