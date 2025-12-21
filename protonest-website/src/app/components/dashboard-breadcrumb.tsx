"use client";

import { ChevronRight, Menu } from 'lucide-react';
import Link from 'next/link';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface DashboardBreadcrumbProps {
    items: BreadcrumbItem[];
    onMenuClick: () => void;
}

const DashboardBreadcrumb = ({ items, onMenuClick }: DashboardBreadcrumbProps) => {
    return (
        <div className="flex items-center mb-6 flex-shrink-0">
            <button
                onClick={onMenuClick}
                className="lg:hidden mr-2 p-2 rounded-full hover:bg-gray-100"
            >
                <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <nav className="w-full font-poppins px-4 shadow-[0px_2px_20px_0px_rgba(166,175,195,0.20)] rounded-[8px] h-[40px] flex items-center space-x-2 text-[11px] lg:text-sm text-gray-500">
                {items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        {item.href ? (
                            <Link href={item.href} className="hover:text-gray-700">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-[#5C4EC9]">{item.label}</span>
                        )}
                        {index < items.length - 1 && <ChevronRight className="w-4 h-4" />}
                    </div>
                ))}
            </nav>
        </div>
    );
};

export default DashboardBreadcrumb;
