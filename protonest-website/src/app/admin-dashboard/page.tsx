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

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    const sidebarItems = [
        { icon: '📊', label: 'Dashboard', path: '/admin-dashboard' },
        { icon: '👤', label: 'Candidate Management', path: '/admin-dashboard/candidates' },
        { icon: '📄', label: 'Job Postings', path: '/admin-dashboard/jobs' },
        { icon: '🔄', label: 'Application Pipeline', path: '/admin-dashboard/pipeline' },
        { icon: '✍️', label: 'NDA & Compliance Log', path: '/admin-dashboard/nda' },
        { icon: '🔔', label: 'Subscription Management', path: '/admin-dashboard/subscriptions' },
        { icon: '📝', label: 'Blog Manager', path: '/admin-dashboard/blog' },
        { icon: '🔬', label: 'Research Manager', path: '/admin-dashboard/research' },
        { icon: '👥', label: 'Talent Pool', path: '/admin-dashboard/talent-pool' },
        { icon: '📥', label: 'Contact Form Messages', path: '/admin-dashboard/contact' },
        { icon: '📈', label: 'Analytics & Reports', path: '/admin-dashboard/analytics' },
        { icon: '👀', label: 'System Logs', path: '/admin-dashboard/logs' },
        { icon: '⚙️', label: 'Settings', path: '/admin-dashboard/settings' },
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
            title: 'Total Applicants',
            value: '142',
            subtitle: 'this month',
            path: '/admin-dashboard/candidates'
        },
        {
            title: 'Active Roles Posted',
            value: '7',
            subtitle: 'open roles',
            path: '/admin-dashboard/jobs'
        },
        {
            title: 'Avg. Time to Hire',
            value: '11',
            subtitle: 'days',
            path: '/admin-dashboard/analytics'
        },
        {
            title: 'CVs in Talent Pool',
            value: '345',
            subtitle: 'profiles',
            path: '/admin-dashboard/candidates'
        }
    ];

    const quickActions = [
        { icon: '🔍', label: 'Review New Candidates', path: '/admin-dashboard/candidates' },
        { icon: '📝', label: 'Post a New Job', path: '/admin-dashboard/jobs/new' },
        { icon: '📊', label: 'View Detailed Analytics', path: '/admin-dashboard/analytics' },
        { icon: '📨', label: 'Manage Subscriptions', path: '/admin-dashboard/subscriptions' }
    ];

    const newSubmissions = [
        {
            name: 'Sarah M.',
            stage: 'Received',
            score: '92%',
            expertise: 'Firmware',
            date: '1 day ago'
        },
        {
            name: 'Sarah M.',
            stage: 'Screened',
            score: '92%',
            expertise: 'Firmware',
            date: '1 day ago'
        },
        {
            name: 'Sarah M.',
            stage: 'NDA Sent',
            score: '92%',
            expertise: 'Firmware',
            date: '1 day ago'
        },
        {
            name: 'Sarah M.',
            stage: 'Interview',
            score: '92%',
            expertise: 'Firmware',
            date: '1 day ago'
        },
        {
            name: 'Sarah M.',
            stage: 'Project Start',
            score: '92%',
            expertise: 'Firmware',
            date: '1 day ago'
        }
    ];

    const ndaStatus = [
        {
            name: 'Ayesha K.',
            role: 'PCB Designer',
            status: '✅ Signed',
            date: 'Apr 26, 2025'
        },
        {
            name: 'Malik S.',
            role: 'QA Tester',
            status: '❌ Not Sent',
            date: '-'
        },
        {
            name: 'Jason F.',
            role: 'Backend Developer',
            status: '⏳ Pending',
            date: '-'
        }
    ];

    const jobAlerts = [
        {
            name: 'Sarah M.',
            email: 'sarah.m@email.com',
            categories: 'Firmware, QA',
            frequency: 'Weekly',
            subscribed: 'Apr 14, 2025',
            status: 'Active'
        },
        {
            name: 'Sarah M.',
            email: 'sarah.m@email.com',
            categories: 'Firmware, QA',
            frequency: 'Weekly',
            subscribed: 'Apr 14, 2025',
            status: 'Active'
        },
        {
            name: 'Sarah M.',
            email: 'sarah.m@email.com',
            categories: 'Firmware, QA',
            frequency: 'Weekly',
            subscribed: 'Apr 14, 2025',
            status: 'Deactivated'
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
                                <Link href="/admin-dashboard/settings" className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
                                    <Settings className="w-5 h-5 text-gray-600" />
                                </Link>

                                <Link href="/admin-dashboard/profile" className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
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
                                    <Link href="/admin-dashboard" className="hover:text-gray-700">Admin Portal</Link>
                                    <ChevronRight className="w-4 h-4" />
                                    <span className="text-[#5C4EC9]">Dashboard</span>
                                </nav>
                            </div>

                            {/* Welcome Section */}
                            <div className="font-montserrat mb-8">
                                <h1 className="text-2xl font-semibold text-gray-700 mb-2">
                                    Welcome back, [Admin Name]
                                </h1>
                            </div>

                            {/* Stats Cards - 2 per row on mobile */}
                            <div className="mb-8">
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
                                                <p className="text-3xl font-light text-gray-600 mb-1">{card.value}</p>
                                                <p className="text-xs text-gray-500">{card.subtitle}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-8">
                                {/* Two tables side by side */}
                                <div className="flex flex-col lg:flex-row gap-6">
                                    {/* Current Hiring Funnel Table - First */}
                                    <div className="flex-1">
                                        {/* Heading aligned above the table */}
                                        <div className="mb-2">
                                            <h2 className="text-[#6c6c6c] text-lg lg:text-base xl:text-lg font-medium font-poppins leading-[23px] tracking-wide">
                                                Current Hiring Funnel
                                            </h2>
                                        </div>

                                        <div className="h-auto bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] overflow-hidden">
                                            <div className="overflow-x-auto h-full">
                                                <table className="w-full min-w-[150px] xl:min-w-[300px]">
                                                    <thead>
                                                        <tr className="border-b border-gray-200">
                                                            <th className="w-[50%] h-[49px] px-4 py-3 bg-Neutral-200 text-left">
                                                                <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                                                    Stage
                                                                </div>
                                                            </th>
                                                            <th className="w-[50%] h-[49px] px-4 py-3 bg-Neutral-200 text-left">
                                                                <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                                                    Count
                                                                </div>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {newSubmissions.map((submission, index) => (
                                                            <tr key={index} className="hover:bg-gray-50">
                                                                <td className="h-10 px-4 py-3 bg-Surface-Default text-left">
                                                                    <div className="text-[#676767] text-[11px] font-medium font-poppins leading-none">
                                                                        {submission.stage}
                                                                    </div>
                                                                </td>
                                                                <td className="h-10 px-4 py-3 bg-Surface-Default text-left">
                                                                    <div className="text-[#676767] text-[11px] font-medium font-poppins leading-none">
                                                                        {index * 10 + 5} {/* Placeholder count */}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    {/* New CV Submissions Table - Second */}
                                    <div className="flex-1">
                                        {/* Heading aligned above the table */}
                                        <div className="flex justify-between items-center mb-2">
                                            <h2 className="text-[#6c6c6c] text-lg lg:text-base xl:text-lg font-medium font-poppins leading-[23px] tracking-wide">
                                                New CV Submissions
                                            </h2>
                                            <Link
                                                href="/admin-dashboard/candidates"
                                                className="flex items-center text-sm text-gray-600 hover:text-purple-600"
                                            >
                                                View all submissions
                                                <ChevronRight className="w-4 h-4 ml-1" />
                                            </Link>
                                        </div>

                                        <div className="h-auto bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] overflow-hidden">
                                            <div className="overflow-x-auto h-full">
                                                <table className="w-full min-w-[380px] xl:min-w-[500px]">
                                                    <thead>
                                                        <tr className="border-b border-gray-200">
                                                            <th className="w-[25%] h-[49px] px-4 py-3 bg-Neutral-200 text-left">
                                                                <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                                                    Name
                                                                </div>
                                                            </th>
                                                            <th className="w-[30%] h-[49px] px-4 py-3 bg-Neutral-200 text-left">
                                                                <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                                                    Stage
                                                                </div>
                                                            </th>
                                                            <th className="w-[25%] h-[49px] px-4 py-3 bg-Neutral-200 text-left">
                                                                <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                                                    Expertise
                                                                </div>
                                                            </th>
                                                            <th className="w-[25%] h-[49px] px-4 py-3 bg-Neutral-200 text-left">
                                                                <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                                                    Submitted
                                                                </div>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {newSubmissions.map((submission, index) => (
                                                            <tr key={index} className="hover:bg-gray-50">
                                                                <td className="h-10 px-4 py-3 bg-Surface-Default text-left">
                                                                    <div className="text-[#676767] text-[11px] font-medium font-poppins leading-none">
                                                                        {submission.name}
                                                                    </div>
                                                                </td>
                                                                <td className="h-10 px-4 py-3 bg-Surface-Default text-left">
                                                                    <div className="text-[#676767] text-[11px] font-medium font-poppins leading-none">
                                                                        {submission.stage}
                                                                    </div>
                                                                </td>
                                                                <td className="h-10 px-4 py-3 bg-Surface-Default text-left">
                                                                    <div className="text-[#676767] text-[11px] font-medium font-poppins leading-none">
                                                                        {submission.expertise}
                                                                    </div>
                                                                </td>
                                                                <td className="h-10 px-4 py-3 bg-Surface-Default text-left">
                                                                    <div className="text-[#676767] text-[11px] font-medium font-poppins leading-none">
                                                                        {submission.date}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
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

                            {/* NDA & Compliance Status */}
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-medium text-gray-700">
                                        NDA & Compliance Status
                                    </h2>
                                    <Link href="/admin-dashboard/nda" className="flex items-center text-sm text-gray-600 hover:text-purple-600">
                                        View full NDA log
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>

                                <div className="w-full bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[800px] lg:min-w-full">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="px-4 py-3 text-left">
                                                        <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                                            Name
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-left">
                                                        <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                                            Role Applied
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-left">
                                                        <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                                            NDA Status
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-left">
                                                        <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                                            Signed Date
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-left">
                                                        <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                                            Actions
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {ndaStatus.map((nda, index) => (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-left">
                                                            <div className="text-[#676767] text-[11px] font-medium font-poppins leading-none">
                                                                {nda.name}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-left">
                                                            <div className="text-[#676767] text-[11px] font-medium font-poppins leading-none">
                                                                {nda.role}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-left">
                                                            <div className="text-[#676767] text-[11px] font-medium font-poppins leading-none">
                                                                {nda.status}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-left">
                                                            <div className="text-[#676767] text-[11px] font-medium font-poppins leading-none">
                                                                {nda.date}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-left">
                                                            <Link
                                                                href={`/admin-dashboard/nda/${nda.name}`}
                                                                className="px-[9px] py-2 bg-gradient-to-r from-[#F51DA5] to-[#5530FA] rounded-[15px] text-white text-[11px] font-medium font-poppins leading-none inline-flex items-center justify-center"
                                                            >
                                                                {nda.status === '✅ Signed' ? 'View NDA' :
                                                                    nda.status === '❌ Not Sent' ? 'Send Reminder' : 'Send NDA'}
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Job Alert Subscriptions */}
                            <div className="mb-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-lg font-medium text-gray-700">
                                        Job Alert Subscriptions
                                    </h2>
                                    <Link href="/admin-dashboard/subscriptions" className="flex items-center text-sm text-gray-600 hover:text-purple-600">
                                        Manage all subscriptions
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Link>
                                </div>

                                <div className="w-full bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full min-w-[800px] lg:min-w-full">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="px-4 py-3 text-left">
                                                        <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                                            Name
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-left">
                                                        <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                                            Email
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-left">
                                                        <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                                            Preferred Categories
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-left">
                                                        <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                                            Frequency
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-left">
                                                        <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                                            Subscribed On
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-left">
                                                        <div className="text-[#4e4e4e] text-[11px] font-medium font-poppins leading-none">
                                                            Status
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {jobAlerts.map((alert, index) => (
                                                    <tr key={index} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-left">
                                                            <div className="text-[#676767] text-[11px] font-medium font-poppins leading-none">
                                                                {alert.name}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-left">
                                                            <div className="text-[#676767] text-[11px] font-medium font-poppins leading-none">
                                                                {alert.email}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-left">
                                                            <div className="text-[#676767] text-[11px] font-medium font-poppins leading-none">
                                                                {alert.categories}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-left">
                                                            <div className="text-[#676767] text-[11px] font-medium font-poppins leading-none">
                                                                {alert.frequency}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-left">
                                                            <div className="text-[#676767] text-[11px] font-medium font-poppins leading-none">
                                                                {alert.subscribed}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 text-left">
                                                            <div className={`px-[9px] py-2 rounded-[15px] text-[11px] font-medium font-poppins leading-none inline-flex items-center justify-center ${alert.status === 'Active'
                                                                ? 'bg-[#bcff9b] text-[#6c6c6c]'
                                                                : 'bg-[#ff8686] text-white'
                                                                }`}>
                                                                {alert.status}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;