"use client";

import {
    Bell,
    ChevronRight,
    Edit,
    Eye,
    LogOut,
    Menu,
    Search,
    Settings,
    SlidersHorizontal,
    Trash2,
    X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const NDAComplianceLog = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [jobFilterOpen, setJobFilterOpen] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const jobFilterRef = useRef<HTMLDivElement>(null);
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



    // NDA compliance data
    const ndaRecords = [
        {
            id: 1,
            freelancerName: 'John Smith',
            appliedFor: 'Firmware Dev – Embedded IoT',
            ndaStatus: 'Submitted',
            statusIcon: '✅',
            sentOn: 'May 22, 2025',
            submittedOn: 'May 22, 2025',
            daysPending: '-',
            complianceNotes: '-'
        },
        {
            id: 2,
            freelancerName: 'Sarah Johnson',
            appliedFor: 'Firmware Dev – Embedded IoT',
            ndaStatus: 'Sent',
            statusIcon: '🟠',
            sentOn: 'May 19, 2025',
            submittedOn: '-',
            daysPending: '3',
            complianceNotes: 'NDA resent once'
        },
        {
            id: 3,
            freelancerName: 'Michael Brown',
            appliedFor: 'Firmware Dev – Embedded IoT',
            ndaStatus: 'Not Sent',
            statusIcon: '❌',
            sentOn: '-',
            submittedOn: '-',
            daysPending: '-',
            complianceNotes: '-'
        }
    ];

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setSidebarOpen(false);
            }
            if (jobFilterOpen && jobFilterRef.current && !jobFilterRef.current.contains(event.target as Node)) {
                setJobFilterOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [sidebarOpen, jobFilterOpen]);

    const getActionButton = (status: string) => {
        switch (status) {
            case 'Submitted':
                return 'Add Note';
            case 'Sent':
                return 'Resend NDA';
            case 'Not Sent':
                return 'Send NDA';
            default:
                return 'Send NDA';
        }
    };

    return (
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
                                <span className="text-[#5C4EC9]">NDA & Compliance Log</span>
                            </nav>
                        </div>

                        {/* Page Header */}
                        <div className="mb-6">
                            <h1 className="text-2xl md:text-[25px] font-semibold text-[#6c6c6c] mb-1 font-montserrat">
                                ✍️ NDA & Compliance Log
                            </h1>
                            <p className="text-[#6c6c6c] text-xs md:text-sm font-normal font-montserrat">
                                View and track all NDA requests and submissions across job roles. This helps ensure that freelancers complete compliance requirements before onboarding.
                            </p>
                        </div>


                        <div className="flex items-center gap-3 mb-6">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    className="block w-full pl-4 pr-12 py-2 rounded-[20px] shadow-[5px_5px_20px_0px_rgba(0,0,0,0.10)] outline-none focus:ring-1 focus:ring-[#5530FA] focus:border-[#5530FA] opacity-50"
                                    placeholder="Search by candidate name or role applied for"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>

                            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>


                        {/* NDA Records Table */}
                        <div className="bg-white rounded-[9px] shadow-[0px_2px_20px_0px_rgba(170,170,170,0.20)] overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-3 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                            Freelancer Name
                                        </th>
                                        <th className="px-4 py-3 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                            Applied For
                                        </th>
                                        <th className="px-4 py-3 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                            NDA Status
                                        </th>
                                        <th className="px-4 py-3 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                            Sent On
                                        </th>
                                        <th className="px-4 py-3 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                            Submitted On
                                        </th>
                                        <th className="px-4 py-3 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                            Days Pending
                                        </th>
                                        <th className="px-4 py-3 bg-Neutral-200 text-left text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                            Compliance Notes
                                        </th>
                                        <th className="px-4 py-3 bg-Neutral-200 text-center text-[11px] font-medium font-poppins text-[#4e4e4e] uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {ndaRecords.map((record) => (
                                        <tr key={record.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                                {record.freelancerName}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767] underline">
                                                <Link href="#" className="hover:text-[#5530FA]">
                                                    {record.appliedFor}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                                {record.statusIcon} {record.ndaStatus}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                                {record.sentOn}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                                {record.submittedOn}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                                {record.daysPending}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium font-poppins text-[#676767]">
                                                {record.complianceNotes}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-medium">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button className="px-3 py-1 bg-gradient-to-r from-[#5530FA] to-[#F51DA5] rounded-[15px] text-white text-[10px] font-medium font-poppins hover:opacity-90 transition-opacity">
                                                        {getActionButton(record.ndaStatus)}
                                                    </button>
                                                    <div className="flex items-center gap-1 ml-2">
                                                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                                                            <Eye className="w-4 h-4 text-gray-600" />
                                                        </button>
                                                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                                                            <Edit className="w-4 h-4 text-gray-600" />
                                                        </button>
                                                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                                                            <Trash2 className="w-4 h-4 text-gray-600" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </main>
                </div>
            </div>
        </div>
    );
};

export default NDAComplianceLog;