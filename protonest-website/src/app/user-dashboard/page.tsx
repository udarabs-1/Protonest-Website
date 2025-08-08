"use client";

import {
    Bell,
    ChevronRight,
    LogOut,
    Menu,
    Settings,
    X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Footer from '../components/footer';

type ApplicationStatus = 'pending' | 'shortlisted' | 'rejected';

const UserDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    const sidebarItems = [
        { icon: '📊', label: 'Dashboard Overview', path: '/user-dashboard' },
        { icon: '🔎', label: 'Suggested Jobs', path: '/user-dashboard/suggested-jobs' },
        { icon: '👀', label: 'Saved Jobs', path: '/user-dashboard/saved-jobs' },
        { icon: '🎯', label: 'Applied Jobs', path: '/user-dashboard/applied-jobs' },
        { icon: '✍️', label: 'Ongoing Projects', path: '/user-dashboard/projects' },
        { icon: '📨', label: 'Resubmit CV', path: '/user-dashboard/resubmit-cv' },
        { icon: '📣', label: 'Manage Alerts', path: '/user-dashboard/alerts' },
        { icon: '👤', label: 'View/Edit Profile', path: '/user-dashboard/profile' },
        { icon: '⚙️', label: 'Settings', path: '/user-dashboard/settings' },
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

    const statsCards = [
        {
            title: 'Suggested Jobs',
            value: 'Submit CV',
            subtitle: 'Based on your skills & CV',
            type: 'action',
            path: '/user-dashboard/suggested-jobs'
        },
        {
            title: 'Saved Jobs',
            value: '4',
            subtitle: "You haven't applied yet",
            type: 'stat',
            path: '/user-dashboard/saved-jobs'
        },
        {
            title: 'Applied Jobs',
            value: '5',
            subtitle: '2 shortlisted · 1 rejected',
            type: 'stat',
            path: '/user-dashboard/applied-jobs'
        },
        {
            title: 'Ongoing Projects',
            value: '2',
            subtitle: 'Freelancing in progress',
            type: 'stat',
            path: '/user-dashboard/projects'
        }
    ];

    const quickActions = [
        { icon: '📝', label: 'Edit Profile', path: '/user-dashboard/profile' },
        { icon: '📨', label: 'Manage Job Alerts', path: '/user-dashboard/alerts' },
        { icon: '📊', label: 'Completed Projects', path: '/user-dashboard/projects' },
        { icon: '📣', label: 'Manage Subscriptions', path: '/user-dashboard/settings' }
    ];

    const applications = [
        {
            id: '1',
            title: 'Embedded Firmware Developer',
            status: 'pending' as ApplicationStatus,
            date: 'May 22, 2025'
        },
        {
            id: '2',
            title: 'Junior PCB Layout Engineer',
            status: 'shortlisted' as ApplicationStatus,
            date: 'May 19, 2025'
        },
        {
            id: '3',
            title: 'IoT Field Tester – Smart Agri',
            status: 'shortlisted' as ApplicationStatus,
            date: 'May 19, 2025'
        },
        {
            id: '4',
            title: 'Senior iOT Engineer',
            status: 'rejected' as ApplicationStatus,
            date: 'May 15, 2025'
        },
        {
            id: '5',
            title: 'Embedded Firmware Developer',
            status: 'pending' as ApplicationStatus,
            date: 'May 10, 2025'
        }
    ];

    const suggestedJobs = [
        {
            id: '1',
            title: 'Job Title Here Job Title Here',
            type: 'Hourly',
            posted: '1 day ago',
            hours: 'Less than 30 hrs/week',
            level: 'Intermediate',
            description: 'Project Description Here. Project Description Here. Project Description Here. Project Description Here. Project Description Here. Project...',
            keywords: ['Key Word', 'Key Word', 'Key Word', 'Key Word']
        },
        {
            id: '2',
            title: 'Job Title Here Job Title Here',
            type: 'Hourly',
            posted: '1 day ago',
            hours: 'Less than 30 hrs/week',
            level: 'Intermediate',
            description: 'Project Description Here. Project Description Here. Project Description Here. Project Description Here. Project Description Here. Project...',
            keywords: ['Key Word', 'Key Word', 'Key Word', 'Key Word']
        },
        {
            id: '3',
            title: 'Job Title Here Job Title Here',
            type: 'Hourly',
            posted: '1 day ago',
            hours: 'Less than 30 hrs/week',
            level: 'Intermediate',
            description: 'Project Description Here. Project Description Here. Project Description Here. Project Description Here. Project Description Here. Project...',
            keywords: ['Key Word', 'Key Word', 'Key Word', 'Key Word']
        }
    ];

    const getStatusColor = (status: ApplicationStatus): string => {
        switch (status) {
            case 'pending':
                return 'text-yellow-600';
            case 'shortlisted':
                return 'text-green-600';
            case 'rejected':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    const getStatusIcon = (status: ApplicationStatus): string => {
        switch (status) {
            case 'pending':
                return '🟡';
            case 'shortlisted':
                return '✅';
            case 'rejected':
                return '❌';
            default:
                return '🟡';
        }
    };

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
                                <Link href="/user-dashboard/settings" className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                                    <Settings className="w-5 h-5 text-gray-600" />
                                </Link>

                                <Link href="/user-dashboard/profile" className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
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
                                    <Link href="/user-dashboard" className="hover:text-gray-700">User Dashboard</Link>
                                    <ChevronRight className="w-4 h-4" />
                                    <span className="text-[#5C4EC9]">Dashboard Overview</span>
                                </nav>
                            </div>

                            {/* Welcome Section */}
                            <div className="font-montserrat mb-8">
                                <h1 className="text-2xl font-semibold text-gray-700 mb-2">
                                    Welcome back, [User Name]
                                </h1>
                                <p className="text-sm text-gray-600">
                                    ⚠️ Reminder: You haven&apos;t updated your CV in 6 months.{' '}
                                    <Link href="/user-dashboard/resubmit-cv" className="text-gray-800 underline hover:text-purple-600">
                                        Click here
                                    </Link>{' '}
                                    to upload your updated CV
                                </p>
                            </div>

                            {/* Stats Cards - 2 per row on mobile */}
                            <div className="mb-8">
                                <h2 className="text-lg font-medium text-gray-700 mb-4">
                                    Your Applications at a Glance
                                </h2>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                    {statsCards.map((card, index) => (
                                        <Link
                                            key={index}
                                            href={card.path}
                                            className="bg-white rounded-lg shadow-md p-6 text-center relative overflow-hidden hover:shadow-lg transition-shadow"
                                        >
                                            {/* Background Image */}
                                            <div className="absolute inset-0 z-0">
                                                <Image
                                                    src="/cards.svg"
                                                    alt="Background pattern"
                                                    layout="fill"
                                                    objectFit="cover"
                                                    className="w-full h-full"
                                                />
                                            </div>

                                            {/* Content */}
                                            <div className="relative z-10">
                                                <h3 className="text-sm text-gray-600 mb-2">{card.title}</h3>
                                                {card.type === 'action' ? (
                                                    <>
                                                        <p className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#5530FA] to-[#F51DA5] mb-1">{card.value}</p>
                                                        <p className="text-xs text-gray-500">{card.subtitle}</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p className="text-3xl font-light text-gray-600 mb-1">{card.value}</p>
                                                        <p className="text-xs text-gray-500">{card.subtitle}</p>
                                                    </>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Applications Table */}
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-medium text-gray-700">
                                        Recent Applications
                                    </h2>
                                    <Link href="/user-dashboard/applied-jobs" className="flex items-center text-sm text-gray-600 hover:text-purple-600">
                                        View all applied jobs
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>

                                <div className="w-full bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="px-4 py-3 text-left">
                                                        <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                                            Job Title
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-left">
                                                        <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                                            Status
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-left">
                                                        <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                                            Applied On
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-center">
                                                        <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                                            Action
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {applications.map((app, index) => (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-left">
                                                            <div className="text-[#676767] text-[11px] font-medium font-poppins leading-none">
                                                                {app.title}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-left">
                                                            <div className={`text-[11px] font-medium font-poppins leading-none ${getStatusColor(app.status)}`}>
                                                                {getStatusIcon(app.status)} {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-left">
                                                            <div className="text-[#676767] text-[11px] font-medium font-poppins leading-none">
                                                                {app.date}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <Link
                                                                href={`/user-dashboard/applied-jobs/${app.id}`}
                                                                className="w-[198px] h-8 bg-gradient-to-r from-[#F51DA5] to-[#5530FA] rounded-[15px] text-white text-[11px] font-medium font-poppins leading-none inline-flex items-center justify-center"
                                                            >
                                                                View
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions - 2 per row on mobile */}
                            <div className="mb-8">
                                <h2 className="text-lg font-medium text-gray-700 mb-4">
                                    Quick Actions
                                </h2>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                    {quickActions.map((action, index) => (
                                        <Link
                                            key={index}
                                            href={action.path}
                                            className="bg-white rounded-lg shadow-md p-2 flex flex-col justify-center items-center text-center hover:shadow-lg transition-shadow h-36"
                                        >
                                            <div className="mb-4 flex items-center justify-center">
                                                <span className="w-12 h-12 text-4xl flex items-center justify-center">
                                                    {action.icon}
                                                </span>
                                            </div>
                                            <h3 className="text-[15px] text-gray-600">{action.label}</h3>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Suggested Jobs */}
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-medium text-gray-700">
                                        Suggested Jobs
                                    </h2>
                                    <Link href="/user-dashboard/suggested-jobs" className="flex items-center text-sm text-gray-600 hover:text-purple-600">
                                        View all
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>

                                <div className="relative">
                                    <div className="w-full overflow-x-auto pb-4">
                                        <div
                                            className="inline-flex gap-6"
                                            style={{ minWidth: `${suggestedJobs.length * 452}px` }}
                                        >
                                            {suggestedJobs.map((job) => (
                                                <Link
                                                    key={job.id}
                                                    href={`/user-dashboard/suggested-jobs/${job.id}`}
                                                    className="group w-[436px] h-[318px] flex-shrink-0 relative bg-white/5 rounded-tl-[35px] rounded-bl-[35px] rounded-br-[35px] shadow-md backdrop-blur-[20px] overflow-hidden hover:shadow-lg transition-shadow"
                                                >
                                                    {/* Job Title */}
                                                    <div className="w-[325px] h-[43px] left-[46px] top-[46px] absolute">
                                                        <div className="w-full h-full text-[#6c6c6c] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#F51DA5] group-hover:to-[#5530FA] group-hover:font-medium text-base font-normal font-['Poppins'] leading-[35px] line-clamp-1 transition-none">
                                                            {job.title}
                                                        </div>
                                                    </div>

                                                    {/* Job Type and Posted Date */}
                                                    <div className="w-[330px] h-[35px] left-[46px] top-[69px] absolute text-[#6c6c6c] text-[9px] font-normal font-['Poppins'] leading-[35px]">
                                                        {job.type} - Posted {job.posted}
                                                    </div>

                                                    {/* Job Description */}
                                                    <div className="w-[330px] h-[43px] left-[46px] top-[191px] absolute text-[#6c6c6c] text-[9px] font-medium font-['Poppins'] leading-[18px] line-clamp-2">
                                                        {job.description}
                                                    </div>

                                                    {/* Hours and Experience */}
                                                    <div className="left-[46px] top-[117px] absolute inline-flex justify-start items-start gap-[51px]">
                                                        <div className="w-[136px] inline-flex flex-col justify-start items-start">
                                                            <div className="self-stretch h-5 text-[#6c6c6c] text-xs font-medium font-['Poppins'] leading-[35px]">
                                                                {job.hours}
                                                            </div>
                                                            <div className="self-stretch h-[25px] text-[#6c6c6c] text-[9px] font-normal font-['Poppins'] leading-[35px]">
                                                                Hours needed
                                                            </div>
                                                        </div>
                                                        <div className="w-[120px] inline-flex flex-col justify-start items-start">
                                                            <div className="self-stretch h-[26px] text-[#6c6c6c] text-xs font-medium font-['Poppins'] leading-[35px]">
                                                                {job.level}
                                                            </div>
                                                            <div className="self-stretch h-[25px] text-[#6c6c6c] text-[9px] font-normal font-['Poppins'] leading-[35px]">
                                                                Experience level
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Arrow Image Swap on Hover */}
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
                                                    <div className="left-[46px] top-[245px] absolute inline-flex justify-start items-center gap-2">
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