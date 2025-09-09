"use client";

import Footer from '@/app/components/footer';
import {
    Bell,
    ChevronRight,
    LogOut,
    Menu,
    Search,
    Settings,
    SlidersHorizontal,
    X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const UserDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    const sidebarItems = [
        { icon: '📊', label: 'Dashboard Overview', path: '/dashboard' },
        { icon: '🔎', label: 'Suggested Jobs', path: '/dashboard/suggested-jobs' },
        { icon: '👀', label: 'Saved Jobs', path: '/dashboard/saved-jobs' },
        { icon: '🎯', label: 'Applied Jobs', path: '/dashboard/applied-jobs' },
        { icon: '✍️', label: 'Ongoing Projects', path: '/dashboard/projects' },
        { icon: '📨', label: 'Resubmit CV', path: '/dashboard/resubmit-cv' },
        { icon: '📣', label: 'Manage Alerts', path: '/dashboard/alerts' },
        { icon: '👤', label: 'View/Edit Profile', path: '/dashboard/profile' },
        { icon: '⚙️', label: 'Settings', path: '/dashboard/settings' },
    ];

    // Close sidebar when clicking outside
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

    const suggestedJobs = [
        {
            title: 'Embedded Firmware Developer',
            type: 'Fixed-price',
            posted: 'Posted 1 day ago',
            hours: 'Less than 30 hrs/week',
            level: 'Intermediate',
            price: '$15',
            matchScore: '91% Match',
            description: 'Project Description Here. Project Description Here. Project Description Here. Project Description Here. Project Description Here. Project...',
            keywords: ['Embedded', 'Firmware', 'C++', 'RTOS'],
        },
        {
            title: 'IoT Field Tester – Smart Agri',
            type: 'Hourly',
            posted: 'Posted 1 day ago',
            hours: 'Less than 30 hrs/week',
            level: 'Intermediate',
            price: '$25/hr',
            matchScore: '87% Match',
            description: 'Project Description Here. Project Description Here. Project Description Here. Project Description Here. Project Description Here. Project...',
            keywords: ['IoT', 'Testing', 'Agriculture', 'Wireless'],
        },
        {
            title: 'Junior PCB Layout Engineer',
            type: 'Fixed-price',
            posted: 'Posted 2 days ago',
            hours: 'One-time project',
            level: 'Entry',
            price: '$500',
            matchScore: '78% Match',
            description: 'Project Description Here. Project Description Here. Project Description Here. Project Description Here. Project Description Here. Project...',
            keywords: ['PCB', 'Altium', 'CAD', 'Electronics'],
        },
        {
            title: 'Senior iOT Engineer',
            type: 'Hourly',
            posted: 'Posted 3 days ago',
            hours: 'Full-time',
            level: 'Senior',
            price: '$45/hr',
            matchScore: '85% Match',
            description: 'Project Description Here. Project Description Here. Project Description Here. Project Description Here. Project Description Here. Project...',
            keywords: ['IoT', 'Cloud', 'Python', 'AWS'],
        }
    ];

    return (
        <div>
            <div className="font-poppins min-h-screen bg-white relative">
                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-20 lg:hidden backdrop-blur-xs"></div>
                )}

                {/* Header */}
                <header className="bg-white py-4">
                    <div className="max-w-7xl 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center">
                            {/* Logo - Smaller on mobile */}
                            <div className="flex items-center">
                                <Link href="/" className="w-[100px] lg:w-[130px] relative">
                                    <Image
                                        src="/logo.png"
                                        alt="Protonest Logo"
                                        width={130}
                                        height={80}
                                        className="object-contain"
                                    />
                                </Link>
                            </div>

                            {/* Header Actions */}
                            <div className="flex items-center space-x-4">
                                <button className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                                    <Bell className="w-5 h-5 text-gray-600" />
                                </button>
                                <Link href="/dashboard/settings" className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                                    <Settings className="w-5 h-5 text-gray-600" />
                                </Link>

                                <Link href="/dashboard/profile" className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                                    <Image
                                        src="/profile-1.svg"
                                        alt="User Avatar"
                                        width={40}
                                        height={40}
                                        className="w-full h-full object-cover"
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl 2xl:max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar - Mobile */}
                        <div
                            ref={sidebarRef}
                            className={`fixed top-0 right-0 h-full w-80 z-30 bg-white transform transition-transform duration-300 ease-in-out shadow-xl lg:hidden ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}
                        >
                            {/* Mobile Sidebar Header */}
                            <div className="flex justify-between items-center p-4">
                                <Link href="/" className="w-[100px] relative">
                                    <Image
                                        src="/logo.png"
                                        alt="Protonest Logo"
                                        width={100}
                                        height={60}
                                        className="object-contain"
                                    />
                                </Link>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    className="p-2 rounded-full hover:bg-gray-100"
                                >
                                    <X className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>

                            {/* Sidebar Content */}
                            <div className="overflow-y-auto h-full p-4">
                                <nav className="space-y-1">
                                    {sidebarItems.map((item, index) => (
                                        <Link
                                            key={index}
                                            href={item.path}
                                            onClick={() => setSidebarOpen(false)}
                                            className={`w-full flex items-center px-4 py-3 rounded-lg text-left bg-[#FAFAFA] transition-colors ${pathname === item.path
                                                ? 'font-semibold bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white'
                                                : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span className="w-5 h-5 mr-4 text-lg flex items-center justify-center">{item.icon}</span>
                                            <span className={`${pathname === item.path ? 'font-medium' : 'font-normal'}`}>{item.label}</span>
                                        </Link>
                                    ))}
                                </nav>

                                {/* Logout Button */}
                                <div className="pt-8">
                                    <Link
                                        href="/logout"
                                        className="w-full flex items-center px-4 py-3 bg-[#FAFAFA] rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                                    >
                                        <LogOut className="w-5 h-5 mr-4" />
                                        <span className="font-normal">Logout</span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar - Desktop */}
                        <aside className="hidden lg:block font-poppins w-full lg:w-80 xl:w-85 2xl:w-96 lg:mr-auto">
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <nav className="p-4 space-y-1">
                                    {sidebarItems.map((item, index) => (
                                        <Link
                                            key={index}
                                            href={item.path}
                                            className={`w-full flex items-center px-4 py-3 rounded-lg text-left bg-[#FAFAFA] transition-colors ${pathname === item.path
                                                ? 'font-semibold bg-gradient-to-r from-[#F51DA5] to-[#5530FA] text-white'
                                                : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span className="w-5 h-5 mr-4 text-lg flex items-center justify-center">{item.icon}</span>
                                            <span className={`${pathname === item.path ? 'font-medium' : 'font-normal'}`}>{item.label}</span>
                                        </Link>
                                    ))}
                                </nav>

                                {/* Logout Button */}
                                <div className="p-4 pt-8">
                                    <Link
                                        href="/logout"
                                        className="w-full flex items-center px-4 py-3 bg-[#FAFAFA] rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                                    >
                                        <LogOut className="w-5 h-5 mr-4" />
                                        <span className="font-normal">Logout</span>
                                    </Link>
                                </div>
                            </div>
                        </aside>

                        {/* Main Content */}
                        <main className={`flex-1 lg:max-w-[calc(100%-22rem)] 2xl:max-w-[calc(100%-24rem)] ${sidebarOpen ? 'blur-sm lg:blur-0' : ''}`}>
                            {/* Breadcrumb with Hamburger Menu for mobile */}
                            <div className="flex items-center mb-6">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="lg:hidden mr-2 p-2 rounded-full hover:bg-gray-100"
                                >
                                    <Menu className="w-5 h-5 text-gray-600" />
                                </button>
                                <nav className="w-full font-poppins px-4 shadow-[0px_2px_20px_0px_rgba(166,175,195,0.20)] rounded-[8px] h-[40px] flex items-center space-x-2 text-[11px] lg:text-sm text-gray-500">
                                    <span>User Dashboard</span>
                                    <ChevronRight className="w-4 h-4" />
                                    <span className="text-[#5C4EC9]">Suggested Jobs</span>
                                </nav>
                            </div>

                            {/* Suggested Jobs Section */}
                            <div className="mb-8">
                                <div className="flex flex-col mb-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[25px]">🔎</span>
                                        <h2 className="text-2xl font-medium text-gray-700">Suggested Jobs</h2>
                                    </div>
                                    <p className="text-gray-600 text-sm">
                                        These jobs are matched based on your profile, CV, and skills.
                                    </p>
                                </div>

                                <div className="relative mb-6 flex items-center gap-3">
                                    {/* Search Bar */}
                                    <div className="relative w-full bg-white rounded-[20px] shadow-sm overflow-hidden">
                                        <input
                                            type="text"
                                            placeholder="Search for the job you are looking for"
                                            className="w-full py-3 pl-4 pr-12 text-gray-600 focus:outline-none"
                                        />
                                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>

                                    {/* Modern Filter Button */}
                                    <button className="flex-shrink-0  hover:bg-gray-50 transition-colors">
                                        <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>

                                {/* Filters */}
                                <div className="flex flex-wrap gap-3 mb-6">
                                    <button className="px-4 py-2 rounded-full gradient-button text-gray-600 text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-none">
                                        Beginner
                                        <X className="w-4 h-4 text-gray-500 hover:text-red-500 transition-colors" />
                                    </button>
                                    <button className="px-4 py-2 rounded-full gradient-button text-gray-600 text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-none">
                                        Remote
                                        <X className="w-4 h-4 text-gray-500 hover:text-red-500 transition-colors" />
                                    </button>
                                </div>

                                {/* Suggested Jobs Container - Updated Grid Layout */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {suggestedJobs.map((job, index) => (
                                        <Link
                                            key={index}
                                            href={`/dashboard/suggested-jobs/${index}`}
                                            className="group relative w-full h-[318px] bg-white rounded-tl-[35px] rounded-bl-[35px] rounded-br-[35px] shadow-md overflow-hidden hover:shadow-lg transition-shadow p-6"
                                        >
                                            {/* Job Title */}
                                            <div className="w-full h-[43px]">
                                                <div className="w-full h-full text-[#6c6c6c] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#F51DA5] group-hover:to-[#5530FA] group-hover:font-medium text-base font-normal font-['Poppins'] leading-[35px] line-clamp-1 transition-none">
                                                    {job.title}
                                                </div>
                                            </div>

                                            {/* Job Type and Posted Date */}
                                            <div className="w-full h-[35px] text-[#6c6c6c] text-[9px] font-normal font-['Poppins'] leading-[35px]">
                                                {job.type} - {job.posted}
                                            </div>

                                            {/* Job Description */}
                                            <div className="w-full h-[43px] text-[#6c6c6c] text-[9px] font-medium font-['Poppins'] leading-[18px] line-clamp-2 mt-4">
                                                {job.description}
                                            </div>

                                            {/* Price and Match Score */}
                                            <div className="mt-6 inline-flex justify-start items-start gap-[51px]">
                                                <div className="w-[136px] inline-flex flex-col justify-start items-start">
                                                    <div className="self-stretch h-5 text-[#6c6c6c] text-xs font-medium font-['Poppins'] leading-[35px]">
                                                        {job.price}
                                                    </div>
                                                    <div className="self-stretch h-[25px] text-[#6c6c6c] text-[9px] font-normal font-['Poppins'] leading-[35px]">
                                                        {job.type === 'Hourly' ? 'Hourly rate' : 'Project budget'}
                                                    </div>
                                                </div>
                                                <div className="w-[120px] inline-flex flex-col justify-start items-start">
                                                    <div className="self-stretch h-[26px] text-[#6c6c6c] text-xs font-medium font-['Poppins'] leading-[35px]">
                                                        {job.matchScore}
                                                    </div>
                                                    <div className="self-stretch h-[25px] text-[#6c6c6c] text-[9px] font-normal font-['Poppins'] leading-[35px]">
                                                        Match Score
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Arrow Image Swap on Hover - Fixed Positioning */}
                                            <div className="absolute right-6 top-6 w-[70px] h-[70px] group-hover:w-[100px] group-hover:h-[100px] transition-all duration-300">
                                                {/* Default Arrow */}
                                                <div className="w-full h-full group-hover:hidden">
                                                    <Image
                                                        src="/upleft.svg"
                                                        alt="Arrow"
                                                        width={70}
                                                        height={70}
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>

                                                {/* Hover Arrow */}
                                                <div className="hidden w-full h-full group-hover:block">
                                                    <Image
                                                        src="/upleft-hover.svg"
                                                        alt="Hover Arrow"
                                                        width={100}
                                                        height={100}
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                            </div>

                                            {/* Keywords */}
                                            <div className="mt-6 inline-flex justify-start items-center gap-2">
                                                {job.keywords.slice(0, 4).map((keyword, keyIndex) => (
                                                    <div
                                                        key={keyIndex}
                                                        className="min-w-[70px] h-[29px] px-2.5 rounded-[30px] outline outline-offset-[-1px] outline-[#d5d5d5] flex justify-center items-center"
                                                    >
                                                        <div className="text-[#83848b] text-[8px] font-normal font-['Poppins'] leading-normal truncate">
                                                            {keyword}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default UserDashboard;