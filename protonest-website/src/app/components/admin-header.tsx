"use client";

import { Settings } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface AdminHeaderProps {
    onSettingsClick?: () => void;
}

const AdminHeader = ({ onSettingsClick }: AdminHeaderProps) => {
    return (
        <header className="bg-white py-4 flex-shrink-0 border-b border-gray-100">
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

                    <div className="flex items-center">
                        <Link
                            href="/admin-dashboard/settings"
                            className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                            onClick={onSettingsClick}
                        >
                            <Settings className="w-5 h-5 text-gray-600" />
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
